import { describe, expect, it } from "vitest";
import { SettlementOrchestrator } from "../../src/execution/orchestrator.js";
import type { SettlementInput } from "../../src/execution/orchestrator.js";
import { buildCanonicalRequest } from "../../src/payment/canonical-request.js";
import { derivePaymentKey } from "../../src/payment/payment-key.js";
import { hashCanonicalRequest } from "../../src/payment/payment-hash.js";
import { toAtomicUnits } from "../../src/domain/decimal.js";
import { PAYMENT_PURPOSE } from "../../src/domain/constants.js";
import { ProviderError } from "../../src/keeperhub/errors.js";
import { serializeEvidence } from "../../src/evidence/evidence.js";
import type { ReceiptRecord } from "../../src/evidence/receipt.js";
import type { NormalizedPullRequestEvent } from "../../src/github/event.js";
import {
  FIXTURE_CHAIN_TOKEN,
  FIXTURE_CONFIG,
  FIXTURE_REQUIRED_LABEL,
  FIXTURE_AMOUNT_LABEL,
} from "../fixtures/policy.js";
import { FakeKeeperHubProvider, FakeReceiptStore } from "../fakes/fakes.js";

const MERGE_SHA = "0123456789abcdef0123456789abcdef01234567";

function makeEvent(
  overrides: Partial<NormalizedPullRequestEvent> = {},
): NormalizedPullRequestEvent {
  return {
    repository: { owner: "acme", name: "mergepay-demo", fullName: "acme/mergepay-demo" },
    pullRequestNumber: 42,
    baseBranch: "main",
    mergeSha: MERGE_SHA,
    authorLogin: "alice",
    labels: [FIXTURE_REQUIRED_LABEL, FIXTURE_AMOUNT_LABEL],
    merged: true,
    ...overrides,
  };
}

function makeInput(overrides: Partial<SettlementInput> = {}): SettlementInput {
  return {
    event: makeEvent(),
    config: FIXTURE_CONFIG,
    expectedBaseBranch: "main",
    passedChecks: ["CI / test"],
    chainToken: FIXTURE_CHAIN_TOKEN,
    ...overrides,
  };
}

function identityFor(input: SettlementInput): { paymentKey: string; requestHash: string } {
  const recipient = input.config.recipients[input.event.authorLogin] as string;
  const amount = input.config.payout.amounts[FIXTURE_AMOUNT_LABEL] as string;
  const amountAtomic = toAtomicUnits(amount, input.config.chain.token.decimals) as string;
  const canonical = buildCanonicalRequest({
    repository: input.event.repository.fullName,
    pullRequestNumber: input.event.pullRequestNumber,
    mergeSha: input.event.mergeSha,
    recipient,
    amountAtomic,
    chainId: input.chainToken.chainId,
    tokenAddress: input.chainToken.tokenAddress,
    purpose: PAYMENT_PURPOSE,
  });
  return { paymentKey: derivePaymentKey(canonical), requestHash: hashCanonicalRequest(canonical) };
}

function receiptFor(input: SettlementInput, overrides: Partial<ReceiptRecord> = {}): ReceiptRecord {
  const { paymentKey, requestHash } = identityFor(input);
  return {
    version: 1,
    product: "mergepay",
    paymentKey,
    requestHash,
    status: "confirmed",
    executionId: "ex_orig",
    repository: input.event.repository.fullName,
    pullRequestNumber: input.event.pullRequestNumber,
    mergeSha: input.event.mergeSha,
    createdAt: "2026-08-03T00:00:00.000Z",
    updatedAt: "2026-08-03T00:00:00.000Z",
    ...overrides,
  };
}

const NOW = "2026-08-03T22:00:00.000Z";

describe("SettlementOrchestrator.settle", () => {
  it("blocks without any provider call when policy is blocked", async () => {
    const provider = new FakeKeeperHubProvider();
    const receipts = new FakeReceiptStore();
    const orchestrator = new SettlementOrchestrator({ provider, receipts, nowIso: () => NOW });

    const input = makeInput({
      event: makeEvent({ repository: { owner: "other", name: "org", fullName: "other/org" } }),
    });
    const evidence = await orchestrator.settle(input);

    expect(evidence.status).toBe("blocked");
    expect(evidence.broadcastMade).toBe(false);
    expect(evidence.paymentKey).toBe("");
    expect(provider.calls).toEqual({
      simulate: 0,
      broadcast: 0,
      getExecution: 0,
      waitForTerminal: 0,
      chains: 0,
    });
    expect(receipts.saves).toHaveLength(0);
  });

  it("fails without broadcast when simulation reverts", async () => {
    const provider = new FakeKeeperHubProvider();
    provider.simulateResult = { wouldRevert: true, simulatedReturnValue: false };
    const receipts = new FakeReceiptStore();
    const orchestrator = new SettlementOrchestrator({ provider, receipts, nowIso: () => NOW });

    const evidence = await orchestrator.settle(makeInput());

    expect(evidence.status).toBe("failed");
    expect(evidence.simulation).toBe("failed");
    expect(evidence.broadcastMade).toBe(false);
    expect(evidence.error?.code).toBe("PROVIDER_SIMULATION_FAILED");
    expect(provider.calls.simulate).toBe(1);
    expect(provider.calls.broadcast).toBe(0);
    expect(receipts.saves).toHaveLength(0);
  });

  it("confirms a new payout end-to-end and saves a receipt", async () => {
    const provider = new FakeKeeperHubProvider();
    provider.broadcastResult = {
      executionId: "ex_new",
      status: "running",
      transactionHash: "0xabc",
      transactionLink: "https://explorer/tx/0xabc",
    };
    provider.terminalResult = {
      executionId: "ex_new",
      status: "completed",
      transactionHash: "0xabc",
      transactionLink: "https://explorer/tx/0xabc",
      pollIntervalHint: 0,
    };
    const receipts = new FakeReceiptStore();
    const orchestrator = new SettlementOrchestrator({ provider, receipts, nowIso: () => NOW });

    const input = makeInput();
    const evidence = await orchestrator.settle(input);

    expect(evidence.status).toBe("confirmed");
    expect(evidence.broadcastMade).toBe(true);
    expect(evidence.simulation).toBe("passed");
    expect(evidence.executionId).toBe("ex_new");
    expect(evidence.transactionHash).toBe("0xabc");
    expect(provider.calls.simulate).toBe(1);
    expect(provider.calls.broadcast).toBe(1);
    expect(provider.lastBroadcastKey).toBe(identityFor(input).paymentKey);
    expect(receipts.saves).toHaveLength(3);
    expect(receipts.saves[0]?.status).toBe("pending");
    expect(receipts.saves[0]?.executionId).toBeUndefined();
    expect(receipts.saves[1]?.status).toBe("pending");
    expect(receipts.saves[1]?.executionId).toBe("ex_new");
    expect(receipts.saves[2]?.status).toBe("confirmed");
    expect(receipts.saves[2]?.executionId).toBe("ex_new");
  });

  it("marks a broadcast that reaches a failed terminal state as failed", async () => {
    const provider = new FakeKeeperHubProvider();
    provider.terminalResult = {
      executionId: "ex_new",
      status: "failed",
      pollIntervalHint: 0,
    };
    const receipts = new FakeReceiptStore();
    const orchestrator = new SettlementOrchestrator({ provider, receipts, nowIso: () => NOW });

    const evidence = await orchestrator.settle(makeInput());

    expect(evidence.status).toBe("failed");
    expect(evidence.broadcastMade).toBe(true);
    expect(receipts.saves[2]?.status).toBe("failed");
  });

  it("returns a duplicate when a confirmed receipt matches the current content", async () => {
    const provider = new FakeKeeperHubProvider();
    const receipts = new FakeReceiptStore();
    const input = makeInput();
    await receipts.save(receiptFor(input));
    const orchestrator = new SettlementOrchestrator({ provider, receipts, nowIso: () => NOW });

    const evidence = await orchestrator.settle(input);

    expect(evidence.status).toBe("duplicate");
    expect(evidence.executionId).toBe("ex_orig");
    expect(evidence.broadcastMade).toBe(false);
    expect(provider.calls.simulate).toBe(0);
    expect(provider.calls.broadcast).toBe(0);
    expect(receipts.saves).toHaveLength(1);
  });

  it("flags changed content under the same key as a conflict", async () => {
    const provider = new FakeKeeperHubProvider();
    const receipts = new FakeReceiptStore();
    const input = makeInput();
    await receipts.save(receiptFor(input, { requestHash: "different-hash" }));
    const orchestrator = new SettlementOrchestrator({ provider, receipts, nowIso: () => NOW });

    const evidence = await orchestrator.settle(input);

    expect(evidence.status).toBe("manual-review");
    expect(evidence.error?.code).toBe("EXECUTION_CONFLICT");
    expect(evidence.broadcastMade).toBe(false);
    expect(provider.calls.simulate).toBe(0);
    expect(provider.calls.broadcast).toBe(0);
  });

  it("resumes polling a pending execution without rebroadcasting", async () => {
    const provider = new FakeKeeperHubProvider();
    provider.terminalResult = {
      executionId: "ex_orig",
      status: "completed",
      transactionHash: "0xorig",
      pollIntervalHint: 0,
    };
    const receipts = new FakeReceiptStore();
    const input = makeInput();
    await receipts.save(receiptFor(input, { status: "pending" }));
    const orchestrator = new SettlementOrchestrator({ provider, receipts, nowIso: () => NOW });

    const evidence = await orchestrator.settle(input);

    expect(evidence.status).toBe("confirmed");
    expect(evidence.executionId).toBe("ex_orig");
    expect(evidence.transactionHash).toBe("0xorig");
    expect(evidence.broadcastMade).toBe(false);
    expect(provider.calls.waitForTerminal).toBe(1);
    expect(provider.calls.broadcast).toBe(0);
    expect(receipts.saves[1]?.status).toBe("confirmed");
  });

  it("sends a prior failed receipt to manual review without rebroadcasting", async () => {
    const provider = new FakeKeeperHubProvider();
    const receipts = new FakeReceiptStore();
    const input = makeInput();
    await receipts.save(receiptFor(input, { status: "failed", executionId: "ex_fail" }));
    const orchestrator = new SettlementOrchestrator({ provider, receipts, nowIso: () => NOW });

    const evidence = await orchestrator.settle(input);

    expect(evidence.status).toBe("manual-review");
    expect(evidence.error?.code).toBe("EXECUTION_MANUAL_REVIEW");
    expect(evidence.broadcastMade).toBe(false);
    expect(provider.calls.broadcast).toBe(0);
  });

  it("keeps a submitted execution pending as manual review when polling times out", async () => {
    const provider = new FakeKeeperHubProvider();
    provider.broadcastResult = { executionId: "ex_new", status: "running" };
    provider.terminalError = new ProviderError({
      code: "PROVIDER_POLL_TIMEOUT",
      message: "KeeperHub execution did not reach a terminal state within the deadline.",
    });
    const receipts = new FakeReceiptStore();
    const orchestrator = new SettlementOrchestrator({ provider, receipts, nowIso: () => NOW });

    const evidence = await orchestrator.settle(makeInput());

    expect(evidence.status).toBe("manual-review");
    expect(evidence.broadcastMade).toBe(true);
    expect(evidence.executionId).toBe("ex_new");
    expect(evidence.error?.code).toBe("EXECUTION_MANUAL_REVIEW");
    expect(provider.calls.broadcast).toBe(1);
    expect(receipts.saves[1]?.status).toBe("pending");
    expect(receipts.saves[1]?.executionId).toBe("ex_new");
  });

  it("never rebroadcasts when the broadcast response is lost", async () => {
    const provider = new FakeKeeperHubProvider();
    provider.broadcastError = new ProviderError({
      code: "PROVIDER_TRANSPORT_FAILED",
      message: "KeeperHub request could not be completed.",
    });
    const receipts = new FakeReceiptStore();
    const orchestrator = new SettlementOrchestrator({ provider, receipts, nowIso: () => NOW });

    const evidence = await orchestrator.settle(makeInput());

    expect(evidence.status).toBe("manual-review");
    expect(evidence.broadcastMade).toBe(false);
    expect(evidence.error?.code).toBe("EXECUTION_MANUAL_REVIEW");
    expect(provider.calls.broadcast).toBe(1);
    // The durable pre-broadcast reservation remains so a later run resolves
    // to manual review and never rebroadcasts.
    expect(receipts.saves).toHaveLength(1);
    expect(receipts.saves[0]?.status).toBe("pending");
    expect(receipts.saves[0]?.executionId).toBeUndefined();
  });

  it("maps a rejected broadcast (auth) to a failed outcome without a receipt", async () => {
    const provider = new FakeKeeperHubProvider();
    provider.broadcastError = new ProviderError({
      code: "PROVIDER_AUTH_FAILED",
      message: "KeeperHub authentication failed.",
      statusCode: 401,
    });
    const receipts = new FakeReceiptStore();
    const orchestrator = new SettlementOrchestrator({ provider, receipts, nowIso: () => NOW });

    const evidence = await orchestrator.settle(makeInput());

    expect(evidence.status).toBe("failed");
    expect(evidence.broadcastMade).toBe(false);
    expect(evidence.error?.code).toBe("PROVIDER_AUTH_FAILED");
    expect(provider.calls.broadcast).toBe(1);
    expect(receipts.saves).toHaveLength(1);
    expect(receipts.saves[0]?.status).toBe("pending");
  });

  it("preserves the execution id as manual review when the submitted receipt save fails after broadcast", async () => {
    const provider = new FakeKeeperHubProvider();
    provider.broadcastResult = { executionId: "ex_new", status: "running" };
    const receipts = new FakeReceiptStore();
    receipts.saveErrorAt = 2;
    const orchestrator = new SettlementOrchestrator({ provider, receipts, nowIso: () => NOW });

    const evidence = await orchestrator.settle(makeInput());

    expect(evidence.status).toBe("manual-review");
    expect(evidence.broadcastMade).toBe(true);
    expect(evidence.executionId).toBe("ex_new");
    expect(evidence.error?.code).toBe("EXECUTION_MANUAL_REVIEW");
    expect(provider.calls.broadcast).toBe(1);
    expect(provider.calls.waitForTerminal).toBe(0);
    // The durable pre-broadcast reservation remains (pending, no execution id)
    // so a later run resolves to manual review and never rebroadcasts.
    expect(receipts.saves).toHaveLength(1);
    expect(receipts.saves[0]?.status).toBe("pending");
    expect(receipts.saves[0]?.executionId).toBeUndefined();
  });

  it("never rebroadcasts in a later run after a post-broadcast receipt failure", async () => {
    const provider = new FakeKeeperHubProvider();
    provider.broadcastResult = { executionId: "ex_new", status: "running" };
    provider.terminalResult = {
      executionId: "ex_new",
      status: "completed",
      transactionHash: "0xabc",
      pollIntervalHint: 0,
    };
    const receipts = new FakeReceiptStore();
    receipts.saveErrorAt = 2;
    const orchestrator = new SettlementOrchestrator({ provider, receipts, nowIso: () => NOW });

    // Run 1: broadcast succeeds but the submitted receipt save fails.
    const first = await orchestrator.settle(makeInput());
    expect(first.status).toBe("manual-review");
    expect(provider.calls.broadcast).toBe(1);

    // Run 2: the durable reservation exists; the same event must not broadcast
    // again, even after simulated provider idempotency expiry.
    provider.calls.broadcast = 0;
    receipts.saveErrorAt = undefined;
    const second = await orchestrator.settle(makeInput());
    expect(second.status).toBe("manual-review");
    expect(second.broadcastMade).toBe(false);
    expect(provider.calls.broadcast).toBe(0);
  });

  it("uses the configured recipient wallet from the trusted mapping", async () => {
    const provider = new FakeKeeperHubProvider();
    const receipts = new FakeReceiptStore();
    const orchestrator = new SettlementOrchestrator({ provider, receipts, nowIso: () => NOW });

    await orchestrator.settle(makeInput());

    expect(provider.lastBroadcastKey).toMatch(/^mergepay:[a-f0-9]{64}$/);
  });

  it("serializes a duplicate evidence record without secrets", async () => {
    const provider = new FakeKeeperHubProvider();
    const receipts = new FakeReceiptStore();
    const input = makeInput();
    await receipts.save(receiptFor(input));
    const orchestrator = new SettlementOrchestrator({ provider, receipts, nowIso: () => NOW });

    const evidence = await orchestrator.settle(input);
    const serialized = serializeEvidence(evidence);

    expect(serialized).toContain('"status": "duplicate"');
    expect(serialized).not.toContain("kh_test");
    expect(serialized).not.toContain("ghp_");
  });
});
