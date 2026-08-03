import type { KeeperHubProvider } from "../../src/keeperhub/provider.js";
import type {
  ExecutionStatusResponse,
  KeeperHubChain,
  TransferBroadcast,
  TransferParameters,
  TransferSimulation,
} from "../../src/keeperhub/types.js";
import type { ReceiptRecord } from "../../src/evidence/receipt.js";
import type { ReceiptStore } from "../../src/github/receipt-store.js";
import type {
  GitHubApi,
  CommentState,
  CheckState,
  PullRequestState,
} from "../../src/github/api.js";
import type { HttpRequest, HttpResponse, HttpTransport } from "../../src/transport/http.js";

export class FakeHttpTransport implements HttpTransport {
  calls: HttpRequest[] = [];
  responder?: (request: HttpRequest) => HttpResponse;

  async request(request: HttpRequest): Promise<HttpResponse> {
    this.calls.push(request);
    if (this.responder === undefined) {
      throw new Error("no fake http responder");
    }
    return this.responder(request);
  }
}

export class FakeGitHubApi implements GitHubApi {
  pullRequest: PullRequestState = {
    number: 42,
    baseBranch: "main",
    mergeSha: "0123456789abcdef0123456789abcdef01234567",
    authorLogin: "alice",
    labels: ["mergepay-approved", "mergepay-5"],
    merged: true,
  };
  defaultBranch = "main";
  configFile = "";
  checkRuns: CheckState[] = [];
  comments: CommentState[] = [];
  fetchError?: unknown;
  private nextCommentId = 100;

  async fetchPullRequest(): Promise<PullRequestState> {
    this.throwIfError();
    return this.pullRequest;
  }

  async fetchDefaultBranch(): Promise<string> {
    this.throwIfError();
    return this.defaultBranch;
  }

  async fetchConfigFile(): Promise<string> {
    this.throwIfError();
    return this.configFile;
  }

  async fetchCheckStates(): Promise<CheckState[]> {
    this.throwIfError();
    return this.checkRuns;
  }

  async listIssueComments(): Promise<CommentState[]> {
    this.throwIfError();
    return this.comments;
  }

  async createIssueComment(
    _owner: string,
    _name: string,
    _number: number,
    body: string,
  ): Promise<void> {
    this.throwIfError();
    this.comments.push({ id: this.nextCommentId++, body, createdAt: "2026-08-03T22:00:00.000Z" });
  }

  async updateIssueComment(
    _owner: string,
    _name: string,
    commentId: number,
    body: string,
  ): Promise<void> {
    this.throwIfError();
    const comment = this.comments.find((entry) => entry.id === commentId);
    if (comment) {
      comment.body = body;
    }
  }

  private throwIfError(): void {
    if (this.fetchError !== undefined) {
      throw this.fetchError;
    }
  }
}

export class FakeKeeperHubProvider implements KeeperHubProvider {
  simulateResult: TransferSimulation = { wouldRevert: false };
  simulateError?: unknown;
  broadcastResult: TransferBroadcast = { executionId: "ex_fake", status: "running" };
  broadcastError?: unknown;
  terminalResult: ExecutionStatusResponse = {
    executionId: "ex_fake",
    status: "completed",
    pollIntervalHint: 0,
  };
  terminalError?: unknown;
  lastBroadcastKey?: string;
  calls = {
    simulate: 0,
    broadcast: 0,
    getExecution: 0,
    waitForTerminal: 0,
    chains: 0,
  };

  async simulateTransfer(): Promise<TransferSimulation> {
    this.calls.simulate += 1;
    if (this.simulateError !== undefined) {
      throw this.simulateError;
    }
    return this.simulateResult;
  }

  async broadcastTransfer(
    parameters: TransferParameters,
    paymentKey: string,
  ): Promise<TransferBroadcast> {
    void parameters;
    this.calls.broadcast += 1;
    this.lastBroadcastKey = paymentKey;
    if (this.broadcastError !== undefined) {
      throw this.broadcastError;
    }
    return this.broadcastResult;
  }

  async getExecution(): Promise<ExecutionStatusResponse> {
    this.calls.getExecution += 1;
    return this.terminalResult;
  }

  async waitForTerminal(): Promise<ExecutionStatusResponse> {
    this.calls.waitForTerminal += 1;
    if (this.terminalError !== undefined) {
      throw this.terminalError;
    }
    return this.terminalResult;
  }

  async discoverChains(): Promise<KeeperHubChain[]> {
    this.calls.chains += 1;
    return [];
  }
}

export class FakeReceiptStore implements ReceiptStore {
  records = new Map<string, ReceiptRecord>();
  saves: ReceiptRecord[] = [];

  async findByPaymentKey(paymentKey: string): Promise<ReceiptRecord | undefined> {
    return this.records.get(paymentKey);
  }

  async save(record: ReceiptRecord): Promise<void> {
    this.records.set(record.paymentKey, record);
    this.saves.push(record);
  }
}
