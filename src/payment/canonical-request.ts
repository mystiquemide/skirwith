import { normalizeHexAddress } from "../security/validate.js";
import type { CanonicalPaymentRequest } from "../domain/types.js";

export interface CanonicalRequestInput {
  repository: string;
  pullRequestNumber: number;
  mergeSha: string;
  recipient: string;
  amountAtomic: string;
  chainId: number;
  tokenAddress: string;
  purpose: string;
}

export function buildCanonicalRequest(input: CanonicalRequestInput): CanonicalPaymentRequest {
  return {
    version: 1,
    repository: input.repository.toLowerCase(),
    pullRequestNumber: input.pullRequestNumber,
    mergeSha: input.mergeSha.toLowerCase(),
    recipient: normalizeHexAddress(input.recipient),
    amountAtomic: input.amountAtomic,
    chainId: input.chainId,
    tokenAddress: normalizeHexAddress(input.tokenAddress),
    purpose: input.purpose,
  };
}

export function canonicalRequestToRecord(request: CanonicalPaymentRequest): Record<string, string> {
  return {
    version: String(request.version),
    repository: request.repository,
    pullRequestNumber: String(request.pullRequestNumber),
    mergeSha: request.mergeSha,
    recipient: request.recipient,
    amountAtomic: request.amountAtomic,
    chainId: String(request.chainId),
    tokenAddress: request.tokenAddress,
    purpose: request.purpose,
  };
}
