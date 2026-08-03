import { decodeReceiptMarker } from "../evidence/receipt.js";
import type { ReceiptRecord } from "../evidence/receipt.js";
import { renderReceiptComment } from "../output/receipt-comment.js";
import type { GitHubApi } from "./api.js";
import type { ReceiptStore } from "./receipt-store.js";

export class CommentReceiptStore implements ReceiptStore {
  private readonly api: GitHubApi;
  private readonly owner: string;
  private readonly name: string;
  private readonly pullRequestNumber: number;

  constructor(api: GitHubApi, owner: string, name: string, pullRequestNumber: number) {
    this.api = api;
    this.owner = owner;
    this.name = name;
    this.pullRequestNumber = pullRequestNumber;
  }

  async findByPaymentKey(paymentKey: string): Promise<ReceiptRecord | undefined> {
    const comments = await this.api.listIssueComments(
      this.owner,
      this.name,
      this.pullRequestNumber,
    );
    for (const comment of comments) {
      const marker = decodeReceiptMarker(comment.body);
      if (marker !== undefined && marker.paymentKey === paymentKey) {
        return {
          ...marker,
          createdAt: comment.createdAt,
          updatedAt: comment.createdAt,
        };
      }
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
    const body = renderReceiptComment(record);
    if (existing !== undefined) {
      await this.api.updateIssueComment(this.owner, this.name, existing.id, body);
    } else {
      await this.api.createIssueComment(this.owner, this.name, this.pullRequestNumber, body);
    }
  }
}
