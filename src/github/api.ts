import { MergePayError } from "../domain/errors.js";
import type { HttpTransport } from "../transport/http.js";

export interface PullRequestState {
  number: number;
  baseBranch: string;
  mergeSha: string;
  authorLogin: string;
  labels: readonly string[];
  merged: boolean;
}

export interface CheckState {
  name: string;
  passed: boolean;
}

export interface CommentState {
  id: number;
  body: string;
  createdAt: string;
}

export interface GitHubApi {
  fetchPullRequest(owner: string, name: string, number: number): Promise<PullRequestState>;
  fetchDefaultBranch(owner: string, name: string): Promise<string>;
  fetchConfigFile(owner: string, name: string, ref: string): Promise<string>;
  fetchCheckStates(owner: string, name: string, mergeSha: string): Promise<CheckState[]>;
  listIssueComments(owner: string, name: string, number: number): Promise<CommentState[]>;
  createIssueComment(owner: string, name: string, number: number, body: string): Promise<void>;
  updateIssueComment(owner: string, name: string, commentId: number, body: string): Promise<void>;
}

const DEFAULT_GITHUB_API_BASE = "https://api.github.com";
const DEFAULT_TIMEOUT_MS = 15_000;

export interface GithubRestApiOptions {
  token: string;
  transport: HttpTransport;
  baseUrl?: string;
  timeoutMs?: number;
}

function githubError(message: string, cause?: unknown): MergePayError {
  return new MergePayError({
    code: "GITHUB_FETCH_FAILED",
    category: "github",
    message,
    cause,
  });
}

function encodePath(value: string): string {
  return encodeURIComponent(value);
}

export class GithubRestApi implements GitHubApi {
  private readonly token: string;
  private readonly transport: HttpTransport;
  private readonly baseUrl: string;
  private readonly timeoutMs: number;

  constructor(options: GithubRestApiOptions) {
    this.token = options.token;
    this.transport = options.transport;
    this.baseUrl = (options.baseUrl ?? DEFAULT_GITHUB_API_BASE).replace(/\/+$/, "");
    this.timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  }

  async fetchDefaultBranch(owner: string, name: string): Promise<string> {
    const parsed = (await this.get(`/repos/${encodePath(owner)}/${encodePath(name)}`)) as Record<
      string,
      unknown
    >;
    if (typeof parsed.default_branch !== "string" || parsed.default_branch.length === 0) {
      throw githubError("GitHub repository response is missing 'default_branch'.");
    }
    return parsed.default_branch;
  }

  async fetchPullRequest(owner: string, name: string, number: number): Promise<PullRequestState> {
    const parsed = (await this.get(
      `/repos/${encodePath(owner)}/${encodePath(name)}/pulls/${number}`,
    )) as Record<string, unknown>;
    const base = parsed.base as Record<string, unknown> | undefined;
    const user = parsed.user as Record<string, unknown> | undefined;
    if (
      typeof parsed.number !== "number" ||
      typeof parsed.merged !== "boolean" ||
      typeof parsed.merge_commit_sha !== "string" ||
      typeof base?.ref !== "string" ||
      typeof user?.login !== "string"
    ) {
      throw githubError("GitHub pull request response is malformed.");
    }
    const labels = parseLabels(parsed.labels);
    return {
      number: parsed.number,
      baseBranch: base.ref,
      mergeSha: parsed.merge_commit_sha.toLowerCase(),
      authorLogin: user.login,
      labels,
      merged: parsed.merged,
    };
  }

  async fetchConfigFile(owner: string, name: string, ref: string): Promise<string> {
    const parsed = (await this.get(
      `/repos/${encodePath(owner)}/${encodePath(name)}/contents/.github%2Fmergepay.yml?ref=${encodePath(ref)}`,
    )) as Record<string, unknown>;
    if (typeof parsed.content !== "string") {
      throw githubError("GitHub config contents response is missing 'content'.");
    }
    return Buffer.from(parsed.content, "base64").toString("utf8");
  }

  async fetchCheckStates(owner: string, name: string, mergeSha: string): Promise<CheckState[]> {
    const parsed = (await this.get(
      `/repos/${encodePath(owner)}/${encodePath(name)}/commits/${encodePath(mergeSha)}/check-runs`,
    )) as Record<string, unknown>;
    const runs = parsed.check_runs;
    if (!Array.isArray(runs)) {
      throw githubError("GitHub check-runs response is missing 'check_runs'.");
    }
    return runs.map((run) => {
      const record = run as Record<string, unknown>;
      if (typeof record.name !== "string") {
        throw githubError("GitHub check-runs response contains a malformed run.");
      }
      return {
        name: record.name,
        passed: record.status === "completed" && record.conclusion === "success",
      };
    });
  }

  async listIssueComments(owner: string, name: string, number: number): Promise<CommentState[]> {
    const parsed = await this.get(
      `/repos/${encodePath(owner)}/${encodePath(name)}/issues/${number}/comments`,
    );
    if (!Array.isArray(parsed)) {
      throw githubError("GitHub comments response is not a list.");
    }
    return parsed.map((entry) => {
      const record = entry as Record<string, unknown>;
      if (
        typeof record.id !== "number" ||
        typeof record.body !== "string" ||
        typeof record.created_at !== "string"
      ) {
        throw githubError("GitHub comments response contains a malformed comment.");
      }
      return { id: record.id, body: record.body, createdAt: record.created_at };
    });
  }

  async createIssueComment(
    owner: string,
    name: string,
    number: number,
    body: string,
  ): Promise<void> {
    await this.send(
      "POST",
      `/repos/${encodePath(owner)}/${encodePath(name)}/issues/${number}/comments`,
      { body },
    );
  }

  async updateIssueComment(
    owner: string,
    name: string,
    commentId: number,
    body: string,
  ): Promise<void> {
    await this.send(
      "PATCH",
      `/repos/${encodePath(owner)}/${encodePath(name)}/issues/comments/${commentId}`,
      { body },
    );
  }

  private headers(): Record<string, string> {
    return {
      authorization: `token ${this.token}`,
      accept: "application/vnd.github+json",
      "x-github-api-version": "2022-11-28",
    };
  }

  private async get(path: string): Promise<unknown> {
    const response = await this.transport.request({
      method: "GET",
      url: `${this.baseUrl}${path}`,
      headers: this.headers(),
      timeoutMs: this.timeoutMs,
    });
    return this.decode(response);
  }

  private async send(method: "POST" | "PATCH", path: string, body: unknown): Promise<void> {
    const response = await this.transport.request({
      method,
      url: `${this.baseUrl}${path}`,
      headers: { ...this.headers(), "content-type": "application/json" },
      body: JSON.stringify(body),
      timeoutMs: this.timeoutMs,
    });
    this.ensureSuccess(response);
  }

  private decode(response: { status: number; body: string }): unknown {
    this.ensureSuccess(response);
    if (response.body.length === 0) {
      return undefined;
    }
    try {
      return JSON.parse(response.body);
    } catch (error) {
      throw githubError("GitHub returned a malformed JSON response.", error);
    }
  }

  private ensureSuccess(response: { status: number; body: string }): void {
    if (response.status < 200 || response.status >= 300) {
      throw githubError(`GitHub request failed with HTTP ${response.status}.`);
    }
  }
}

function parseLabels(raw: unknown): readonly string[] {
  if (!Array.isArray(raw)) {
    throw githubError("GitHub pull request response has malformed labels.");
  }
  return raw.map((entry) => {
    const record = entry as Record<string, unknown>;
    if (typeof record.name !== "string") {
      throw githubError("GitHub pull request response contains a malformed label.");
    }
    return record.name;
  });
}
