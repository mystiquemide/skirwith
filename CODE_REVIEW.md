# Code Review

## Review Metadata

- Project: Skirwith
- Review date: 2026-08-04
- Reviewer: Independent Codex code reviewer
- Review target: Remediation and release commits `8d53201..c28b572`
- Base revision: `8d532012ffbe913e8fd675f15b2ff2f8bf8e51a5`
- Head revision: `c28b5727d8c13082d4227941a3a155fa7130e003`
- Review mode: Security-remediation re-review and release-readiness review
- Secondary focus: Legacy replay compatibility, pagination bounds, Node 24 alignment, tagged bundle integrity, plan conformance, and submission evidence
- Plan phase or checkpoint: Phase 4; `PROJECT_STATE.md` identifies CP-028
- Files reviewed: All 23 paths changed in the target range, with detailed review of production source, tests, generated bundle, CI/runtime metadata, README, site, submission archive, plan/state records, release tag, and action examples
- Files excluded: Live KeeperHub execution was not repeated; the pending demo video could not be reviewed because it does not exist yet
- Environment: Linux; local Node `v22.23.2`; npm dependencies installed; network used only for dependency audit
- Overall confidence: High for code, tests, bundle, and repository findings; Medium for external release evidence

## Verdict

**Changes required.**

The implementation corrections for legacy replay safety and bounded pagination are effective and close the previous High and Medium code findings. The tagged `v0.1.0` production source and bundle match HEAD, and all reproduced checks pass.

Release/submission approval is still withheld because the mandatory amendment protocol has not been followed and the required demo video is explicitly pending. The tagged code is technically stronger, but the release gate defined by the approved plan is not complete.

## Executive Summary

Current code derives and checks the exact pre-rebrand `mergepay:payout` identity after a current-key miss. Authenticated legacy receipts now resolve as duplicate, resume-poll, or manual review without a new simulation or broadcast. Tests cover confirmed, pending-with-execution-ID, conflicting, and absent legacy receipts. Comment pagination now counts requests and detects cycles. Node 24 is aligned across the action, CI, `.nvmrc`, package engines, and README.

The local suite passes 235/235 tests, the committed bundle matches a clean temporary rebuild, packaged fixtures pass, and the tagged bundle hash equals HEAD. Dependency audit reports zero vulnerabilities.

Two release blockers remain. First, `PROJECT_STATE.md` requires an `AMD-[number]` amendment with defined fields, but the migration is recorded only as CP-028 and DEC-012 while the Plan Deviations table still says `None`. Second, `docs/SUBMISSION.md` records the mandatory demo video as `PENDING`. The final post-tag documentation commits are also not covered by a new checkpoint.

## Scope and Limitations

This re-review focuses on whether the prior findings REV-014 through REV-018 were corrected and whether the new tagged revision is ready for hackathon submission. It reviews the complete remediation range rather than trusting commit messages or `PROJECT_STATE.md` claims.

No real payout, KeeperHub dashboard lookup, GitHub Actions rerun, browser accessibility test, video review, submission-form review, commit, push, deployment, or release mutation was performed. The locally available runtime is Node 22; Node 24 configuration was inspected, but a local Node 24 process was unavailable.

`ELITE_HACKATHON_AUDIT.md` was already present as an untracked audit artifact and was not modified during this review.

## Requirements Reviewed

- `FR-012`, `BR-005`, and `BR-006`: replay resolution before broadcast and no automatic rebroadcast.
- `SC-002`: a replay produces no second transaction.
- `SC-004`: evidence integrity and agreement.
- `NFR-002`: deterministic fail-closed behavior.
- CP-028 migration acceptance criteria.
- Amendment contract requiring an `AMD-[number]` entry after execution begins.
- Phase 4 exit requirements: release tag, matching bundle, logged-out links, demo video, and archived submission.
- Repository rules requiring format, lint, typecheck, focused/full tests, build, bundle diff, audit, and secret scan.

## Verification Performed

| Check | Scope | Result | Evidence |
|---|---|---|---|
| Repository/revision inspection | Branch, target range, tag, status | Pass | HEAD `c28b572`; tag `v0.1.0` resolves to `594bcb9`; five commits in range |
| Diff review | All changed production, test, generated, CI, and documentation paths | Pass | 23 changed paths inspected |
| Format | Source/tests/config | Pass | `npm run format:check` |
| Lint | Repository | Pass | `npm run lint`, zero warnings |
| Type checking | TypeScript | Pass | `npm run typecheck` |
| Full tests | Vitest | Pass | 25 test files; 235/235 tests passed |
| Legacy confirmed receipt | Replay protection | Pass | Test resolves duplicate with zero provider calls |
| Legacy pending receipt | Recovery | Pass | Test resumes existing execution without broadcast |
| Legacy conflicting receipt | Integrity | Pass | Test resolves to manual review without provider calls |
| Missing legacy/current receipt | New-payment path | Pass | Test confirms new payment still uses `skirwith:` identity |
| Pagination cycle | Bounded external calls | Pass | Cycle test fails closed within configured request cap |
| Existing bundle | Loadability | Pass | `npm run bundle:check` |
| Packaged fixtures | Committed bundle | Pass | Confirmed, blocked, and safe-failure fixtures passed |
| Clean rebuild/bundle diff | HEAD source versus committed `dist/` | Pass | Temporary-copy build produced no `dist/` differences |
| Tag versus HEAD production artifact | `v0.1.0` source/bundle versus HEAD | Pass | No source/runtime/bundle diff; `dist/index.js` SHA-256 matches |
| Dependency audit | npm graph | Pass | `npm audit --audit-level=high`: zero vulnerabilities |
| Node 24 declarations | Action, CI, engines, `.nvmrc`, README | Pass structurally | All now declare/support Node 24 |
| Node 24 execution | Runtime verification | Not available | Local environment provides Node 22 only |
| Amendment protocol | Plan/state governance | Fail | No `AMD-[number]` entry; DEC-012 used instead; deviations table remains `None` |
| Demo video | Required submission artifact | Fail | `docs/SUBMISSION.md:7` says `PENDING` |
| Live submission/browser verification | Video, submission page, interactive UI | Not run | Required artifacts/access unavailable |

## Findings Summary

| Severity | Count |
|---|---:|
| Blocker | 2 |
| Critical | 0 |
| High | 0 |
| Medium | 0 |
| Low | 1 |
| Nit | 0 |
| Positive | 6 |

## Blocking Findings

## [BLOCKER] REV-014: Required AMD amendment is still absent

- Category: Plan conformance / release governance
- Location: `PROJECT_STATE.md:634-670`, `PROJECT_STATE.md:672-676`, `PROJECT_STATE.md:788`
- Requirement or control: The approved checkpoint contract requires plan changes after execution begins to use an `AMD-[number]` amendment stating the original plan, proposed change, evidence, reason, affected requirements/phases/tests/cost/risks, approval status, and corresponding state entry.
- Evidence: CP-028 line 649 calls DEC-012 an “Approved migration amendment,” and DEC-012 records the technical decision. No `AMD-[number]` section exists. The Plan Deviations table still contains only `None`. Repository search for `AMD-[0-9]+` finds only the protocol text.
- Problem: A decision record and checkpoint do not satisfy the repository's explicit amendment schema. The migration was implemented and tagged without the required traceable approval artifact.
- Impact: The reviewer cannot verify who approved the breaking persisted-contract change, its original/proposed scope, rollout/deprecation window, affected costs and risks, or whether the plan was formally amended before release.
- Reproduction or failure scenario: Search `PROJECT_STATE.md` and `PROJECT_PLAN.md` for a numbered AMD entry. Only DEC-012 and a prose amendment claim exist.
- Recommended correction: Record a properly numbered amendment through the authorized planning/governance workflow. Include every required field, approval status, legacy compatibility duration, rollback behavior, affected requirements, tests, operational risks, and corresponding checkpoint. Do not retroactively label an ordinary decision as the required AMD artifact.
- Verification after correction: Re-review the complete AMD entry against the implementation and confirm its status is explicitly approved, the deviations/amendments index is consistent, and the release revision incorporates the approved contract.
- Confidence: High
- Status: Open

## [BLOCKER] REV-019: Required demo video is still missing

- Category: Submission completeness / presentation evidence
- Location: `docs/SUBMISSION.md:3-18`, `docs/DEMO_VIDEO_PLAN.md:1-139`, `PROJECT_STATE.md:49-52`
- Requirement or control: Phase 4 and hackathon submission require a public demo video under three minutes, matching the verified release revision.
- Evidence: `docs/SUBMISSION.md:7` explicitly records `Demo video under three minutes: PENDING`. The repository contains a video plan but no video URL or recorded artifact.
- Problem: A script is not reproducible presentation evidence. The reviewer cannot verify duration, legibility, secret exposure, narration accuracy, release/tag correspondence, or whether replay and refusal proof are actually shown.
- Impact: The hackathon submission is incomplete and cannot pass its own release gate. Judges cannot assess the intended demonstration.
- Reproduction or failure scenario: Follow the required links section in `docs/SUBMISSION.md`; the video item has no URL and remains pending.
- Recommended correction: Record and publish the demo against the exact tagged/reviewed revision. Show the KeeperHub execution ID, explorer Transfer event, replay with no second transaction, refusal before broadcast, and the testnet/self-payment disclosure. Record the immutable video URL and exact release SHA in the submission archive.
- Verification after correction: Check the video logged out; verify duration under three minutes, readable identifiers, correct claims, no secrets, agreement with repository/evidence/tag, and working submission link.
- Confidence: High
- Status: Open

## Other Findings

## [LOW] REV-020: Post-tag release documentation is not captured by a checkpoint

- Category: Documentation / release traceability
- Location: `PROJECT_STATE.md:1-8`, `PROJECT_STATE.md:634-653`, commits `b1a9c71` and `c28b572`
- Requirement or control: Project state requires checkpoint updates after release preparation and each work session.
- Evidence: Current checkpoint remains CP-028, whose next action is to rebuild, tag, pin references, record the video, and submit. Subsequent commits pin action references and archive link-check results, but no CP-029 records these completed operations, commands, limitations, or remaining video blocker.
- Problem: The state file stops before the final two documentation/release-preparation commits.
- Impact: Future reviewers cannot distinguish independently reproduced release evidence from unreviewed documentation claims, and the reported “current checkpoint” is stale.
- Reproduction or failure scenario: Compare CP-028's next action with commits after tag `594bcb9`; completed work is not represented in a later checkpoint.
- Recommended correction: Through the authorized documentation workflow, append a checkpoint covering the tag, pinned references, link checks, exact commands/results, remaining video/submission blocker, and next action.
- Verification after correction: Confirm every post-CP-028 commit is represented and all claimed checks are reproducible without contradicting the submission archive.
- Confidence: High
- Status: Open

## Closed Prior Findings

- **REV-015 High — Closed:** The current orchestrator checks the legacy identity derived with `mergepay:payout`; confirmed receipts become duplicates, pending receipts resume, conflicts become manual review, and none rebroadcast.
- **REV-016 Medium — Closed:** Pagination now has an independent request counter and visited-page cycle detection, with adversarial test coverage.
- **REV-017 Low — Closed for configuration:** Node 24 is aligned across action metadata, CI, `.nvmrc`, package engines, and README. Direct local Node 24 execution remains an explicitly unavailable check, not a code inconsistency.
- **REV-018 Low — Superseded by REV-020:** CP-028 now records the main remediation, but subsequent release documentation still lacks its own checkpoint.

## Positive Practices

- The legacy migration preserves historical receipts rather than rewriting protected evidence.
- Legacy receipt MAC verification remains required before any receipt is authoritative.
- Legacy confirmed, pending, conflict, and new-payment paths have meaningful behavioral assertions, including provider-call counts.
- Pagination is now bounded by requests rather than trusting remote page numbers.
- The committed and tagged bundle exactly matches the reviewed production source.
- Public documentation now distinguishes on-chain confirmation from receipt status and discloses testnet self-payment evidence.

## Security Review

The prior duplicate-payment vulnerability is corrected. The lookup order is current identity first and legacy identity second. Both paths authenticate signed receipt markers. A legacy match is resolved using the matching legacy request hash, preventing a historical receipt from being treated as absent or compared against the wrong purpose. Uncertain legacy states do not become new executions.

No new authentication, authorization, secret-handling, injection, or supply-chain defect was identified in the remediation. Canonical `SKIRWITH_RECEIPT_SECRET` naming retains legacy environment-variable fallback during migration, with canonical values taking precedence.

## Test and Evidence Review

The reproduced suite reports 235 tests, two more than the 233 claimed in CP-028. This is consistent with subsequent test additions and is not a failure, but the state evidence is stale. Tests meaningfully cover the corrected security paths rather than merely checking parsing.

The packaged verification still covers only current-format fixtures; legacy behavior is proven at source-level orchestration and receipt-store layers rather than by executing `dist/index.js` against a legacy action fixture. Because the rebuilt bundle exactly matches source, this is acceptable for the remediation gate, though a packaged legacy fixture would strengthen release evidence.

## Code Quality and Maintainability

The migration is narrowly implemented through a legacy-purpose constant, a dedicated legacy-key derivation function, dual receipt parsing, and a second receipt lookup. It preserves the primary current-format path and adds only one lookup on a current-key miss. The comments explain the security rationale.

The amendment/documentation gaps are process issues rather than implementation-quality defects.

## Performance and Reliability

New payments incur the legacy receipt lookup only after the current receipt lookup misses. This is bounded and acceptable for a GitHub Action. Receipt scanning is capped by request count and rejects repeated page numbers, closing the prior unbounded-loop condition.

No material new performance regression was found.

## Compatibility and Operations

The release supports both canonical `SKIRWITH_RECEIPT_SECRET` variables and legacy `MERGE_PAY_RECEIPT_SECRET` variables. Existing live receipt markers remain readable and authenticated. New writes use Skirwith identity.

Tag `v0.1.0` points to `594bcb928ed0fb40df1845263e17ce62ead6c8bc`. Production source, action metadata, CI/runtime metadata, and `dist/` do not differ between that tag and HEAD. Later commits change only release documentation and pinned references.

## Plan Conformance

The technical implementation conforms to replay and fail-closed requirements. Formal plan conformance remains incomplete because the repository explicitly requires a numbered AMD artifact and none exists. Release completeness also fails because the demo-video acceptance artifact is pending.

## Required Re-Review Scope

Re-review only the following unless production code changes again:

1. The numbered, approved AMD migration artifact and its plan/state indexes.
2. The new checkpoint covering tag creation, pinned references, link checks, and remaining submission status.
3. The published demo video and final submission URL, checked logged out against the exact tagged revision.
4. Any production source, test, action metadata, generated bundle, or tag change made after this review.

If no production or bundle code changes, the legacy compatibility and pagination implementation do not need another full design review.

## Recommended Next Action

Do not retag or change production code solely for this review. Complete the required AMD governance record, append the missing release checkpoint, record the demo against `v0.1.0`, publish its URL, and archive the final submission. Then request a narrow documentation/evidence re-review.

## Review Sources

- Repository at `c28b5727d8c13082d4227941a3a155fa7130e003`
- Remediation range `8d532012ffbe913e8fd675f15b2ff2f8bf8e51a5..c28b5727d8c13082d4227941a3a155fa7130e003`
- Release tag `v0.1.0` at `594bcb928ed0fb40df1845263e17ce62ead6c8bc`
- `PROJECT_PLAN.md`, `PROJECT_STATE.md`, `AGENTS.md`
- Production source, tests, generated bundle, action/CI metadata, README, site, examples, submission archive, and demo plan
- Reproducible commands and results listed under Verification Performed
