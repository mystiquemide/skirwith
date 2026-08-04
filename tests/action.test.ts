import { describe, expect, it } from "vitest";
import { run } from "../src/action.js";
import { decodeReceiptMarker } from "../src/evidence/receipt.js";
import { encodeReceiptMarker } from "../src/evidence/receipt.js";
import { buildCanonicalRequest } from "../src/payment/canonical-request.js";
import { derivePaymentKey } from "../src/payment/payment-key.js";
import { hashCanonicalRequest } from "../src/payment/payment-hash.js";
import { toAtomicUnits } from "../src/domain/decimal.js";
import { PAYMENT_PURPOSE } from "../src/domain/constants.js";
import { CommentReceiptStore } from "../src/github/receipts.js";
import type { ReceiptRecord } from "../src/evidence/receipt.js";
import { FakeGitHubApi, FakeKeeperHubProvider } from "./fakes/fakes.js";

const MERGE_SHA = "0123456789abcdef0123456789abcdef01234567";

const CONFIG_YAML = `
version: 1
repository: acme/skirwith-demo
chain:
  id: 11155111
  explorer: https://sepolia.etherscan.io
  token:
    address: "0x1c7d4b196cb0c7b01d743fbc6116a902379c7238"
    symbol: USDC
    decimals: 6
payout:
  requiredLabel: skirwith-approved
  maximum: "25"
  amounts:
    skirwith-5: "5"
recipients:
  alice: "0x05619d1a133623b322a8f366ea9594e4e586f26d"
checks:
  required: true
  names:
    - CI / test
`;

function eventPayload(): Record<string, unknown> {
  return {
    action: "closed",
    pull_request: {
      number: 42,
      merged: true,
      merge_commit_sha: MERGE_SHA,
      base: { ref: "main" },
      user: { login: "alice" },
      labels: [{ name: "skirwith-approved" }, { name: "skirwith-5" }],
    },
    repository: { owner: { login: "acme" }, name: "skirwith-demo" },
  };
}

function happyDeps() {
  const api = new FakeGitHubApi();
  api.configFile = CONFIG_YAML;
  api.checkRuns = [{ name: "CI / test", passed: true }];
  const provider = new FakeKeeperHubProvider();
  provider.broadcastResult = { executionId: "ex_1", status: "running" };
  provider.terminalResult = {
    executionId: "ex_1",
    status: "completed",
    transactionHash: "0xabc",
    transactionLink: "https://explorer/tx/0xabc",
    pollIntervalHint: 0,
  };
  return {
    githubToken: "ghp_test",
    keeperhubApiKey: "kh_test",
    receiptSecret: "kh_test_synthetic_secret",
    eventPayload: eventPayload(),
    api,
    provider,
    nowIso: () => "2026-08-03T22:00:00.000Z",
  };
}

function identityFor(): { paymentKey: string; requestHash: string } {
  const canonical = buildCanonicalRequest({
    repository: "acme/skirwith-demo",
    pullRequestNumber: 42,
    mergeSha: MERGE_SHA,
    recipient: "0x05619d1a133623b322a8f366ea9594e4e586f26d",
    amountAtomic: toAtomicUnits("5", 6) as string,
    chainId: 11155111,
    tokenAddress: "0x1c7d4b196cb0c7b01d743fbc6116a902379c7238",
    purpose: PAYMENT_PURPOSE,
  });
  return { paymentKey: derivePaymentKey(canonical), requestHash: hashCanonicalRequest(canonical) };
}

describe("run", () => {
  it("runs a confirmed payout end-to-end and posts one receipt comment", async () => {
    const deps = happyDeps();
    const result = await run(deps);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.evidence.status).toBe("confirmed");
    expect(result.evidence.broadcastMade).toBe(true);
    expect(result.outputs["broadcast-made"]).toBe("true");
    expect(result.summary).toContain("Status: `confirmed`");
    expect(result.summary).toContain("Recipient: `0x05619d1a133623b322a8f366ea9594e4e586f26d`");

    expect(deps.api.comments).toHaveLength(1);
    const marker = decodeReceiptMarker(deps.api.comments[0]?.body ?? "");
    expect(marker?.status).toBe("confirmed");
    expect(marker?.executionId).toBe("ex_1");
  });

  it("blocks an unmerged close with no broadcast and no comment", async () => {
    const deps = happyDeps();
    deps.api.pullRequest = { ...deps.api.pullRequest, merged: false };
    const result = await run(deps);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.evidence.status).toBe("blocked");
    expect(result.evidence.broadcastMade).toBe(false);
    expect(deps.api.comments).toHaveLength(0);
    expect(deps.provider.calls.broadcast).toBe(0);
  });

  it("rejects a non-closed event payload", async () => {
    const deps = happyDeps();
    deps.eventPayload = { action: "opened" };
    const result = await run(deps);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("GITHUB_INVALID_EVENT");
  });

  it("rejects a config for the wrong repository", async () => {
    const deps = happyDeps();
    deps.api.configFile = CONFIG_YAML.replace("acme/skirwith-demo", "other/org");
    const result = await run(deps);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("CONFIG_SEMANTIC_INVALID");
  });

  it("rejects missing secrets before any network call", async () => {
    const deps = happyDeps();
    const result = await run({ ...deps, githubToken: "", keeperhubApiKey: "" });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("CONFIG_SEMANTIC_INVALID");
    expect(deps.api.comments).toHaveLength(0);
  });

  it("maps a failed check to a blocked outcome without provider calls", async () => {
    const deps = happyDeps();
    deps.api.checkRuns = [{ name: "CI / test", passed: false }];
    const result = await run(deps);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.evidence.status).toBe("blocked");
    expect(result.evidence.policy.result).toBe("blocked");
    expect(deps.provider.calls.simulate).toBe(0);
  });

  it("ignores an attacker-forged confirmed marker and still pays", async () => {
    const deps = happyDeps();
    const { paymentKey } = identityFor();
    const forged = encodeReceiptMarker({
      version: 1,
      product: "skirwith",
      paymentKey,
      requestHash: "f".repeat(64),
      status: "confirmed",
      executionId: "ex_attacker",
      repository: "acme/skirwith-demo",
      pullRequestNumber: 42,
      mergeSha: MERGE_SHA,
      keyId: "0".repeat(16),
      mac: "0".repeat(64),
    });
    deps.api.comments = [{ id: 1, body: forged, createdAt: "2026-08-03T22:00:00.000Z" }];

    const result = await run(deps);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.evidence.status).toBe("confirmed");
    expect(result.evidence.broadcastMade).toBe(true);
    expect(deps.provider.calls.broadcast).toBe(1);
    // The forged squatter must never be updated; the action creates its own
    // signed receipt comment instead.
    expect(deps.api.comments[0]?.body).toBe(forged);
    expect(deps.api.comments).toHaveLength(2);
    const created = deps.api.comments[1];
    expect(decodeReceiptMarker(created?.body ?? "")?.status).toBe("confirmed");
    expect(decodeReceiptMarker(created?.body ?? "")?.mac).not.toBe("0".repeat(64));
  });

  it("honors a legitimately signed confirmed receipt as a duplicate with no broadcast", async () => {
    const deps = happyDeps();
    const { paymentKey, requestHash } = identityFor();
    const receipt: ReceiptRecord = {
      version: 1,
      product: "skirwith",
      paymentKey,
      requestHash,
      status: "confirmed",
      executionId: "ex_orig",
      repository: "acme/skirwith-demo",
      pullRequestNumber: 42,
      mergeSha: MERGE_SHA,
      createdAt: "2026-08-03T00:00:00.000Z",
      updatedAt: "2026-08-03T00:00:00.000Z",
    };
    const store = new CommentReceiptStore(
      deps.api,
      "acme",
      "skirwith-demo",
      42,
      deps.receiptSecret,
    );
    await store.save(receipt);

    const result = await run(deps);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.evidence.status).toBe("duplicate");
    expect(result.evidence.broadcastMade).toBe(false);
    expect(result.evidence.executionId).toBe("ex_orig");
    expect(deps.provider.calls.broadcast).toBe(0);
  });

  it("does not broadcast when the pre-broadcast reservation cannot be saved", async () => {
    const deps = happyDeps();
    deps.api.createIssueCommentError = new Error("receipt comment creation failed");

    const result = await run(deps);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.evidence.status).toBe("failed");
    expect(result.evidence.broadcastMade).toBe(false);
    expect(deps.provider.calls.broadcast).toBe(0);
  });

  it("reports manual review with the execution id when the submitted receipt save fails after broadcast", async () => {
    const deps = happyDeps();
    deps.api.updateIssueCommentError = new Error("receipt comment update failed");

    const result = await run(deps);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.evidence.status).toBe("manual-review");
    expect(result.evidence.broadcastMade).toBe(true);
    expect(result.evidence.executionId).toBe("ex_1");
    expect(result.evidence.error?.code).toBe("EXECUTION_MANUAL_REVIEW");
    expect(deps.provider.calls.broadcast).toBe(1);
    // The durable reservation comment remains so a later run never rebroadcasts.
    expect(decodeReceiptMarker(deps.api.comments[0]?.body ?? "")?.status).toBe("pending");
  });

  it("never rebroadcasts in a later run after a post-broadcast receipt failure", async () => {
    const deps = happyDeps();
    deps.api.updateIssueCommentError = new Error("receipt comment update failed");

    const first = await run(deps);
    expect(first.ok).toBe(true);
    if (!first.ok) return;
    expect(first.evidence.status).toBe("manual-review");
    expect(deps.provider.calls.broadcast).toBe(1);

    // Second run: same event, comment store now healthy. The durable
    // reservation (pending, no execution id) must resolve to manual review
    // with zero broadcasts.
    deps.api.updateIssueCommentError = undefined;
    deps.provider.calls.broadcast = 0;
    deps.provider.calls.simulate = 0;
    const second = await run(deps);

    expect(second.ok).toBe(true);
    if (!second.ok) return;
    expect(second.evidence.status).toBe("manual-review");
    expect(second.evidence.broadcastMade).toBe(false);
    expect(deps.provider.calls.broadcast).toBe(0);
    expect(deps.provider.calls.simulate).toBe(0);
  });
});
