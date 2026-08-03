import { describe, expect, it } from "vitest";
import { buildCanonicalRequest } from "../../src/payment/canonical-request.js";
import { MergePayError } from "../../src/domain/errors.js";

const base = {
  repository: "acme/mergepay-demo",
  pullRequestNumber: 42,
  mergeSha: "0123456789abcdef0123456789abcdef01234567",
  recipient: "0x05619d1a133623b322a8f366ea9594e4e586f26d",
  amountAtomic: "2500000",
  chainId: 11155111,
  tokenAddress: "0x1c7d4b196cb0c7b01d743fbc6116a902379c7238",
  purpose: "mergepay:payout",
};

const invalidCases: Array<{ name: string; input: Record<string, unknown> }> = [
  { name: "empty repository", input: { repository: "" } },
  { name: "non-string repository", input: { repository: 5 } },
  { name: "zero pull request number", input: { pullRequestNumber: 0 } },
  { name: "negative pull request number", input: { pullRequestNumber: -1 } },
  { name: "non-integer pull request number", input: { pullRequestNumber: 1.5 } },
  { name: "short merge sha", input: { mergeSha: "abc" } },
  { name: "non-hex merge sha", input: { mergeSha: "zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz" } },
  {
    name: "0x-prefixed merge sha",
    input: { mergeSha: "0x0123456789abcdef0123456789abcdef01234567" },
  },
  { name: "invalid recipient", input: { recipient: "not-an-address" } },
  { name: "short recipient", input: { recipient: "0x1234" } },
  { name: "fractional atomic amount", input: { amountAtomic: "1.5" } },
  { name: "negative atomic amount", input: { amountAtomic: "-5" } },
  { name: "empty atomic amount", input: { amountAtomic: "" } },
  { name: "zero chain id", input: { chainId: 0 } },
  { name: "negative chain id", input: { chainId: -1 } },
  { name: "invalid token address", input: { tokenAddress: "not-an-address" } },
  { name: "empty purpose", input: { purpose: "" } },
];

describe("buildCanonicalRequest validation boundary", () => {
  it("builds a canonical request from valid input", () => {
    const request = buildCanonicalRequest(base);
    expect(request.version).toBe(1);
    expect(request.repository).toBe("acme/mergepay-demo");
    expect(request.pullRequestNumber).toBe(42);
    expect(request.amountAtomic).toBe("2500000");
  });

  it("normalizes repository and addresses to lowercase", () => {
    const upperHex = (address: string) => `0x${address.slice(2).toUpperCase()}`;
    const request = buildCanonicalRequest({
      ...base,
      repository: "ACME/MergePay-Demo",
      recipient: upperHex(base.recipient),
      tokenAddress: upperHex(base.tokenAddress),
    });
    expect(request.repository).toBe("acme/mergepay-demo");
    expect(request.recipient).toBe(base.recipient.toLowerCase());
    expect(request.tokenAddress).toBe(base.tokenAddress.toLowerCase());
  });

  it("canonicalizes logically equivalent inputs identically", () => {
    const upperHex = (address: string) => `0x${address.slice(2).toUpperCase()}`;
    const a = buildCanonicalRequest({
      ...base,
      repository: "ACME/mergepay-demo",
      recipient: upperHex(base.recipient),
      tokenAddress: upperHex(base.tokenAddress),
    });
    const b = buildCanonicalRequest(base);
    expect(a).toEqual(b);
  });

  for (const { name, input } of invalidCases) {
    it(`rejects invalid input: ${name}`, () => {
      expect(() => buildCanonicalRequest({ ...base, ...input })).toThrow(MergePayError);
    });
  }

  it("fails with a stable safe error code for invalid input", () => {
    try {
      buildCanonicalRequest({ ...base, recipient: "not-an-address" });
      throw new Error("expected buildCanonicalRequest to throw");
    } catch (error) {
      expect(error).toBeInstanceOf(MergePayError);
      const publicError = (error as MergePayError).toPublic();
      expect(publicError.code).toBe("CANONICAL_REQUEST_INVALID");
      expect(publicError.message).toMatch(/recipient/i);
    }
  });
});
