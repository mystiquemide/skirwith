import {
  decodeReceiptMarker,
  keyIdFor,
  signReceiptMarker,
  verifyReceiptMarker,
} from "../evidence/receipt.js";
import type { ReceiptRecord, ReceiptSigningKey } from "../evidence/receipt.js";
import { renderReceiptComment } from "../output/receipt-comment.js";
import type { GitHubApi } from "./api.js";
import type { ReceiptStore } from "./receipt-store.js";

export class CommentReceiptStore implements ReceiptStore {
  private readonly api: GitHubApi;
  private readonly owner: string;
  private readonly name: string;
  private readonly pullRequestNumber: number;
  private readonly activeKey: ReceiptSigningKey;
  private readonly verificationKeys: readonly ReceiptSigningKey[];

  constructor(
    api: GitHubApi,
    owner: string,
    name: string,
    pullRequestNumber: number,
    activeSecret: string,
    previousSecret?: string,
  ) {
    this.api = api;
    this.owner = owner;
    this.name = name;
    this.pullRequestNumber = pullRequestNumber;
    this.activeKey = { id: keyIdFor(activeSecret), secret: activeSecret };
    this.verificationKeys = previousSecret
      ? [this.activeKey, { id: keyIdFor(previousSecret), secret: previousSecret }]
      : [this.activeKey];
  }

  async findByPaymentKey(paymentKey: string): Promise<ReceiptRecord | undefined> {
    const comments = await this.api.listIssueComments(
      this.owner,
      this.name,
      this.pullRequestNumber,
    );
    for (const comment of comments) {
      const marker = decodeReceiptMarker(comment.body);
      if (marker === undefined || marker.paymentKey !== paymentKey) {
        continue;
      }
      // Only a marker signed with a known receipt key may be treated as
      // authoritative execution state. Forged or retired-key comments fail
      // closed.
      if (!verifyReceiptMarker(marker, this.verificationKeys)) {
        continue;
      }
      const { mac: _mac, keyId: _keyId, ...record } = marker;
      void _mac;
      void _keyId;
      return {
        ...record,
        createdAt: comment.createdAt,
        updatedAt: comment.createdAt,
      };
    }
    return undefined;
  }

  async save(record: ReceiptRecord): Promise<void> {
    const comments = await this.api.listIssueComments(
      this.owner,
      this.name,
      this.pullRequestNumber,
    );
    // Update only a comment we can authenticate as our own receipt. A forged
    // or unverified squatter must never become the update target; create a
    // fresh action-owned receipt comment instead.
    const existing = comments.find((comment) => {
      const marker = decodeReceiptMarker(comment.body);
      return (
        marker !== undefined &&
        marker.paymentKey === record.paymentKey &&
        verifyReceiptMarker(marker, this.verificationKeys)
      );
    });
    const mac = signReceiptMarker(
      {
        version: 1,
        product: "mergepay",
        paymentKey: record.paymentKey,
        requestHash: record.requestHash,
        status: record.status,
        executionId: record.executionId,
        transactionHash: record.transactionHash,
        transactionLink: record.transactionLink,
        repository: record.repository,
        pullRequestNumber: record.pullRequestNumber,
        mergeSha: record.mergeSha,
      },
      this.activeKey,
    );
    const body = renderReceiptComment(record, mac, this.activeKey.id);
    if (existing !== undefined) {
      await this.api.updateIssueComment(this.owner, this.name, existing.id, body);
    } else {
      await this.api.createIssueComment(this.owner, this.name, this.pullRequestNumber, body);
    }
  }
}
