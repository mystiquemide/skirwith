import type { PolicyReason, PolicyReasonCode } from "../domain/types.js";

export interface ReasonCodeDefinition {
  code: PolicyReasonCode;
  severity: "info" | "block";
  message: string;
  broadcastEligible: boolean;
}

export const REASON_CODES: Readonly<Record<PolicyReasonCode, ReasonCodeDefinition>> = {
  "merged-pr-verified": {
    code: "merged-pr-verified",
    severity: "info",
    message: "The pull request is verified as merged.",
    broadcastEligible: true,
  },
  "expected-repository": {
    code: "expected-repository",
    severity: "info",
    message: "The pull request is in the configured repository.",
    broadcastEligible: true,
  },
  "expected-base-branch": {
    code: "expected-base-branch",
    severity: "info",
    message: "The pull request targets the expected base branch.",
    broadcastEligible: true,
  },
  "required-label-present": {
    code: "required-label-present",
    severity: "info",
    message: "The required payout label is present.",
    broadcastEligible: true,
  },
  "required-checks-passed": {
    code: "required-checks-passed",
    severity: "info",
    message: "All required status checks passed.",
    broadcastEligible: true,
  },
  "recipient-resolved": {
    code: "recipient-resolved",
    severity: "info",
    message: "A recipient wallet resolved from the maintainer mapping.",
    broadcastEligible: true,
  },
  "amount-resolved": {
    code: "amount-resolved",
    severity: "info",
    message: "Exactly one payout amount resolved from the maintainer mapping.",
    broadcastEligible: true,
  },
  "amount-within-cap": {
    code: "amount-within-cap",
    severity: "info",
    message: "The resolved amount is within the configured maximum.",
    broadcastEligible: true,
  },
  "chain-token-allowed": {
    code: "chain-token-allowed",
    severity: "info",
    message: "The chain and token match the configured allowlist.",
    broadcastEligible: true,
  },
  "blocked-unknown-reason": {
    code: "blocked-unknown-reason",
    severity: "block",
    message: "The payout was blocked without a specific reason.",
    broadcastEligible: false,
  },
  "blocked-unmerged-pr": {
    code: "blocked-unmerged-pr",
    severity: "block",
    message: "The pull request is not verified as merged.",
    broadcastEligible: false,
  },
  "blocked-wrong-repository": {
    code: "blocked-wrong-repository",
    severity: "block",
    message: "The pull request is not in the configured repository.",
    broadcastEligible: false,
  },
  "blocked-wrong-base-branch": {
    code: "blocked-wrong-base-branch",
    severity: "block",
    message: "The pull request does not target the expected base branch.",
    broadcastEligible: false,
  },
  "blocked-missing-required-label": {
    code: "blocked-missing-required-label",
    severity: "block",
    message: "The required payout label is missing.",
    broadcastEligible: false,
  },
  "blocked-checks-not-passed": {
    code: "blocked-checks-not-passed",
    severity: "block",
    message: "Required status checks have not passed.",
    broadcastEligible: false,
  },
  "blocked-unknown-recipient": {
    code: "blocked-unknown-recipient",
    severity: "block",
    message: "The author is not mapped to a configured recipient wallet.",
    broadcastEligible: false,
  },
  "blocked-ambiguous-payout": {
    code: "blocked-ambiguous-payout",
    severity: "block",
    message: "The pull request labels do not resolve to exactly one payout amount.",
    broadcastEligible: false,
  },
  "blocked-amount-exceeds-cap": {
    code: "blocked-amount-exceeds-cap",
    severity: "block",
    message: "The resolved amount exceeds the configured maximum.",
    broadcastEligible: false,
  },
  "blocked-invalid-amount": {
    code: "blocked-invalid-amount",
    severity: "block",
    message: "The resolved payout amount is invalid (for example, zero).",
    broadcastEligible: false,
  },
  "blocked-disallowed-chain-token": {
    code: "blocked-disallowed-chain-token",
    severity: "block",
    message: "The chain or token is not in the configured allowlist.",
    broadcastEligible: false,
  },
};

export function reason(code: PolicyReasonCode): PolicyReason {
  const definition = REASON_CODES[code];
  return {
    code: definition.code,
    severity: definition.severity,
    message: definition.message,
  };
}
