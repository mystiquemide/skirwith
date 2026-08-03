import type { EvidenceRecord } from "../domain/types.js";

export function buildActionOutputs(evidence: EvidenceRecord): Record<string, string> {
  return {
    status: evidence.status,
    "policy-result": evidence.policy.result,
    "payment-key": evidence.paymentKey,
    "request-hash": evidence.requestHash,
    "execution-id": evidence.executionId ?? "",
    "transaction-hash": evidence.transactionHash ?? "",
    "transaction-link": evidence.transactionLink ?? "",
    duplicate: String(evidence.status === "duplicate"),
    "broadcast-made": String(evidence.broadcastMade),
  };
}
