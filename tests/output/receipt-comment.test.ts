import { describe, expect, it } from "vitest";
import { renderReceiptComment } from "../../src/output/receipt-comment.js";
import { decodeReceiptMarker } from "../../src/evidence/receipt.js";
import type { ReceiptRecord } from "../../src/evidence/receipt.js";

const RECEIPT: ReceiptRecord = {
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
  createdAt: "2026-08-03T00:00:00.000Z",
  updatedAt: "2026-08-03T00:00:00.000Z",
};

describe("renderReceiptComment", () => {
  it("renders readable receipt text plus a decodable hidden marker", () => {
    const body = renderReceiptComment(RECEIPT);
    expect(body).toContain("## MergePay receipt");
    expect(body).toContain("Status: `confirmed`");
    expect(body).toContain("Payment key: `mergepay:abc`");
    expect(body).toContain("Execution ID: `ex_1`");
    expect(body).toContain("[0x123](https://explorer/tx/0x123)");

    const marker = decodeReceiptMarker(body);
    expect(marker).toEqual({
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
    });
  });

  it("renders a pending receipt without transaction fields", () => {
    const { transactionHash, transactionLink, ...pendingBase } = RECEIPT;
    void transactionHash;
    void transactionLink;
    const body = renderReceiptComment({ ...pendingBase, status: "pending" });
    expect(body).toContain("Status: `pending`");
    expect(body).not.toContain("Transaction:");
  });
});
