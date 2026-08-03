import { describe, expect, it } from "vitest";
import { REASON_CODES, reason } from "../../src/policy/reason-codes.js";
import type { PolicyReasonCode } from "../../src/domain/types.js";

const ALL_CODES: readonly PolicyReasonCode[] = [
  "merged-pr-verified",
  "expected-repository",
  "expected-base-branch",
  "required-label-present",
  "required-checks-passed",
  "recipient-resolved",
  "amount-resolved",
  "amount-within-cap",
  "chain-token-allowed",
  "blocked-unknown-reason",
  "blocked-unmerged-pr",
  "blocked-wrong-repository",
  "blocked-wrong-base-branch",
  "blocked-missing-required-label",
  "blocked-checks-not-passed",
  "blocked-unknown-recipient",
  "blocked-ambiguous-payout",
  "blocked-amount-exceeds-cap",
  "blocked-invalid-amount",
  "blocked-disallowed-chain-token",
];

const BLOCKED_CODES = ALL_CODES.filter((code) => code.startsWith("blocked-"));
const INFO_CODES = ALL_CODES.filter((code) => !code.startsWith("blocked-"));

describe("reason code registry", () => {
  it("defines a stable entry for every allowed reason code", () => {
    for (const code of ALL_CODES) {
      expect(REASON_CODES[code]).toBeDefined();
      expect(REASON_CODES[code].code).toBe(code);
    }
  });

  it("registers exactly the set of defined reason codes", () => {
    expect(Object.keys(REASON_CODES).sort()).toEqual([...ALL_CODES].sort());
  });

  it("gives every code a severity, a safe message, and a broadcast classification", () => {
    for (const definition of Object.values(REASON_CODES)) {
      expect(["info", "block"]).toContain(definition.severity);
      expect(definition.message.length).toBeGreaterThan(0);
      expect(typeof definition.broadcastEligible).toBe("boolean");
    }
  });

  it("keeps severity consistent with the code name", () => {
    for (const code of BLOCKED_CODES) {
      expect(REASON_CODES[code].severity).toBe("block");
    }
    for (const code of INFO_CODES) {
      expect(REASON_CODES[code].severity).toBe("info");
    }
  });

  it("marks every info code as broadcast eligible and every block code as not", () => {
    for (const definition of Object.values(REASON_CODES)) {
      expect(definition.broadcastEligible).toBe(definition.severity === "info");
    }
  });

  it("classifies every blocked path as no-broadcast", () => {
    for (const code of BLOCKED_CODES) {
      expect(REASON_CODES[code].broadcastEligible).toBe(false);
    }
  });
});

describe("reason()", () => {
  it("builds a reason consistent with the registry for a blocked code", () => {
    const entry = reason("blocked-amount-exceeds-cap");
    expect(entry).toEqual({
      code: "blocked-amount-exceeds-cap",
      severity: "block",
      message: REASON_CODES["blocked-amount-exceeds-cap"].message,
    });
  });

  it("builds an info reason for an allow path", () => {
    const entry = reason("chain-token-allowed");
    expect(entry.severity).toBe("info");
    expect(entry.message.length).toBeGreaterThan(0);
  });
});
