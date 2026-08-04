import { describe, expect, it } from "vitest";
import { renderActionSummary } from "../../src/output/summary.js";
import { buildEvidence } from "../../src/evidence/evidence.js";
import type { PolicyDecision } from "../../src/domain/types.js";

const POLICY: PolicyDecision = {
  result: "approved",
  reasons: [],
  broadcastEligible: true,
};

const NOW = "2026-08-03T22:00:00.000Z";

describe("renderActionSummary", () => {
  it("renders the confirmed state with payment and transaction evidence", () => {
    const evidence = buildEvidence({
      paymentKey: "skirwith:abc",
      requestHash: "def",
      policy: POLICY,
      simulation: "passed",
      broadcastMade: true,
      status: "confirmed",
      executionId: "ex_1",
      transactionHash: "0x123",
      transactionLink: "https://explorer/tx/0x123",
      nowIso: () => NOW,
    });
    const summary = renderActionSummary(evidence, {
      repository: "acme/skirwith-demo",
      pullRequestNumber: 42,
      recipient: "0x05619d1a133623b322a8f366ea9594e4e586f26d",
      amount: "2.5",
      chainId: 11155111,
      tokenSymbol: "USDC",
      tokenAddress: "0x1c7d4b196cb0c7b01d743fbc6116a902379c7238",
    });
    expect(summary).toContain("Status: `confirmed`");
    expect(summary).toContain("Broadcast made: yes");
    expect(summary).toContain("Recipient: `0x05619d1a133623b322a8f366ea9594e4e586f26d`");
    expect(summary).toContain("Amount: 2.5 USDC");
    expect(summary).toContain("Chain: 11155111");
    expect(summary).toContain("Payment key: `skirwith:abc`");
    expect(summary).toContain("[0x123](https://explorer/tx/0x123)");
  });

  it("renders a blocked state without payment details", () => {
    const evidence = buildEvidence({
      paymentKey: "",
      requestHash: "",
      policy: { result: "blocked", reasons: [], broadcastEligible: false },
      simulation: "not-run",
      broadcastMade: false,
      status: "blocked",
      nowIso: () => NOW,
    });
    const summary = renderActionSummary(evidence, {
      repository: "acme/skirwith-demo",
      pullRequestNumber: 42,
    });
    expect(summary).toContain("Status: `blocked`");
    expect(summary).toContain("Broadcast made: no");
    expect(summary).not.toContain("Payment key");
  });
});
