import { createHash } from "node:crypto";
import { canonicalRequestToRecord } from "./canonical-request.js";
import { paymentIdentityToRecord } from "./payment-identity.js";
import type { CanonicalPaymentRequest, PaymentIdentity } from "../domain/types.js";

export function serializeStableRecord(record: Record<string, string>): string {
  return Object.entries(record)
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([key, value]) => `${key}:${value}`)
    .join("\n");
}

export function hashStableRecord(record: Record<string, string>): string {
  return createHash("sha256").update(serializeStableRecord(record), "utf8").digest("hex");
}

export function hashCanonicalRequest(request: CanonicalPaymentRequest): string {
  return hashStableRecord(canonicalRequestToRecord(request));
}

export function hashPaymentIdentity(identity: PaymentIdentity): string {
  return hashStableRecord(paymentIdentityToRecord(identity));
}
