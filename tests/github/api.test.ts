import { describe, expect, it } from "vitest";
import { GithubRestApi } from "../../src/github/api.js";
import { MergePayError } from "../../src/domain/errors.js";
import { FakeHttpTransport } from "../fakes/fakes.js";
import type { HttpResponse } from "../../src/transport/http.js";

const MERGE_SHA = "0123456789abcdef0123456789abcdef01234567";
const BASE = "https://api.github.com";

function json(status: number, body: unknown): HttpResponse {
  return { status, headers: {}, body: JSON.stringify(body) };
}

function makeApi(responder: (url: string) => HttpResponse): {
  api: GithubRestApi;
  transport: FakeHttpTransport;
} {
  const transport = new FakeHttpTransport();
  transport.responder = (request) => responder(request.url);
  const api = new GithubRestApi({ token: "ghp_test", transport, baseUrl: BASE });
  return { api, transport };
}

describe("GithubRestApi", () => {
  it("fetches the default branch", async () => {
    const { api } = makeApi((url) =>
      url.endsWith("/repos/acme/mergepay-demo")
        ? json(200, { default_branch: "main" })
        : json(500, {}),
    );
    await expect(api.fetchDefaultBranch("acme", "mergepay-demo")).resolves.toBe("main");
  });

  it("fetches and normalizes pull request state", async () => {
    const { api } = makeApi((url) =>
      url.includes("/pulls/42")
        ? json(200, {
            number: 42,
            merged: true,
            merge_commit_sha: MERGE_SHA.toUpperCase(),
            base: { ref: "main" },
            user: { login: "alice" },
            labels: [{ name: "mergepay-approved" }, { name: "mergepay-5" }],
          })
        : json(500, {}),
    );
    const pr = await api.fetchPullRequest("acme", "mergepay-demo", 42);
    expect(pr.number).toBe(42);
    expect(pr.merged).toBe(true);
    expect(pr.mergeSha).toBe(MERGE_SHA);
    expect(pr.baseBranch).toBe("main");
    expect(pr.authorLogin).toBe("alice");
    expect(pr.labels).toEqual(["mergepay-approved", "mergepay-5"]);
  });

  it("fetches and base64-decodes the trusted config file", async () => {
    const configYaml = "version: 1\nrepository: acme/mergepay-demo\n";
    const encoded = Buffer.from(configYaml, "utf8").toString("base64");
    const { api } = makeApi((url) =>
      url.includes("/contents/.github%2Fmergepay.yml")
        ? json(200, { content: encoded, encoding: "base64" })
        : json(500, {}),
    );
    await expect(api.fetchConfigFile("acme", "mergepay-demo", "main")).resolves.toBe(configYaml);
  });

  it("maps check runs to passed states", async () => {
    const { api } = makeApi((url) =>
      url.includes("/check-runs")
        ? json(200, {
            check_runs: [
              { name: "CI / test", status: "completed", conclusion: "success" },
              { name: "Lint", status: "completed", conclusion: "failure" },
              { name: "Pending", status: "in_progress", conclusion: null },
            ],
          })
        : json(500, {}),
    );
    const checks = await api.fetchCheckStates("acme", "mergepay-demo", MERGE_SHA);
    expect(checks).toEqual([
      { name: "CI / test", passed: true },
      { name: "Lint", passed: false },
      { name: "Pending", passed: false },
    ]);
  });

  it("lists a page of issue comments and follows the next-page link", async () => {
    const { api } = makeApi((url) =>
      url.includes("/issues/42/comments")
        ? {
            ...json(200, [{ id: 10, body: "hello", created_at: "2026-08-03T00:00:00.000Z" }]),
            headers: {
              link: '<https://api.github.com/repos/acme/mergepay-demo/issues/42/comments?per_page=100&page=2>; rel="next"',
            },
          }
        : json(500, {}),
    );
    const page = await api.listIssueCommentsPage("acme", "mergepay-demo", 42, 1);
    expect(page.comments).toEqual([
      { id: 10, body: "hello", createdAt: "2026-08-03T00:00:00.000Z" },
    ]);
    expect(page.hasMore).toBe(true);
    expect(page.nextPage).toBe(2);
  });

  it("marks the last page with no next link as terminal", async () => {
    const { api } = makeApi((url) =>
      url.includes("/issues/42/comments")
        ? json(200, [{ id: 10, body: "hi", created_at: "2026-08-03T00:00:00.000Z" }])
        : json(500, {}),
    );
    const page = await api.listIssueCommentsPage("acme", "mergepay-demo", 42, 2);
    expect(page.hasMore).toBe(false);
    expect(page.nextPage).toBeUndefined();
  });

  it("creates and updates issue comments with the expected methods", async () => {
    const seen: Array<{ method: string; url: string; body: string }> = [];
    const transport = new FakeHttpTransport();
    transport.responder = (request) => {
      seen.push({ method: request.method, url: request.url, body: request.body ?? "" });
      return json(201, { id: 10 });
    };
    const api = new GithubRestApi({ token: "ghp_test", transport, baseUrl: BASE });
    await api.createIssueComment("acme", "mergepay-demo", 42, "body-one");
    await api.updateIssueComment("acme", "mergepay-demo", 10, "body-two");
    expect(seen[0]).toMatchObject({
      method: "POST",
      url: `${BASE}/repos/acme/mergepay-demo/issues/42/comments`,
      body: JSON.stringify({ body: "body-one" }),
    });
    expect(seen[1]).toMatchObject({
      method: "PATCH",
      url: `${BASE}/repos/acme/mergepay-demo/issues/comments/10`,
    });
  });

  it("maps a non-2xx response to a safe GitHub error", async () => {
    const { api } = makeApi(() => json(404, { message: "Not Found" }));
    await expect(api.fetchDefaultBranch("acme", "mergepay-demo")).rejects.toMatchObject({
      code: "GITHUB_FETCH_FAILED",
      category: "github",
    });
  });

  it("maps malformed JSON to a safe GitHub error", async () => {
    const { api, transport } = makeApi(() => json(200, {}));
    transport.responder = () => ({ status: 200, headers: {}, body: "not-json" });
    await expect(api.fetchDefaultBranch("acme", "mergepay-demo")).rejects.toBeInstanceOf(
      MergePayError,
    );
  });
});
