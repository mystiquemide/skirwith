import { describe, expect, it } from "vitest";
import { buildCanonicalRequest } from "../../src/payment/canonical-request.js";
import { hashCanonicalRequest } from "../../src/payment/payment-hash.js";
import { derivePaymentKey } from "../../src/payment/payment-key.js";
import type { CanonicalPaymentRequest } from "../../src/domain/types.js";

const base = {
  repository: "acme/mergepay-demo",
  pullRequestNumber: 42,
  mergeSha: "0123456789abcdef0123456789abcdef01234567",
  recipient: "0x05619d1a133623b322a8f366ea9594e4e586f26d" as const,
  amountAtomic: "2500000",
  chainId: 11155111,
  tokenAddress: "0x1c7d4b196cb0c7b01d743fbc6116a902379c7238" as const,
  purpose: "mergepay:payout",
};

describe("buildCanonicalRequest", () => {
  it("produces a canonical request with version 1", () => {
    const request: CanonicalPaymentRequest = buildCanonicalRequest(base);
    expect(request.version).toBe(1);
    expect(request.pullRequestNumber).toBe(42);
    expect(request.amountAtomic).toBe("2500000");
  });

  it("normalizes the repository and merge sha to lowercase hex", () => {
    const request = buildCanonicalRequest({
      ...base,
      repository: "ACME/mergepay-demo",
      mergeSha: "0123456789abcdef0123456789abcdef01234567",
    });
    expect(request.repository).toBe("acme/mergepay-demo");
  });
});

describe("hashCanonicalRequest", () => {
  it("hashes identical requests identically", () => {
    const a = hashCanonicalRequest(buildCanonicalRequest(base));
    const b = hashCanonicalRequest(buildCanonicalRequest(base));
    expect(a).toBe(b);
  });

  it("produces different hashes when any material field changes", () => {
    const original = hashCanonicalRequest(buildCanonicalRequest(base));
    const changedAmount = hashCanonicalRequest(
      buildCanonicalRequest({ ...base, amountAtomic: "2500001" }),
    );
    const changedRecipient = hashCanonicalRequest(
      buildCanonicalRequest({
        ...base,
        recipient: "0x05619d1a133623b322a8f366ea9594e4e586f26e",
      }),
    );
    expect(changedAmount).not.toBe(original);
    expect(changedRecipient).not.toBe(original);
  });

  it("is stable across runs (deterministic)", () => {
    const request = buildCanonicalRequest(base);
    const first = hashCanonicalRequest(request);
    const second = hashCanonicalRequest(request);
    expect(first).toBe(second);
    expect(first).toMatch(/^[a-f0-9]{64}$/);
  });
});

describe("derivePaymentKey", () => {
  it("is stable for the same request", () => {
    const key = derivePaymentKey(buildCanonicalRequest(base));
    expect(key).toMatch(/^mergepay:/);
  });

  it("changes when the request changes", () => {
    const a = derivePaymentKey(buildCanonicalRequest(base));
    const b = derivePaymentKey(buildCanonicalRequest({ ...base, pullRequestNumber: 43 }));
    expect(a).not.toBe(b);
  });

  it("is provider-safe (alphanumeric plus safe delimiters)", () => {
    const key = derivePaymentKey(buildCanonicalRequest(base));
    expect(key).toMatch(/^mergepay:[a-f0-9]{64}$/);
  });
});
