export type HexAddress = `0x${string}`;

export interface RepositoryIdentity {
  owner: string;
  name: string;
  fullName: string;
}

export interface MergedPullRequest {
  repository: RepositoryIdentity;
  pullRequestNumber: number;
  baseBranch: string;
  mergeSha: string;
  authorLogin: string;
  labels: readonly string[];
}

export interface PayoutAmount {
  raw: string;
}

export interface PayoutRecipient {
  wallet: HexAddress;
}

export interface PayoutCandidate {
  recipient: PayoutRecipient;
  amount: PayoutAmount;
}

export interface ChainTokenConfig {
  chainId: number;
  tokenAddress: HexAddress;
  symbol: string;
  decimals: number;
}

export type PolicyReasonCode =
  | "merged-pr-verified"
  | "expected-repository"
  | "expected-base-branch"
  | "required-label-present"
  | "required-checks-passed"
  | "recipient-resolved"
  | "amount-resolved"
  | "amount-within-cap"
  | "chain-token-allowed"
  | "blocked-unknown-reason"
  | "blocked-unmerged-pr"
  | "blocked-wrong-repository"
  | "blocked-wrong-base-branch"
  | "blocked-missing-required-label"
  | "blocked-checks-not-passed"
  | "blocked-unknown-recipient"
  | "blocked-ambiguous-payout"
  | "blocked-amount-exceeds-cap"
  | "blocked-invalid-amount"
  | "blocked-disallowed-chain-token";

export interface PolicyReason {
  code: PolicyReasonCode;
  severity: "info" | "block";
}

export type PolicyResult = "approved" | "blocked";

export interface PolicyDecision {
  result: PolicyResult;
  reasons: readonly PolicyReason[];
  broadcastEligible: boolean;
}

export interface CanonicalPaymentRequest {
  version: 1;
  repository: string;
  pullRequestNumber: number;
  mergeSha: string;
  recipient: HexAddress;
  amountAtomic: string;
  chainId: number;
  tokenAddress: HexAddress;
  purpose: string;
}

export type ExecutionStatus =
  "blocked" | "pending" | "confirmed" | "failed" | "duplicate" | "manual-review";

export type SimulationState = "not-run" | "passed" | "failed";

export interface EvidenceRecord {
  version: 1;
  paymentKey: string;
  requestHash: string;
  policy: PolicyDecision;
  simulation: SimulationState;
  broadcastMade: boolean;
  executionId?: string;
  status: ExecutionStatus;
  transactionHash?: string;
  transactionLink?: string;
  timestamps: Record<string, string>;
  error?: { code: string; message: string };
}
