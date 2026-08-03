import { atomicToHumanUnits } from "../domain/decimal.js";
import type { CanonicalPaymentRequest } from "../domain/types.js";
import type { TransferParameters } from "./types.js";

export function buildTransferParameters(
  canonical: CanonicalPaymentRequest,
  decimals: number,
): TransferParameters {
  return {
    chainId: canonical.chainId,
    recipientAddress: canonical.recipient,
    amount: atomicToHumanUnits(canonical.amountAtomic, decimals),
    tokenAddress: canonical.tokenAddress,
  };
}
