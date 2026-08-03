# Code Review

## Review Metadata

- Project: MergePay
- Review date: 2026-08-04 (Africa/Lagos)
- Reviewer: Independent Codex review
- Review target: Phase 2 exit gate / CP-016, revisions `0a853f3..887cce2`
- Base revision: `4554773`
- Head revision: `887cce2`
- Review mode: Phase review / security-focused release-readiness review
- Secondary focus: GitHub trust boundary, payment replay safety, provider parity, workflow isolation, packaged action
- Plan phase or checkpoint: Phase 2 — Trusted GitHub and KeeperHub execution / CP-016
- Files reviewed: Phase 2 source, tests, workflow/action metadata, examples, scripts, relevant architecture/security/test docs, `PROJECT_PLAN.md`, and `PROJECT_STATE.md`
- Files excluded: Live KeeperHub/GitHub execution and Phase 3 real transaction evidence
- Environment: Node.js/npm workspace `/home/mide/mergepay`; `master` synchronized with `origin/master`; working tree clean
- Overall confidence: High for local code/tests; Medium for live provider and dependency evidence

## Verdict

**Changes required.** The Phase 2 implementation is substantial and the local verification suite passes, but the receipt-backed replay control trusts attacker-controlled GitHub issue comments. A commenter can forge a deterministic MergePay receipt marker before the action runs, causing a legitimate payout to be classified as duplicate or manual-review without any provider broadcast. This violates the project’s explicit spoofed/stale receipt risk control and blocks the Phase 2 exit gate until corrected or explicitly redesigned and accepted.

## Executive Summary

Positive evidence is strong: provider transport/client, simulation and broadcast parity, bounded polling, event normalization, settlement orchestration, fresh GitHub state loading, action outputs, trusted workflow examples, and packaged fixtures are implemented with injectable seams. Independent verification reproduced 199 passing tests, format, lint, typecheck, build, bundle load, and packaged-action fixture verification.

The remaining security defect is in receipt discovery. `CommentReceiptStore` accepts any comment containing a syntactically valid hidden marker and uses it as authoritative execution state. GitHub issue comments are untrusted external input; the marker is not signed, tied to an authenticated bot identity, or otherwise anchored to an action-owned record. Because payment keys and request hashes are deterministic from public event/config state, an attacker can construct a forged marker for a target PR and suppress payment. The implementation must not proceed to live three-state acceptance with this control unresolved.

## Scope and Limitations

The review covered the Phase 2 diff and surrounding contracts, not only changed lines. Live GitHub and KeeperHub calls were not performed, so provider response assumptions and real permission behavior remain pending Phase 3. No production code, tests, plan, or state files were modified; only this review artifact was overwritten.

`npm audit` could not be independently completed because the registry request failed with `EAI_AGAIN registry.npmjs.org`. A dedicated secret-scanning product and formal bundle-diff tool were unavailable. Local source/config inspection found no apparent live credential.

## Requirements Reviewed

- FR-001, FR-002, FR-009 through FR-013
- NFR-001 through NFR-005
- SC-003 through SC-006 and Phase 2 exit gate
- BR-003 through BR-006, especially no-broadcast, exact parity, replay suppression, and changed-content conflict handling
- RISK-009: GitHub receipt spoofing or stale receipt state

## Verification Performed

| Check | Scope | Result | Evidence |
|---|---|---|---|
| Repository/revision status | Branch, remote, working tree | Pass | HEAD `887cce2`, synchronized with `origin/master`, clean tree |
| Phase 2 diff review | `4554773..887cce2` plus callers/docs | Pass with finding | Provider, execution, GitHub, workflow, packaging, and tests inspected |
| Format | Configured source/test/config files | Pass | `npm run format:check` |
| Lint | Repository | Pass | `npm run lint` |
| Typecheck | TypeScript project | Pass | `npm run typecheck` |
| Full tests | 25 Vitest files | Pass | 199/199 tests passed |
| Build | NCC bundle | Pass | `npm run build`; 651 kB bundle generated |
| Bundle load | Generated `dist/index.js` | Pass | `npm run bundle:check`: bundle loads |
| Packaged fixtures | Merged, unmerged, opened events | Pass | `npm run verify:packaged`: confirmed, blocked, safe failure |
| Dependency audit | npm advisory service | Unavailable | Registry DNS failure `EAI_AGAIN` |
| Secret scan | Source, workflow, action metadata, scripts | Limited pass | No apparent live secret; dedicated scanner unavailable |
| Workflow trust review | Example consumer workflow and CI | Pass with limitation | `pull_request` closed only, no untrusted checkout, pinned actions, least permissions; release SHA placeholder remains by design |
| Receipt spoofing review | `CommentReceiptStore`, marker codec, replay resolver | Fail | Any issue comment with a valid marker is treated as authoritative receipt state |

## Findings Summary

| Severity | Count |
|---|---:|
| Blocker | 0 |
| Critical | 0 |
| High | 0 |
| Medium | 1 |
| Low | 0 |
| Nit | 0 |
| Positive | 5 |

## Blocking Findings

## [MEDIUM] REV-006: Unauthenticated GitHub comments can forge receipt state and suppress payouts

- Category: Security / business logic / replay integrity / availability
- Location: `src/github/receipts.ts:20-55`; `src/evidence/receipt.ts:21-69`; `src/execution/orchestrator.ts:98-100`
- Requirement or control: FR-012, BR-005, BR-006, NFR-001, RISK-009, Phase 2 acceptance criterion for deterministic duplicate/conflict handling
- Evidence: `CommentReceiptStore.findByPaymentKey()` lists all issue comments, decodes any matching `<!-- mergepay:{...} -->` marker, and returns it as a `ReceiptRecord` without checking comment author, bot identity, signature, action-run identity, or an external authoritative store. `isReceiptMarker()` validates only broad field types and allowed status values. `SettlementOrchestrator` trusts the returned record before simulation/broadcast and resolves `confirmed` markers as duplicates.
- Problem: GitHub issue comments are attacker-controlled input. Any user able to comment on the PR can publish a forged marker. Payment keys and request hashes are deterministic from public repository/PR/config data, so a malicious commenter can calculate a target marker and pre-seed `status: "confirmed"` with matching identity/hash. The next legitimate run returns `duplicate` and makes no provider call, or a forged pending/failed marker forces manual review.
- Impact: A payout can be permanently or repeatedly suppressed without authorization. This is a denial-of-payment/replay-integrity failure and invalidates the claim that receipt comments are an auditable source of truth. It does not directly authorize theft, but it breaks the acceptance path and can be used against every eligible PR in a public repository.
- Reproduction or failure scenario: (1) Observe a merged PR, trusted default-branch config, and public event fields. (2) Compute the same canonical identity/payment key/request hash. (3) Post a normal issue comment containing a valid MergePay marker with matching repository, PR, merge SHA, key, and hash but `status: "confirmed"` and attacker-chosen proof fields. (4) Trigger/replay the action. `findByPaymentKey()` returns the forged marker; `resolveExistingReceipt()` returns `duplicate`; no simulation or broadcast occurs.
- Recommended correction: Do not treat arbitrary comments as authoritative execution state. Preferred options are an authenticated provider lookup keyed by the stable payment key, or a trusted durable receipt store. If GitHub comments remain the persistence mechanism, bind records to an action-owned bot identity and verify author/permissions through the GitHub API, use a signed MAC over the full marker with a secret unavailable to commenters, and fail closed when provenance or integrity cannot be established. Also validate payment-key/request-hash formats, merge SHA, PR number, and proof fields before accepting a marker. Document the chosen trust model and its residual race/replay limits.
- Verification after correction: Add tests for forged markers from arbitrary authors, malformed/invalid-proof markers, same-key changed-hash conflicts, legitimate bot-authored pending/confirmed receipts, and comment-list races. Prove an attacker-authored confirmed marker never suppresses provider calls; prove a legitimate confirmed receipt still suppresses exactly one replay; run the full integration, security, and packaged-action suites.
- Confidence: High
- Status: Open

## Other Findings

None.

## Positive Practices

- Pure policy and settlement logic remain separated from injected GitHub/provider interfaces.
- Simulation and broadcast use parity-checked transfer parameters, with idempotency identity sent only on broadcast.
- Uncertain broadcast/poll outcomes become manual review with no automatic rebroadcast.
- Trusted workflow uses `pull_request` closed events, avoids `pull_request_target`, checks out no PR code, pins external actions, and uses narrow permissions.
- Packaged-action verification exercises merged, unmerged, and malformed/open-event behavior against the built bundle.

## Security Review

The workflow boundary is directionally sound: secrets are supplied only in the settlement step, PR code is not checked out, and contributor-controlled configuration is not read from the PR head. Provider errors are projected through safe messages and recursively redacted. The unresolved receipt provenance issue is the main security boundary failure.

Additional live-validation items remain: confirm actual GitHub token permissions, default-branch contents behavior, KeeperHub response fields/status units, and action release packaging. These are not credited as live evidence by this review.

## Test and Evidence Review

The 199-test suite covers the intended happy/failure state machine and packaged fixtures. It does not include adversarial comment-author/provenance cases, despite the plan explicitly identifying spoofed/stale receipts as a risk. The missing test is material because the vulnerable path is the actual replay gate, not a peripheral renderer.

The state file’s CP-012 through CP-015 claims are broadly reproduced locally. `npm audit` and live provider/GitHub evidence remain unverified in this environment.

## Code Quality and Maintainability

The module boundaries and injectable fakes are strong. Receipt persistence currently conflates human-readable GitHub comments with trusted state; that trust assumption should be made explicit in the architecture and represented by a verified interface.

## Performance and Reliability

Provider calls have per-request timeouts and bounded polling. The GitHub comment list has no pagination support, so a long PR discussion can miss older receipt markers or create avoidable API limits; this is a secondary operational risk to address before production-scale use, but not separately blocking this narrow checkpoint.

## Compatibility and Operations

Action metadata points to `dist/index.js`, which is intentionally generated/released later. The example workflow contains a `<release-sha>` placeholder and is not directly runnable until replaced with a real release reference. This is documented and appropriate for the current phase.

## Plan Conformance

Provider, state-machine, GitHub adapter, workflow, and packaging scope matches the approved Phase 2 plan. The receipt implementation does not satisfy the plan’s spoofed/stale receipt control or safely establish an authoritative replay source. This is a correctable implementation/design issue, not an approved scope amendment.

## Required Re-Review Scope

- Receipt provenance/trust model and marker validation
- Duplicate/conflict behavior against attacker-authored and malformed comments
- Provider lookup or trusted receipt-store integration, if changed
- Updated architecture/security/configuration documentation and tests
- Full verification suite, packaged fixtures, secret scan, dependency audit, and clean-room workflow review

## Recommended Next Action

Fix REV-006 before the Phase 2 exit gate. Do not begin Phase 3 live payout/replay/refusal acceptance until an independent re-review confirms that untrusted GitHub comments cannot suppress or alter settlement state.

## Review Sources

- Repository HEAD `887cce2`
- `PROJECT_PLAN.md`, `PROJECT_STATE.md`, `docs/ARCHITECTURE.md`, `docs/SECURITY.md`, `docs/KEEPERHUB-INTEGRATION.md`, `docs/TEST-STRATEGY.md`
- Phase 2 source and tests under `src/`, `tests/`, `.github/`, `action.yml`, and `scripts/verify-packaged.mjs`
- Local verification commands documented in the verification table
