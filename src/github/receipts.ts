import {
  decodeReceiptMarker,
  signReceiptMarker,
  verifyReceiptMarker,
} from "../evidence/receipt.js";
import type { ReceiptRecord } from "../evidence/receipt.js";
import { renderReceiptComment } from "../output/receipt-comment.js";
import type { GitHubApi } from "./api.js";
import type { ReceiptStore } from "./receipt-store.js";

export class CommentReceiptStore implements ReceiptStore {
  private readonly api: GitHubApi;
  private readonly owner: string;
  private readonly name: string;
  private readonly pullRequestNumber: number;
  private readonly receiptSecret: string;

  constructor(
    api: GitHubApi,
    owner: string,
    name: string,
    pullRequestNumber: number,
    receiptSecret: string,
  ) {
    this.api = api;
    this.owner = owner;
    this.name = name;
    this.pullRequestNumber = pullRequestNumber;
    this.receiptSecret = receiptSecret;
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
      // Only a marker signed with the receipt secret may be treated as
      // authoritative execution state. Forged comments fail closed.
      if (!verifyReceiptMarker(marker, this.receiptSecret)) {
        continue;
      }
      const { mac: _mac, ...record } = marker;
      void _mac;
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
    const existing = comments.find((comment) => {
      const marker = decodeReceiptMarker(comment.body);
      return marker?.paymentKey === record.paymentKey;
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
      this.receiptSecret,
    );
    const body = renderReceiptComment(record, mac);
    if (existing !== undefined) {
      await this.api.updateIssueComment(this.owner, this.name, existing.id, body);
    } else {
      await this.api.createIssueComment(this.owner, this.name, this.pullRequestNumber, body);
    }
  }
}
