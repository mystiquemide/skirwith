# Code Review

## Review Metadata

- Project: MergePay
- Review date: 2026-08-04 (Africa/Lagos)
- Reviewer: Independent Codex review
- Review target: CP-017 remediation of REV-006 (receipt-marker authentication); re-review of the Phase 2 exit gate
- Base revision: `ea33028` (code-identical to the last reviewed head `887cce2` except `CODE_REVIEW.md`)
- Head revision: `bee4a94`
- Review mode: Checkpoint re-review
- Secondary focus: Security (receipt provenance, replay integrity), payment safety, release readiness
- Plan phase or checkpoint: Phase 2 — Trusted GitHub and KeeperHub execution / CP-017 (REV-006 fix)
- Files reviewed: `src/evidence/receipt.ts`, `src/github/receipts.ts`, `src/output/receipt-comment.ts`, `src/action.ts`, `src/execution/duplicate-resolver.ts`, `src/execution/orchestrator.ts`, related tests, and `docs/ARCHITECTURE.md` / `SECURITY.md` / `TEST-STRATEGY.md`
- Files excluded: Live KeeperHub/GitHub execution and Phase 3 real-transaction evidence
- Environment: Node.js/npm workspace `/root/projects/mergepay`; `master` synchronized with `origin/master`; working tree clean
- Overall confidence: High for the receipt-authentication fix and local verification; Medium for live GitHub comment-permission behavior on the receipt `save()` path

## Verdict

**Approve with non-blocking findings.** REV-006 is materially corrected: receipt markers are now authenticated with an HMAC-SHA256 tag over a secret only the action holds, the tag is verified before any comment is treated as execution state, marker fields are strictly validated, and forged/tampered/differently-signed markers fail closed. The primary attack (an attacker-forged `confirmed` marker suppressing a payout) is closed and covered by passing adversarial tests. One Low-severity hardening gap remains in the receipt `save()` path (REV-007); it does not enable double payment or suppress the first payout and does not block the Phase 2 exit gate.

## Executive Summary

The CP-016 finding REV-006 held that `CommentReceiptStore.findByPaymentKey()` treated any issue comment with a syntactically valid marker as authoritative execution state, letting a commenter forge a `confirmed` marker and suppress a legitimate payout. The fix adds a `mac` field to `ReceiptMarker`, computes it as HMAC-SHA256 over a sorted-key, undefined-pruned serialization of the marker payload using a receipt secret, and verifies it in `findByPaymentKey()` before trusting a comment. `isReceiptMarker()` now validates the payment-key format (`mergepay:` + 64 hex), 64-hex request hash, 40-hex merge SHA, positive safe-integer PR number, allowed status, transaction-hash shape, and MAC format. The receipt secret is the KeeperHub API key, wired in `src/action.ts`.

Independent verification reproduced all local claims: 208/208 tests, clean typecheck/lint/format, successful build and bundle load, packaged fixtures (merged → confirmed, unmerged → blocked, opened → safe failure), 0-vulnerability audit, and a clean secret scan. Adversarial tests prove an attacker-forged confirmed marker still pays (broadcast runs) while a legitimately signed confirmed receipt returns a duplicate with no second broadcast.

The residual gap (REV-007) is that `save()` selects a comment to update by matching `paymentKey` without verifying the MAC, so a squatter who pre-posts the deterministic payment key can divert or disrupt receipt creation. KeeperHub idempotency (keyed by payment key) prevents double payment and the MAC check in `findByPaymentKey()` prevents payout suppression, so this is a griefing/robustness issue, not a payment-safety failure.

## Scope and Limitations

This re-review covers the REV-006 remediation (`ea33028..bee4a94`) plus the surrounding receipt/execution contracts it touches. The fix commit `bee4a94` is the only code change; its parent `ea33028` modified only `CODE_REVIEW.md`.

Limitations:

- Live GitHub behavior of `updateIssueComment()` on a comment the action does not own was not exercised (no live GitHub access). The REV-007 impact assessment for that path is inferred from the GitHub REST permission model and code inspection, and should be confirmed during Phase 3.
- Live KeeperHub execution, wallet funding, and provider response/status semantics remain unverified here (Phase 3 scope).
- The dependency audit succeeded this time (0 vulnerabilities), resolving the CP-016 `EAI_AGAIN` limitation. A dedicated secret-scanning product and formal bundle-diff tool were still unavailable; source/config inspection found no apparent live credential.
- Comment-list pagination remains unimplemented (noted in CP-016 as secondary; unchanged).

## Requirements Reviewed

- `FR-012`: Resolve receipts/executions before any replay broadcast; never automatically rebroadcast uncertain states.
- `BR-005`: A matching confirmed payment key returns the original proof, not a new payment.
- `BR-006`: A matching key with a changed canonical request is a conflict requiring manual review.
- `NFR-001`: No secret or raw sensitive payload appears in output artifacts.
- `RISK-009`: GitHub receipt is spoofed or stale — control is "structured marker plus request/provider integrity checks."
- CP-016 finding REV-006 and its recommended corrections.

## Verification Performed

| Check | Scope | Result | Evidence |
|---|---|---|---|
| Repository/revision status | Branch, HEAD, parent, working tree | Pass | HEAD `bee4a94`, parent `ea33028` (review-artifact only), synced with `origin/master`, clean tree |
| Fix diff scope | `ea33028..bee4a94` | Pass | Receipt-authentication change across `receipt.ts`, `receipts.ts`, `receipt-comment.ts`, `action.ts` + tests/docs |
| Full tests | 25 Vitest files | Pass | 208/208 tests passed |
| Typecheck | TypeScript project | Pass | `npm run typecheck` clean |
| Lint | Repository | Pass | `npm run lint --max-warnings 0` clean |
| Format | Source/test/config | Pass | `npm run format:check` clean |
| Build | NCC bundle | Pass | `npm run build`; 2748 kB bundle |
| Bundle load | `dist/index.js` | Pass | `npm run bundle:check`: bundle loads |
| Packaged fixtures | merged/unmerged/opened events | Pass | `npm run verify:packaged`: confirmed, blocked, safe failure |
| Dependency audit | npm advisory service | Pass | `npm audit`: 0 vulnerabilities (resolves CP-016 `EAI_AGAIN`) |
| Secret scan | src, scripts, action.yml, .github | Pass | No apparent live credential |
| MAC forgery resistance | tampered field / different secret / forged mac / end-to-end attacker marker | Pass | Covered by passing tests in `receipt.test.ts`, `receipts.test.ts`, `action.test.ts` |
| Trust-point audit | all `decodeReceiptMarker`/`verifyReceiptMarker` call sites | Pass | Only `findByPaymentKey()` trusts a marker, and it verifies the MAC first |
| `save()` squatter behavior | `receipts.ts:65-68` | Finding | Existing comment selected by payment key without MAC verification (REV-007) |

## Findings Summary

| Severity | Count |
|---|---:|
| Blocker | 0 |
| Critical | 0 |
| High | 0 |
| Medium | 0 |
| Low | 1 |
| Nit | 0 |
| Positive | 5 |

## Blocking Findings

None.

### Resolved: REV-006 (CP-016, Medium)

- Status: Resolved.
- Evidence of resolution: `src/evidence/receipt.ts:116-125` adds `signReceiptMarker`/`verifyReceiptMarker` (HMAC-SHA256 over sorted-key, undefined-pruned payload). `src/github/receipts.ts:45` verifies the MAC before a comment is returned as execution state; forged/tampered/differently-signed markers are skipped (fail closed). `src/evidence/receipt.ts:62-89` strictly validates marker identity/proof fields. Passing tests: `tests/action.test.ts` "ignores an attacker-forged confirmed marker and still pays" and "honors a legitimately signed confirmed receipt as a duplicate with no broadcast"; `tests/evidence/receipt.test.ts` tampered/different-secret/forged-mac cases; `tests/github/receipts.test.ts` fail-closed cases.
- The reviewer-recommended "signed MAC over the full marker with a secret unavailable to commenters, fail closed, and validate formats" is implemented. The alternative "authenticated provider lookup / trusted durable store" and "bot-identity binding" were not implemented; the MAC alone is cryptographically sufficient to prevent forgery because only the secret holder can produce a valid tag.

## Other Findings

## [LOW] REV-007: Receipt `save()` selects a comment to update by payment key without verifying the MAC

- Category: Security hardening / robustness / replay-integrity hygiene
- Location: `src/github/receipts.ts:65-68`
- Requirement or control: `RISK-009`, `FR-012`, Task 68 (create-or-update one receipt safely)
- Evidence: `save()` runs `comments.find((comment) => decodeReceiptMarker(comment.body)?.paymentKey === record.paymentKey)` with no `verifyReceiptMarker()` call, then updates that comment if found. The payment key is deterministic from public event/config data, so an attacker who can comment can pre-post a marker carrying the target payment key (with any/invalid MAC).
- Problem: When a forged squatter comment matches the payment key, `save()` targets it for update instead of creating a new, action-owned receipt. Two live outcomes are possible: (a) if the token cannot edit another user's comment, `updateIssueComment` throws and `save()` fails after the broadcast already succeeded, so the run reports failure and no clean receipt is recorded; (b) if the update succeeds, the legitimate marker lands in an attacker-owned comment the attacker can later re-forge or delete (cosmetic only, since `findByPaymentKey()` still verifies the MAC).
- Impact: Griefing/availability against the receipt record and run reporting. It does NOT enable double payment (KeeperHub idempotency is keyed by the payment key, so a re-broadcast returns the original execution) and does NOT suppress the first payout (`findByPaymentKey()` verifies the MAC before trust). Recoverable by admin removal of the squatter comment.
- Reproduction or failure scenario: Attacker computes the payment key from public data and posts a comment with a marker containing that key and an invalid MAC. The legitimate run pays, then `save()` matches the squatter and either errors (case a) or overwrites an attacker-owned comment (case b).
- Recommended correction: In `save()`, only update a comment whose marker MAC verifies with the receipt secret (a receipt the action recognizes as its own); otherwise create a new comment. Optionally bind receipts to the action's bot identity and verify authorship through the GitHub API. Add a test where a forged same-key squatter is present and `save()` creates a new comment rather than updating the squatter.
- Verification after correction: New test proves a forged squatter is not updated and a fresh signed receipt is created; re-run full suite and packaged fixtures; confirm live `updateIssueComment` permission behavior during Phase 3.
- Confidence: High (code path), Medium (live permission outcome)
- Status: Open

## Positive Practices

- The MAC is verified at the single trust point (`findByPaymentKey()`), and a call-site audit confirms no other path treats a decoded marker as execution state.
- Sorted-key, undefined-pruned stable serialization makes the MAC independent of field ordering and of optional-field presence, and round-trips correctly between sign/encode/decode/verify.
- Marker field validation was meaningfully tightened (payment-key, request-hash, merge-SHA, PR-number, status, tx-hash, MAC formats), rejecting malformed markers before the MAC check.
- Adversarial tests exercise the actual abuse case end-to-end (forged marker still pays; legitimate receipt suppresses exactly one replay), not just the codec in isolation.
- The dependency audit now passes (0 vulnerabilities), clearing the CP-016 environmental limitation.

## Security Review

The receipt-provenance boundary is now cryptographically enforced: a valid MAC implies the marker was produced by a holder of the receipt secret (the KeeperHub API key), which commenters do not possess. HMAC-SHA256 is an appropriate, established primitive; the secret is not logged or embedded in comments (only the tag is). The MAC binds all identity and proof fields (payment key, request hash, status, execution ID, transaction hash/link, repository, PR, merge SHA), so cross-payment, cross-PR, and cross-repository replay would require forging a new tag. The payment key/request hash remain deterministic and public, but that no longer grants trust because trust now requires the MAC.

Residual, non-blocking: the `save()` path (REV-007) and the absence of bot-identity binding. Neither breaks the core payment-safety invariants, which rest on (a) MAC verification before trust and (b) KeeperHub idempotency keyed by the payment key.

## Test and Evidence Review

The 208-test suite includes dedicated receipt-authentication coverage: sign/verify round-trip, tampered-field rejection, different-secret rejection, forged-MAC rejection, malformed-field rejection, store fail-closed behavior, and two end-to-end action-level adversarial tests. These directly satisfy the CP-016 verification requirements ("attacker-authored confirmed marker never suppresses provider calls; legitimate confirmed receipt still suppresses exactly one replay"). Assertions are meaningful and target behavior, not implementation.

Gap: there is no test for `save()` encountering a forged same-key squatter (REV-007). The existing "updates the matching receipt comment" test uses a legitimately signed pending marker, so the unverified-MAC selection path is untested.

The `PROJECT_STATE.md` CP-017 claims were compared against independent reproduction and are accurate (test counts, checks, and the decision to reuse the KeeperHub API key as the receipt secret).

## Code Quality and Maintainability

The change is focused and consistent with the existing module boundaries and injectable-seam style. `receiptMatchesCurrent` was widened to a shared identity-field type so both `ReceiptMarker` and `ReceiptRecord` satisfy it, which is a clean generalization. Naming is clear and error handling fails closed. No dead code, debug output, or unrelated changes were introduced. Documentation (`ARCHITECTURE.md`, `SECURITY.md`, `TEST-STRATEGY.md`) was updated to describe the MAC trust model and matches the implementation.

## Performance and Reliability

No performance concern is introduced; HMAC over a small marker payload is negligible. The known comment-list pagination gap remains (a long PR discussion could miss older markers or add API load) and is unchanged from CP-016; it is secondary and not blocking. Receipt creation is create-or-update, bounded to one receipt per payment key.

## Compatibility and Operations

The marker format now requires `mac`; pre-fix markers (without `mac`) fail `isReceiptMarker()` and are ignored (fail closed). This is acceptable pre-release because no live receipts exist yet. Action metadata still points to `dist/index.js` (generated at release), and the example workflow retains the documented `<release-sha>` placeholder. The dependency audit passed (0 vulnerabilities).

## Plan Conformance

The fix conforms to the approved Phase 2 scope and to the `RISK-009` control ("structured marker plus request/provider integrity checks"). No approved scope, architecture, requirement, or acceptance criterion was changed without an amendment. The decision to reuse the KeeperHub API key as the receipt secret and to forgo bot-identity binding is recorded in `PROJECT_STATE.md` (CP-017) and is a reasonable, documented engineering choice rather than a scope change.

## Required Re-Review Scope

- The REV-007 correction in `src/github/receipts.ts` `save()` and its new test.
- Any change to the receipt secret source, MAC scheme, or marker format.
- Live confirmation of `updateIssueComment()` permission behavior during Phase 3.
- If Phase 3 proceeds without first fixing REV-007, re-review should confirm the squatter path cannot disrupt the live demo or acceptance evidence.

## Recommended Next Action

The Phase 2 exit gate may close for revision `bee4a94`: REV-006 is resolved and only a Low, non-blocking hardening item (REV-007) remains. Fix REV-007 (MAC-verified update-or-create in `save()` plus a squatter test) before or early in Phase 3, then proceed to Phase 3 live three-state acceptance (one confirmed payout, replay with no second transaction, blocked no-broadcast refusal) using the funded Sepolia wallet and frozen USDC contract. Do not treat this approval as covering live execution, which still requires Phase 3 evidence.

## Review Sources

- Repository HEAD `bee4a94` and parent `ea33028`
- `PROJECT_PLAN.md`, `PROJECT_STATE.md` (CP-016/CP-017), `docs/ARCHITECTURE.md`, `docs/SECURITY.md`, `docs/TEST-STRATEGY.md`, `docs/KEEPERHUB-INTEGRATION.md`
- Phase 2 source and tests: `src/evidence/receipt.ts`, `src/github/receipts.ts`, `src/output/receipt-comment.ts`, `src/action.ts`, `src/execution/duplicate-resolver.ts`, `src/execution/orchestrator.ts`, `tests/evidence/receipt.test.ts`, `tests/github/receipts.test.ts`, `tests/output/receipt-comment.test.ts`, `tests/action.test.ts`
- Local verification commands documented in the Verification Performed table
