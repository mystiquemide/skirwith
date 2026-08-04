import { SkirwithError } from "../domain/errors.js";
import type { TransferParameters } from "./types.js";

export function serializeTransferParameters(parameters: TransferParameters): string {
  return JSON.stringify(parameters);
}

export function assertSameTransferParameters(
  simulated: TransferParameters,
  broadcast: TransferParameters,
): void {
  if (serializeTransferParameters(simulated) !== serializeTransferParameters(broadcast)) {
    throw new SkirwithError({
      code: "EXECUTION_PARITY_MISMATCH",
      category: "execution",
      message: "Simulation and broadcast transfer parameters do not match.",
    });
  }
}
