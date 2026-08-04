import { LEGACY_PAYMENT_PURPOSE } from "../domain/constants.js";
import { hashPaymentIdentity } from "./payment-hash.js";
import { derivePaymentIdentity } from "./payment-identity.js";
import type { CanonicalPaymentRequest } from "../domain/types.js";

export function derivePaymentKey(request: CanonicalPaymentRequest): string {
  const identityHash = hashPaymentIdentity(derivePaymentIdentity(request));
  return `skirwith:${identityHash}`;
}

// Pre-rebrand receipts were keyed under the mergepay purpose and prefix. The
// current request identity is re-derived against that legacy purpose so a
// historical payment can be found and resolved instead of broadcasting again.
export function deriveLegacyPaymentKey(request: CanonicalPaymentRequest): string {
  const identityHash = hashPaymentIdentity(
    derivePaymentIdentity({ ...request, purpose: LEGACY_PAYMENT_PURPOSE }),
  );
  return `mergepay:${identityHash}`;
}
