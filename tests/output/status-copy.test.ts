import { describe, expect, it } from "vitest";
import { describeOutcome } from "../../src/output/status-copy.js";
import type { ExecutionStatus } from "../../src/domain/types.js";

const STATUSES: readonly ExecutionStatus[] = [
  "blocked",
  "pending",
  "confirmed",
  "failed",
  "duplicate",
  "manual-review",
];

describe("describeOutcome", () => {
  it("covers every execution status for broadcast and no-broadcast runs", () => {
    for (const status of STATUSES) {
      for (const broadcastMade of [false, true]) {
        const copy = describeOutcome({ status, broadcastMade });
        expect(copy.outcome.length).toBeGreaterThan(0);
        expect(copy.broadcast.length).toBeGreaterThan(0);
        expect(copy.explanation.length).toBeGreaterThan(0);
        expect(copy.nextStep.length).toBeGreaterThan(0);
      }
    }
  });

  it("never recommends blind retrying without checking evidence", () => {
    for (const status of STATUSES) {
      const copy = describeOutcome({ status, broadcastMade: true });
      expect(copy.nextStep.toLowerCase()).not.toContain("just re-run");
      expect(copy.nextStep.toLowerCase()).not.toContain("simply re-run");
    }
  });

  it("distinguishes a confirmed broadcast from a confirmed replay", () => {
    expect(describeOutcome({ status: "confirmed", broadcastMade: true }).broadcast).toBe(
      "Sent once",
    );
    expect(describeOutcome({ status: "confirmed", broadcastMade: false }).broadcast).toBe(
      "Not repeated",
    );
  });

  it("labels a blocked run as stopped before broadcast", () => {
    expect(describeOutcome({ status: "blocked", broadcastMade: false }).outcome).toBe(
      "Stopped before broadcast",
    );
    expect(describeOutcome({ status: "blocked", broadcastMade: false }).broadcast).toBe(
      "Not attempted",
    );
  });

  it("guides a missing-label block to add the label", () => {
    const copy = describeOutcome({
      status: "blocked",
      broadcastMade: false,
      reasons: ["blocked-missing-required-label"],
    });
    expect(copy.nextStep).toContain("required payout label");
  });

  it("guides simulation, auth, and rate-limit failures to safe checks", () => {
    expect(
      describeOutcome({
        status: "failed",
        broadcastMade: false,
        errorCode: "PROVIDER_SIMULATION_FAILED",
      }).nextStep,
    ).toContain("would revert");
    expect(
      describeOutcome({ status: "failed", broadcastMade: false, errorCode: "PROVIDER_AUTH_FAILED" })
        .nextStep,
    ).toContain("API key");
    expect(
      describeOutcome({
        status: "failed",
        broadcastMade: false,
        errorCode: "PROVIDER_RATE_LIMITED",
      }).nextStep,
    ).toContain("Wait");
  });

  it("marks duplicate and manual-review outcomes as never re-broadcast", () => {
    expect(describeOutcome({ status: "duplicate", broadcastMade: false }).outcome).toBe(
      "Existing payment found",
    );
    expect(describeOutcome({ status: "manual-review", broadcastMade: false }).nextStep).toContain(
      "will not broadcast again automatically",
    );
  });
});
