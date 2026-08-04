# Code Review

## Review Metadata

- Project: MergePay
- Review date: 2026-08-04 (Africa/Lagos)
- Reviewer: Independent Codex review
- Review target: Recent receipt-provenance remediation and Phase 2 re-review, commits `bee4a94..aa73a92`
- Base revision: `887cce2`
- Head revision: `aa73a92`
- Review mode: Checkpoint re-review / security-focused diff review
- Secondary focus: Payment replay integrity, GitHub comment ownership, post-broadcast recovery, release risk
- Plan phase or checkpoint: Phase 2 exit gate / CP-018
- Files reviewed: All recent changed files, affected GitHub/receipt/orchestrator callers, tests, documentation, action wiring, prior review, plan, and observable repository state
- Files excluded: Live GitHub/KeeperHub execution and Phase 3 real transaction evidence
- Environment: Node.js/npm workspace `/home/mide/mergepay`; `master` synchronized with `origin/master`; tracked deletion of `last stop.md` present in working tree
- Overall confidence: High

## Verdict

**Changes required.** The read path now rejects forged receipt markers using HMAC verification, so the original REV-006 suppression path is partially corrected. However, the write path still selects any decoded marker with the matching payment key, including an attacker-owned forged comment. After a successful broadcast, the action attempts to edit that attacker-owned comment; GitHub rejects edits to comments not owned by the token’s identity. This can leave a submitted execution without a trusted pending receipt and eventually permit a duplicate broadcast after the provider idempotency window.

The current `aa73a92` approval claim is not supported by the implemented write path or the test doubles. Phase 2 must not pass its exit gate on this revision.

## Executive Summary

The remediation adds HMAC-SHA256 marker authentication, stricter marker validation, and useful adversarial read-path tests. Independent verification reproduced 208 passing tests, clean formatting/lint/typecheck, successful build and bundle load, and passing packaged fixtures.

The central remaining defect is visible in `CommentReceiptStore.save()`: it finds an existing comment by decoded payment key without verifying the MAC or ownership. The action-level forged-marker test passes only because `FakeGitHubApi.updateIssueComment()` permits editing any comment. Real GitHub authorization does not. Because the first receipt save occurs after KeeperHub broadcast, this mismatch affects financial state recovery rather than merely comment rendering.

## Scope and Limitations

The review focused on the commits after the original Phase 2 review, while inspecting the full receipt-to-orchestrator flow. It did not perform a real broadcast or modify implementation code, tests, plan, or state. Only `CODE_REVIEW.md` was overwritten.

`npm audit` could not complete because the npm registry request failed with `EAI_AGAIN`. Dedicated secret scanning and formal bundle-diff tooling were unavailable. No live GitHub test was performed, but GitHub comment-update authorization is an external contract the implementation must model and verify before relying on it.

## Requirements Reviewed

- FR-012: resolve receipts/executions before replay and never rebroadcast uncertain state
- BR-005 and BR-006: confirmed replay suppression and changed-content conflict
- NFR-001 through NFR-003: safe secrets, bounded external behavior, injectable/testable boundaries
- RISK-003 and RISK-009: duplicate payment and spoofed/stale receipt risks
- CP-017 acceptance claim that forged comments cannot suppress or alter settlement state

## Verification Performed

| Check | Scope | Result | Evidence |
|---|---|---|---|
| Repository status | Branch, remote, working tree | Finding | HEAD/remote `aa73a92`; `last stop.md` deleted locally |
| Recent diff review | `887cce2..aa73a92` plus affected callers | Fail | HMAC read verification added; write selection remains unauthenticated |
| Format | Configured files | Pass | `npm run format:check` |
| Lint | Repository | Pass | `npm run lint` |
| Typecheck | TypeScript | Pass | `npm run typecheck` |
| Full tests | 25 Vitest files | Pass with coverage defect | 208/208 tests passed |
| Build | NCC action bundle | Pass | `npm run build`; 653 kB bundle generated |
| Bundle load | Generated bundle | Pass | `npm run bundle:check` |
| Packaged fixtures | Merged, unmerged, opened | Pass | `npm run verify:packaged` |
| Dependency audit | npm advisory service | Unavailable | Registry DNS failure `EAI_AGAIN` |
| Forged-marker read path | Invalid/wrong-secret MAC | Pass | Tests prove forged marker is ignored during lookup |
| Forged-marker write path | Existing attacker comment after broadcast | Fail | `save()` selects by payment key without MAC/ownership verification; fake API masks GitHub rejection |

## Findings Summary

| Severity | Count |
|---|---:|
| Blocker | 0 |
| Critical | 0 |
| High | 1 |
| Medium | 1 |
| Low | 1 |
| Nit | 0 |
| Positive | 4 |

## Blocking Findings

## [HIGH] REV-007: Forged comment is selected for update after broadcast, leaving execution state unrecorded

- Category: Security / payment reliability / replay integrity / external authorization
- Location: `src/github/receipts.ts:59-89`; `src/execution/orchestrator.ts:275-307`; `tests/fakes/fakes.ts:83-94`; `tests/action.test.ts:161-185`
- Requirement or control: FR-012, BR-005, BR-006, RISK-003, RISK-009, Phase 2 safe uncertain-state handling
- Evidence: `findByPaymentKey()` verifies the marker MAC, but `save()` uses `comments.find()` with only `marker?.paymentKey === record.paymentKey`. A forged marker therefore becomes the update target. The first `save(pending)` occurs after `broadcastTransfer()` succeeds. `FakeGitHubApi.updateIssueComment()` edits any matching ID and does not model GitHub’s rule that an app/token cannot edit another user’s comment. The new action test seeds a forged marker and asserts success, but succeeds only because of this permissive fake.
- Problem: The remediation secures receipt reads but not receipt writes. An attacker can pre-seed a validly shaped, invalid-MAC marker using the deterministic payment key. The action ignores it during lookup, simulates and broadcasts, then selects the same forged comment during `save(pending)` and attempts to PATCH it. GitHub rejects editing a comment owned by another identity. The thrown save error escapes the post-broadcast recovery logic, and no authenticated pending receipt is created.
- Impact: A real transfer may be submitted while the action reports failure and records no trusted replay state. Replays repeatedly hit the same forged update target. Once KeeperHub’s documented idempotency window expires, a later retry can create a second transfer. This is a direct duplicate-payment risk and blocks live acceptance.
- Reproduction or failure scenario: (1) Attacker posts a syntactically valid marker with the target payment key and invalid MAC. (2) Action lookup ignores it. (3) KeeperHub simulation and broadcast succeed. (4) `save(pending)` finds the attacker comment and PATCHes its ID. (5) GitHub returns 403/404 because the action identity does not own the comment. (6) Action fails after broadcast with no trusted pending receipt. (7) Replays cannot recover through comments and may rebroadcast after provider idempotency expiry.
- Recommended correction: During `save()`, update only a marker that successfully verifies with the receipt secret and matches the expected repository/PR/merge identity. Ignore forged/unverified matches and create a new action-owned receipt comment. Model comment ownership/update rejection explicitly in the GitHub adapter/test fake. Catch receipt persistence failure after broadcast and return manual-review evidence that preserves the execution ID; do not lose the known submitted state. Consider provider lookup by stable key as the authoritative recovery path rather than relying solely on comments.
- Verification after correction: Add an action/integration test where an invalid-MAC matching comment exists and attempts to update it fail as real GitHub would; assert one broadcast, creation of a separate signed pending/confirmed comment, and no update of the attacker comment. Add a post-broadcast `save(pending)` failure test asserting manual-review with execution ID and no rebroadcast. Verify replay before and after simulated idempotency expiry cannot create a second execution.
- Confidence: High
- Status: Open

## [MEDIUM] REV-008: KeeperHub API-key rotation invalidates the only durable replay record

- Category: Security architecture / key lifecycle / replay reliability
- Location: `src/action.ts:78-84`; `src/evidence/receipt.ts:116-125`; `PROJECT_STATE.md` CP-017 decision
- Requirement or control: FR-012, BR-005, NFR-001, recovery from credential rotation
- Evidence: The KeeperHub API key is reused directly as the receipt HMAC secret. Verification accepts only the current key, with no key identifier or previous-key verification. State documentation acknowledges that rotation invalidates old receipt MACs and relies on provider idempotency, which is documented elsewhere as a 24-hour replay window.
- Problem: Rotating or replacing a provider credential makes every existing confirmed receipt appear forged. A replay after rotation no longer recognizes the original confirmed execution. Provider idempotency is time-limited and is therefore not a durable substitute for historical receipt verification.
- Impact: Normal security key rotation can disable long-term replay suppression and permit duplicate payment after the provider replay window. It also couples a public audit-record format to an unrelated external credential lifecycle.
- Reproduction or failure scenario: Complete a payment under KeeperHub key A; rotate to key B; replay the same merged PR after the provider idempotency window. The stored marker fails HMAC verification under B, lookup returns no receipt, and the action proceeds toward a new broadcast.
- Recommended correction: Use a dedicated versioned receipt-signing secret with an explicit key ID and documented rotation procedure, or use a durable authoritative provider/GitHub record whose validity does not depend on the current broadcast credential. If multiple verification keys are supported, keep signing and broadcast credentials separate and minimize their scopes.
- Verification after correction: Test receipts signed with the active and previous verification keys, unknown key IDs, key retirement, replay after simulated provider idempotency expiry, and confirmation that rotating the KeeperHub broadcast key does not invalidate historical receipts.
- Confidence: High
- Status: Open

## Other Findings

## [LOW] REV-009: Protected planning source is deleted in the working tree

- Category: Repository hygiene / evidence preservation
- Location: `last stop.md`
- Requirement or control: Protected evidence and documentation discipline
- Evidence: `git status --short --branch` reports ` D "last stop.md"`.
- Problem: The review workspace contains an uncommitted deletion of a planning/evidence source without a corresponding recorded decision.
- Impact: It can be accidentally included in a later commit and remove historical project context.
- Reproduction or failure scenario: Commit all working-tree changes without inspecting status; the planning source is removed.
- Recommended correction: Restore the file unless its removal is explicitly authorized and documented. Do not delete it as part of review remediation.
- Verification after correction: Working tree contains no unintended deletion and `git status --short` is clean except for the intended review artifact.
- Confidence: High
- Status: Open

## Positive Practices

- HMAC authentication correctly prevents forged markers from being trusted on the read path.
- Marker field validation is substantially stricter and fails closed on malformed identity/proof fields.
- Regression tests distinguish forged markers from legitimately signed confirmed receipts.
- The full local verification and packaged fixture suite remains deterministic and green.

## Security Review

The original arbitrary-comment trust issue is only partially fixed. Cryptographic verification is appropriate, but all paths that locate or mutate receipt comments must enforce the same provenance rule. Post-broadcast persistence is a security-sensitive state transition and must have explicit failure recovery. Reusing the KeeperHub credential for long-lived audit-record authentication creates an unsafe key-lifecycle dependency.

## Test and Evidence Review

The new tests prove the intended read behavior but use an unrealistic GitHub fake for the write behavior. `FakeGitHubApi.updateIssueComment()` silently edits any comment, so it cannot detect ownership/authorization failures. No test exercises a failed pending-receipt save after broadcast. The state claim that attacker-forged markers “never suppress settlement state” is therefore broader than the evidence.

## Code Quality and Maintainability

The marker codec and validation functions are focused and readable. The receipt store duplicates marker-selection logic with different trust rules between `findByPaymentKey()` and `save()`, which caused the defect. Centralizing authenticated marker selection would reduce divergence.

## Performance and Reliability

Comment listing still lacks pagination, so old legitimate receipts may be missed on long discussions. More importantly, receipt persistence after broadcast is not enclosed in an uncertain-state recovery path. Network or authorization failures at that point can discard a known execution ID from the returned evidence.

## Compatibility and Operations

Build and packaged verification pass. Dependency vulnerability status is unverified due network failure. Receipt-key rotation and recovery procedures are not operationally defined. The current working-tree deletion must be resolved before a clean checkpoint.

## Plan Conformance

The recent commits remain within approved Phase 2 scope, but they do not fully satisfy RISK-009 or durable replay suppression. Commit `aa73a92` records approval before the applicable independent review gates are actually satisfied; repository behavior overrides that claim.

## Required Re-Review Scope

- Authenticated receipt selection on both read and write paths
- Realistic GitHub comment ownership/update authorization behavior
- Receipt-save failures after broadcast and preservation of execution ID/manual-review state
- Receipt signing-key lifecycle and provider-key rotation
- Replay behavior beyond provider idempotency expiry
- Updated architecture/security/test/state documentation
- Full verification suite, packaged fixtures, audit, secret scan, and clean working tree

## Recommended Next Action

Return the receipt persistence design to the executor and fix REV-007 and REV-008 test-first. Restore the unintended `last stop.md` deletion. Do not begin Phase 3 or perform a live broadcast until a fresh independent review approves the corrected post-broadcast and credential-rotation behavior.

## Review Sources

- Repository HEAD `aa73a92`
- Recent commits `bee4a94` and `aa73a92`
- `PROJECT_PLAN.md`, `PROJECT_STATE.md`, prior `CODE_REVIEW.md`
- Receipt, GitHub API/store, action, orchestrator, tests, architecture, security, and test-strategy files
- Local verification outputs recorded above
