import { describe, expect, it } from "vitest";
import {
  decodeReceiptMarker,
  encodeReceiptMarker,
  receiptMatchesCurrent,
} from "../../src/evidence/receipt.js";
import type { ReceiptMarker } from "../../src/evidence/receipt.js";

const MARKER: ReceiptMarker = {
  version: 1,
  product: "mergepay",
  paymentKey: "mergepay:abc",
  requestHash: "def",
  status: "confirmed",
  executionId: "ex_1",
  transactionHash: "0x123",
  transactionLink: "https://explorer/tx/0x123",
  repository: "acme/mergepay-demo",
  pullRequestNumber: 42,
  mergeSha: "0123456789abcdef0123456789abcdef01234567",
};

describe("encodeReceiptMarker / decodeReceiptMarker", () => {
  it("round-trips a receipt marker through the hidden comment block", () => {
    const encoded = encodeReceiptMarker(MARKER);
    expect(encoded).toMatch(/^<!-- mergepay:\{.*-->$/);
    expect(decodeReceiptMarker(encoded)).toEqual(MARKER);
  });

  it("extracts a marker embedded inside a larger comment body", () => {
    const text = `Summary text here.\n${encodeReceiptMarker(MARKER)}\nMore text.`;
    expect(decodeReceiptMarker(text)).toEqual(MARKER);
  });

  it("returns undefined when no marker is present", () => {
    expect(decodeReceiptMarker("no marker here")).toBeUndefined();
  });

  it("returns undefined for a malformed marker", () => {
    expect(decodeReceiptMarker("<!-- mergepay:not-json -->")).toBeUndefined();
  });

  it("rejects a marker with an invalid shape", () => {
    expect(
      decodeReceiptMarker(
        `<!-- mergepay:${JSON.stringify({ version: 1, product: "mergepay" })} -->`,
      ),
    ).toBeUndefined();
  });
});

describe("receiptMatchesCurrent", () => {
  it("accepts a receipt matching the current request identity", () => {
    expect(
      receiptMatchesCurrent(MARKER, {
        paymentKey: MARKER.paymentKey,
        requestHash: MARKER.requestHash,
        repository: MARKER.repository,
        pullRequestNumber: MARKER.pullRequestNumber,
        mergeSha: MARKER.mergeSha,
      }),
    ).toBe(true);
  });

  it("rejects a receipt with a changed request hash", () => {
    expect(
      receiptMatchesCurrent(MARKER, {
        paymentKey: MARKER.paymentKey,
        requestHash: "different",
        repository: MARKER.repository,
        pullRequestNumber: MARKER.pullRequestNumber,
        mergeSha: MARKER.mergeSha,
      }),
    ).toBe(false);
  });

  it("rejects a receipt for a different merge", () => {
    expect(
      receiptMatchesCurrent(MARKER, {
        paymentKey: MARKER.paymentKey,
        requestHash: MARKER.requestHash,
        repository: MARKER.repository,
        pullRequestNumber: MARKER.pullRequestNumber,
        mergeSha: "0123456789abcdef0123456789abcdef01234568",
      }),
    ).toBe(false);
  });
});
