import type { MergePayConfig } from "../../src/config/schema.js";
import type { ChainTokenConfig } from "../../src/domain/types.js";
import type { PolicyEvaluationInput } from "../../src/policy/evaluate-policy.js";

// Synthetic test fixture. Values are not live deployment credentials; they
// mirror the frozen v0.1 integration target for realistic policy fixtures.

export const FIXTURE_REPOSITORY = "acme/mergepay-demo";
export const FIXTURE_BASE_BRANCH = "main";
export const FIXTURE_AUTHOR = "alice";
export const FIXTURE_REQUIRED_LABEL = "mergepay-approved";
export const FIXTURE_AMOUNT_LABEL = "mergepay-5";
export const FIXTURE_TOKEN = "0x1c7d4b196cb0c7b01d743fbc6116a902379c7238" as const;
export const FIXTURE_RECIPIENT = "0x05619d1a133623b322a8f366ea9594e4e586f26d" as const;

export const FIXTURE_CONFIG: MergePayConfig = {
  version: 1,
  repository: FIXTURE_REPOSITORY,
  chain: {
    id: 11155111,
    explorer: "https://sepolia.etherscan.io",
    token: {
      address: FIXTURE_TOKEN,
      symbol: "USDC",
      decimals: 6,
    },
  },
  payout: {
    requiredLabel: FIXTURE_REQUIRED_LABEL,
    maximum: "25",
    amounts: {
      [FIXTURE_AMOUNT_LABEL]: "5",
      "mergepay-10": "10",
    },
  },
  recipients: {
    [FIXTURE_AUTHOR]: FIXTURE_RECIPIENT,
  },
  checks: {
    required: true,
    names: ["CI / test"],
  },
};

export const FIXTURE_CHAIN_TOKEN: ChainTokenConfig = {
  chainId: FIXTURE_CONFIG.chain.id,
  tokenAddress: FIXTURE_CONFIG.chain.token.address,
  symbol: FIXTURE_CONFIG.chain.token.symbol,
  decimals: FIXTURE_CONFIG.chain.token.decimals,
};

export function makePolicyInput(
  overrides: Partial<PolicyEvaluationInput> = {},
): PolicyEvaluationInput {
  return {
    repository: FIXTURE_REPOSITORY,
    authorLogin: FIXTURE_AUTHOR,
    baseBranch: FIXTURE_BASE_BRANCH,
    labels: [FIXTURE_REQUIRED_LABEL, FIXTURE_AMOUNT_LABEL],
    merged: true,
    passedChecks: ["CI / test"],
    expectedBaseBranch: FIXTURE_BASE_BRANCH,
    chainToken: FIXTURE_CHAIN_TOKEN,
    config: FIXTURE_CONFIG,
    ...overrides,
  };
}
