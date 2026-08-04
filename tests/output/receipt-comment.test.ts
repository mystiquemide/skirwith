import { describe, expect, it } from "vitest";
import { renderReceiptComment } from "../../src/output/receipt-comment.js";
import { decodeReceiptMarker, keyIdFor } from "../../src/evidence/receipt.js";
import type { ReceiptRecord } from "../../src/evidence/receipt.js";

const MAC = "a".repeat(64);
const KEY_ID = keyIdFor("kh_test_synthetic_secret");
const KEY = `skirwith:${"a".repeat(64)}`;

const RECEIPT: ReceiptRecord = {
  version: 1,
  product: "skirwith",
  paymentKey: KEY,
  requestHash: "d".repeat(64),
  status: "confirmed",
  executionId: "ex_1",
  transactionHash: `0x${"a".repeat(64)}`,
  transactionLink: "https://explorer/tx/0x123",
  repository: "acme/skirwith-demo",
  pullRequestNumber: 42,
  mergeSha: "0123456789abcdef0123456789abcdef01234567",
  createdAt: "2026-08-03T00:00:00.000Z",
  updatedAt: "2026-08-03T00:00:00.000Z",
};

describe("renderReceiptComment", () => {
  it("renders readable receipt text plus a decodable signed marker", () => {
    const body = renderReceiptComment(RECEIPT, MAC, KEY_ID);
    expect(body).toContain("## Skirwith receipt");
    expect(body).toContain("Status: Confirmed (`confirmed`)");
    expect(body).toContain("Next step: No action needed");
    expect(body).toContain(`Payment key: \`${KEY}\``);
    expect(body).toContain("Execution ID: `ex_1`");
    expect(body).toContain(`[0x${"a".repeat(64)}](https://explorer/tx/0x123)`);

    const marker = decodeReceiptMarker(body);
    expect(marker?.mac).toBe(MAC);
    expect(marker?.transactionHash).toBe(`0x${"a".repeat(64)}`);
  });

  it("renders a pending receipt without transaction fields", () => {
    const { transactionHash, transactionLink, ...pendingBase } = RECEIPT;
    void transactionHash;
    void transactionLink;
    const body = renderReceiptComment({ ...pendingBase, status: "pending" }, MAC, KEY_ID);
    expect(body).toContain("Status: Waiting for confirmation (`pending`)");
    expect(body).toContain("Next step: Do not re-run yet");
    expect(body).not.toContain("Transaction:");
  });
});
