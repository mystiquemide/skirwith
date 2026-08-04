import { createHash, createHmac } from "node:crypto";
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

export interface ReceiptMarkerPayload {
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
}

export interface ReceiptMarker extends ReceiptMarkerPayload {
  keyId: string;
  mac: string;
}

export interface ReceiptSigningKey {
  id: string;
  secret: string;
}

const MARKER_RE = /<!-- mergepay:(\{[\s\S]*?\}) -->/;

const VALID_STATUSES: ReadonlySet<string> = new Set([
  "blocked",
  "pending",
  "confirmed",
  "failed",
  "duplicate",
  "manual-review",
]);

const PAYMENT_KEY_RE = /^mergepay:[0-9a-f]{64}$/;
const SHA256_HEX_RE = /^[0-9a-f]{64}$/;
const MERGE_SHA_RE = /^[0-9a-f]{40}$/;
const TX_HASH_RE = /^0x[0-9a-fA-F]+$/;
const MAC_RE = /^[0-9a-f]{64}$/;
const KEY_ID_RE = /^[0-9a-f]{16}$/;

function isOptionalString(value: unknown, minLength: number): boolean {
  return value === undefined || (typeof value === "string" && value.length >= minLength);
}

function isOptionalTransactionLink(value: unknown): boolean {
  return value === undefined || (typeof value === "string" && value.startsWith("https://"));
}

export function isReceiptMarker(value: unknown): value is ReceiptMarker {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const marker = value as Record<string, unknown>;
  return (
    marker.version === 1 &&
    marker.product === "mergepay" &&
    typeof marker.paymentKey === "string" &&
    PAYMENT_KEY_RE.test(marker.paymentKey) &&
    typeof marker.requestHash === "string" &&
    SHA256_HEX_RE.test(marker.requestHash) &&
    typeof marker.status === "string" &&
    VALID_STATUSES.has(marker.status) &&
    typeof marker.repository === "string" &&
    marker.repository.length > 0 &&
    typeof marker.pullRequestNumber === "number" &&
    Number.isSafeInteger(marker.pullRequestNumber) &&
    marker.pullRequestNumber > 0 &&
    typeof marker.mergeSha === "string" &&
    MERGE_SHA_RE.test(marker.mergeSha) &&
    typeof marker.keyId === "string" &&
    KEY_ID_RE.test(marker.keyId) &&
    typeof marker.mac === "string" &&
    MAC_RE.test(marker.mac) &&
    isOptionalString(marker.executionId, 1) &&
    (marker.transactionHash === undefined || TX_HASH_RE.test(String(marker.transactionHash))) &&
    isOptionalTransactionLink(marker.transactionLink)
  );
}

function pruneUndefined(value: object): Record<string, unknown> {
  const output: Record<string, unknown> = {};
  for (const [key, entry] of Object.entries(value)) {
    if (entry !== undefined) {
      output[key] = entry;
    }
  }
  return output;
}

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map((entry) => stableStringify(entry)).join(",")}]`;
  }
  if (value !== null && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) =>
      a < b ? -1 : 1,
    );
    return `{${entries
      .map(([key, entry]) => `${JSON.stringify(key)}:${stableStringify(entry)}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

export function keyIdFor(secret: string): string {
  return createHash("sha256").update(secret).digest("hex").slice(0, 16);
}

export function signReceiptMarker(payload: ReceiptMarkerPayload, key: ReceiptSigningKey): string {
  return createHmac("sha256", key.secret)
    .update(stableStringify(pruneUndefined(payload)))
    .digest("hex");
}

export function verifyReceiptMarker(
  marker: ReceiptMarker,
  keys: readonly ReceiptSigningKey[],
): boolean {
  const key = keys.find((candidate) => candidate.id === marker.keyId);
  if (key === undefined) {
    return false;
  }
  const { mac, keyId: _keyId, ...payload } = marker;
  void _keyId;
  return signReceiptMarker(payload, key) === mac;
}

export function encodeReceiptMarker(marker: ReceiptMarker): string {
  return `<!-- mergepay:${JSON.stringify(pruneUndefined(marker))} -->`;
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

export interface ReceiptIdentityFields {
  paymentKey: string;
  requestHash: string;
  repository: string;
  pullRequestNumber: number;
  mergeSha: string;
}

export function receiptMatchesCurrent(
  receipt: ReceiptIdentityFields,
  current: ReceiptIntegrityInput,
): boolean {
  return (
    receipt.paymentKey === current.paymentKey &&
    receipt.requestHash === current.requestHash &&
    receipt.repository === current.repository &&
    receipt.pullRequestNumber === current.pullRequestNumber &&
    receipt.mergeSha === current.mergeSha
  );
}
