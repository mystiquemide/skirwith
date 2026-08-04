import { SkirwithError } from "../domain/errors.js";
import type { ErrorCode } from "../domain/errors.js";

export interface ProviderErrorInput {
  code: ErrorCode;
  message: string;
  cause?: unknown;
  statusCode?: number;
  kind?: string;
  retryAfterMs?: number;
}

export class ProviderError extends SkirwithError {
  readonly statusCode?: number;
  readonly kind?: string;
  readonly retryAfterMs?: number;

  constructor(input: ProviderErrorInput) {
    super({
      code: input.code,
      category: "provider",
      message: input.message,
      cause: input.cause,
    });
    this.statusCode = input.statusCode;
    this.kind = input.kind;
    this.retryAfterMs = input.retryAfterMs;
  }
}
