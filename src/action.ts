import { readFileSync } from "node:fs";
import * as core from "@actions/core";
import { parseRuntimeSecrets } from "./action-inputs.js";
import { SkirwithError } from "./domain/errors.js";
import type { EvidenceRecord } from "./domain/types.js";
import { SettlementOrchestrator } from "./execution/orchestrator.js";
import type { SettlementInput } from "./execution/orchestrator.js";
import { GithubRestApi } from "./github/api.js";
import type { GitHubApi } from "./github/api.js";
import { normalizePullRequestClosedEvent } from "./github/event.js";
import { CommentReceiptStore } from "./github/receipts.js";
import { GithubStateFetcher } from "./github/state.js";
import { KeeperHubClient } from "./keeperhub/client.js";
import type { KeeperHubProvider } from "./keeperhub/provider.js";
import { buildActionOutputs } from "./output/outputs.js";
import { renderActionSummary } from "./output/summary.js";
import type { SettlementDisplay } from "./output/summary.js";
import { resolvePayoutAmount, resolveRecipient } from "./policy/evaluate-policy.js";
import { FetchHttpTransport } from "./transport/http.js";

export interface RunDependencies {
  githubToken: string;
  keeperhubApiKey: string;
  receiptSecret: string;
  previousReceiptSecret?: string;
  eventPayload: unknown;
  api: GitHubApi;
  provider: KeeperHubProvider;
  nowIso?: () => string;
}

export type RunResult =
  | { ok: true; evidence: EvidenceRecord; outputs: Record<string, string>; summary: string }
  | { ok: false; error: { code: string; message: string } };

function fail(error: unknown): RunResult {
  const safe =
    error instanceof SkirwithError
      ? error.toPublic()
      : { code: "INTERNAL_ERROR", message: "An unexpected error occurred." };
  return { ok: false, error: safe };
}

function displayFor(input: SettlementInput): SettlementDisplay {
  const recipient = resolveRecipient(input.config, input.event.authorLogin);
  const resolved = resolvePayoutAmount(input.config, input.event.labels);
  return {
    repository: input.event.repository.fullName,
    pullRequestNumber: input.event.pullRequestNumber,
    recipient: recipient ?? undefined,
    amount: resolved?.amount,
    chainId: input.chainToken.chainId,
    tokenSymbol: input.chainToken.symbol,
    tokenAddress: input.chainToken.tokenAddress,
  };
}

export async function run(deps: RunDependencies): Promise<RunResult> {
  if (deps.githubToken.length === 0 || deps.keeperhubApiKey.length === 0) {
    return fail(
      new SkirwithError({
        code: "CONFIG_SEMANTIC_INVALID",
        category: "configuration",
        message: "Missing required GitHub token or KeeperHub API key.",
      }),
    );
  }
  if (deps.receiptSecret.length === 0) {
    return fail(
      new SkirwithError({
        code: "CONFIG_SEMANTIC_INVALID",
        category: "configuration",
        message: "Missing required receipt signing secret.",
      }),
    );
  }

  let event;
  try {
    event = normalizePullRequestClosedEvent(deps.eventPayload);
  } catch (error) {
    return fail(error);
  }

  const nowIso = deps.nowIso ?? (() => new Date().toISOString());
  try {
    const fetcher = new GithubStateFetcher(deps.api, event.repository.owner, event.repository.name);
    const input = await fetcher.fetchFreshSettlementInput(event);
    const receipts = new CommentReceiptStore(
      deps.api,
      event.repository.owner,
      event.repository.name,
      event.pullRequestNumber,
      deps.receiptSecret,
      deps.previousReceiptSecret,
    );
    const orchestrator = new SettlementOrchestrator({ provider: deps.provider, receipts, nowIso });
    const evidence = await orchestrator.settle(input);
    return {
      ok: true,
      evidence,
      outputs: buildActionOutputs(evidence),
      summary: renderActionSummary(evidence, displayFor(input)),
    };
  } catch (error) {
    return fail(error);
  }
}

async function main(): Promise<void> {
  const secrets = parseRuntimeSecrets(process.env as Record<string, string | undefined>);
  const eventPath = process.env.GITHUB_EVENT_PATH;
  if (eventPath === undefined || eventPath.length === 0) {
    console.error("GITHUB_EVENT_PATH is not set.");
    process.exitCode = 1;
    return;
  }
  let payload: unknown;
  try {
    payload = JSON.parse(readFileSync(eventPath, "utf8"));
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
    return;
  }

  const transport = new FetchHttpTransport();
  const result = await run({
    githubToken: secrets.githubToken,
    keeperhubApiKey: secrets.keeperhubApiKey,
    receiptSecret: secrets.receiptSecret,
    previousReceiptSecret:
      secrets.previousReceiptSecret.length > 0 ? secrets.previousReceiptSecret : undefined,
    eventPayload: payload,
    api: new GithubRestApi({ token: secrets.githubToken, transport }),
    provider: new KeeperHubClient({ apiKey: secrets.keeperhubApiKey, transport }),
  });

  if (!result.ok) {
    console.error(`${result.error.code}: ${result.error.message}`);
    process.exitCode = 1;
    return;
  }
  const evidence = result.evidence;
  console.log(
    `skirwith status=${evidence.status} policy=${evidence.policy.result} broadcast=${evidence.broadcastMade} ` +
      `executionId=${evidence.executionId ?? "none"} tx=${evidence.transactionHash ?? "none"} ` +
      `error=${evidence.error ? `${evidence.error.code}` : "none"}`,
  );
  for (const [key, value] of Object.entries(result.outputs)) {
    core.setOutput(key, value);
  }
  await core.summary.addRaw(result.summary).write();
}

if (import.meta.url === new URL(process.argv[1] ?? "", "file:").href) {
  main().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
}
