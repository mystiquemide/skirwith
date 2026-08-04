import type { SkirwithConfig } from "../config/schema.js";
import { isZeroAmount, toAtomicUnits } from "../domain/decimal.js";
import type {
  ChainTokenConfig,
  HexAddress,
  PolicyDecision,
  PolicyReason,
  PolicyReasonCode,
} from "../domain/types.js";
import { REASON_CODES, reason } from "./reason-codes.js";

export interface PolicyEvaluationInput {
  repository: string;
  authorLogin: string;
  baseBranch: string;
  labels: readonly string[];
  merged: boolean;
  passedChecks: readonly string[];
  expectedBaseBranch: string;
  chainToken: ChainTokenConfig;
  config: SkirwithConfig;
}

export function resolveRecipient(
  config: SkirwithConfig,
  authorLogin: string,
): HexAddress | undefined {
  const wallet = config.recipients[authorLogin];
  return wallet === undefined ? undefined : wallet;
}

export function resolvePayoutAmount(
  config: SkirwithConfig,
  labels: readonly string[],
): { label: string; amount: string } | undefined {
  const matches = labels.filter((label) => Object.hasOwn(config.payout.amounts, label));
  if (matches.length !== 1) {
    return undefined;
  }
  const label = matches[0];
  const amount = label === undefined ? undefined : config.payout.amounts[label];
  if (label === undefined || amount === undefined) {
    return undefined;
  }
  return { label, amount };
}

export function isChainTokenAllowed(config: SkirwithConfig, candidate: ChainTokenConfig): boolean {
  const allowed = config.chain;
  return (
    candidate.chainId === allowed.id &&
    candidate.tokenAddress.toLowerCase() === allowed.token.address.toLowerCase() &&
    candidate.symbol === allowed.token.symbol &&
    candidate.decimals === allowed.token.decimals
  );
}

function blockedDecision(code: PolicyReasonCode): PolicyDecision {
  return {
    result: "blocked",
    reasons: [reason(code)],
    broadcastEligible: false,
  };
}

export function evaluatePolicy(input: PolicyEvaluationInput): PolicyDecision {
  if (!input.merged) {
    return blockedDecision("blocked-unmerged-pr");
  }

  const reasons: PolicyReason[] = [reason("merged-pr-verified")];

  if (input.repository !== input.config.repository) {
    return blockedDecision("blocked-wrong-repository");
  }
  reasons.push(reason("expected-repository"));

  if (input.baseBranch !== input.expectedBaseBranch) {
    return blockedDecision("blocked-wrong-base-branch");
  }
  reasons.push(reason("expected-base-branch"));

  if (!input.labels.includes(input.config.payout.requiredLabel)) {
    return blockedDecision("blocked-missing-required-label");
  }
  reasons.push(reason("required-label-present"));

  if (input.config.checks.required) {
    const missing = input.config.checks.names.filter((name) => !input.passedChecks.includes(name));
    if (missing.length > 0) {
      return blockedDecision("blocked-checks-not-passed");
    }
    reasons.push(reason("required-checks-passed"));
  }

  const recipient = resolveRecipient(input.config, input.authorLogin);
  if (recipient === undefined) {
    return blockedDecision("blocked-unknown-recipient");
  }
  reasons.push(reason("recipient-resolved"));

  const resolved = resolvePayoutAmount(input.config, input.labels);
  if (resolved === undefined) {
    return blockedDecision("blocked-ambiguous-payout");
  }

  if (isZeroAmount(resolved.amount)) {
    return blockedDecision("blocked-invalid-amount");
  }
  const decimals = input.config.chain.token.decimals;
  const amountAtomic = toAtomicUnits(resolved.amount, decimals);
  const maximumAtomic = toAtomicUnits(input.config.payout.maximum, decimals);
  if (amountAtomic === undefined || maximumAtomic === undefined) {
    return blockedDecision("blocked-invalid-amount");
  }
  if (BigInt(amountAtomic) > BigInt(maximumAtomic)) {
    return blockedDecision("blocked-amount-exceeds-cap");
  }
  reasons.push(reason("amount-resolved"));
  reasons.push(reason("amount-within-cap"));

  if (!isChainTokenAllowed(input.config, input.chainToken)) {
    return blockedDecision("blocked-disallowed-chain-token");
  }
  reasons.push(reason("chain-token-allowed"));

  return {
    result: "approved",
    reasons,
    broadcastEligible: reasons.every((entry) => REASON_CODES[entry.code].broadcastEligible),
  };
}
