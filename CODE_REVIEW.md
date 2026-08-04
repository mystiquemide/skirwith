# Code Review

## Review Metadata

- Project: Skirwith (formerly MergePay)
- Review date: 2026-08-04
- Reviewer: Independent Codex code reviewer
- Review target: All commits after the last approved Phase 2 revision, `f883b81..8d53201`
- Base revision: `f883b816c390c185a29121cd2ebbdee80e308257`
- Head revision: `8d532012ffbe913e8fd675f15b2ff2f8bf8e51a5`
- Review mode: Phase/release-readiness review of 24 commits
- Secondary focus: Payment replay safety, security compatibility, generated bundle integrity, Phase 3 evidence, and Phase 4 documentation
- Plan phase or checkpoint: Phase 4; state records CP-027, while HEAD also contains later Node 24, README, and demo-plan commits not recorded as a checkpoint
- Files reviewed: All 78 changed paths in the range, with detailed review of payment identity, receipt persistence/discovery, GitHub pagination, settlement retry behavior, action metadata, tests, bundle, evidence, plan, state, README, and release documentation
- Files excluded: No changed file was intentionally excluded; live third-party dashboard state and authenticated GitHub/KeeperHub behavior were not independently re-executed
- Environment: Linux workspace; Node `v22.23.2`; npm project dependencies already installed; network enabled only for the npm vulnerability audit
- Overall confidence: High for repository findings and local verification; Medium for historical live-evidence assertions that require external accounts/services

## Verdict

**Changes required.**

The reviewed range cannot be approved for release or further live payout execution. The rebrand changed the durable payment identity and receipt format without an approved amendment or a compatibility migration. Current code therefore does not recognize the repository's own previously confirmed `mergepay:` receipt and can derive a different idempotency key for the same already-paid pull request. This violates the project's primary replay-suppression requirement and creates a material duplicate-payment risk.

## Executive Summary

The pagination, receipt-save retry, committed action bundle, documentation, site, and Node 24 metadata changes are generally coherent, and all 223 automated tests pass. A clean temporary rebuild exactly matched the committed `dist/` files, packaged fixture verification passed, and `npm audit` found no vulnerabilities.

However, the tests were mechanically renamed to the new namespace and do not exercise compatibility with existing signed `mergepay:` receipts or previously issued KeeperHub idempotency keys. The live Phase 3 evidence proves such a legacy confirmed receipt exists. Because both the payment purpose and key prefix changed, replaying that paid PR under current code can take the new-payment path. The change also altered an approved security contract without the amendment required by the project plan. A second reliability defect allows a cyclic GitHub `Link` header to bypass the intended comment-page bound indefinitely.

## Scope and Limitations

This review covers the complete commit range from the last independently approved Phase 2 revision through current HEAD, rather than only the final documentation commit, because the user requested the recent commits and the range contains security-sensitive production changes.

The repository and local runtime were inspected before relying on `PROJECT_STATE.md`. Historical GitHub Actions runs, KeeperHub execution records, explorer transactions, GitHub Pages rendering, logged-out link access, responsive layout, and accessibility behavior were not independently re-run. Their documentation was checked for internal consistency only. No real funds, testnet broadcasts, service restarts, repository writes other than this report, or external publication actions were performed.

## Requirements Reviewed

- `FR-012`: resolve receipts/executions before replay broadcast and never automatically rebroadcast uncertain states.
- `BR-005`: a matching confirmed payment key returns the original proof rather than a new payment.
- `BR-006`: changed content under an existing identity must fail to manual review.
- `NFR-002`: deterministic, fail-closed execution behavior.
- Phase 3 acceptance: confirmed payout, replay suppression, refusal before broadcast, and evidence agreement.
- Phase 4 release readiness: public documentation, Node runtime migration, bundle integrity, audit, secret scan, and evidence quality.
- Amendment contract: changes to approved scope, architecture, requirements, security controls, or acceptance criteria require an approved `AMD-*` entry.
- Repository instruction: strongest proof is success, replay suppression, and refusal before broadcast.

## Verification Performed

| Check | Scope | Result | Evidence |
|---|---|---|---|
| Repository status and revisions | Branch, worktree, base, HEAD, commit range | Pass | `master` at `8d53201`, synchronized with `origin/master`; clean before report creation; base `f883b81`; 24 commits |
| Range inventory | Changed files and statistics | Pass | 78 paths; 1,915 insertions and 562 deletions |
| Format | Source/tests/config | Pass | `npm run format:check` |
| Lint | Repository | Pass | `npm run lint`, zero warnings |
| Type checking | TypeScript | Pass | `npm run typecheck` |
| Automated tests | Full Vitest suite | Pass | `npm test`: 25 files, 223/223 tests passed |
| Existing bundle load | Committed action bundle | Pass | `npm run bundle:check`: `bundle loads` |
| Packaged behavior | Committed bundle and three synthetic fixtures | Pass | `npm run verify:packaged`: confirmed, blocked, and safe-failure fixtures passed |
| Reproducible build/bundle diff | Source versus committed `dist/` | Pass | Built a copied repository under `/tmp`; `diff -rq` returned no differences |
| Dependency audit | npm dependency graph | Pass | `npm audit --audit-level=high`: 0 vulnerabilities |
| Secret-pattern scan | Tracked non-bundle files | Pass with expected placeholders | No apparent live credential/private-key match; `.env.example`, tests, and historical notes contain visibly synthetic placeholders |
| Replay compatibility trace | Current identity/receipt code versus live Phase 3 receipt | Fail | Current code accepts only `skirwith:` identity; evidence records a confirmed `mergepay:` key |
| Amendment review | Plan/state decision and deviation records | Fail | No `AMD-*` entry approves the persisted identity/config-contract change |
| Node runtime consistency | Action metadata, package engines, README | Partial | `action.yml` uses Node 24; package and README still specify Node 20/22 |
| Live external verification | GitHub/KeeperHub/explorer/Pages/logged-out UI | Not run | Requires authenticated/external service checks and potentially live execution; historical evidence only was reviewed |
| Accessibility/responsive browser review | Phase 4 landing page | Not run | No browser session was used in this review |

## Findings Summary

| Severity | Count |
|---|---:|
| Blocker | 1 |
| Critical | 0 |
| High | 1 |
| Medium | 1 |
| Low | 2 |
| Nit | 0 |
| Positive | 5 |

## Blocking Findings

## [BLOCKER] REV-014: Persisted security contracts were changed without an approved plan amendment

- Category: Plan conformance / architecture / compatibility
- Location: `PROJECT_PLAN.md:1-54`, `PROJECT_STATE.md:640-653`, `PROJECT_STATE.md:766`, `src/domain/constants.ts:1`, `src/payment/payment-key.ts:5-7`, `src/evidence/receipt.ts:44-55`, `src/github/api.ts:131-138`
- Requirement or control: The plan's amendment contract requires an approved `AMD-*` record for changes to architecture, requirements, security controls, or acceptance criteria. Stable payment identity and trusted default-branch configuration are security contracts.
- Evidence: The range mechanically renames the plan and changes `.github/mergepay.yml` to `.github/skirwith.yml`, payment purpose `mergepay:payout` to `skirwith:payout`, payment-key namespace, receipt product, and hidden marker syntax. The decision table ends at `DEC-011`, and the Plan Deviations table still says `None`; no `AMD-*` record defines migration, compatibility, rollout, or accepted duplicate-payment risk.
- Problem: The implementation changes approved, persisted interfaces after live execution without the required design/amendment process. Renaming prose in the plan does not document the original contract, migration policy, affected requirements, risks, tests, or approval.
- Impact: Review cannot establish an approved intended behavior for existing receipts/configurations or determine whether breaking compatibility and resetting payment identity were authorized. The undocumented change directly intersects replay prevention and payout safety.
- Reproduction or failure scenario: Compare `f883b81` to HEAD and inspect the decision/amendment sections. Multiple persisted identifiers change, but there is no amendment explaining how existing installations and receipts remain safe.
- Recommended correction: Complete the plan-amendment process before implementation approval. Define the canonical identity across the rename, legacy receipt/config compatibility, rollout sequence, deprecation window, provider idempotency behavior, tests, and operator recovery. Then implement that approved migration in a separate executor task.
- Verification after correction: Re-review the approved amendment and final diff; prove old and new configurations and signed receipts are handled according to the migration policy, including already-confirmed, pending-with-ID, pending-without-ID, conflicting, and forged legacy markers.
- Confidence: High
- Status: Open

## [HIGH] REV-015: Rebrand resets replay identity for already-paid pull requests

- Category: Security / financial integrity / replay suppression
- Location: `src/domain/constants.ts:1`, `src/payment/payment-key.ts:5-7`, `src/evidence/receipt.ts:44-55`, `src/evidence/receipt.ts:70-98`, `src/github/receipts.ts:78-99`, `docs/PHASE3-EVIDENCE.md:18`
- Requirement or control: `FR-012`, `BR-005`, `BR-006`, `RISK-003`, and the nonnegotiable rule to never automatically rebroadcast an uncertain or previously settled execution.
- Evidence: HEAD derives `skirwith:<sha256>` using purpose `skirwith:payout`. Receipt decoding accepts only `<!-- skirwith:... -->`, `product: "skirwith"`, and a `skirwith:` payment key. The repository's confirmed live payout evidence records payment key `mergepay:1892a75931959e8f7895aaff1fdca962392e82c5274cb5d289b6fdd16ebd2ef3`. Search found no dual-read, alias, migration, legacy-key lookup, or legacy replay test.
- Problem: The same repository, PR number, and merge SHA now produce a different identity hash because the purpose changed, as well as a different key prefix. Receipt discovery cannot decode the existing signed marker. The current run therefore sees no authoritative receipt, writes a fresh reservation under the new key, and can call KeeperHub with a new idempotency key.
- Impact: A previously paid pull request may be paid again. Blast radius includes every pre-rebrand confirmed or uncertain receipt, and financial recovery may require manual reconciliation or may be impossible.
- Reproduction or failure scenario: Use a comment containing the valid Phase 3 `mergepay:` confirmed marker and invoke current settlement for the same merged PR with otherwise eligible trusted configuration. `decodeReceiptMarker` returns `undefined`; `findByPaymentKey` returns no record; the orchestrator proceeds through simulation and new broadcast under a `skirwith:` key.
- Recommended correction: Preserve a brand-neutral immutable identity, or perform a safe migration that derives and checks all approved legacy identities before any reservation/simulation/broadcast. Verify legacy MACs without weakening authentication. Existing confirmed receipts must return duplicate proof; uncertain legacy states must fail to resume/manual review and never become a new execution.
- Verification after correction: Add regression tests using authentic synthetic legacy marker formats and old payment derivation for confirmed, pending with execution ID, pending without ID, failed/conflicting, forged, and rotated-key cases. Add a two-run packaged test proving zero provider broadcast for a legacy confirmed receipt and zero rebroadcast for legacy uncertain states.
- Confidence: High
- Status: Open

## Other Findings

## [MEDIUM] REV-016: Cyclic pagination links bypass the advertised page bound

- Category: Reliability / external response validation / denial of service
- Location: `src/github/api.ts:68-79`, `src/github/api.ts:161-188`, `src/github/receipts.ts:52-75`
- Requirement or control: Bounded external operations, fail-closed receipt discovery, safe external-response validation, and CP-023's claimed bounded pagination correction.
- Evidence: `parseNextPageLink` accepts any positive page number. `iterateComments` checks `if (page >= maxCommentPages)` but then assigns the untrusted next-page number. A response sequence whose `Link` repeatedly says `page=1`, or cycles `1 -> 2 -> 1`, never reaches the numeric limit. Tests cover later pages and exceeding monotonically increasing pages, not cycles/non-progress.
- Problem: The bound is based on page value rather than pages fetched, and visited pages are not tracked. A malformed or unexpected GitHub/proxy response can cause unbounded requests and prevent the action from reaching a safe outcome.
- Impact: The secret-bearing job can hang until an outer timeout, consume API quota, and fail availability. Receipt discovery is not deterministically bounded as claimed.
- Reproduction or failure scenario: Configure the fake transport to return a valid comment array plus `Link: <...page=1>; rel="next"` on every request. `iterateComments` continuously refetches page 1 because `page >= 10` is always false.
- Recommended correction: Count requests independently of remote page numbers, reject repeated/non-progressing pages, and fail closed once the request count reaches the configured maximum. Validate that `nextPage` is a safe integer and follows the accepted progression policy.
- Verification after correction: Add tests for self-loop, two-page cycle, decreasing page, very large page, malformed link, and exactly-at-limit termination; confirm bounded request counts and stable safe error codes.
- Confidence: High
- Status: Open

## [LOW] REV-017: Node 24 action metadata conflicts with supported development/runtime declarations

- Category: Compatibility / release documentation
- Location: `action.yml:27`, `package.json:8-10`, `README.md:182`
- Requirement or control: Release metadata and documentation must accurately describe supported runtimes.
- Evidence: `action.yml` now declares `node24`, while `package.json` permits only `^20 || ^22` and README Development says `Requirements: Node 20 or 22, npm.` Local verification ran under Node 22, not Node 24.
- Problem: The release claims a runtime that the package metadata does not support and that was not directly exercised by this review's local toolchain.
- Impact: Contributors and CI receive contradictory guidance, and Node-24-only behavior or incompatibility may escape detection.
- Reproduction or failure scenario: A release consumer sees Node 24 in action metadata, while `npm` under Node 24 can warn that the package engine is unsupported; project checks may continue to run only on Node 20/22.
- Recommended correction: Define one explicit support policy, align `engines`, README, types/tooling, and CI matrix, and execute packaged verification under the same Node major used by GitHub Actions.
- Verification after correction: Run format, lint, typecheck, full tests, clean build, bundle diff, and packaged fixtures on Node 24; also run any intentionally supported older Node versions.
- Confidence: High
- Status: Open

## [LOW] REV-018: Project state does not record the final release-preparation commits consistently

- Category: Documentation / release traceability
- Location: `PROJECT_STATE.md:54-80`, `PROJECT_STATE.md:613-632`, `PROJECT_STATE.md:760`, commits `66fd720`, `8b7edba`, `8d53201`
- Requirement or control: Repository documentation discipline requires checkpoint/state updates for implementation, security-sensitive changes, release preparation, and each work session.
- Evidence: The last checkpoint is CP-027. Later commits migrate the action runtime to Node 24, add the README, and add the demo video plan, but no CP-028 entry records their changed files, checks, deviations, risk, or next action. The Current Status section also retains a stale `Not Started` subsection despite Phase 3 completion and Phase 4 progress.
- Problem: Release history and claimed verification lag behind HEAD, weakening the state file as an auditable handoff.
- Impact: A future executor/reviewer can mistake unverified work for checkpoint-approved work and cannot trace whether Node 24 or final documentation checks were performed.
- Reproduction or failure scenario: Read the checkpoint log and compare it with the final three commits; no state entry covers them.
- Recommended correction: In a separate documentation execution task, append the required checkpoint with exact verification evidence and update status headings without rewriting historical facts. Do not claim Node 24 verification unless actually run.
- Verification after correction: Confirm every post-CP-027 commit is covered by a checkpoint or explicitly scoped follow-up, and reproduce every command claimed in that entry.
- Confidence: High
- Status: Open

## Positive Practices

- The receipt-save retry is limited to persistence operations and does not retry broadcast; injected sleeping keeps tests deterministic.
- Reservation-first ordering and post-broadcast manual-review behavior remain explicit in the orchestrator and covered by cross-run tests.
- Comment receipt writes authenticate existing markers before updating, preserving protection against forged comment squatters.
- The committed `dist/` bundle exactly matches a clean rebuild from HEAD.
- The test suite, lint, formatting, type checking, packaged fixtures, and dependency audit all pass at the reviewed revision.

## Security Review

Authentication boundaries, signed receipt verification, trusted default-branch configuration loading, policy-before-broadcast ordering, simulation/broadcast parity, secret redaction, and no-checkout workflow design were inspected. No apparent hardcoded live secret was found. Existing code continues to authenticate receipt markers and refuses to edit forged comments.

Release approval is nevertheless blocked because replay protection is a security and financial-integrity boundary, and the namespace/purpose migration bypasses it for historical receipts. The passing tests establish safety only for receipts created entirely within the new namespace.

## Test and Evidence Review

The suite is deterministic and broad for current-format behavior, with 223 passing tests. New tests cover transient receipt-save retry and paginated discovery. Packaged fixtures prove current success, refusal, and safe failure paths.

Missing evidence is material:

- No backward-compatibility test loads a signed `mergepay:` receipt into current code.
- No test proves the payment identity remains stable across the product rename.
- No cyclic/non-progressing pagination test proves the maximum request count.
- No local Node 24 verification was available; checks ran on Node 22.
- Historical live evidence was not independently re-executed, and three formerly pending receipts are documented as reconciled by maintainer notes rather than rewritten action receipts.

## Code Quality and Maintainability

The production changes generally preserve injected interfaces, pure domain logic, stable errors, and focused modules. The rename is mechanically consistent inside current source and tests, but that consistency concealed the missing compatibility boundary. Persisted identifiers should not be coupled to mutable branding without an explicit versioned migration strategy.

## Performance and Reliability

Receipt-save retry is bounded to three attempts with short linear backoff. Comment discovery attempts to cap reads at ten pages and stops early on a match, which is appropriate in principle. REV-016 must be corrected because the actual request count is not bounded when the remote next-page value cycles.

No representative performance benchmark was required by the plan or run. No unbounded production loop was otherwise identified in the reviewed changes.

## Compatibility and Operations

The action bundle is reproducible and loads successfully. The rename changes the trusted config filename, environment/documentation naming, receipt serialization, idempotency namespace, and payment purpose. These are breaking operational contracts and need a rollout/migration plan. Node runtime declarations also need alignment and verification on Node 24.

Rollback is especially sensitive: code rollback after new-format receipts exist, or forward deployment while old-format receipts exist, can make one generation invisible to the other. Any correction must define dual-read/write or a clearly safe staged transition.

## Plan Conformance

Phase 3 acceptance evidence is documented and the current range adds expected Phase 4 artifacts. The implementation violates plan conformance by altering replay/security identity and trusted config contracts without an `AMD-*` amendment. Mechanically replacing the product name in `PROJECT_PLAN.md` does not satisfy the amendment protocol and obscures the historical contract that produced the live evidence.

## Required Re-Review Scope

Re-review is required for:

1. The approved amendment governing the MergePay-to-Skirwith migration.
2. All payment identity, purpose, receipt parsing/signing, receipt lookup, configuration filename, and rollout changes.
3. Legacy/current regression tests and the rebuilt committed bundle.
4. Pagination request-count/cycle handling and its adversarial tests.
5. Node 24 metadata, CI/runtime evidence, README, and state checkpoint updates.
6. Full release preflight: format, lint, typecheck, focused and full tests, clean build, bundle diff, packaged fixtures, dependency audit, secret scan, and logged-out external evidence-link checks.

Approval, if later granted, applies only to the newly reviewed revision. Any additional production or generated-bundle change requires affected-scope re-review.

## Recommended Next Action

Pause live payout/replay runs and release publication at `8d53201`. First approve a formal migration amendment that preserves historical replay identity. Then have an executor implement and test legacy compatibility plus bounded pagination, align Node 24 declarations, rebuild `dist/`, and update project state. Return the complete final diff and reproducible verification evidence for independent re-review.

## Review Sources

- Repository at `8d532012ffbe913e8fd675f15b2ff2f8bf8e51a5`
- Diff and commit history for `f883b816c390c185a29121cd2ebbdee80e308257..8d532012ffbe913e8fd675f15b2ff2f8bf8e51a5`
- `PROJECT_PLAN.md`
- `PROJECT_STATE.md`
- `AGENTS.md`
- `docs/PHASE3-EVIDENCE.md`
- Source, tests, package metadata, action metadata, README, generated bundle, and Phase 4 documentation in the reviewed range
- Reproducible local commands listed in Verification Performed
