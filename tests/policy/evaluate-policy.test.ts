import { describe, expect, it } from "vitest";
import {
  evaluatePolicy,
  isChainTokenAllowed,
  resolvePayoutAmount,
  resolveRecipient,
} from "../../src/policy/evaluate-policy.js";
import { REASON_CODES } from "../../src/policy/reason-codes.js";
import type { MergePayConfig } from "../../src/config/schema.js";
import {
  FIXTURE_AMOUNT_LABEL,
  FIXTURE_AUTHOR,
  FIXTURE_CHAIN_TOKEN,
  FIXTURE_CONFIG,
  FIXTURE_RECIPIENT,
  FIXTURE_REPOSITORY,
  FIXTURE_REQUIRED_LABEL,
  FIXTURE_TOKEN,
  makePolicyInput,
} from "../fixtures/policy.js";

const APPROVED_REASON_ORDER = [
  "merged-pr-verified",
  "expected-repository",
  "expected-base-branch",
  "required-label-present",
  "required-checks-passed",
  "recipient-resolved",
  "amount-resolved",
  "amount-within-cap",
  "chain-token-allowed",
];

function assertBlocked(code: string, decision: ReturnType<typeof evaluatePolicy>): void {
  expect(decision.result).toBe("blocked");
  expect(decision.broadcastEligible).toBe(false);
  expect(decision.reasons).toHaveLength(1);
  expect(decision.reasons[0]?.code).toBe(code);
  expect(decision.reasons[0]?.severity).toBe("block");
}

describe("evaluatePolicy", () => {
  it("approves an eligible merged pull request with deterministic reasons and broadcast eligibility", () => {
    const decision = evaluatePolicy(makePolicyInput());
    expect(decision.result).toBe("approved");
    expect(decision.broadcastEligible).toBe(true);
    expect(decision.reasons.map((entry) => entry.code)).toEqual(APPROVED_REASON_ORDER);
    for (const entry of decision.reasons) {
      expect(entry.severity).toBe("info");
      expect(entry.message).toBe(REASON_CODES[entry.code].message);
    }
  });

  it("is deterministic for the same input", () => {
    const a = evaluatePolicy(makePolicyInput());
    const b = evaluatePolicy(makePolicyInput());
    expect(a).toEqual(b);
  });

  it("blocks an unmerged pull request before broadcast", () => {
    assertBlocked("blocked-unmerged-pr", evaluatePolicy(makePolicyInput({ merged: false })));
  });

  it("blocks a pull request from the wrong repository", () => {
    assertBlocked(
      "blocked-wrong-repository",
      evaluatePolicy(makePolicyInput({ repository: "other/org" })),
    );
  });

  it("blocks a pull request targeting a non-default base branch", () => {
    assertBlocked(
      "blocked-wrong-base-branch",
      evaluatePolicy(makePolicyInput({ baseBranch: "release" })),
    );
  });

  it("blocks a pull request missing the required label", () => {
    assertBlocked(
      "blocked-missing-required-label",
      evaluatePolicy(makePolicyInput({ labels: [FIXTURE_AMOUNT_LABEL] })),
    );
  });

  it("blocks a pull request when required checks have not passed", () => {
    assertBlocked(
      "blocked-checks-not-passed",
      evaluatePolicy(makePolicyInput({ passedChecks: [] })),
    );
  });

  it("blocks an author with no configured recipient wallet", () => {
    assertBlocked(
      "blocked-unknown-recipient",
      evaluatePolicy(makePolicyInput({ authorLogin: "mallory" })),
    );
  });

  it("blocks labels that resolve to no configured payout amount", () => {
    assertBlocked(
      "blocked-ambiguous-payout",
      evaluatePolicy(makePolicyInput({ labels: [FIXTURE_REQUIRED_LABEL, "unpaid-label"] })),
    );
  });

  it("blocks labels that resolve to more than one configured payout amount", () => {
    assertBlocked(
      "blocked-ambiguous-payout",
      evaluatePolicy(
        makePolicyInput({ labels: [FIXTURE_REQUIRED_LABEL, FIXTURE_AMOUNT_LABEL, "mergepay-10"] }),
      ),
    );
  });

  it("blocks a zero payout amount", () => {
    const config: MergePayConfig = {
      ...FIXTURE_CONFIG,
      payout: { ...FIXTURE_CONFIG.payout, amounts: { [FIXTURE_AMOUNT_LABEL]: "0" } },
    };
    assertBlocked("blocked-invalid-amount", evaluatePolicy(makePolicyInput({ config })));
  });

  it("blocks an amount above the configured maximum", () => {
    const config: MergePayConfig = {
      ...FIXTURE_CONFIG,
      payout: { ...FIXTURE_CONFIG.payout, amounts: { [FIXTURE_AMOUNT_LABEL]: "30" } },
    };
    assertBlocked("blocked-amount-exceeds-cap", evaluatePolicy(makePolicyInput({ config })));
  });

  it("blocks a chain or token outside the configured allowlist", () => {
    assertBlocked(
      "blocked-disallowed-chain-token",
      evaluatePolicy(
        makePolicyInput({
          chainToken: { ...FIXTURE_CHAIN_TOKEN, chainId: 84532 },
        }),
      ),
    );
  });

  it("approves without a checks reason when checks are not required", () => {
    const config: MergePayConfig = {
      ...FIXTURE_CONFIG,
      checks: { required: false, names: [] },
    };
    const decision = evaluatePolicy(makePolicyInput({ config, passedChecks: [] }));
    expect(decision.result).toBe("approved");
    expect(decision.broadcastEligible).toBe(true);
    expect(decision.reasons.map((entry) => entry.code)).not.toContain("required-checks-passed");
  });
});

describe("resolveRecipient", () => {
  it("resolves the configured wallet for a known author", () => {
    expect(resolveRecipient(FIXTURE_CONFIG, FIXTURE_AUTHOR)).toBe(FIXTURE_RECIPIENT);
  });

  it("returns undefined for an unmapped author", () => {
    expect(resolveRecipient(FIXTURE_CONFIG, "mallory")).toBeUndefined();
  });
});

describe("resolvePayoutAmount", () => {
  it("resolves exactly one configured amount from matching labels", () => {
    expect(
      resolvePayoutAmount(FIXTURE_CONFIG, [FIXTURE_REQUIRED_LABEL, FIXTURE_AMOUNT_LABEL]),
    ).toEqual({ label: FIXTURE_AMOUNT_LABEL, amount: "5" });
  });

  it("returns undefined when no label matches a configured amount", () => {
    expect(
      resolvePayoutAmount(FIXTURE_CONFIG, [FIXTURE_REQUIRED_LABEL, "unpaid-label"]),
    ).toBeUndefined();
  });

  it("returns undefined when more than one label matches", () => {
    expect(
      resolvePayoutAmount(FIXTURE_CONFIG, [FIXTURE_AMOUNT_LABEL, "mergepay-10"]),
    ).toBeUndefined();
  });
});

describe("isChainTokenAllowed", () => {
  it("accepts the configured chain and token", () => {
    expect(isChainTokenAllowed(FIXTURE_CONFIG, FIXTURE_CHAIN_TOKEN)).toBe(true);
  });

  it("rejects a different chain id", () => {
    expect(isChainTokenAllowed(FIXTURE_CONFIG, { ...FIXTURE_CHAIN_TOKEN, chainId: 84532 })).toBe(
      false,
    );
  });

  it("rejects a different token address", () => {
    expect(
      isChainTokenAllowed(FIXTURE_CONFIG, {
        ...FIXTURE_CHAIN_TOKEN,
        tokenAddress: "0x036cbd53842c5426634e7929541ec2318f3dcf7e",
      }),
    ).toBe(false);
  });

  it("rejects a different symbol", () => {
    expect(isChainTokenAllowed(FIXTURE_CONFIG, { ...FIXTURE_CHAIN_TOKEN, symbol: "DAI" })).toBe(
      false,
    );
  });

  it("rejects different decimals", () => {
    expect(isChainTokenAllowed(FIXTURE_CONFIG, { ...FIXTURE_CHAIN_TOKEN, decimals: 18 })).toBe(
      false,
    );
  });
});

describe("policy fixture sanity", () => {
  it("uses the frozen integration target values", () => {
    expect(FIXTURE_CONFIG.repository).toBe(FIXTURE_REPOSITORY);
    expect(FIXTURE_CONFIG.chain.token.address).toBe(FIXTURE_TOKEN);
    expect(FIXTURE_CONFIG.chain.token.symbol).toBe("USDC");
    expect(FIXTURE_CONFIG.chain.token.decimals).toBe(6);
    expect(FIXTURE_CONFIG.chain.id).toBe(11155111);
    expect(FIXTURE_CONFIG.payout.maximum).toBe("25");
    expect(FIXTURE_CONFIG.payout.requiredLabel).toBe(FIXTURE_REQUIRED_LABEL);
  });
});
