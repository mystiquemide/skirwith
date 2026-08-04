import { describe, expect, it } from "vitest";
import { buildActionOutputs } from "../../src/output/outputs.js";
import { buildEvidence } from "../../src/evidence/evidence.js";
import type { PolicyDecision } from "../../src/domain/types.js";

const POLICY: PolicyDecision = {
  result: "approved",
  reasons: [],
  broadcastEligible: true,
};

describe("buildActionOutputs", () => {
  it("exposes the documented outputs for a confirmed payout", () => {
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
      nowIso: () => "2026-08-03T00:00:00.000Z",
    });
    expect(buildActionOutputs(evidence)).toEqual({
      status: "confirmed",
      "policy-result": "approved",
      "payment-key": "skirwith:abc",
      "request-hash": "def",
      "execution-id": "ex_1",
      "transaction-hash": "0x123",
      "transaction-link": "https://explorer/tx/0x123",
      duplicate: "false",
      "broadcast-made": "true",
    });
  });

  it("exposes duplicate and no-broadcast flags", () => {
    const evidence = buildEvidence({
      paymentKey: "skirwith:abc",
      requestHash: "def",
      policy: POLICY,
      simulation: "not-run",
      broadcastMade: false,
      status: "duplicate",
      nowIso: () => "2026-08-03T00:00:00.000Z",
    });
    const outputs = buildActionOutputs(evidence);
    expect(outputs.duplicate).toBe("true");
    expect(outputs["broadcast-made"]).toBe("false");
  });
});
