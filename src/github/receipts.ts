import {
  decodeReceiptMarker,
  keyIdFor,
  signReceiptMarker,
  verifyReceiptMarker,
} from "../evidence/receipt.js";
import type { ReceiptRecord, ReceiptSigningKey } from "../evidence/receipt.js";
import { SkirwithError } from "../domain/errors.js";
import { renderReceiptComment } from "../output/receipt-comment.js";
import type { GitHubApi } from "./api.js";
import type { ReceiptStore } from "./receipt-store.js";

const DEFAULT_MAX_COMMENT_PAGES = 10;

export class CommentReceiptStore implements ReceiptStore {
  private readonly api: GitHubApi;
  private readonly owner: string;
  private readonly name: string;
  private readonly pullRequestNumber: number;
  private readonly activeKey: ReceiptSigningKey;
  private readonly verificationKeys: readonly ReceiptSigningKey[];
  private readonly maxCommentPages: number;

  constructor(
    api: GitHubApi,
    owner: string,
    name: string,
    pullRequestNumber: number,
    activeSecret: string,
    previousSecret?: string,
    maxCommentPages: number = DEFAULT_MAX_COMMENT_PAGES,
  ) {
    this.api = api;
    this.owner = owner;
    this.name = name;
    this.pullRequestNumber = pullRequestNumber;
    this.activeKey = { id: keyIdFor(activeSecret), secret: activeSecret };
    this.verificationKeys = previousSecret
      ? [this.activeKey, { id: keyIdFor(previousSecret), secret: previousSecret }]
      : [this.activeKey];
    this.maxCommentPages = maxCommentPages;
  }

  private paginationError(): SkirwithError {
    return new SkirwithError({
      code: "GITHUB_FETCH_FAILED",
      category: "github",
      message: `Comment pagination exceeded ${this.maxCommentPages} pages; receipt discovery failed closed.`,
    });
  }

  private async *iterateComments(): AsyncGenerator<{
    id: number;
    body: string;
    createdAt: string;
  }> {
    let page = 1;
    for (;;) {
      const pageResult = await this.api.listIssueCommentsPage(
        this.owner,
        this.name,
        this.pullRequestNumber,
        page,
      );
      for (const comment of pageResult.comments) {
        yield comment;
      }
      if (!pageResult.hasMore || pageResult.nextPage === undefined) {
        return;
      }
      if (page >= this.maxCommentPages) {
        throw this.paginationError();
      }
      page = pageResult.nextPage;
    }
  }

  async findByPaymentKey(paymentKey: string): Promise<ReceiptRecord | undefined> {
    for await (const comment of this.iterateComments()) {
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
    // Update only a comment we can authenticate as our own receipt. A forged
    // or unverified squatter must never become the update target; create a
    // fresh action-owned receipt comment instead.
    let existing: { id: number } | undefined;
    for await (const comment of this.iterateComments()) {
      const marker = decodeReceiptMarker(comment.body);
      if (
        marker !== undefined &&
        marker.paymentKey === record.paymentKey &&
        verifyReceiptMarker(marker, this.verificationKeys)
      ) {
        existing = { id: comment.id };
        break;
      }
    }
    const mac = signReceiptMarker(
      {
        version: 1,
        product: "skirwith",
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
