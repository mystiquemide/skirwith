import { describe, expect, it } from "vitest";
import { CommentReceiptStore } from "../../src/github/receipts.js";
import {
  decodeReceiptMarker,
  signReceiptMarker,
  verifyReceiptMarker,
} from "../../src/evidence/receipt.js";
import type { ReceiptMarkerPayload, ReceiptRecord } from "../../src/evidence/receipt.js";
import type { ExecutionStatus } from "../../src/domain/types.js";
import { FakeGitHubApi } from "../fakes/fakes.js";

const SECRET = "kh_test_synthetic_secret";
const MERGE_SHA = "0123456789abcdef0123456789abcdef01234567";
const KEY = `mergepay:${"a".repeat(64)}`;
const OTHER_KEY = `mergepay:${"b".repeat(64)}`;

const RECEIPT: ReceiptRecord = {
  version: 1,
  product: "mergepay",
  paymentKey: KEY,
  requestHash: "d".repeat(64),
  status: "confirmed",
  executionId: "ex_1",
  repository: "acme/mergepay-demo",
  pullRequestNumber: 42,
  mergeSha: MERGE_SHA,
  createdAt: "2026-08-03T00:00:00.000Z",
  updatedAt: "2026-08-03T00:00:00.000Z",
};

function signedMarkerBody(paymentKey: string, status: ExecutionStatus = "confirmed"): string {
  const payload: ReceiptMarkerPayload = {
    version: 1,
    product: "mergepay",
    paymentKey,
    requestHash: "d".repeat(64),
    status,
    repository: "acme/mergepay-demo",
    pullRequestNumber: 42,
    mergeSha: MERGE_SHA,
  };
  const mac = signReceiptMarker(payload, SECRET);
  return `<!-- mergepay:${JSON.stringify({ ...payload, mac })} -->`;
}

describe("CommentReceiptStore", () => {
  it("finds a legitimately signed receipt by payment key", async () => {
    const api = new FakeGitHubApi();
    api.comments = [{ id: 1, body: signedMarkerBody(KEY), createdAt: "2026-08-03T00:00:00.000Z" }];
    const store = new CommentReceiptStore(api, "acme", "mergepay-demo", 42, SECRET);

    const found = await store.findByPaymentKey(KEY);
    expect(found?.paymentKey).toBe(KEY);
    expect(found?.status).toBe("confirmed");
    expect(found?.createdAt).toBe("2026-08-03T00:00:00.000Z");
  });

  it("ignores a forged marker with an invalid mac (fails closed)", async () => {
    const api = new FakeGitHubApi();
    api.comments = [
      {
        id: 1,
        body: signedMarkerBody(KEY).replace(/mac":".{64}"/, 'mac":"' + "0".repeat(64) + '"'),
        createdAt: "2026-08-03T00:00:00.000Z",
      },
    ];
    const store = new CommentReceiptStore(api, "acme", "mergepay-demo", 42, SECRET);

    await expect(store.findByPaymentKey(KEY)).resolves.toBeUndefined();
  });

  it("ignores a marker signed with a different secret", async () => {
    const payload: ReceiptMarkerPayload = {
      version: 1,
      product: "mergepay",
      paymentKey: KEY,
      requestHash: "d".repeat(64),
      status: "confirmed",
      repository: "acme/mergepay-demo",
      pullRequestNumber: 42,
      mergeSha: MERGE_SHA,
    };
    const mac = signReceiptMarker(payload, "attacker-secret");
    const api = new FakeGitHubApi();
    api.comments = [
      {
        id: 1,
        body: `<!-- mergepay:${JSON.stringify({ ...payload, mac })} -->`,
        createdAt: "2026-08-03T00:00:00.000Z",
      },
    ];
    const store = new CommentReceiptStore(api, "acme", "mergepay-demo", 42, SECRET);

    await expect(store.findByPaymentKey(KEY)).resolves.toBeUndefined();
  });

  it("returns undefined when no comment carries the payment key", async () => {
    const api = new FakeGitHubApi();
    api.comments = [
      { id: 1, body: signedMarkerBody(OTHER_KEY), createdAt: "2026-08-03T00:00:00.000Z" },
    ];
    const store = new CommentReceiptStore(api, "acme", "mergepay-demo", 42, SECRET);
    const missingKey = `mergepay:${"c".repeat(64)}`;

    await expect(store.findByPaymentKey(missingKey)).resolves.toBeUndefined();
  });

  it("creates a comment whose marker verifies with the receipt secret", async () => {
    const api = new FakeGitHubApi();
    const store = new CommentReceiptStore(api, "acme", "mergepay-demo", 42, SECRET);

    await store.save(RECEIPT);

    expect(api.comments).toHaveLength(1);
    const marker = decodeReceiptMarker(api.comments[0]?.body ?? "");
    expect(marker?.paymentKey).toBe(KEY);
    expect(marker?.status).toBe("confirmed");
    expect(verifyReceiptMarker(marker as never, SECRET)).toBe(true);
  });

  it("updates the matching receipt comment instead of creating a second", async () => {
    const api = new FakeGitHubApi();
    api.comments = [
      { id: 7, body: signedMarkerBody(KEY, "pending"), createdAt: "2026-08-03T00:00:00.000Z" },
    ];
    const store = new CommentReceiptStore(api, "acme", "mergepay-demo", 42, SECRET);

    await store.save(RECEIPT);

    expect(api.comments).toHaveLength(1);
    expect(api.comments[0]?.id).toBe(7);
    expect(decodeReceiptMarker(api.comments[0]?.body ?? "")?.status).toBe("confirmed");
  });
});
