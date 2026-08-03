// Verifies the packaged dist/index.js bundle behaves like the source action
// against saved GitHub event fixtures. Requires `npm run build` first.

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = await import("../dist/index.js");

function loadJson(relative) {
  return JSON.parse(readFileSync(join(root, relative), "utf8"));
}

const configYaml = readFileSync(join(root, "tests/fixtures/mergepay.example.yml"), "utf8");
const MERGE_SHA = "0123456789abcdef0123456789abcdef01234567";

function makeApi({ merged = true } = {}) {
  return {
    fetchDefaultBranch: async () => "main",
    fetchPullRequest: async () => ({
      number: 42,
      baseBranch: "main",
      mergeSha: merged ? MERGE_SHA : "",
      authorLogin: "alice",
      labels: ["mergepay-approved", "mergepay-5"],
      merged,
    }),
    fetchConfigFile: async () => configYaml,
    fetchCheckStates: async () => [{ name: "CI / test", passed: true }],
    listIssueComments: async () => [],
    createIssueComment: async () => {},
    updateIssueComment: async () => {},
  };
}

function makeProvider() {
  return {
    simulateTransfer: async () => ({ wouldRevert: false, simulatedReturnValue: true }),
    broadcastTransfer: async () => ({ executionId: "ex_packaged", status: "running" }),
    getExecution: async () => ({ executionId: "ex_packaged", status: "completed", pollIntervalHint: 0 }),
    waitForTerminal: async () => ({
      executionId: "ex_packaged",
      status: "completed",
      transactionHash: "0xabc",
      transactionLink: "https://explorer/tx/0xabc",
      pollIntervalHint: 0,
    }),
    discoverChains: async () => [],
  };
}

function deps(api, provider, eventPayload) {
  return {
    githubToken: "ghp_test_synthetic",
    keeperhubApiKey: "kh_test_synthetic",
    eventPayload,
    api,
    provider,
    nowIso: () => "2026-08-03T22:00:00.000Z",
  };
}

let failed = false;
function assert(condition, message) {
  if (condition) {
    console.log(`PASS: ${message}`);
  } else {
    console.error(`FAIL: ${message}`);
    failed = true;
  }
}

const merged = await dist.run(
  deps(makeApi(), makeProvider(), loadJson("tests/fixtures/events/merged-closed.json")),
);
assert(merged.ok && merged.evidence.status === "confirmed", "merged-closed fixture -> confirmed");

const unmerged = await dist.run(
  deps(
    makeApi({ merged: false }),
    makeProvider(),
    loadJson("tests/fixtures/events/unmerged-closed.json"),
  ),
);
assert(unmerged.ok && unmerged.evidence.status === "blocked", "unmerged-closed fixture -> blocked");

const opened = await dist.run(
  deps(makeApi(), makeProvider(), loadJson("tests/fixtures/events/opened.json")),
);
assert(!opened.ok && opened.error.code === "GITHUB_INVALID_EVENT", "opened fixture -> safe failure");

if (failed) {
  process.exit(1);
}
console.log("Packaged bundle verification passed.");
