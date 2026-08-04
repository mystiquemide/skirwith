// Verifies the packaged dist/index.js bundle behaves like the source action
// against saved GitHub event fixtures. Requires `npm run build` first.

import { readFileSync } from "node:fs";
import { createHash, createHmac } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = await import("../dist/index.js");

function sha256(text) {
  return createHash("sha256").update(text, "utf8").digest("hex");
}
function hmac(secret, text) {
  return createHmac("sha256", secret).update(text, "utf8").digest("hex");
}
function pruneUndefined(value) {
  const out = {};
  for (const [key, entry] of Object.entries(value)) {
    if (entry !== undefined) out[key] = entry;
  }
  return out;
}
function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map((entry) => stableStringify(entry)).join(",")}]`;
  if (value !== null && typeof value === "object") {
    const entries = Object.entries(value).sort(([a], [b]) => (a < b ? -1 : 1));
    return `{${entries
      .map(([key, entry]) => `${JSON.stringify(key)}:${stableStringify(entry)}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}
function stableRecord(record) {
  return Object.entries(record)
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([key, value]) => `${key}:${value}`)
    .join("\n");
}

function loadJson(relative) {
  return JSON.parse(readFileSync(join(root, relative), "utf8"));
}

const configYaml = readFileSync(join(root, "tests/fixtures/skirwith.example.yml"), "utf8");
const MERGE_SHA = "0123456789abcdef0123456789abcdef01234567";

function makeApi({ merged = true } = {}) {
  return {
    fetchDefaultBranch: async () => "main",
    fetchPullRequest: async () => ({
      number: 42,
      baseBranch: "main",
      mergeSha: merged ? MERGE_SHA : "",
      authorLogin: "alice",
      labels: ["skirwith-approved", "skirwith-5"],
      merged,
    }),
    fetchConfigFile: async () => configYaml,
    fetchCheckStates: async () => [{ name: "CI / test", passed: true }],
    listIssueCommentsPage: async () => ({ comments: [], hasMore: false, nextPage: undefined }),
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
    receiptSecret: "receipt_test_synthetic_secret",
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

// Legacy replay fixture: a signed pre-rebrand mergepay receipt for the same
// merge must resolve the packaged action to duplicate with zero broadcasts.
// The key, hash, and HMAC are recomputed independently here as a cross-check
// of the bundled algorithm.
const RECEIPT_SECRET = "receipt_test_synthetic_secret";
const RECIPIENT = "0x05619d1a133623b322a8f366ea9594e4e586f26d";
const TOKEN = "0x1c7d4b196cb0c7b01d743fbc6116a902379c7238";
const legacyCanonical = {
  version: "1",
  repository: "acme/skirwith-demo",
  pullRequestNumber: "42",
  mergeSha: MERGE_SHA,
  recipient: RECIPIENT,
  amountAtomic: "5000000",
  chainId: "11155111",
  tokenAddress: TOKEN,
  purpose: "mergepay:payout",
};
const legacyIdentity = {
  version: "1",
  repository: "acme/skirwith-demo",
  pullRequestNumber: "42",
  mergeSha: MERGE_SHA,
  purpose: "mergepay:payout",
};
const legacyPaymentKey = `mergepay:${sha256(stableRecord(legacyIdentity))}`;
const legacyRequestHash = sha256(stableRecord(legacyCanonical));
const legacyPayload = {
  version: 1,
  product: "mergepay",
  paymentKey: legacyPaymentKey,
  requestHash: legacyRequestHash,
  status: "confirmed",
  executionId: "ex_legacy_packaged",
  transactionHash: `0x${"a".repeat(64)}`,
  transactionLink: "https://explorer/tx/0xlegacy",
  repository: "acme/skirwith-demo",
  pullRequestNumber: 42,
  mergeSha: MERGE_SHA,
};
const legacyKeyId = sha256(RECEIPT_SECRET).slice(0, 16);
const legacyMac = hmac(RECEIPT_SECRET, stableStringify(pruneUndefined(legacyPayload)));
const legacyComment = `<!-- mergepay:${JSON.stringify({ ...legacyPayload, keyId: legacyKeyId, mac: legacyMac })} -->`;

const legacyCalls = { broadcast: 0 };
const legacyApi = {
  ...makeApi(),
  listIssueCommentsPage: async () => ({
    comments: [{ id: 1, body: legacyComment, createdAt: "2026-08-02T00:00:00.000Z" }],
    hasMore: false,
    nextPage: undefined,
  }),
};
const legacyProvider = {
  ...makeProvider(),
  broadcastTransfer: async () => {
    legacyCalls.broadcast += 1;
    throw new Error("legacy fixture must never broadcast");
  },
};
const legacyRun = await dist.run(
  deps(legacyApi, legacyProvider, loadJson("tests/fixtures/events/merged-closed.json")),
);
assert(
  legacyRun.ok &&
    legacyRun.evidence.status === "duplicate" &&
    legacyRun.evidence.broadcastMade === false,
  "legacy mergepay confirmed receipt -> duplicate",
);
assert(legacyCalls.broadcast === 0, "legacy mergepay replay -> zero broadcasts");

if (failed) {
  process.exit(1);
}
console.log("Packaged bundle verification passed.");
