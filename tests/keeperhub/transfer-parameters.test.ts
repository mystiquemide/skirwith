import { describe, expect, it } from "vitest";
import { buildTransferParameters } from "../../src/keeperhub/transfer-parameters.js";
import { toAtomicUnits } from "../../src/domain/decimal.js";
import type { CanonicalPaymentRequest } from "../../src/domain/types.js";

const CANONICAL: CanonicalPaymentRequest = {
  version: 1,
  repository: "acme/skirwith-demo",
  pullRequestNumber: 42,
  mergeSha: "0123456789abcdef0123456789abcdef01234567",
  recipient: "0x05619d1a133623b322a8f366ea9594e4e586f26d",
  amountAtomic: "2500000",
  chainId: 11155111,
  tokenAddress: "0x1c7d4b196cb0c7b01d743fbc6116a902379c7238",
  purpose: "skirwith:payout",
};

describe("buildTransferParameters", () => {
  it("maps the canonical request to provider parameters with a human amount", () => {
    const parameters = buildTransferParameters(CANONICAL, 6);
    expect(parameters.chainId).toBe(11155111);
    expect(parameters.recipientAddress).toBe(CANONICAL.recipient);
    expect(parameters.amount).toBe("2.5");
    expect(parameters.tokenAddress).toBe(CANONICAL.tokenAddress);
  });

  it("round-trips the amount back to atomic units", () => {
    const parameters = buildTransferParameters(CANONICAL, 6);
    expect(toAtomicUnits(parameters.amount, 6)).toBe(CANONICAL.amountAtomic);
  });
});
