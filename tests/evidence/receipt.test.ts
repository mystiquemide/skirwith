import { describe, expect, it } from "vitest";
import {
  decodeReceiptMarker,
  encodeReceiptMarker,
  receiptMatchesCurrent,
  signReceiptMarker,
  verifyReceiptMarker,
} from "../../src/evidence/receipt.js";
import type { ReceiptMarker, ReceiptMarkerPayload } from "../../src/evidence/receipt.js";
import type { ExecutionStatus } from "../../src/domain/types.js";

const SECRET = "kh_test_synthetic_secret";
const KEY = `mergepay:${"a".repeat(64)}`;

function payload(overrides: Partial<ReceiptMarkerPayload> = {}): ReceiptMarkerPayload {
  return {
    version: 1,
    product: "mergepay",
    paymentKey: KEY,
    requestHash: "d".repeat(64),
    status: "confirmed",
    executionId: "ex_1",
    transactionHash: `0x${"a".repeat(64)}`,
    transactionLink: "https://explorer/tx/0x123",
    repository: "acme/mergepay-demo",
    pullRequestNumber: 42,
    mergeSha: "0123456789abcdef0123456789abcdef01234567",
    ...overrides,
  };
}

function signed(overrides: Partial<ReceiptMarkerPayload> = {}): ReceiptMarker {
  const base = payload(overrides);
  return { ...base, mac: signReceiptMarker(base, SECRET) };
}

describe("signReceiptMarker / verifyReceiptMarker", () => {
  it("round-trips a signed marker", () => {
    const marker = signed();
    expect(verifyReceiptMarker(marker, SECRET)).toBe(true);
  });

  it("rejects a tampered field", () => {
    const marker = signed({ status: "pending" });
    const tampered = { ...marker, status: "confirmed" as const };
    expect(verifyReceiptMarker(tampered, SECRET)).toBe(false);
  });

  it("rejects a marker signed with a different secret", () => {
    const marker = signed();
    expect(verifyReceiptMarker(marker, "different-secret")).toBe(false);
  });

  it("rejects a marker with a forged mac", () => {
    const marker = signed();
    expect(verifyReceiptMarker({ ...marker, mac: "f".repeat(64) }, SECRET)).toBe(false);
  });

  it("is stable regardless of field ordering", () => {
    const a = signed();
    const { mac, ...base } = a;
    const reordered = {
      repository: base.repository,
      paymentKey: base.paymentKey,
      requestHash: base.requestHash,
      status: base.status,
      version: base.version,
      product: base.product,
      executionId: base.executionId,
      transactionHash: base.transactionHash,
      transactionLink: base.transactionLink,
      pullRequestNumber: base.pullRequestNumber,
      mergeSha: base.mergeSha,
    };
    expect(signReceiptMarker(reordered, SECRET)).toBe(mac);
  });
});

describe("encodeReceiptMarker / decodeReceiptMarker", () => {
  it("round-trips a signed marker through the hidden comment block", () => {
    const marker = signed();
    const encoded = encodeReceiptMarker(marker);
    expect(encoded).toMatch(/^<!-- mergepay:\{.*-->$/);
    expect(decodeReceiptMarker(encoded)).toEqual(marker);
  });

  it("extracts a marker embedded inside a larger comment body", () => {
    const marker = signed();
    const text = `Summary text here.\n${encodeReceiptMarker(marker)}\nMore text.`;
    expect(decodeReceiptMarker(text)).toEqual(marker);
  });

  it("returns undefined when no marker is present", () => {
    expect(decodeReceiptMarker("no marker here")).toBeUndefined();
  });

  it("returns undefined for a malformed marker", () => {
    expect(decodeReceiptMarker("<!-- mergepay:not-json -->")).toBeUndefined();
  });

  it("rejects a marker with a missing or malformed mac", () => {
    const marker = signed();
    const withoutMac = { ...marker } as Record<string, unknown>;
    delete withoutMac.mac;
    expect(decodeReceiptMarker(`<!-- mergepay:${JSON.stringify(withoutMac)} -->`)).toBeUndefined();
    expect(
      decodeReceiptMarker(`<!-- mergepay:${JSON.stringify({ ...marker, mac: "zz" })} -->`),
    ).toBeUndefined();
  });

  it("rejects a marker with malformed identity fields", () => {
    const bad = [
      { paymentKey: "mergepay:not-a-hash" },
      { paymentKey: "not-mergepay:0000" },
      { requestHash: "zz".repeat(32) },
      { mergeSha: "not-a-sha" },
      { pullRequestNumber: 0 },
      { pullRequestNumber: -1 },
      { repository: "" },
      { status: "mysterious" as ExecutionStatus },
      { transactionHash: "0xzz" },
    ];
    for (const change of bad) {
      const marker = signed(change);
      expect(decodeReceiptMarker(encodeReceiptMarker(marker))).toBeUndefined();
    }
  });
});

describe("receiptMatchesCurrent", () => {
  const marker = signed();
  it("accepts a receipt matching the current request identity", () => {
    expect(
      receiptMatchesCurrent(marker, {
        paymentKey: marker.paymentKey,
        requestHash: marker.requestHash,
        repository: marker.repository,
        pullRequestNumber: marker.pullRequestNumber,
        mergeSha: marker.mergeSha,
      }),
    ).toBe(true);
  });

  it("rejects a receipt with a changed request hash", () => {
    expect(
      receiptMatchesCurrent(marker, {
        paymentKey: marker.paymentKey,
        requestHash: "e".repeat(64),
        repository: marker.repository,
        pullRequestNumber: marker.pullRequestNumber,
        mergeSha: marker.mergeSha,
      }),
    ).toBe(false);
  });

  it("rejects a receipt for a different merge", () => {
    expect(
      receiptMatchesCurrent(marker, {
        paymentKey: marker.paymentKey,
        requestHash: marker.requestHash,
        repository: marker.repository,
        pullRequestNumber: marker.pullRequestNumber,
        mergeSha: "0123456789abcdef0123456789abcdef01234568",
      }),
    ).toBe(false);
  });
});
