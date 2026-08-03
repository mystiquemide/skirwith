# Code Review

## Review Metadata

- Project: MergePay
- Review date: 2026-08-03 (Africa/Lagos)
- Reviewer: Independent Codex review
- Review target: Fresh re-review of CP-010 fixes for Phase 1 exit gate (CP-011)
- Base revision: `46b8825946a8935ccb22f47a5d9aa10f8bf4e103`
- Head revision: `4554773` (`fix: address Phase 1 review findings REV-001 through REV-004`)
- Review mode: Checkpoint re-review
- Secondary focus: Payment correctness, security, reliability, test evidence, release readiness
- Plan phase or checkpoint: Phase 1 — Foundation and contract freeze / CP-011
- Files reviewed: HEAD diff, affected source/tests/docs, `PROJECT_PLAN.md`, `PROJECT_STATE.md`, repository instructions, and current working-tree state
- Files excluded: Phase 2 GitHub/provider execution (not implemented); live KeeperHub evidence was not replayed
- Environment: Node.js/npm workspace `/home/mide/mergepay`, branch `master`; untracked nested `mergepay/` directory remains present
- Overall confidence: High for corrected contracts and local verification; Medium for dependency vulnerability status because npm registry access failed

## Verdict

**Approve with non-blocking findings.** The prior High findings REV-001 and REV-002 and Medium finding REV-003 are materially corrected, covered by new tests, and the corrected Phase 1 contracts now satisfy the reviewed acceptance criteria. The Phase 1 exit gate is approved for this revision only. Phase 2 remains outside this approval and requires its own review before execution or broadcast behavior is accepted.

One Low finding remains: the untracked nested `mergepay/` directory reduces clean-checkout confidence. The dependency audit and dedicated secret scan were not independently reproducible in this environment.

## Executive Summary

The corrected implementation separates stable payment identity from canonical request content hash, making same-key/different-hash conflict detection representable. Decimal inputs are converted to atomic units using token decimals with excess precision rejected, and canonical request construction now validates runtime invariants with stable safe errors. The added tests cover these prior failure modes. Independent verification reproduced 90 passing tests, clean format/lint/typecheck, successful build, and bundle loading.

The approval is limited to the Phase 1 foundation contracts. The action entrypoint remains a placeholder, and no GitHub trust-boundary, KeeperHub simulation/broadcast, replay lookup, polling, redaction, or live acceptance behavior is approved by this review.

## Scope and Limitations

This review compares the previous reviewed head `46b8825` with current HEAD `4554773`, while also inspecting all affected callers and contract documentation. The untracked nested `mergepay/` tree was not treated as source for the reviewed revision.

`npm audit --audit-level=high` again failed with `EAI_AGAIN registry.npmjs.org`; no clean audit result is claimed. A local secret-pattern search found no apparent live credential, but no dedicated secret-scanning product was available. Bundle build/load passed; a formal source-to-bundle diff check was not available.

## Requirements Reviewed

- FR-003 through FR-007, especially stable payment identity, canonical request hashing, and changed-content conflict detection.
- NFR-003 and NFR-004: pure domain logic, strict TypeScript, reproducible toolchain.
- BR-001 through BR-007, especially amount caps, atomic values, replay, and conflict behavior.
- Phase 1 acceptance criteria and CP-010 remediation requirements for REV-001 through REV-004.

## Verification Performed

| Check | Scope | Result | Evidence |
|---|---|---|---|
| Revision/diff review | `46b8825..4554773` and affected callers/docs | Pass | Corrective commit inspected; 20 tracked paths changed, including tests and contract docs |
| Format | Configured source/test/config files | Pass | `npm run format:check` |
| Lint | Repository | Pass | `npm run lint -- --max-warnings 0` via package script |
| Typecheck | TypeScript project | Pass | `npm run typecheck` |
| Full tests | Eight Vitest files | Pass | 90/90 tests passed |
| Build | NCC action bundle | Pass | `npm run build` |
| Bundle load | Generated bundle | Pass | `npm run bundle:check`: bundle loads |
| Dependency audit | npm advisory service | Unavailable | Registry DNS failure `EAI_AGAIN` |
| Secret scan | Local pattern search | Limited pass | No apparent live secret; dedicated scanner unavailable |
| Payment identity regression | Stable key vs changed content | Pass | Tests prove same key with changed amount/recipient/chain/token and different canonical hashes; identity changes alter key |
| Decimal regression | Atomic conversion/cap boundary | Pass | Tests cover token precision, >18-digit scales, malformed values, and over-cap comparison |
| Canonical validation regression | Runtime malformed inputs | Pass | 21 canonical-request tests; invalid fields return `CANONICAL_REQUEST_INVALID` |
| Repository hygiene | Working tree | Finding remains | Untracked nested `mergepay/` directory is still present |

## Findings Summary

| Severity | Count |
|---|---:|
| Blocker | 0 |
| Critical | 0 |
| High | 0 |
| Medium | 0 |
| Low | 1 |
| Nit | 0 |
| Positive | 4 |

## Blocking Findings

None.

## Other Findings

## [LOW] REV-005: Untracked nested project copy remains in the workspace

- Category: Repository hygiene / release risk
- Location: `mergepay/` (untracked directory)
- Requirement or control: SC-006 clean checkout, NFR-004 reproducibility
- Evidence: `git status --short --branch` still reports `?? mergepay/`; the directory contains a duplicate project tree.
- Problem: Two visible project roots can cause commands or future edits to target a different copy from the reviewed repository and can complicate release packaging.
- Impact: Limited immediate runtime impact because the directory is untracked, but it reduces operator confidence and leaves the working tree non-clean.
- Reproduction or failure scenario: Running npm or editing source from `/home/mide/mergepay/mergepay` can produce green results that do not affect the tracked root.
- Recommended correction: Determine whether the directory is user-owned work; if not, remove or relocate it through an authorized recoverable operation. Do not delete it automatically.
- Verification after correction: `git status --short --branch` is clean and all commands run from the intended repository root.
- Confidence: High
- Status: Open

## Positive Practices

- Stable `PaymentIdentity` and separate canonical request hash now correctly support same-key/different-hash conflict detection.
- Atomic-unit conversion is explicit, integer-based, and tied to configured token precision; no floating-point arithmetic is used.
- Canonical request construction is a fail-closed runtime validation boundary with stable public error code `CANONICAL_REQUEST_INVALID`.
- Remediation included focused regression tests and updated architecture/security/configuration/test documentation.

## Security Review

The corrected Phase 1 code performs no network calls, signing, secret access, or broadcast. The prior replay/conflict design flaw is resolved in the reviewed scope. Amount precision and cap enforcement now fail closed before policy approval. Runtime canonical input validation reduces the risk of malformed payment identities entering later provider paths.

Provider/API error redaction, trusted GitHub state loading, no-checkout secret isolation, simulation parity, idempotency lookup, polling, and no-rebroadcast behavior remain Phase 2 controls and are not approved here.

## Test and Evidence Review

The new tests directly exercise the prior findings rather than only mirroring implementation. Coverage now includes material-content changes with stable identity, identity changes with different keys, precision rejection, high-scale conversion, over-cap comparison, and malformed canonical fields. The final local suite is deterministic and passed 90 tests.

The `PROJECT_STATE.md` claim of a zero-vulnerability audit was not independently reproducible because the npm advisory endpoint was unavailable; this remains an evidence limitation, not a code finding against the corrected contracts.

## Code Quality and Maintainability

The corrected design preserves clear pure-domain boundaries and documents the key architectural decision. Error handling is stable and safe for canonical validation. The decimal API now has a single clear purpose (`toAtomicUnits`) instead of a scale-limited generic comparator.

## Performance and Reliability

No material performance regression was observed. BigInt conversion is bounded by configured token precision and avoids floating-point ambiguity. Phase 2 timeout, retry, polling, and uncertain-outcome controls remain unimplemented and require separate review.

## Compatibility and Operations

The Node/TypeScript/ESM/npm/Vitest/ESLint/Prettier/NCC stack remains aligned with the plan. Build and bundle load pass. Formal dependency audit, dedicated secret scan, and bundle-diff evidence remain required before release-level approval.

## Plan Conformance

The corrected implementation conforms to the reviewed Phase 1 requirements and the remediation decisions recorded in CP-010. No unapproved architecture expansion was observed. Phase 2 must not be considered approved by this report.

## Required Re-Review Scope

For this Phase 1 gate, no further re-review is required unless the corrected contract files change. Before Phase 2 approval, review the full GitHub/provider execution path, including trusted default-branch loading, event re-fetch, simulation/broadcast parity, provider idempotency, duplicate/conflict lookup, bounded polling, redaction, evidence, and no-broadcast behavior.

## Recommended Next Action

Phase 1 may close its contract-review gate for revision `4554773`. Resolve or explicitly quarantine the nested `mergepay/` directory, obtain reproducible dependency-audit and secret-scan evidence, then proceed to Phase 2 implementation under a new review scope. Do not claim live execution or broadcast readiness from this Phase 1 approval.

## Review Sources

- Repository HEAD `4554773`
- Prior review baseline `46b8825` and `CODE_REVIEW.md`
- `PROJECT_PLAN.md`, `PROJECT_STATE.md`, `docs/TASKS.md`, `docs/ARCHITECTURE.md`, `docs/SECURITY.md`, `docs/CONFIGURATION.md`, `docs/TEST-STRATEGY.md`
- Corrected Phase 1 source, tests, package/toolchain files, and current working-tree state
