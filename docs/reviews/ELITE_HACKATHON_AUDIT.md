# Elite Hackathon Audit — Skirwith

## Executive Verdict

**Submission readiness: Not ready. Overall grade: C-.**

Skirwith has a compelling, narrow hackathon thesis: turn a merged pull request into a deterministic testnet payment while proving replay suppression and refusal before broadcast. The repository shows serious engineering effort, strong safety-oriented architecture, real Sepolia evidence, pinned CI actions, signed receipts, and a reproducible bundle.

The submission is still vulnerable to a technically serious judging challenge: the MergePay-to-Skirwith rename changed the persisted payment identity and receipt namespace without migration. Existing live evidence uses a `mergepay:` payment key, while current code accepts only `skirwith:` keys. That threatens the central “never pay twice” claim.

The project also lacks a final release tag and actual demo video, CI still tests Node 20 while the action declares Node 24, and the strongest live proof uses self-payments to the organization wallet rather than demonstrating contributor settlement.

Do not submit until replay compatibility and release evidence are resolved.

## 1. Product and Feature Audit

### What Works

- Clear core workflow: merged PR → trusted config → policy → simulation → one broadcast → receipt.
- Strong differentiator: replay suppression and refusal-before-broadcast are explicit product promises.
- Scope is appropriately narrow: one chain, one token, one GitHub Action.
- The product is easy to explain in one sentence.

Evidence:

- `README.md:3-18`
- `PROJECT_PLAN.md:17-28`

### Major Risks

#### High — Rebrand breaks historical replay identity

Current code derives `skirwith:` keys and uses `skirwith:payout`, while live evidence records a confirmed `mergepay:` receipt.

- Current identity: `src/payment/payment-key.ts:5-7`
- Current purpose: `src/domain/constants.ts:1`
- Current receipt parser: `src/evidence/receipt.ts:44-55`
- Legacy live receipt: `docs/PHASE3-EVIDENCE.md:18`

A judge or maintainer can reasonably ask: “What prevents the renamed action from paying an already-paid PR again?” The current repository does not provide a convincing answer.

#### Medium — Product proof is self-payment

The acceptance config maps the contributor to the organization wallet itself:

- `docs/PHASE3-EVIDENCE.md:5`

This proves the transaction path, but weakens the user-value demonstration. A judge may view it as infrastructure smoke testing rather than a genuine contributor payout.

Improve the narrative explicitly:

> All live transactions use a self-payment recipient to avoid moving funds to an external person during testing. The workflow still validates the complete recipient mapping and transfer path.

If possible, include a clearly labeled synthetic recipient mapping or controlled test wallet—not a real person’s wallet.

## 2. Code and Architecture Audit

### Strengths

- Good module separation: policy, payment identity, GitHub adapters, KeeperHub client, orchestration, and evidence.
- Provider calls are injected and testable.
- Reservation-first ordering is a strong safety design.
- Broadcast is not retried.
- Receipt persistence retries are bounded.
- Generated `dist/` exactly matches a clean rebuild.
- All 223 tests pass.

### Findings

#### High — Persisted security contracts changed without migration

The rename changed more than branding:

- `.github/mergepay.yml` → `.github/skirwith.yml`
- `mergepay:payout` → `skirwith:payout`
- `mergepay:<hash>` → `skirwith:<hash>`
- `<!-- mergepay:... -->` → `<!-- skirwith:... -->`

This is a breaking storage and replay-contract change, not merely a visual rename. There is no migration or approved amendment documenting compatibility.

#### Medium — GitHub pagination is not truly bounded

`iterateComments()` compares the current page number to the maximum rather than counting requests or tracking visited pages.

- `src/github/receipts.ts:52-75`
- `src/github/api.ts:68-79`

A cyclic `Link` header such as page 1 → page 1 can loop indefinitely. Add cycle detection and a request counter.

## 3. UX and Design Audit

### Overall Score: 7/10

The landing page has a polished visual direction and a clear narrative structure:

- Product value proposition appears immediately.
- Proof, safety, setup, and documentation are separated logically.
- CTAs are action-oriented: “Set it up” and “View the acceptance repo.”
- Safety language is understandable to non-specialists.

Evidence:

- `docs/index.html:158-170`
- `docs/index.html:194-240`

### UX Issues

#### Medium — “7 confirmed transactions” is semantically confusing

The page says:

> 7 confirmed KeeperHub USDC transactions

But three table rows are labeled `pending*`:

- `docs/index.html:197-215`

The footnote explains that those transactions confirmed on-chain but the action receipt remained pending. This is technically defensible but visually confusing.

Use clearer labels:

- “7 on-chain-confirmed transactions”
- “4 action receipts confirmed”
- “3 receipts pending, transactions independently confirmed”

#### Low — Setup promises success too directly

The setup section says:

> The transaction appears on Sepolia.

- `docs/index.html:305-310`

For a third-party API, GitHub permission, balance, and configuration-dependent action, this should be conditional:

> If policy passes, the wallet is funded, and KeeperHub is available, the action posts a receipt with the Sepolia transaction link.

#### Low — No explicit failure-recovery path in landing-page setup

The README includes troubleshooting, but the landing page’s setup flow does not tell users what to do for:

- blocked policy
- pending/manual review
- missing secrets
- insufficient testnet funds

Add a compact “If the run does not settle” section with links to configuration and troubleshooting documentation.

## 4. Performance and Reliability Audit

### Score: 7/10

Positive practices:

- Polling is bounded.
- Receipt-save retries are bounded.
- No automatic rebroadcast follows uncertainty.
- Concurrency is configured per PR.
- The bundle is reproducible.

Risks:

1. Cyclic pagination can bypass the page limit.
2. No independent Node 24 runtime verification was run.
3. External GitHub/KeeperHub behavior is mostly represented by fakes and historical evidence rather than current live verification.
4. There is no explicit operational alerting or maintainer notification path for manual-review outcomes.

For a hackathon, lack of production observability is acceptable if clearly disclosed. It should not be presented as production-ready infrastructure.

## 5. Security Audit

### Score: 6/10

### Strong Controls

- No PR checkout in the secret-bearing workflow.
- Config is loaded from the default branch.
- Recipient and amount are not trusted from PR text.
- Signed receipt markers.
- Secret redaction.
- Simulation/broadcast parity.
- Reservation before broadcast.
- No rebroadcast on uncertain state.
- Actions pinned by commit SHA.

Evidence:

- `docs/examples/skirwith-workflow.yml:8-17`
- `docs/SECURITY.md:5-37`

### Blocking Security Concern

Replay compatibility is the dominant issue. A security system cannot change its durable identity namespace without proving old records remain authoritative.

Also note the naming inconsistency:

- Runtime secret: `MERGE_PAY_RECEIPT_SECRET`
- Product name: Skirwith

This is not itself a vulnerability, but it signals incomplete migration and may confuse operators.

## 6. Submission-Page Readiness

### Score: 4/10

The repository contains a preflight checklist:

- `docs/SUBMISSION.md:1-24`

But the actual submission package is incomplete:

- No release tag exists.
- No demo video URL exists.
- No final submission URL is recorded.
- The workflow example still contains `<release-sha>`.
- The demo plan is not the demo itself.
- `PROJECT_STATE.md` still describes release and submission as remaining work.

Evidence:

- `docs/SUBMISSION.md:3-20`
- `docs/examples/skirwith-workflow.yml:39-45`
- `PROJECT_STATE.md:49-67`

A judge opening the repository today can understand the project but cannot yet verify a finalized, immutable release artifact.

## 7. Repository Audit

### Score: 7/10

Strengths:

- The public repository is reachable.
- The README is present and structured.
- Documentation coverage is unusually strong for a hackathon project.
- CI exists and pins third-party actions.
- The public site and acceptance repository URLs returned HTTP 200 during read-only checks.
- The dependency audit reports zero vulnerabilities.
- All 223 tests pass locally.

Weaknesses:

#### High — Origin still points to the old repository name

Local Git metadata reports:

```text
origin https://github.com/mystiquemide/mergepay.git
```

Public documentation points to:

```text
https://github.com/mystiquemide/skirwith
```

Evidence:

- `git remote -v`
- `README.md:32`
- `docs/index.html:329`

This can create confusion for release automation and judges cloning from the repository’s actual origin.

#### Medium — CI tests Node 20 while the action runs Node 24

- CI: `.github/workflows/ci.yml:18-27`
- Action: `action.yml:27`
- Package engines: `package.json:8-10`

Align the CI matrix and package metadata with the runtime used by the action.

#### Low — Project state is behind the repository

The latest commits add Node 24 migration, README work, and demo-video planning, but the state log does not contain a corresponding final checkpoint. This weakens auditability and handoff quality.

## 8. Competitive Positioning Audit

### Current Positioning

The strongest positioning is:

> A safety-first GitHub Action that pays contributors after verified merges, with replay suppression and explicit refusal before broadcast.

That is sharper than positioning it as a generic crypto payroll tool.

### Competitive Strengths

- Clear integration with the GitHub workflow.
- Strong trust-boundary story.
- Real KeeperHub integration.
- On-chain evidence.
- Explicit refusal and replay cases.
- Small, understandable architecture.

### Competitive Weaknesses

- Self-payment proof is less compelling than real contributor settlement.
- The product currently feels like a technically excellent proof of concept rather than a deployable product.
- No clear adoption path exists beyond manually copying a workflow.
- No release tag or one-click installation reference exists.
- The rebrand/replay issue undermines the most important differentiator.
- No quantified user benefit is given, such as time saved or duplicate payments prevented.

### Recommended One-Line Pitch

> Skirwith turns a verified merged pull request into one policy-controlled testnet payment—with signed evidence, replay suppression, and refusal before broadcast.

Avoid claiming production payroll, mainnet readiness, gas sponsorship, or autonomous treasury management.

## 9. Judge Rubric Simulation

| Category | Score | Rationale |
|---|---:|---|
| Problem clarity | 9/10 | Narrow, understandable merge-to-payment problem |
| Innovation | 7/10 | Strong safety implementation, moderate product novelty |
| Technical execution | 7/10 | Good architecture and tests; replay migration defect is serious |
| Security | 6/10 | Excellent intended controls, but persisted identity compatibility is unresolved |
| Real-world usefulness | 6/10 | Useful workflow, but self-payment limits proof of user value |
| KeeperHub integration | 8/10 | Real executions, simulation, idempotency, and recovery evidence |
| UX/design | 7/10 | Strong landing page and documentation, with some ambiguous proof copy |
| Presentation readiness | 4/10 | Demo plan exists; final video and release artifact do not |
| Documentation | 8/10 | Extensive and readable, though state and naming are inconsistent |
| Overall hackathon readiness | 6/10 | Strong technical base, not submission-ready |

### Likely Judge Verdict

> Technically impressive and security-conscious, but I need to see a stable release, a real demo, and proof that the rename did not break replay protection.

## 10. Presentation Readiness

### Current Demo Plan Is Strong

The planned sequence covers:

1. Problem
2. Trusted config
3. Merged PR
4. KeeperHub execution
5. Replay
6. Refusal
7. Evidence
8. End card

Evidence:

- `docs/DEMO_VIDEO_PLAN.md:17-97`

### Missing Assets

- Actual recorded video
- Public video URL
- Final release tag
- Immutable commit reference used in the video
- Final submission form/archive
- Recorded logged-out verification results

### Demo Risk

The demo says:

> Seven real transactions are confirmed onchain.

But three action receipts are still displayed as `pending*`. Explain the distinction verbally and on screen, or judges may interpret this as contradictory.

## 11. Five Reality-Check Questions

1. If a maintainer runs the renamed action against a PR paid before the rename, can you prove it will not pay twice?
2. Why does the acceptance proof pay the organization wallet rather than a controlled contributor test wallet?
3. Where is the immutable release tag a judge should evaluate?
4. Where is the actual demo video, not just its plan?
5. Can a new maintainer complete setup without guessing the correct Node version, receipt-secret naming, release SHA, and recovery process?

At present, questions 1, 3, and 4 have unacceptable answers for submission.

## Priority Action Plan

### P0 — Before Any Submission or Live Payout

#### 1. Resolve replay compatibility

- Preserve or dual-read legacy `mergepay:` identities and receipt markers.
- Add tests for legacy confirmed, pending, failed, forged, and conflicting receipts.
- Document the migration as an approved amendment.
- Rebuild and independently re-review the bundle.

#### 2. Create an immutable release

- Align repository naming and origin.
- Align Node 24 across action metadata, CI, `engines`, README, and `.nvmrc`.
- Run the complete release preflight.
- Create a release tag only after verification.

#### 3. Produce the actual demo

- Keep it under three minutes.
- Show the execution ID, explorer Transfer event, replay with no second transaction, and blocked run.
- State clearly that the live transactions are testnet self-payments.

### P1 — Before Final Judging

4. Replace ambiguous “7 confirmed transactions” copy with on-chain-confirmed versus receipt-confirmed counts.
5. Add a manual-review recovery callout to the landing page.
6. Complete logged-out checks for every repository, run, explorer, and documentation link.
7. Archive the final submission payload and exact release commit.

### P2 — Post-Hackathon Polish

8. Add pagination-cycle tests and request-count enforcement.
9. Add a controlled recipient demonstration.
10. Add lightweight metrics or operator notification for manual-review outcomes.

## Verification Evidence Used

- Repository revision: `8d532012ffbe913e8fd675f15b2ff2f8bf8e51a5`
- Review range previously inspected: `f883b81..8d53201`
- Local test suite: 223/223 tests passed
- Format, lint, and TypeScript checks passed
- Committed bundle loaded successfully
- Packaged synthetic fixtures passed
- Temporary clean rebuild exactly matched committed `dist/`
- `npm audit --audit-level=high`: zero vulnerabilities
- Read-only public HTTP checks returned HTTP 200 for:
  - `https://mystiquemide.github.io/skirwith/`
  - `https://github.com/mystiquemide/skirwith`
  - `https://github.com/mystiquemide/skirwith-acceptance`
  - Confirmed GitHub Actions run `30886636409`
  - Confirmed Sepolia transaction `0x4c2e25779a1bccd11db69dd68ba5aa25a5a164d3010e1a34001a55750c7dddb0`

### Verification Limitations

- Browser automation was unavailable, so the live site was not visually or interactively inspected.
- Responsive behavior, keyboard navigation, contrast, and screen-reader output were not independently verified.
- Authenticated KeeperHub dashboards and GitHub maintainer-only state were not accessed.
- No live payment or service mutation was performed.
- No demo video or final submission page existed to inspect.

## Final Recommendation

**Do not submit the current revision.**

The project has a strong hackathon concept and unusually good safety engineering, but its central replay guarantee is not trustworthy across the product rename, and the submission artifacts are incomplete. Fix the migration first, then produce the immutable release and actual demo.
