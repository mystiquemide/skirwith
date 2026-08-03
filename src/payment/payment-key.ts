import { hashCanonicalRequest } from "./payment-hash.js";
import type { CanonicalPaymentRequest } from "../domain/types.js";

export function derivePaymentKey(request: CanonicalPaymentRequest): string {
  const requestHash = hashCanonicalRequest(request);
  return `mergepay:${requestHash}`;
}
