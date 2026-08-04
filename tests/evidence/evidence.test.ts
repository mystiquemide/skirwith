import { describe, expect, it } from "vitest";
import { buildEvidence, serializeEvidence } from "../../src/evidence/evidence.js";
import type { PolicyDecision } from "../../src/domain/types.js";

const POLICY: PolicyDecision = {
  result: "approved",
  reasons: [],
  broadcastEligible: true,
};

const NOW = "2026-08-03T21:00:00.000Z";

describe("buildEvidence", () => {
  it("builds a versioned evidence record with injected timestamps", () => {
    const record = buildEvidence({
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
    expect(record.version).toBe(1);
    expect(record.paymentKey).toBe("skirwith:abc");
    expect(record.requestHash).toBe("def");
    expect(record.policy).toEqual(POLICY);
    expect(record.simulation).toBe("passed");
    expect(record.broadcastMade).toBe(true);
    expect(record.status).toBe("confirmed");
    expect(record.executionId).toBe("ex_1");
    expect(record.transactionHash).toBe("0x123");
    expect(record.transactionLink).toBe("https://explorer/tx/0x123");
    expect(record.timestamps).toEqual({ createdAt: NOW, updatedAt: NOW });
  });

  it("records an error without leaking extra fields", () => {
    const record = buildEvidence({
      paymentKey: "",
      requestHash: "",
      policy: POLICY,
      simulation: "not-run",
      broadcastMade: false,
      status: "blocked",
      error: { code: "POLICY_BLOCKED", message: "Blocked." },
      nowIso: () => NOW,
    });
    expect(record.error).toEqual({ code: "POLICY_BLOCKED", message: "Blocked." });
    expect(record.broadcastMade).toBe(false);
  });
});

describe("serializeEvidence", () => {
  it("serializes to stable pretty JSON", () => {
    const record = buildEvidence({
      paymentKey: "skirwith:abc",
      requestHash: "def",
      policy: POLICY,
      simulation: "not-run",
      broadcastMade: false,
      status: "duplicate",
      nowIso: () => NOW,
    });
    const first = serializeEvidence(record);
    const second = serializeEvidence(record);
    expect(first).toBe(second);
    expect(JSON.parse(first)).toMatchObject({ version: 1, status: "duplicate" });
  });
});
