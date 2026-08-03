import type { ExecutionStatus } from "../domain/types.js";

export interface ReceiptRecord {
  version: 1;
  product: "mergepay";
  paymentKey: string;
  requestHash: string;
  status: ExecutionStatus;
  executionId?: string;
  transactionHash?: string;
  transactionLink?: string;
  repository: string;
  pullRequestNumber: number;
  mergeSha: string;
  createdAt: string;
  updatedAt: string;
}

export type ReceiptMarker = Omit<ReceiptRecord, "createdAt" | "updatedAt">;

const MARKER_RE = /<!-- mergepay:(\{[\s\S]*?\}) -->/;

const VALID_STATUSES: ReadonlySet<string> = new Set([
  "blocked",
  "pending",
  "confirmed",
  "failed",
  "duplicate",
  "manual-review",
]);

export function isReceiptMarker(value: unknown): value is ReceiptMarker {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const marker = value as Record<string, unknown>;
  return (
    marker.version === 1 &&
    marker.product === "mergepay" &&
    typeof marker.paymentKey === "string" &&
    typeof marker.requestHash === "string" &&
    typeof marker.status === "string" &&
    VALID_STATUSES.has(marker.status) &&
    typeof marker.repository === "string" &&
    typeof marker.pullRequestNumber === "number" &&
    typeof marker.mergeSha === "string"
  );
}

export function encodeReceiptMarker(marker: ReceiptMarker): string {
  return `<!-- mergepay:${JSON.stringify(marker)} -->`;
}

export function decodeReceiptMarker(text: string): ReceiptMarker | undefined {
  const match = MARKER_RE.exec(text);
  const raw = match?.[1];
  if (raw === undefined) {
    return undefined;
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return undefined;
  }
  if (!isReceiptMarker(parsed)) {
    return undefined;
  }
  return parsed;
}

export interface ReceiptIntegrityInput {
  paymentKey: string;
  requestHash: string;
  repository: string;
  pullRequestNumber: number;
  mergeSha: string;
}

export function receiptMatchesCurrent(
  marker: ReceiptMarker,
  current: ReceiptIntegrityInput,
): boolean {
  return (
    marker.paymentKey === current.paymentKey &&
    marker.requestHash === current.requestHash &&
    marker.repository === current.repository &&
    marker.pullRequestNumber === current.pullRequestNumber &&
    marker.mergeSha === current.mergeSha
  );
}
