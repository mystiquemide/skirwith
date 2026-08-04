# Code Review

## Review Metadata

- Project: MergePay
- Review date: 2026-08-04 (Africa/Lagos)
- Reviewer: Independent Codex review
- Review target: Latest commit `f883b81`, remediation of REV-010
- Base revision: `ebefa9a`
- Head revision: `f883b81`
- Review mode: Checkpoint re-review / security-focused diff review
- Secondary focus: Cross-run replay safety, reservation ordering, post-broadcast recovery
- Plan phase or checkpoint: Phase 2 exit gate / CP-022
- Files reviewed: All files changed by `f883b81`, affected receipt/orchestrator/action callers, relevant tests and documentation, plan, and observable repository state
- Files excluded: Live GitHub/KeeperHub execution and Phase 3 real transaction evidence
- Environment: Node.js/npm workspace `/home/mide/mergepay`; `master` synchronized with `origin/master`; local deletion of `last stop.md`
- Overall confidence: High for the local Phase 2 implementation; Medium for dependency and live-integration evidence

## Verdict

**Approve with non-blocking findings.** REV-010 is corrected. A signed pending reservation is now persisted before broadcast, broadcast is refused if reservation persistence fails, and a failed submitted-state update leaves the reservation durable so later runs resolve to manual review without simulation or rebroadcast. The Phase 2 execution gate is approved for revision `f883b81`, subject to resolving the working-tree deletion and completing unavailable release-level checks before publication.

This approval does not constitute live KeeperHub transaction evidence or Phase 3 acceptance.

## Executive Summary

The latest commit establishes the missing cross-run invariant: no broadcast can occur without durable replay state. The orchestrator writes a pending reservation before calling KeeperHub, upgrades it with the execution ID after submission, and preserves conservative manual-review behavior when persistence or polling becomes uncertain. Two-run orchestrator and action tests demonstrate that a later invocation performs zero simulations and zero broadcasts after a submitted-state save failure.

Independent verification reproduced 218 passing tests, clean format/lint/typecheck, successful build and bundle load, and all packaged fixtures. No unresolved Blocker, Critical, High, or Medium defect was found in the reviewed commit.

## Scope and Limitations

The review focused on `f883b81` and inspected enough surrounding replay, receipt, and provider code to validate its effect. No implementation code, tests, plan, state, commits, external systems, or protected evidence were modified. Only this review artifact was overwritten.

`npm audit` could not complete because registry DNS failed with `EAI_AGAIN registry.npmjs.org`. Dedicated secret scanning and formal bundle-diff tools were unavailable. Live GitHub comment behavior and KeeperHub transaction/idempotency behavior remain Phase 3 validation items.

## Requirements Reviewed

- FR-012: resolve existing state before broadcast and never automatically rebroadcast uncertain executions
- BR-005 and BR-006: durable replay suppression and conflict handling
- NFR-001 through NFR-003: safe failure behavior and injectable/testable boundaries
- RISK-003 and RISK-009: duplicate-payment and receipt-state integrity
- CP-021 acceptance criteria for reservation-first ordering and two-run zero-rebroadcast behavior

## Verification Performed

| Check | Scope | Result | Evidence |
|---|---|---|---|
| Repository/revision status | Branch, remote, working tree | Pass with Low finding | HEAD/remote `f883b81`; `last stop.md` deleted locally |
| Latest commit review | `ebefa9a..f883b81` plus affected callers | Pass | Reservation-first ordering and cross-run resolution verified |
| Format | Configured files | Pass | `npm run format:check` |
| Lint | Repository | Pass | `npm run lint` |
| Typecheck | TypeScript project | Pass | `npm run typecheck` |
| Full tests | 25 Vitest files | Pass | 218/218 tests passed |
| Build | NCC bundle | Pass | `npm run build`; 655 kB bundle generated |
| Bundle load | Generated bundle | Pass | `npm run bundle:check` |
| Packaged fixtures | Merged, unmerged, opened | Pass | `npm run verify:packaged` |
| Dependency audit | npm advisory service | Unavailable | Registry DNS failure `EAI_AGAIN` |
| Pre-broadcast reservation failure | Receipt persistence unavailable | Pass | No broadcast occurs |
| Submitted-state save failure | Broadcast succeeds, receipt upgrade fails | Pass | Manual review preserves execution ID; original reservation remains |
| Cross-run replay | Second invocation after submitted-save failure | Pass | Zero simulation and zero broadcast; existing reservation resolves manual review |

## Findings Summary

| Severity | Count |
|---|---:|
| Blocker | 0 |
| Critical | 0 |
| High | 0 |
| Medium | 0 |
| Low | 2 |
| Nit | 0 |
| Positive | 5 |

## Blocking Findings

None.

## Other Findings

## [LOW] REV-012: Protected planning source remains deleted in the working tree

- Category: Repository hygiene / evidence preservation
- Location: `last stop.md`
- Requirement or control: Protected evidence and documentation discipline
- Evidence: `git status --short --branch` reports ` D "last stop.md"`.
- Problem: A historical planning/evidence file is deleted locally without an approved recorded removal.
- Impact: It can be accidentally included in a later commit, removing project context and preventing a clean release checkout.
- Reproduction or failure scenario: Commit all local changes without inspecting the deletion.
- Recommended correction: Restore the file unless deletion is explicitly authorized and documented.
- Verification after correction: `git status --short` contains only the intended review artifact or is clean.
- Confidence: High
- Status: Open

## [LOW] REV-013: Comment receipt discovery has no pagination support

- Category: Reliability / GitHub API compatibility
- Location: `src/github/api.ts:137-155`; `src/github/receipts.ts:38-83`
- Requirement or control: FR-012, NFR-002, reliable replay discovery
- Evidence: `listIssueComments()` requests a single GitHub comments page without `per_page`, pagination links, or iteration. Both lookup and save operate only on that returned list.
- Problem: On a PR with more comments than GitHub’s default page size, an older signed reservation/receipt may not be returned. The action can miss authoritative replay state or create another receipt comment.
- Impact: Limited for the hackathon MVP and mitigated by per-PR concurrency plus provider idempotency, but it reduces robustness on active public PRs and should be addressed before broader release.
- Reproduction or failure scenario: Place the signed receipt outside the first API page, then replay the event; receipt lookup returns undefined.
- Recommended correction: Implement bounded pagination for issue comments, preferably stopping once the authenticated matching receipt is found, with a documented maximum and safe API-failure behavior.
- Verification after correction: Add multi-page tests with the receipt on later pages, malformed comments across pages, and bounded termination.
- Confidence: High
- Status: Open

## Positive Practices

- Durable reservation is written before any broadcast.
- Broadcast is refused when the reservation cannot be persisted.
- Submitted-state failure preserves the known execution ID and leaves a replay-blocking reservation.
- Two-run action and orchestrator tests directly prove zero automatic rebroadcast across invocations.
- Architecture, security, test strategy, and project state document the reservation-first invariant.

## Security Review

The prior forged-comment write, receipt-key rotation, and cross-run rebroadcast defects are corrected in the reviewed scope. Receipt markers are authenticated with dedicated versioned keys, and only authenticated comments are updated. No new secret exposure was identified.

The reservation is deliberately conservative: a clean broadcast rejection can leave a pending record requiring manual review. This prioritizes preventing duplicate payment over automatic recovery and is consistent with the project mission.

## Test and Evidence Review

The tests now exercise pre-broadcast reservation failure, submitted-state save failure, and a second invocation using the durable reservation. Assertions cover broadcast and simulation call counts, not merely returned status. The packaged action fixtures also remain green.

Live GitHub and KeeperHub evidence is still required to validate external response fields, permissions, provider idempotency semantics, and real transaction outcomes.

## Code Quality and Maintainability

The reservation-first sequence is explicit and documented with security rationale. Existing receipt-resolution types naturally classify pending reservations without execution IDs as manual review, avoiding unnecessary state expansion.

## Performance and Reliability

Network timeouts and polling remain bounded. The reservation-first approach introduces an additional GitHub read/write before broadcast, which is justified by the payment-safety invariant. Comment pagination remains the primary reliability hardening item.

## Compatibility and Operations

Build and packaged fixture verification pass. The mandatory receipt-signing secret and optional previous secret are documented. Operators must generate, store, rotate, and retain those secrets correctly. Dependency audit status remains unverified in this environment.

## Plan Conformance

The latest commit stays within the approved stateless/no-database architecture and satisfies the no-automatic-rebroadcast invariant by using signed GitHub reservation state. Phase 2 may close its code-review gate at `f883b81`; Phase 3 must still produce genuine live success, replay suppression, and refusal evidence.

## Required Re-Review Scope

No further Phase 2 re-review is required unless the reservation, receipt, payment identity, provider idempotency, or workflow trust-boundary code changes. Phase 3 review must cover the real transaction, replay with no second transfer, refusal with `broadcastMade: false`, receipt/provider/explorer consistency, and protected evidence.

## Recommended Next Action

Restore `last stop.md`, reproduce dependency audit and secret-scan checks in a network-enabled clean environment, then proceed to the explicitly controlled Phase 3 live three-state acceptance. Do not claim production or mainnet readiness.

## Review Sources

- Repository HEAD `f883b81`
- Latest commit diff `ebefa9a..f883b81`
- `PROJECT_PLAN.md`, `PROJECT_STATE.md`, prior review findings
- Orchestrator, duplicate resolver, receipt store/codec, action tests, integration fixtures, and security/architecture/test documentation
- Local verification outputs recorded above
