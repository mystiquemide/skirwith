import { describe, expect, it } from "vitest";
import { normalizePullRequestClosedEvent } from "../../src/github/event.js";
import { MergePayError } from "../../src/domain/errors.js";

const MERGE_SHA = "0123456789abcdef0123456789abcdef01234567";

function validEvent(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    action: "closed",
    number: 1,
    pull_request: {
      number: 42,
      merged: true,
      merge_commit_sha: MERGE_SHA,
      base: { ref: "main" },
      user: { login: "alice" },
      labels: [{ name: "mergepay-approved" }, { name: "mergepay-5" }],
    },
    repository: {
      owner: { login: "acme" },
      name: "mergepay-demo",
    },
    ...overrides,
  };
}

describe("normalizePullRequestClosedEvent", () => {
  it("normalizes a valid closed merged event", () => {
    const event = normalizePullRequestClosedEvent(validEvent());
    expect(event.repository).toEqual({
      owner: "acme",
      name: "mergepay-demo",
      fullName: "acme/mergepay-demo",
    });
    expect(event.pullRequestNumber).toBe(42);
    expect(event.baseBranch).toBe("main");
    expect(event.mergeSha).toBe(MERGE_SHA);
    expect(event.authorLogin).toBe("alice");
    expect(event.labels).toEqual(["mergepay-approved", "mergepay-5"]);
    expect(event.merged).toBe(true);
  });

  it("rejects a non-closed action", () => {
    expect(() => normalizePullRequestClosedEvent(validEvent({ action: "opened" }))).toThrow(
      MergePayError,
    );
  });

  it("rejects a payload without a pull_request", () => {
    const payload = validEvent();
    delete payload.pull_request;
    expect(() => normalizePullRequestClosedEvent(payload)).toThrow(MergePayError);
  });

  it("accepts a closed unmerged event with an empty merge sha", () => {
    const payload = validEvent({
      pull_request: {
        ...(validEvent().pull_request as Record<string, unknown>),
        merged: false,
        merge_commit_sha: "",
      },
    });
    const event = normalizePullRequestClosedEvent(payload);
    expect(event.merged).toBe(false);
    expect(event.mergeSha).toBe("");
  });

  it("rejects a merged event with an invalid merge sha", () => {
    const payload = validEvent({
      pull_request: {
        ...(validEvent().pull_request as Record<string, unknown>),
        merge_commit_sha: "not-a-sha",
      },
    });
    expect(() => normalizePullRequestClosedEvent(payload)).toThrow(MergePayError);
  });

  it("rejects an invalid pull request number", () => {
    const payload = validEvent({
      pull_request: {
        ...(validEvent().pull_request as Record<string, unknown>),
        number: 0,
      },
    });
    expect(() => normalizePullRequestClosedEvent(payload)).toThrow(MergePayError);
  });

  it("rejects a payload without labels", () => {
    const payload = validEvent({
      pull_request: {
        ...(validEvent().pull_request as Record<string, unknown>),
        labels: "not-a-list",
      },
    });
    expect(() => normalizePullRequestClosedEvent(payload)).toThrow(MergePayError);
  });

  it("fails with a stable safe error code", () => {
    try {
      normalizePullRequestClosedEvent(validEvent({ action: "opened" }));
      throw new Error("expected normalizePullRequestClosedEvent to throw");
    } catch (error) {
      const publicError = (error as MergePayError).toPublic();
      expect(publicError.code).toBe("GITHUB_INVALID_EVENT");
    }
  });
});
