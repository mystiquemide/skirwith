import { receiptMatchesCurrent } from "../evidence/receipt.js";
import type { ReceiptRecord, ReceiptIntegrityInput } from "../evidence/receipt.js";

export type ExistingExecutionResolution =
  | { kind: "duplicate" }
  | { kind: "resume-poll" }
  | { kind: "manual-review" }
  | { kind: "conflict" };

export function resolveExistingReceipt(
  receipt: ReceiptRecord,
  current: ReceiptIntegrityInput,
): ExistingExecutionResolution {
  if (!receiptMatchesCurrent(receipt, current)) {
    return { kind: "conflict" };
  }
  if (receipt.status === "confirmed") {
    return { kind: "duplicate" };
  }
  if (receipt.status === "pending" && receipt.executionId !== undefined) {
    return { kind: "resume-poll" };
  }
  return { kind: "manual-review" };
}
