import type { RepositoryIdentity } from "../domain/types.js";
import { SkirwithError } from "../domain/errors.js";

export interface NormalizedPullRequestEvent {
  repository: RepositoryIdentity;
  pullRequestNumber: number;
  baseBranch: string;
  mergeSha: string;
  authorLogin: string;
  labels: readonly string[];
  merged: boolean;
}

const MERGE_SHA_RE = /^[0-9a-f]{40}$/;

function invalid(message: string): SkirwithError {
  return new SkirwithError({
    code: "GITHUB_INVALID_EVENT",
    category: "github",
    message,
  });
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return undefined;
  }
  return value as Record<string, unknown>;
}

function normalizeLabels(raw: unknown): readonly string[] {
  if (!Array.isArray(raw)) {
    throw invalid("'pull_request.labels' must be a list.");
  }
  const labels: string[] = [];
  for (const entry of raw) {
    const record = asRecord(entry);
    const name = record?.name;
    if (typeof name !== "string" || name.length === 0) {
      throw invalid("A pull request label is missing its name.");
    }
    labels.push(name);
  }
  return labels;
}

export function normalizePullRequestClosedEvent(payload: unknown): NormalizedPullRequestEvent {
  const root = asRecord(payload);
  if (!root) {
    throw invalid("Event payload must be a JSON object.");
  }
  if (root.action !== "closed") {
    throw invalid("Event action must be 'closed'.");
  }
  const pullRequest = asRecord(root.pull_request);
  if (!pullRequest) {
    throw invalid("Event payload is missing 'pull_request'.");
  }
  const repository = asRecord(root.repository);
  if (!repository) {
    throw invalid("Event payload is missing 'repository'.");
  }

  const pullRequestNumber = pullRequest.number;
  if (
    typeof pullRequestNumber !== "number" ||
    !Number.isSafeInteger(pullRequestNumber) ||
    pullRequestNumber <= 0
  ) {
    throw invalid("'pull_request.number' is invalid.");
  }

  const merged = pullRequest.merged;
  if (typeof merged !== "boolean") {
    throw invalid("'pull_request.merged' is invalid.");
  }

  const mergeSha = pullRequest.merge_commit_sha;
  if (typeof mergeSha !== "string" || (merged && !MERGE_SHA_RE.test(mergeSha.toLowerCase()))) {
    throw invalid("'pull_request.merge_commit_sha' is invalid.");
  }

  const base = asRecord(pullRequest.base);
  const baseBranch = base?.ref;
  if (typeof baseBranch !== "string" || baseBranch.length === 0) {
    throw invalid("'pull_request.base.ref' is invalid.");
  }

  const user = asRecord(pullRequest.user);
  const authorLogin = user?.login;
  if (typeof authorLogin !== "string" || authorLogin.length === 0) {
    throw invalid("'pull_request.user.login' is invalid.");
  }

  const labels = normalizeLabels(pullRequest.labels);

  const owner = asRecord(repository.owner);
  const ownerLogin = owner?.login;
  const repoName = repository.name;
  if (
    typeof ownerLogin !== "string" ||
    ownerLogin.length === 0 ||
    typeof repoName !== "string" ||
    repoName.length === 0
  ) {
    throw invalid("'repository' identity is invalid.");
  }

  return {
    repository: {
      owner: ownerLogin,
      name: repoName,
      fullName: `${ownerLogin}/${repoName}`,
    },
    pullRequestNumber,
    baseBranch,
    mergeSha: mergeSha.toLowerCase(),
    authorLogin,
    labels,
    merged,
  };
}
