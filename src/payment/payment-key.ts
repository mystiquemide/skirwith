import { hashPaymentIdentity } from "./payment-hash.js";
import { derivePaymentIdentity } from "./payment-identity.js";
import type { CanonicalPaymentRequest } from "../domain/types.js";

export function derivePaymentKey(request: CanonicalPaymentRequest): string {
  const identityHash = hashPaymentIdentity(derivePaymentIdentity(request));
  return `skirwith:${identityHash}`;
}
