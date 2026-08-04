import { isHexAddress, normalizeHexAddress } from "../security/validate.js";
import { SkirwithError } from "../domain/errors.js";
import type { CanonicalPaymentRequest } from "../domain/types.js";

const MERGE_SHA_RE = /^[0-9a-f]{40}$/;
const ATOMIC_AMOUNT_RE = /^(0|[1-9]\d*)$/;

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

function invalid(field: string): SkirwithError {
  return new SkirwithError({
    code: "CANONICAL_REQUEST_INVALID",
    category: "internal",
    message: `Canonical request field '${field}' is invalid.`,
  });
}

export function buildCanonicalRequest(input: CanonicalRequestInput): CanonicalPaymentRequest {
  if (typeof input.repository !== "string" || input.repository.length === 0) {
    throw invalid("repository");
  }
  if (!Number.isSafeInteger(input.pullRequestNumber) || input.pullRequestNumber <= 0) {
    throw invalid("pullRequestNumber");
  }
  if (typeof input.mergeSha !== "string" || !MERGE_SHA_RE.test(input.mergeSha.toLowerCase())) {
    throw invalid("mergeSha");
  }
  if (typeof input.recipient !== "string" || !isHexAddress(input.recipient)) {
    throw invalid("recipient");
  }
  if (typeof input.amountAtomic !== "string" || !ATOMIC_AMOUNT_RE.test(input.amountAtomic)) {
    throw invalid("amountAtomic");
  }
  if (!Number.isSafeInteger(input.chainId) || input.chainId <= 0) {
    throw invalid("chainId");
  }
  if (typeof input.tokenAddress !== "string" || !isHexAddress(input.tokenAddress)) {
    throw invalid("tokenAddress");
  }
  if (typeof input.purpose !== "string" || input.purpose.length === 0) {
    throw invalid("purpose");
  }

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
