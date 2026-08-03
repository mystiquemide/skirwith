import { describe, expect, it } from "vitest";
import { run } from "../src/action.js";
import { decodeReceiptMarker } from "../src/evidence/receipt.js";
import { FakeGitHubApi, FakeKeeperHubProvider } from "./fakes/fakes.js";

const MERGE_SHA = "0123456789abcdef0123456789abcdef01234567";

const CONFIG_YAML = `
version: 1
repository: acme/mergepay-demo
chain:
  id: 11155111
  explorer: https://sepolia.etherscan.io
  token:
    address: "0x1c7d4b196cb0c7b01d743fbc6116a902379c7238"
    symbol: USDC
    decimals: 6
payout:
  requiredLabel: mergepay-approved
  maximum: "25"
  amounts:
    mergepay-5: "5"
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
      labels: [{ name: "mergepay-approved" }, { name: "mergepay-5" }],
    },
    repository: { owner: { login: "acme" }, name: "mergepay-demo" },
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
    eventPayload: eventPayload(),
    api,
    provider,
    nowIso: () => "2026-08-03T22:00:00.000Z",
  };
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
    deps.api.configFile = CONFIG_YAML.replace("acme/mergepay-demo", "other/org");
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
});
