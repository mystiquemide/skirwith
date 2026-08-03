import type { CanonicalPaymentRequest, PaymentIdentity } from "../domain/types.js";

export function derivePaymentIdentity(request: CanonicalPaymentRequest): PaymentIdentity {
  return {
    version: request.version,
    repository: request.repository,
    pullRequestNumber: request.pullRequestNumber,
    mergeSha: request.mergeSha,
    purpose: request.purpose,
  };
}

export function paymentIdentityToRecord(identity: PaymentIdentity): Record<string, string> {
  return {
    version: String(identity.version),
    repository: identity.repository,
    pullRequestNumber: String(identity.pullRequestNumber),
    mergeSha: identity.mergeSha,
    purpose: identity.purpose,
  };
}
