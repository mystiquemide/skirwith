import type { PolicyReasonCode } from "./types.js";

export type ErrorCategory =
  "configuration" | "policy" | "github" | "provider" | "execution" | "security" | "internal";

export type ErrorCode =
  | "CONFIG_UNSUPPORTED_VERSION"
  | "CONFIG_MALFORMED_YAML"
  | "CONFIG_SCHEMA_INVALID"
  | "CONFIG_SEMANTIC_INVALID"
  | "POLICY_BLOCKED"
  | "CANONICAL_REQUEST_INVALID"
  | "GITHUB_FETCH_FAILED"
  | "GITHUB_INVALID_EVENT"
  | "PROVIDER_TRANSPORT_FAILED"
  | "PROVIDER_RESPONSE_INVALID"
  | "PROVIDER_AUTH_FAILED"
  | "PROVIDER_FORBIDDEN"
  | "PROVIDER_RATE_LIMITED"
  | "PROVIDER_SIMULATION_FAILED"
  | "PROVIDER_BROADCAST_FAILED"
  | "PROVIDER_LOOKUP_FAILED"
  | "PROVIDER_POLL_TIMEOUT"
  | "EXECUTION_PARITY_MISMATCH"
  | "EXECUTION_CONFLICT"
  | "EXECUTION_MANUAL_REVIEW"
  | "SECURITY_REDACTION_FAILED"
  | "INTERNAL_ERROR";

export interface MergePayErrorInput {
  code: ErrorCode;
  category: ErrorCategory;
  message: string;
  cause?: unknown;
}

export class MergePayError extends Error {
  readonly code: ErrorCode;
  readonly category: ErrorCategory;
  override readonly cause?: unknown;

  constructor(input: MergePayErrorInput) {
    super(input.message);
    this.name = "MergePayError";
    this.code = input.code;
    this.category = input.category;
    if (input.cause !== undefined) {
      this.cause = input.cause;
    }
  }

  toPublic(): { code: ErrorCode; message: string } {
    return { code: this.code, message: this.message };
  }
}

export interface PolicyBlockErrorInput {
  code: PolicyReasonCode;
  message: string;
}

export class PolicyBlockError extends Error {
  readonly code: PolicyReasonCode;

  constructor(input: PolicyBlockErrorInput) {
    super(input.message);
    this.name = "PolicyBlockError";
    this.code = input.code;
  }

  toPublic(): { code: PolicyReasonCode; message: string } {
    return { code: this.code, message: this.message };
  }
}
