import { describe, expect, it } from "vitest";
import { resolveExistingReceipt } from "../../src/execution/duplicate-resolver.js";
import type { ReceiptRecord } from "../../src/evidence/receipt.js";

const CURRENT = {
  paymentKey: "mergepay:abc",
  requestHash: "hash-a",
  repository: "acme/mergepay-demo",
  pullRequestNumber: 42,
  mergeSha: "0123456789abcdef0123456789abcdef01234567",
};

function receipt(overrides: Partial<ReceiptRecord> = {}): ReceiptRecord {
  return {
    version: 1,
    product: "mergepay",
    paymentKey: CURRENT.paymentKey,
    requestHash: CURRENT.requestHash,
    status: "confirmed",
    executionId: "ex_1",
    repository: CURRENT.repository,
    pullRequestNumber: CURRENT.pullRequestNumber,
    mergeSha: CURRENT.mergeSha,
    createdAt: "2026-08-03T00:00:00.000Z",
    updatedAt: "2026-08-03T00:00:00.000Z",
    ...overrides,
  };
}

describe("resolveExistingReceipt", () => {
  it("resolves a confirmed receipt with matching content as a duplicate", () => {
    expect(resolveExistingReceipt(receipt(), CURRENT)).toEqual({ kind: "duplicate" });
  });

  it("resolves a pending receipt with an execution id as resume-poll", () => {
    expect(resolveExistingReceipt(receipt({ status: "pending" }), CURRENT)).toEqual({
      kind: "resume-poll",
    });
  });

  it("resolves a failed receipt with matching content as manual review", () => {
    expect(resolveExistingReceipt(receipt({ status: "failed" }), CURRENT)).toEqual({
      kind: "manual-review",
    });
  });

  it("resolves a pending receipt without an execution id as manual review", () => {
    const withoutExecutionId = receipt({ status: "pending" });
    delete withoutExecutionId.executionId;
    expect(resolveExistingReceipt(withoutExecutionId, CURRENT)).toEqual({ kind: "manual-review" });
  });

  it("resolves changed content under the same key as a conflict", () => {
    expect(resolveExistingReceipt(receipt({ requestHash: "hash-b" }), CURRENT)).toEqual({
      kind: "conflict",
    });
  });

  it("resolves a receipt for a different merge as a conflict", () => {
    expect(
      resolveExistingReceipt(
        receipt({ mergeSha: "0123456789abcdef0123456789abcdef01234568" }),
        CURRENT,
      ),
    ).toEqual({ kind: "conflict" });
  });
});
