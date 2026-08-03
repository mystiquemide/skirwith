import { createHash } from "node:crypto";
import { canonicalRequestToRecord } from "./canonical-request.js";
import type { CanonicalPaymentRequest } from "../domain/types.js";

export function hashCanonicalRequest(request: CanonicalPaymentRequest): string {
  const record = canonicalRequestToRecord(request);
  const serialized = Object.entries(record)
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([key, value]) => `${key}:${value}`)
    .join("\n");
  return createHash("sha256").update(serialized, "utf8").digest("hex");
}
