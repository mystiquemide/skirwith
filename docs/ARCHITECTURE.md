# MergePay Architecture

## System Context

MergePay sits between GitHub and KeeperHub. GitHub supplies a trusted merge event and repository state. MergePay converts trusted state into a deterministic payment decision. KeeperHub simulates and executes the transfer. The block explorer provides authoritative chain evidence. GitHub remains the operator interface and audit surface.

```text
Maintainer -> GitHub merge/config/labels
GitHub -> MergePay Action -> KeeperHub Direct API -> EVM testnet
   ^            |                   |                  |
   |            +-- summary/receipt +-- execution ID   +-- tx proof
   +---------------------------------------------------------- evidence
```

## Containers

### Trusted GitHub workflow

Runs on the base repository's closed-PR event. It has minimum GitHub permissions and the KeeperHub secret. It does not check out or execute contributor code.

### MergePay action bundle

NCC-generated Node.js bundle. It parses context, fetches trusted config/state, evaluates policy, creates the canonical request, resolves duplicates, calls KeeperHub, and publishes evidence.

### KeeperHub Direct Execution API

External execution provider used for server-to-server simulation, broadcast, execution lookup, and status polling. Its exact endpoint and response contract remain provisional until live discovery.

### GitHub API

Source of current PR state, merge SHA, labels, checks, default-branch configuration, and existing receipts. It is never replaced by untrusted event text where fresh API verification is feasible.

### EVM testnet and explorer

Final settlement and independent transaction evidence. One supported chain and one verified token are frozen after smoke testing.

## Component Architecture

- `config`: parses and validates trusted YAML.
- `github`: normalizes events and fetches authoritative repository state.
- `policy`: pure deterministic decision engine and reason codes.
- `payment`: canonical serialization, request hashing, and payment key.
- `keeperhub`: typed transport, simulation, broadcast, lookup, polling, and error mapping.
- `execution`: duplicate state machine and settlement orchestration.
- `evidence`: versioned audit record.
- `output`: Actions summary, receipt comment, and action outputs.
- `security`: recursive redaction and safe error projection.
- `action.ts`: dependency composition only; no business logic.
- `cli.ts`: developer surface using the same domain modules.

## Execution Flow

```text
Receive event
-> validate event kind
-> fetch trusted PR state and default-branch config
-> validate checks, label, author, repository, branch
-> evaluate policy
   -> blocked: emit no-broadcast evidence
-> construct canonical request and payment key
-> find/validate existing receipt
   -> confirmed: return duplicate result
   -> pending: poll original execution
   -> conflict/uncertain: manual review
   -> absent: simulate exact request
-> require simulation pass and matching request hash
-> broadcast once with payment key
-> poll within deadline
-> publish evidence and receipt
```

## Data Models

No database is used in v0.1. Models are in-memory typed values and serialized evidence.

```ts
type PolicyDecision = {
  result: "approved" | "blocked";
  reasons: PolicyReason[];
  broadcastEligible: boolean;
};

type CanonicalPaymentRequest = {
  version: 1;
  repository: string;
  pullRequestNumber: number;
  mergeSha: string;
  recipient: `0x${string}`;
  amountAtomic: string;
  chainId: number;
  tokenAddress: `0x${string}`;
  purpose: string;
};

type PaymentIdentity = {
  version: 1;
  repository: string;
  pullRequestNumber: number;
  mergeSha: string;
  purpose: string;
};

type EvidenceRecord = {
  version: 1;
  paymentKey: string;
  requestHash: string;
  policy: PolicyDecision;
  simulation: "not-run" | "passed" | "failed";
  broadcastMade: boolean;
  executionId?: string;
  status: "blocked" | "pending" | "confirmed" | "failed" | "duplicate" | "manual-review";
  transactionHash?: string;
  transactionLink?: string;
  timestamps: Record<string, string>;
  error?: { code: string; message: string };
};
```

The payment key is derived from the stable `PaymentIdentity` (version, repository, pull request, merge SHA, purpose), independent of material content such as recipient, amount, chain, or token. The canonical request hash covers every material field and is kept separate as the integrity value. On replay, a matching key with a matching hash is a duplicate; a matching key with a changed hash is a conflict requiring manual review. Human decimal amounts are converted to atomic integer units using the configured token decimals before any cap comparison or serialization.

The GitHub receipt contains readable Markdown plus a hidden versioned marker encoding only the minimum safe duplicate fields: product/version, payment key, request hash, execution ID, status, repository, PR, and merge SHA.

## Integration Contracts

### GitHub inputs

- Event: `pull_request.closed` and `pull_request.merged === true`.
- Trusted config: repository contents API at the default-branch commit.
- PR verification: pull request API.
- Checks: check-runs/status API for merge SHA.
- Receipts: issue comments API.

### KeeperHub provisional operations

The observed live API contract overrides all planning assumptions.

```text
GET capabilities/chains
POST transfer simulation
POST transfer execution with Idempotency-Key
GET execution status by execution ID
```

Every call uses an injectable transport, timeout, validated JSON decoder, safe public error, and recursive redaction. Poll hints are clamped to local bounds.

## Failure Model

| Failure | Result |
|---|---|
| Invalid/unmerged event | Clean no-op or block; no provider call |
| Untrusted/missing config | Block; no provider call |
| Failed/missing checks | Block; no broadcast |
| Unknown contributor or invalid wallet | Block; no broadcast |
| Simulation revert | Failed simulation; no broadcast |
| Authentication/wallet/funding error | Safe failure; no secret disclosure |
| Network failure before broadcast response | Lookup by known execution/key where supported; otherwise manual review |
| Pending exceeds deadline | Pending/manual review; never rebroadcast |
| Existing matching confirmation | Duplicate success; reuse original proof |
| Existing key with changed request | Conflict/manual review |
| Receipt cannot be trusted | Provider lookup/manual review; never infer payment from visible prose |

## Security Boundaries

- Maintainers control workflow, default-branch config, labels, merges, secrets, and mappings.
- Contributor-controlled branches, code, PR body, title, comments, files, and environment values are untrusted.
- The action never uses `pull_request_target` to execute checked-out PR code.
- No sensitive HTTP body is logged by default.
- Outputs are allowlisted, not raw response dumps.
- External actions are pinned to commit SHAs.
- The generated `dist` bundle must match source at release.

## Onchain/Offchain Split

- Onchain: the final token transfer and transaction receipt only.
- KeeperHub: execution state and provider audit identity.
- GitHub: policy configuration, trigger, receipt, and user-visible evidence.
- No smart contract, proxy, RPC fallback, or indexer is needed. Direct explorer/provider evidence is sufficient for one transfer flow.

## Observability

- Correlation fields: repository, PR, merge SHA, payment key, request hash, execution ID.
- Structured internal log events with redacted values.
- Actions summary and receipt generated from the same evidence record.
- Metrics for the demo: policy outcome, simulation outcome, execution duration, poll count, terminal state, duplicate flag.

## Performance And Reliability Targets

- Local policy work completes in under one second excluding GitHub/provider calls.
- Every HTTP call has an explicit timeout.
- Polling has minimum interval, maximum interval, and total deadline.
- A workflow restart is safe because it resolves evidence before attempting first broadcast.
- No availability claim beyond observed hackathon testing.

## Architecture Decisions

### ADR-001: GitHub JavaScript Action

Decision: strict TypeScript compiled into an NCC JavaScript action. Consequence: fast startup and easy reuse; generated bundle must be committed and verified.

### ADR-002: Direct KeeperHub API in CI

Decision: use a headless organization credential and direct execution API for production; MCP is a development/discovery surface. Consequence: CI avoids interactive OAuth and documentation must not claim MCP executes production payments unless that changes.

### ADR-003: Trusted default-branch configuration

Decision: fetch config through GitHub API at trusted base state. Consequence: contributor edits cannot redirect payment during the settlement run.

### ADR-004: No database in v0.1

Decision: combine canonical identity, KeeperHub idempotency/lookup, and GitHub structured receipts. Consequence: fewer deployment dependencies, but irreconcilable evidence becomes manual review rather than automatic recovery.

### ADR-005: No daily limit

Decision: enforce a per-payment cap and provider organization limits. Consequence: do not advertise cumulative daily enforcement.

### ADR-006: Exact simulation/broadcast parity

Decision: serialize and hash once, simulate that body, then submit the same immutable body. Consequence: any mutation aborts locally.

### ADR-007: No automatic rebroadcast

Decision: uncertain executions are looked up or escalated. Consequence: lower automation but prevents double payment.

### ADR-008: GitHub is the UI

Decision: summaries and comments are primary; a public site is documentation only. Consequence: backend proof remains the critical path.

## Full Target Tree

The authoritative code tree is maintained in `docs/TASKS.md` under Planned Code Map. Documentation adds `PRD.md`, `ARCHITECTURE.md`, `SECURITY.md`, `CONFIGURATION.md`, `KEEPERHUB-INTEGRATION.md`, `TEST-STRATEGY.md`, `DEMO.md`, and `SUBMISSION.md`.

