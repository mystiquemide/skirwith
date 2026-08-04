# Code Review

## Review Metadata

- Project: MergePay
- Review date: 2026-08-04 (Africa/Lagos)
- Reviewer: Independent Codex review
- Review target: Latest remediation commit `ebefa9a` against Phase 2 findings REV-007 through REV-009
- Base revision: `aa73a92`
- Head revision: `ebefa9a`
- Review mode: Checkpoint re-review / security-focused diff review
- Secondary focus: Replay safety, post-broadcast recovery, receipt-key rotation, GitHub authorization
- Plan phase or checkpoint: Phase 2 exit gate / CP-020
- Files reviewed: All files changed by `ebefa9a`, affected receipt/action/orchestrator/provider callers, tests, examples, security/architecture/configuration docs, plan, and current state
- Files excluded: Live GitHub/KeeperHub execution and Phase 3 transaction evidence
- Environment: Node.js/npm workspace `/home/mide/mergepay`; `master` synchronized with `origin/master`; `last stop.md` deleted locally
- Overall confidence: High

## Verdict

**Changes required.** REV-007’s forged-comment update defect and REV-008’s provider-key coupling are corrected. One High replay-safety defect remains: if the trusted pending receipt cannot be persisted after a successful broadcast, the action returns manual-review evidence only to the current run and stores no durable replay guard. A later workflow run sees no receipt and automatically proceeds to broadcast again. After KeeperHub’s documented idempotency window expires, this can create a duplicate payment.

Phase 2 must not pass its exit gate on `ebefa9a`.

## Executive Summary

The latest commit makes meaningful corrections. Receipt writes now update only MAC-verified comments, forged squatters cause a new action-owned comment, GitHub test doubles model comment ownership, and receipt authentication uses a dedicated versioned secret with previous-key verification. Independent verification reproduced 215 passing tests, format, lint, typecheck, build, bundle load, and packaged fixtures.

The post-broadcast persistence fix is incomplete across workflow runs. Catching `save(pending)` and returning `manual-review` preserves the execution ID in ephemeral action output, but it does not persist a tombstone, uncertain-state marker, provider lookup identity, or other durable block. The next run therefore enters `executeNew()` again. The project’s nonnegotiable rule is never to automatically rebroadcast an uncertain execution; that rule must hold across runs, not only inside one invocation.

## Scope and Limitations

The review inspected the latest commit plus surrounding replay and receipt contracts. No real transfer, GitHub mutation, or provider call was performed. No implementation, tests, plan, or state files were changed; only `CODE_REVIEW.md` was overwritten.

`npm audit` remained unavailable because registry DNS failed with `EAI_AGAIN`. Dedicated secret scanning and formal bundle-diff tooling were unavailable. The provider’s live idempotency expiry behavior was not replayed, but the repository’s own state documents a 24-hour window.

## Requirements Reviewed

- FR-012: resolve existing receipts/executions before replay and never rebroadcast uncertain states
- BR-005 and BR-006: durable duplicate suppression and changed-content conflict
- NFR-001 through NFR-003: safe secrets, bounded failure behavior, testable boundaries
- RISK-003 and RISK-009: duplicate payment and receipt spoofing/staleness
- CP-019 claims for authenticated writes, post-broadcast recovery, and signing-key rotation

## Verification Performed

| Check | Scope | Result | Evidence |
|---|---|---|---|
| Repository status | Branch, remote, working tree | Finding | HEAD/remote `ebefa9a`; local deletion of `last stop.md` |
| Latest commit review | `aa73a92..ebefa9a` plus affected callers | Pass with High finding | Authenticated writes/key rotation fixed; cross-run uncertain-state guard absent |
| Format | Configured files | Pass | `npm run format:check` |
| Lint | Repository | Pass | `npm run lint` |
| Typecheck | TypeScript | Pass | `npm run typecheck` |
| Full tests | 25 Vitest files | Pass with missing cross-run case | 215/215 tests passed |
| Build | NCC bundle | Pass | `npm run build`; 654 kB bundle generated |
| Bundle load | Generated bundle | Pass | `npm run bundle:check` |
| Packaged fixtures | Merged, unmerged, opened | Pass | `npm run verify:packaged` |
| Dependency audit | npm advisory service | Unavailable | Registry DNS failure `EAI_AGAIN` |
| Forged receipt write | Invalid-MAC matching comment | Pass | Store creates a separate signed comment and does not edit squatter |
| Receipt-key rotation | Active/previous receipt keys | Pass | Previous receipt key verifies; KeeperHub key is independent |
| Pending-save failure | Current invocation | Partial | Returns manual review with execution ID, but no durable record blocks future runs |

## Findings Summary

| Severity | Count |
|---|---:|
| Blocker | 0 |
| Critical | 0 |
| High | 1 |
| Medium | 0 |
| Low | 1 |
| Nit | 0 |
| Positive | 5 |

## Blocking Findings

## [HIGH] REV-010: Post-broadcast receipt failure does not prevent automatic rebroadcast in a later run

- Category: Payment correctness / replay safety / failure recovery / data integrity
- Location: `src/execution/orchestrator.ts:275-314`; `src/execution/orchestrator.ts:94-103`; `tests/execution/orchestrator.test.ts:307-323`
- Requirement or control: FR-012, BR-005, RISK-003, nonnegotiable “Never automatically rebroadcast an uncertain execution”
- Evidence: After `broadcastTransfer()` succeeds, a failure from `receipts.save(pending)` returns manual-review evidence containing the execution ID. Nothing is persisted. On a later run, `findByPaymentKey()` returns undefined and `settle()` calls `executeNew()` again, including `broadcastTransfer()`. The regression test asserts only the first invocation and does not execute a second run with the same receipt store after the save failure.
- Problem: Manual-review status is ephemeral. The implementation has no durable uncertain-state record or authoritative provider lookup by payment key before a new broadcast. The same event can therefore be automatically rebroadcast by a future workflow invocation.
- Impact: Within the provider idempotency window the provider may return the original execution, but after the documented 24-hour window a second transfer can be created. This is a direct duplicate-payment risk and violates the project’s strongest safety invariant.
- Reproduction or failure scenario: (1) KeeperHub accepts broadcast and returns `executionId`. (2) GitHub receipt creation fails due outage, permissions, rate limit, or comment API error. (3) Run returns manual review but persists nothing. (4) Operator or scheduled replay reruns the same merged event after idempotency expiry. (5) No receipt is found; simulation passes; a new broadcast occurs with the expired key and can pay again.
- Recommended correction: Establish a durable pre-broadcast or post-submission recovery source that survives GitHub comment failure. Options include provider lookup by stable payment key before every broadcast, a trusted durable store, or an action-owned reservation record written before broadcast with an explicit safe state machine. If no authoritative lookup/store is available, fail the architecture gate rather than claiming cross-run no-rebroadcast. Ensure any reservation design distinguishes pre-broadcast failure from submitted/unknown state and cannot itself authorize payment.
- Verification after correction: Add a two-run integration test: first run broadcasts then fails receipt persistence; second run uses the same payment identity with no receipt and must perform zero broadcasts while resolving/provider-looking-up the original execution or returning manual review. Repeat with simulated provider idempotency expiry. Test GitHub outage, permission failure, rate limiting, and terminal-receipt save failure. Capture the durable recovery evidence.
- Confidence: High
- Status: Open

## Other Findings

## [LOW] REV-011: Protected planning source remains deleted in the working tree

- Category: Repository hygiene / evidence preservation
- Location: `last stop.md`
- Requirement or control: Protected evidence and documentation discipline
- Evidence: `git status --short --branch` reports ` D "last stop.md"`.
- Problem: A project planning/evidence source is deleted locally without a recorded approved removal.
- Impact: It may be accidentally committed and remove historical project context.
- Reproduction or failure scenario: Commit all current changes without reviewing status.
- Recommended correction: Restore the file unless deletion is explicitly authorized and documented.
- Verification after correction: `git status --short` contains only the intended review artifact or is clean.
- Confidence: High
- Status: Open

## Positive Practices

- Receipt writes now authenticate candidate comments before updating them.
- The GitHub fake models action-owned comment authorization, closing the prior misleading test behavior.
- Receipt signing uses a dedicated key with explicit key IDs and previous-key rotation support.
- Pending receipt persistence failure preserves the known execution ID in current-run evidence.
- Configuration, workflow examples, security documentation, and packaged fixtures were updated with the new secret contract.

## Security Review

REV-007’s forged-squatter authorization path is corrected and REV-008’s credential-lifecycle coupling is resolved. The remaining cross-run replay gap is more fundamental: current-run safe output is not durable state. No secret exposure was found in the reviewed changes.

## Test and Evidence Review

The added tests meaningfully cover authenticated writes, ownership rejection, key rotation, missing secrets, and current-run save failure. They do not test a second invocation after post-broadcast persistence failure or behavior beyond provider idempotency expiry. The CP-019 statement that post-broadcast recovery is fixed therefore exceeds the demonstrated behavior.

## Code Quality and Maintainability

Authenticated receipt selection is now consistently applied in read/write paths. The signing-key interfaces are clear. The remaining issue belongs to state ownership and recovery architecture, not local code style.

## Performance and Reliability

Network calls remain bounded. GitHub comment pagination remains absent, which can hide older receipts on long PR discussions. More importantly, a comment-store outage after broadcast leaves no durable cross-run recovery state.

## Compatibility and Operations

The new mandatory `MERGE_PAY_RECEIPT_SECRET` is wired through environment parsing and the example workflow. Operators need a documented generation, storage, rotation, and retirement procedure before live use. Audit status remains unverified due network failure.

## Plan Conformance

The latest changes remain within Phase 2 scope and correctly address two prior findings, but durable no-rebroadcast behavior is still not met. Repository behavior outranks the CP-019 completion claim.

## Required Re-Review Scope

- Durable recovery after post-broadcast receipt persistence failure
- Provider lookup or trusted state-store behavior before every possible rebroadcast
- Two-run replay tests including idempotency expiry
- Terminal receipt-save failures and GitHub outage/rate-limit cases
- Updated architecture/security/test/state documentation
- Full verification, packaged fixtures, dependency audit, secret scan, and clean working tree

## Recommended Next Action

Return REV-010 to the executor for an architecture-level recovery fix. Restore `last stop.md`. Do not begin Phase 3 or perform a live payout until an independent re-review proves that a prior uncertain execution cannot be automatically broadcast again in any later run.

## Review Sources

- Repository HEAD `ebefa9a`
- Latest commit diff `aa73a92..ebefa9a`
- `PROJECT_PLAN.md`, `PROJECT_STATE.md`, prior review findings
- Receipt, action, orchestrator, GitHub store/API, tests, workflow examples, and security/configuration documentation
- Local verification outputs recorded above
