# Code Review

## Review Metadata

- Project: MergePay
- Review date: 2026-08-03 (Africa/Lagos)
- Reviewer: Independent Codex review
- Review target: Phase 1 exit gate (CP-009), full Phase 1 implementation diff
- Base revision: `20b6fa213cba` (`docs: add MergePay planning package`)
- Head revision: `46b8825946a8935ccb22f47a5d9aa10f8bf4e103`
- Review mode: Checkpoint review
- Secondary focus: Security, payment correctness, reliability, plan conformance, release risk
- Plan phase or checkpoint: Phase 1 — Foundation and contract freeze / CP-009
- Files reviewed: All 30 files changed in `20b6fa2..46b8825`, relevant plan/tasks/security/config/test documentation, and affected source/test callers
- Files excluded: Provider/action behavior planned for Phase 2; live KeeperHub evidence was not independently replayed; untracked nested `mergepay/` tree was inspected only as repository-hygiene risk
- Environment: Node.js/npm workspace at `/home/mide/mergepay`; branch `master`; tracked HEAD equals `origin/master`; an untracked nested `mergepay/` directory is present
- Overall confidence: High for the Phase 1 code and tests; Medium for dependency vulnerability status because the live audit endpoint was unavailable

## Verdict

**Changes required.** Phase 1 must not pass its contract-freeze exit gate and Phase 2 should not begin on this revision. Two High-severity contract defects undermine replay/conflict safety and amount-cap enforcement, and one Medium-severity boundary-validation defect leaves the supposedly canonical payment identity open to malformed values.

Approval, if later granted, applies only to the reviewed Phase 1 scope and revised commit. Any affected contract or test change requires re-review.

## Executive Summary

The implementation has a good pure-domain structure, deterministic policy decisions, deny-by-default configuration parsing, stable public reason codes, and a reproducible test/build baseline. The independent run reproduced 62 passing tests plus clean formatting, lint, typecheck, build, and bundle load.

However, the payment key is the hash of the entire canonical request. That means changed payment content necessarily creates a different key, so the system cannot detect “changed content under the same key” as required by FR-007 and BR-006. Separately, decimal comparison pads to 18 places without constraining or correctly aligning longer fractional strings, allowing an amount greater than its maximum to be accepted. The config permits up to 77 token decimals and documents bounded precision, but it enforces no amount precision bound. Canonical request construction also coerces addresses and other fields without validation, contrary to the frozen boundary contract.

`PROJECT_STATE.md` was read only after the initial repository/code assessment. Its verification claims were then compared with independent checks. Most local claims reproduced; `npm audit` did not, due unavailable registry DNS.

## Scope and Limitations

The target was inferred from repository state and `PROJECT_STATE.md`: CP-009 requests an independent review of the full Phase 1 diff before Phase 2. The review compared the planning-only baseline `20b6fa2` with current HEAD `46b8825`, not merely the latest CP-008 commit.

No production code, tests, plan, state, commits, external systems, or protected evidence were modified. This report is the sole created review artifact.

Limitations:

- Live KeeperHub authentication, wallet funding, simulation evidence, provider documentation, and hackathon facts recorded for Phase 0 were not independently replayed; they are not necessary to establish the Phase 1 code findings.
- `npm audit --audit-level=high` attempted network access but failed with `EAI_AGAIN registry.npmjs.org`; dependency vulnerability status therefore remains unverified in this review.
- No dedicated repository secret-scanning product was available. A local pattern search found only documented placeholders and provider references, not an apparent credential.
- The untracked nested `mergepay/` directory duplicates the project and is outside the tracked revision. It was not treated as implementation source, but it affects clean-checkout/release confidence.

## Requirements Reviewed

- FR-003 through FR-007: validated trusted configuration, deterministic policy, canonical request/hash, stable payment key, and changed-content conflict detection.
- NFR-003 and NFR-004: pure domain logic, strict/injectable boundaries, reproducible toolchain and verification.
- BR-001 through BR-007, especially BR-004 through BR-006 for parity, replay, and changed-request conflict behavior.
- Phase 1 acceptance criteria: malformed/unsafe config fails, policy is deterministic, canonical identity is stable, foundation gates pass, and contracts/tests are fit to freeze.
- Repository rules: decimal strings at config boundaries, atomic-unit strings internally, addresses validated/normalized once, stable safe errors, TDD, and no unsupported scope expansion.

## Verification Performed

| Check | Scope | Result | Evidence |
|---|---|---|---|
| Repository status/revisions | Branch, HEAD/base, tracked/untracked state | Pass with hygiene concern | `master` at `46b8825`, equal to `origin/master`; untracked `mergepay/` tree present |
| Full Phase 1 diff | `20b6fa2..46b8825` | Reviewed | 30 files, 5,580 insertions, 19 deletions |
| Format | Configured source/test/config patterns | Pass | `npm run format:check`: all matched files formatted |
| Lint | Repository | Pass | `npm run lint`: zero warnings/errors |
| Typecheck | TypeScript project | Pass | `npm run typecheck`: clean |
| Full tests | Seven Vitest files | Pass, but missing required adversarial cases | 62/62 tests passed |
| Build | NCC action bundle | Pass | `npm run build`; bundle generated successfully |
| Bundle load | Generated `dist/index.js` | Pass | `npm run bundle:check`: `bundle loads` |
| Dependency audit | npm advisory service | Unavailable | Registry request failed with `EAI_AGAIN`; no audit conclusion drawn |
| Dependency tree | Direct and depth-1 transitive packages | Pass as inventory only | `npm ls --all --depth=1` completed; this is not a vulnerability audit |
| Secret pattern search | Workspace text excluding `.git`, `node_modules`, `dist` | Pass with limitation | No apparent live secret; documented `kh_replace_me` placeholder only |
| Decimal boundary reproduction | Fractional precision above 18 places | Fail | Comparator reports `0.000000000000000001` does not exceed `0.0000000000000000001` |
| Payment identity review | Key/hash behavior and tests | Fail | Key changes whenever request hash changes, preventing same-key changed-content conflict |

## Findings Summary

| Severity | Count |
|---|---:|
| Blocker | 0 |
| Critical | 0 |
| High | 2 |
| Medium | 1 |
| Low | 1 |
| Nit | 0 |
| Positive | 4 |

## Blocking Findings

## [HIGH] REV-001: Payment key cannot detect changed content under a stable payment identity

- Category: Correctness / replay safety / plan conformance
- Location: `src/payment/payment-key.ts:1-6`; `tests/payment/payment-identity.test.ts:67-82`
- Requirement or control: FR-007, BR-005, BR-006, `docs/SECURITY.md` stable-key plus request-hash comparison, Phase 1 contract-freeze gate
- Evidence: `derivePaymentKey()` returns `mergepay:${hashCanonicalRequest(request)}`. Tests explicitly require the key to change when `pullRequestNumber` changes. Any material request change also changes the hash and therefore the key.
- Problem: The design collapses two distinct identifiers—stable payment identity and request-content hash—into one value. There can never be a matching key with changed canonical content, so the mandated conflict state is unrepresentable. A changed amount, recipient, token, or other field appears to be a new payment rather than a conflict for the original PR/payment identity.
- Impact: Phase 2 replay resolution can fail to recognize tampered or changed payment content and may treat it as an independent payment candidate. This defeats a load-bearing duplicate-payment control and could enable multiple broadcasts for one intended payout if upstream trusted configuration changes or inconsistent reconstruction occurs.
- Reproduction or failure scenario: Build request A for repository/PR/merge identity with amount `2500000`; build request B for the same intended payout identity with amount `2500001`. `derivePaymentKey(A) !== derivePaymentKey(B)`, so no lookup under a common key can compare `hash(A)` with `hash(B)` and return manual review.
- Recommended correction: Define and document a stable payment identity independent of mutable/material request content (for example, the approved repository/PR/merge identity and version/purpose as architecture permits), derive the provider-safe key from that identity, and retain the full canonical request hash as a separate integrity value. Resolve the precise identity fields through the approved architecture rather than silently choosing them during implementation.
- Verification after correction: Add tests proving identical payment identity yields the same key when a material request field changes, the request hash changes, and the pair is classified as conflict/manual review; prove distinct intended payments produce distinct keys; re-run all identity, state-machine, replay, and provider idempotency tests.
- Confidence: High
- Status: Open

## [HIGH] REV-002: Decimal comparison can accept an amount above the configured cap

- Category: Correctness / payment safety / input validation
- Location: `src/domain/decimal.ts:1-13`; `src/config/load-config.ts:74-75,94-107,186-203`; `tests/domain/decimal.test.ts:4-22`
- Requirement or control: FR-003, FR-004, BR-001, Task 21, Task 34, Task 77, `docs/CONFIGURATION.md` bounded precision, repository rule that decimal boundaries convert safely to atomic values
- Evidence: Fractional strings are padded to 18 characters but never truncated, normalized to a shared scale, or constrained to 18 digits. Reproduction: comparing `0.000000000000000001` against `0.0000000000000000001` produces fractional integers `1` and `1`, so `exceedsDecimalString` returns false even though the amount is ten times the cap. Configuration permits token decimals up to 77 and accepts arbitrary decimal-string precision.
- Problem: Integer comparison of fractional digit strings is valid only when both strings use the same scale. `padEnd(18)` does not align values longer than 18 digits. Because input validation imposes no precision bound tied to token decimals, the faulty path is reachable through trusted default-branch configuration.
- Impact: An over-cap payout can pass configuration validation and policy evaluation. In a payment system, incorrect cap enforcement is a material financial-control failure and should block the contract freeze.
- Reproduction or failure scenario: Configure `maximum: "0.0000000000000000001"` and a payout amount `"0.000000000000000001"`. Both pass the decimal regex. `exceedsDecimalString` returns false, so the ten-times-over-cap amount is accepted.
- Recommended correction: Establish one documented decimal precision contract. Prefer converting validated human decimal strings to atomic-unit integers using the configured token decimals, rejecting excess fractional precision, and comparing atomic integers. If a generic comparator remains, normalize both values to the maximum observed scale without an arbitrary 18-digit assumption and separately enforce the token precision bound.
- Verification after correction: Add boundary/property tests for unequal fractional lengths on both sides of 18 digits, configured token decimals (including 0 and 6), excess precision rejection, equality with trailing zeros, very large integers, zero, and amount exactly/just below/just above cap. Exercise both config validation and policy evaluation.
- Confidence: High
- Status: Open

## Other Findings

## [MEDIUM] REV-003: Canonical request builder labels malformed values as normalized valid domain types

- Category: Contract correctness / validation / maintainability
- Location: `src/payment/canonical-request.ts:4-26`; `src/security/validate.ts:7-9`; `tests/payment/payment-identity.test.ts:18-34`
- Requirement or control: FR-006, Task 37, repository rules that addresses are validated and normalized once and atomic amounts are integer strings internally
- Evidence: `CanonicalRequestInput` accepts unrestricted strings and numbers. `normalizeHexAddress()` only lowercases and casts any string to ``0x${string}``; `buildCanonicalRequest()` does not validate recipient/token addresses, positive integer PR number/chain ID, 40-hex merge SHA, or decimal-digit-only `amountAtomic`. Existing tests check version, a lowercase repository, and hash sensitivity, but no malformed input.
- Problem: The constructor for the canonical, security-sensitive payment identity can create values that violate its own declared domain types and invariants. The current config path happens to validate configured addresses, but Phase 2 callers and provider-derived values are not yet frozen, and type casts hide runtime invalidity.
- Impact: Malformed identities can be hashed, keyed, simulated, logged, or compared as if valid. Later adapters must duplicate assumptions or can accidentally bypass validation, reducing confidence that simulation/broadcast parity refers to a valid exact request.
- Reproduction or failure scenario: `buildCanonicalRequest({ ...valid, recipient: "not-an-address", amountAtomic: "1.5", pullRequestNumber: -1 })` returns a typed `CanonicalPaymentRequest` without error.
- Recommended correction: Make canonical construction a validating boundary or accept already validated branded/value types. Enforce all frozen invariants once, including address format, merge SHA, positive/safe integer identifiers, nonnegative integer atomic amount (and nonzero where required), normalized repository identity, and purpose constraints.
- Verification after correction: Add table-driven tests for every invalid field and normalization rule; prove invalid input fails with stable safe errors and valid logical equivalents canonicalize identically.
- Confidence: High
- Status: Open

## [LOW] REV-004: Untracked nested project copy weakens clean-checkout and release confidence

- Category: Repository hygiene / release risk
- Location: `mergepay/` (untracked workspace directory)
- Requirement or control: SC-006 clean checkout, NFR-004 reproducibility, review scope clarity
- Evidence: `git status --short --branch` reports `?? mergepay/`. The nested directory contains a near-complete copy of the repository, including source, tests, docs, lockfile, state, and a placeholder `.env.example`.
- Problem: Two visible project trees make it easy to run commands or apply later changes in the wrong copy, package unintended files, or review a different state than the one committed. It also prevents a clean working tree at the checkpoint gate.
- Impact: Limited immediate runtime impact because the directory is untracked and current npm scripts use the root, but it materially increases operator and release error risk.
- Reproduction or failure scenario: An executor changes `mergepay/src/...` or runs npm from the nested directory, obtains green checks there, while the tracked root remains unchanged.
- Recommended correction: Determine ownership and intended purpose outside this review; remove it through a recoverable user-authorized operation or move it outside the repository, then verify a clean checkout. Do not delete it automatically because it may contain user work.
- Verification after correction: `git status --short --branch` is clean at the intended revision and all required commands run from the tracked repository root.
- Confidence: High
- Status: Open

## Positive Practices

- [POSITIVE] Pure policy evaluation is separated from GitHub/provider side effects and has deterministic ordered reason codes.
- [POSITIVE] Configuration parsing rejects unknown fields and malformed structures by default, a strong fail-closed pattern.
- [POSITIVE] Blocked policy results explicitly set `broadcastEligible: false`, and tests cover the main refusal paths.
- [POSITIVE] Synthetic fixtures are visibly labeled and contain no apparent live credentials.

## Security Review

The reviewed Phase 1 code does not yet perform network calls, secret access, signing, or broadcast. No apparent hardcoded secret was found. The main security-relevant defect is architectural: REV-001 prevents the required stable-identity/request-hash conflict control. REV-002 can bypass a configured financial cap. REV-003 permits invalid values into the canonical security identity.

The policy evaluator uses only supplied normalized state; enforcement that this state is freshly fetched from trusted GitHub/default-branch sources remains Phase 2 and was not credited here. The placeholder action logs raw errors with `console.error`, but it is explicitly a Phase 2 placeholder; provider error redaction must be implemented and reviewed before any secret-bearing execution.

## Test and Evidence Review

The test suite is fast and deterministic in this run, with meaningful coverage of ordinary config, policy, reason-code, and hash behavior. It does not prove the most important cross-contract invariants:

- same stable payment identity plus changed request hash becomes conflict;
- decimal precision is bounded and cap comparisons are correct for all accepted strings;
- canonical construction rejects malformed runtime values;
- atomic conversion obeys token decimals.

The payment-key test currently encodes the opposite of FR-007/BR-006 by requiring the key to change with request content. Decimal tests stop at 18 fractional digits and therefore miss the scale bug.

`PROJECT_STATE.md` claims TDD red/green execution, but this historical sequence cannot be independently reconstructed from the final repository. The final tests and current checks were reviewed directly; no approval is based on the narrative alone.

## Code Quality and Maintainability

Names and module boundaries are generally clear. Stable error codes and pure functions are appropriate foundations. The primary maintainability risk is use of structural template-literal types plus casts as substitutes for runtime validation. The duplicate-label guard inside `parseAmounts()` cannot detect YAML duplicate keys after parsing and is effectively unreachable, though the YAML parser’s duplicate-key rejection is the actual safe control; this is not independently blocking.

## Performance and Reliability

No material performance concern exists in the small pure-domain implementation. BigInt is appropriate for monetary comparison, but scale normalization must be correct. Phase 2 reliability controls—timeouts, bounded polling, retry policy, idempotency lookup, unknown outcomes, and no rebroadcast—remain unimplemented and outside approval.

## Compatibility and Operations

Node engine, strict TypeScript ESM, lockfile, Vitest, ESLint, Prettier, and NCC align with the approved stack. Build and bundle load passed. Dependency audit remains unavailable and must pass before the phase gate. Generated `dist/` is ignored and therefore bundle-diff verification was not demonstrated; the required verification policy explicitly calls for bundle-diff, so this gate remains outstanding even though build/load passed.

## Plan Conformance

The modular pure-domain direction conforms to the plan. The current contracts do not conform to FR-007/BR-006 because stable identity and content hash are inseparable. Decimal/config behavior does not conform to bounded precision and correct cap enforcement. Canonical construction does not yet uphold its declared invariants. These are implementation defects within approved scope, not an approved architecture amendment.

Phase 2 must not start until these findings are corrected, all required verification—including audit, secret scan, and bundle-diff—is reproducible, and an independent re-review approves the revised contracts.

## Required Re-Review Scope

- Payment identity/key derivation, canonical request hash separation, and conflict semantics.
- Decimal parsing, precision/atomic conversion, maximum enforcement, and all affected config/policy tests.
- Canonical request runtime validation and domain types.
- Any architecture, security, configuration, integration, test, task, and memory documentation changed to clarify these contracts.
- Full Phase 1 verification suite, dependency audit, secret scan, bundle-diff, and clean repository status.
- Regression review of all callers introduced before re-review; if Phase 2 begins prematurely, the re-review scope expands to the full execution/replay path.

## Recommended Next Action

Return the Phase 1 contracts to the executor. Correct REV-001 through REV-003 test-first, resolve or explicitly relocate the untracked nested tree with user authorization, update all contract documentation required by repository discipline, run the complete required verification suite, and request a fresh independent Phase 1 review. Do not begin provider/action implementation, broadcast, merge, deploy, or release.

## Review Sources

- Repository at `46b8825946a8935ccb22f47a5d9aa10f8bf4e103`
- `PROJECT_PLAN.md`
- `docs/TASKS.md`
- `docs/ARCHITECTURE.md`
- `docs/SECURITY.md`
- `docs/CONFIGURATION.md`
- `docs/TEST-STRATEGY.md`
- All Phase 1 source, tests, package/toolchain files, and full diff from `20b6fa2`
- `PROJECT_STATE.md`, read after the initial independent code assessment and used only to reconcile claims/evidence
- Local command outputs documented in Verification Performed
