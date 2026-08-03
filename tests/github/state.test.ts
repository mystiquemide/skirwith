import { describe, expect, it } from "vitest";
import { GithubStateFetcher } from "../../src/github/state.js";
import { MergePayError } from "../../src/domain/errors.js";
import { FakeGitHubApi } from "../fakes/fakes.js";
import type { NormalizedPullRequestEvent } from "../../src/github/event.js";

const MERGE_SHA = "0123456789abcdef0123456789abcdef01234567";

const CONFIG_YAML = `
version: 1
repository: acme/mergepay-demo
chain:
  id: 11155111
  explorer: https://sepolia.etherscan.io
  token:
    address: "0x1c7d4b196cb0c7b01d743fbc6116a902379c7238"
    symbol: USDC
    decimals: 6
payout:
  requiredLabel: mergepay-approved
  maximum: "25"
  amounts:
    mergepay-5: "5"
recipients:
  alice: "0x05619d1a133623b322a8f366ea9594e4e586f26d"
checks:
  required: true
  names:
    - CI / test
`;

function makeEvent(
  overrides: Partial<NormalizedPullRequestEvent> = {},
): NormalizedPullRequestEvent {
  return {
    repository: { owner: "acme", name: "mergepay-demo", fullName: "acme/mergepay-demo" },
    pullRequestNumber: 42,
    baseBranch: "main",
    mergeSha: MERGE_SHA,
    authorLogin: "alice",
    labels: ["mergepay-approved", "mergepay-5"],
    merged: true,
    ...overrides,
  };
}

describe("GithubStateFetcher", () => {
  it("assembles the settlement input from fresh GitHub state", async () => {
    const api = new FakeGitHubApi();
    api.configFile = CONFIG_YAML;
    api.checkRuns = [{ name: "CI / test", passed: true }];
    const fetcher = new GithubStateFetcher(api, "acme", "mergepay-demo");

    const input = await fetcher.fetchFreshSettlementInput(makeEvent());

    expect(input.expectedBaseBranch).toBe("main");
    expect(input.event.authorLogin).toBe("alice");
    expect(input.event.mergeSha).toBe(MERGE_SHA);
    expect(input.event.merged).toBe(true);
    expect(input.config.repository).toBe("acme/mergepay-demo");
    expect(input.chainToken).toEqual({
      chainId: 11155111,
      tokenAddress: "0x1c7d4b196cb0c7b01d743fbc6116a902379c7238",
      symbol: "USDC",
      decimals: 6,
    });
    expect(input.passedChecks).toEqual(["CI / test"]);
  });

  it("uses fresh pull request state over event fields", async () => {
    const api = new FakeGitHubApi();
    api.configFile = CONFIG_YAML;
    api.pullRequest = {
      number: 42,
      baseBranch: "main",
      mergeSha: MERGE_SHA,
      authorLogin: "fresh-user",
      labels: ["mergepay-approved", "mergepay-5"],
      merged: true,
    };
    const fetcher = new GithubStateFetcher(api, "acme", "mergepay-demo");

    const input = await fetcher.fetchFreshSettlementInput(makeEvent({ authorLogin: "stale-user" }));
    expect(input.event.authorLogin).toBe("fresh-user");
  });

  it("rejects a config whose repository does not match the event", async () => {
    const api = new FakeGitHubApi();
    api.configFile = CONFIG_YAML.replace("acme/mergepay-demo", "other/org");
    const fetcher = new GithubStateFetcher(api, "acme", "mergepay-demo");

    await expect(fetcher.fetchFreshSettlementInput(makeEvent())).rejects.toMatchObject({
      code: "CONFIG_SEMANTIC_INVALID",
    });
  });

  it("marks configured checks that are missing or failed as not passed", async () => {
    const api = new FakeGitHubApi();
    api.configFile = CONFIG_YAML;
    api.checkRuns = [
      { name: "CI / test", passed: false },
      { name: "Lint", passed: true },
    ];
    const fetcher = new GithubStateFetcher(api, "acme", "mergepay-demo");

    const input = await fetcher.fetchFreshSettlementInput(makeEvent());
    expect(input.passedChecks).toEqual(["Lint"]);
  });

  it("propagates a GitHub fetch failure as a safe error", async () => {
    const api = new FakeGitHubApi();
    api.fetchError = new MergePayError({
      code: "GITHUB_FETCH_FAILED",
      category: "github",
      message: "GitHub request failed.",
    });
    const fetcher = new GithubStateFetcher(api, "acme", "mergepay-demo");

    await expect(fetcher.fetchFreshSettlementInput(makeEvent())).rejects.toMatchObject({
      code: "GITHUB_FETCH_FAILED",
    });
  });
});
