import type { MergePayConfig } from "../config/schema.js";
import { loadConfig } from "../config/load-config.js";
import type { NormalizedPullRequestEvent } from "./event.js";
import type { GitHubApi } from "./api.js";
import type { SettlementInput } from "../execution/orchestrator.js";

export class GithubStateFetcher {
  private readonly api: GitHubApi;
  private readonly owner: string;
  private readonly name: string;

  constructor(api: GitHubApi, owner: string, name: string) {
    this.api = api;
    this.owner = owner;
    this.name = name;
  }

  async fetchFreshSettlementInput(event: NormalizedPullRequestEvent): Promise<SettlementInput> {
    const defaultBranch = await this.api.fetchDefaultBranch(this.owner, this.name);

    const [pullRequest, configYaml] = await Promise.all([
      this.api.fetchPullRequest(this.owner, this.name, event.pullRequestNumber),
      this.api.fetchConfigFile(this.owner, this.name, defaultBranch),
    ]);

    const config: MergePayConfig = loadConfig(configYaml, {
      expectedRepository: event.repository.fullName,
    });

    const checkStates = await this.api.fetchCheckStates(
      this.owner,
      this.name,
      pullRequest.mergeSha,
    );
    const passedChecks = checkStates.filter((check) => check.passed).map((check) => check.name);

    return {
      event: {
        repository: event.repository,
        pullRequestNumber: pullRequest.number,
        baseBranch: pullRequest.baseBranch,
        mergeSha: pullRequest.mergeSha,
        authorLogin: pullRequest.authorLogin,
        labels: pullRequest.labels,
        merged: pullRequest.merged,
      },
      config,
      expectedBaseBranch: defaultBranch,
      passedChecks,
      chainToken: {
        chainId: config.chain.id,
        tokenAddress: config.chain.token.address,
        symbol: config.chain.token.symbol,
        decimals: config.chain.token.decimals,
      },
    };
  }
}
