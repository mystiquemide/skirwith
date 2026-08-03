import { describe, expect, it } from "vitest";
import { CommentReceiptStore } from "../../src/github/receipts.js";
import { decodeReceiptMarker, encodeReceiptMarker } from "../../src/evidence/receipt.js";
import type { ReceiptRecord } from "../../src/evidence/receipt.js";
import type { ExecutionStatus } from "../../src/domain/types.js";
import { FakeGitHubApi } from "../fakes/fakes.js";

const RECEIPT: ReceiptRecord = {
  version: 1,
  product: "mergepay",
  paymentKey: "mergepay:abc",
  requestHash: "def",
  status: "confirmed",
  executionId: "ex_1",
  repository: "acme/mergepay-demo",
  pullRequestNumber: 42,
  mergeSha: "0123456789abcdef0123456789abcdef01234567",
  createdAt: "2026-08-03T00:00:00.000Z",
  updatedAt: "2026-08-03T00:00:00.000Z",
};

function markerBody(paymentKey: string, status: ExecutionStatus = "confirmed"): string {
  return encodeReceiptMarker({
    version: 1,
    product: "mergepay",
    paymentKey,
    requestHash: "def",
    status,
    repository: "acme/mergepay-demo",
    pullRequestNumber: 42,
    mergeSha: "0123456789abcdef0123456789abcdef01234567",
  });
}

describe("CommentReceiptStore", () => {
  it("finds a receipt by payment key from comments", async () => {
    const api = new FakeGitHubApi();
    api.comments = [
      { id: 1, body: markerBody("mergepay:abc"), createdAt: "2026-08-03T00:00:00.000Z" },
    ];
    const store = new CommentReceiptStore(api, "acme", "mergepay-demo", 42);

    const found = await store.findByPaymentKey("mergepay:abc");
    expect(found?.paymentKey).toBe("mergepay:abc");
    expect(found?.status).toBe("confirmed");
    expect(found?.createdAt).toBe("2026-08-03T00:00:00.000Z");
  });

  it("returns undefined when no comment carries the payment key", async () => {
    const api = new FakeGitHubApi();
    api.comments = [
      { id: 1, body: markerBody("mergepay:other"), createdAt: "2026-08-03T00:00:00.000Z" },
    ];
    const store = new CommentReceiptStore(api, "acme", "mergepay-demo", 42);

    await expect(store.findByPaymentKey("mergepay:missing")).resolves.toBeUndefined();
  });

  it("ignores comments without a valid marker", async () => {
    const api = new FakeGitHubApi();
    api.comments = [
      { id: 1, body: "plain text, no marker", createdAt: "2026-08-03T00:00:00.000Z" },
    ];
    const store = new CommentReceiptStore(api, "acme", "mergepay-demo", 42);

    await expect(store.findByPaymentKey("mergepay:abc")).resolves.toBeUndefined();
  });

  it("creates a comment when no receipt exists yet", async () => {
    const api = new FakeGitHubApi();
    const store = new CommentReceiptStore(api, "acme", "mergepay-demo", 42);

    await store.save(RECEIPT);

    expect(api.comments).toHaveLength(1);
    const marker = decodeReceiptMarker(api.comments[0]?.body ?? "");
    expect(marker?.paymentKey).toBe("mergepay:abc");
    expect(marker?.status).toBe("confirmed");
  });

  it("updates the matching receipt comment instead of creating a second", async () => {
    const api = new FakeGitHubApi();
    api.comments = [
      { id: 7, body: markerBody("mergepay:abc", "pending"), createdAt: "2026-08-03T00:00:00.000Z" },
    ];
    const store = new CommentReceiptStore(api, "acme", "mergepay-demo", 42);

    await store.save(RECEIPT);

    expect(api.comments).toHaveLength(1);
    expect(api.comments[0]?.id).toBe(7);
    expect(decodeReceiptMarker(api.comments[0]?.body ?? "")?.status).toBe("confirmed");
  });
});
