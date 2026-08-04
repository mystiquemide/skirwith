# Combined Product, Repository, UX, Page, and Hackathon Audit

## Executive Summary

Overall grade: **B- technically, C+ for submission readiness**.

Skirwith is a credible, security-conscious GitHub Action with strong automated testing, real KeeperHub/Sepolia evidence, reproducible packaging, and unusually disciplined trust boundaries for a hackathon project. The previously serious replay defect introduced by the rebrand has been corrected through authenticated legacy-receipt compatibility.

The three highest remaining risks are:

1. The required demo video is still missing.
2. The mandatory numbered `AMD-*` migration amendment is absent.
3. The public experience explains the implementation better than it helps a new maintainer confidently adopt it.

The three best opportunities are:

1. Turn the existing evidence into a crisp, judge-first three-minute demonstration.
2. Improve action summaries and receipt comments with clear next steps.
3. Convert the single landing page into a tighter proof/setup/recovery journey without building a dashboard.

No production code was modified during this audit.

## 1. Repository Map

### Purpose

Skirwith is a GitHub Action that turns an eligible merged pull request into one policy-controlled USDC transfer through KeeperHub on Ethereum Sepolia.

Its core promise is not merely automated payment. It is:

- trusted configuration;
- simulation before broadcast;
- exactly one broadcast;
- replay suppression;
- refusal before broadcast;
- signed, publicly inspectable evidence.

Evidence: `README.md:3-18`, `PROJECT_PLAN.md:17-28`.

### Stack

- Strict TypeScript ESM
- GitHub JavaScript Action
- Node 24 action runtime
- GitHub REST API
- KeeperHub Direct Execution API
- Vitest
- ESLint and Prettier
- NCC-generated action bundle
- Static GitHub Pages site

### Main Control Flow

```text
pull_request.closed event
    → parse trusted runtime secrets
    → normalize event
    → fetch fresh GitHub state
    → load config from default branch
    → evaluate policy
    → derive current and legacy identities
    → find authenticated receipt
    → simulate exact transfer
    → save durable reservation
    → broadcast once
    → poll existing execution
    → save signed receipt
    → publish outputs and action summary
```

Key implementation:

- Entrypoint: `src/action.ts:58`
- Orchestration: `src/execution/orchestrator.ts:79`
- Policy: `src/policy/`
- Identity: `src/payment/`
- GitHub state and receipts: `src/github/`
- KeeperHub adapter: `src/keeperhub/`
- Evidence and summaries: `src/evidence/`, `src/output/`

### Repository Surfaces

| Area | Purpose |
|---|---|
| `src/` | Production action implementation |
| `tests/` | Unit, integration-style, adversarial, and packaged tests |
| `dist/` | Committed GitHub Action bundle |
| `.github/workflows/ci.yml` | Node 24 CI pipeline |
| `docs/index.html` | Single-page public product/proof site |
| `docs/PHASE3-EVIDENCE.md` | Live execution evidence |
| `docs/DEMO_VIDEO_PLAN.md` | Three-minute demo script |
| `docs/SUBMISSION.md` | Submission archive and preflight |
| `PROJECT_PLAN.md` | Approved requirements and gates |
| `PROJECT_STATE.md` | Execution history and claims |

### Surprises

- The codebase is more safety-focused than most hackathon projects.
- The website is intentionally static and has no application backend.
- The strongest live transaction proof is a self-payment to the organization wallet.
- `test:coverage` exists but currently fails because `@vitest/coverage-v8` is absent.
- The current state file still contains stale “Not Started” claims at `PROJECT_STATE.md:74`.

## 2. Repository Audit

### Architecture and Design

#### Strengths

- Domain logic is separated from provider and GitHub adapters.
- External dependencies are injected.
- The action entrypoint primarily composes dependencies.
- Durable reservation happens before broadcast.
- Broadcast is not automatically retried.
- Legacy identity compatibility is isolated rather than spread across the system.

#### Medium — Orchestrator remains the principal complexity hotspot

Fact: `SettlementOrchestrator` owns policy evaluation, identity lookup, duplicate resolution, simulation, reservation, broadcast, polling, persistence, retry, and evidence creation.

Location: `src/execution/orchestrator.ts:46`.

Judgment: This remains acceptable for a hackathon modular monolith, but future features will make the class difficult to reason about.

Consequence: Adding another execution state or recovery method could create subtle ordering regressions.

Recommendation: Do not refactor before submission. Afterward, extract narrowly focused “resolve existing” and “execute new” collaborators while preserving the tested orchestration order.

Severity: Medium after the hackathon; Low before submission.

### Code Quality

#### Medium — Raw exceptions can reach action logs in bootstrap failures

Fact: JSON event-read failures and top-level rejected promises use `console.error(error)`.

Locations:

- `src/action.ts:119-125`
- `src/action.ts:156-160`

Most operational errors use safe public messages, but these paths print raw unknown errors.

Consequence: A runtime or dependency error may expose more internal detail than intended.

Recommendation: Map bootstrap errors through the same safe error/redaction boundary used by `run()`.

Severity: Medium because this is a secret-bearing action.

#### Low — Public summaries expose codes without explaining what to do

Fact: Summaries list status, policy, reason codes, and errors, but no status-specific recovery instruction.

Location: `src/output/summary.ts:13-53`.

Consequence: Maintainers must search documentation to understand `manual-review`, `pending`, or a policy reason code.

Recommendation: Add deterministic next-step copy based on status and error code.

### Security

#### Strong controls

- No PR code checkout in the secret-bearing workflow.
- Default-branch configuration is loaded through GitHub.
- Recipient and amount are maintainer-controlled.
- Receipt comments are authenticated.
- Legacy receipt compatibility preserves replay safety.
- Unknown execution outcomes fail to manual review.
- CI actions are commit-pinned.
- Dependency audit previously reported zero vulnerabilities.

#### Governance blocker — Migration is not represented by the required AMD format

Fact: CP-028 and DEC-012 describe the legacy migration, but no numbered `AMD-*` artifact exists.

Locations:

- `PROJECT_STATE.md:634-653`
- `PROJECT_STATE.md:670`
- Amendment requirement: `PROJECT_STATE.md:788`

Consequence: The technical fix is sound, but formal authorization, affected scope, rollout, risk, and approval are not recorded according to the project’s own rules.

Severity: Blocker for formal release approval; not a production-code vulnerability.

### Testing

#### Strong practices

- 235 tests pass in 25 files.
- Legacy confirmed, pending, conflict, and absent-receipt paths are covered.
- Tests assert provider-call counts, not just output status.
- Pagination cycles are tested.
- Packaged fixtures cover confirmed, blocked, and safe-failure outcomes.
- The generated bundle matches source.

#### Medium — Coverage command is broken

Fact:

```text
npm run test:coverage
MISSING DEPENDENCY Cannot find dependency '@vitest/coverage-v8'
```

Locations:

- Script: `package.json:19`
- Coverage configuration: `vitest.config.ts`

Consequence: The repository advertises a verification command that cannot run from the locked dependency set.

Recommendation: Add the matching coverage provider or remove the unsupported script/configuration. Do not invent a coverage threshold merely for appearance.

#### Low — No automated site accessibility or responsive test

Fact: No Playwright, Cypress, axe, or equivalent site test exists.

Consequence: The plan’s accessibility requirement is supported mainly by markup inspection and manual claims.

Recommendation: For the hackathon, record manual mobile, keyboard, zoom, and contrast verification. Post-hackathon, add a small static-page accessibility smoke test.

### Performance and Reliability

#### Strong practices

- Polling is bounded.
- Receipt persistence retry is bounded.
- Comment pagination is bounded and cycle-aware.
- No database or unnecessary persistent service was added.
- The static site has negligible server-side operational risk.

#### Low — External font and background image add unnecessary availability dependencies

Locations:

- Google Fonts: `docs/index.html:15-17`
- Unsplash background: `docs/index.html:55-60`

Consequence: The landing page remains usable if these fail, but visual presentation can degrade during judging.

Recommendation: Prefer the existing system-font fallback and consider localizing or removing the decorative image before final capture. This is not worth delaying submission if the page already renders correctly.

### Dependencies

#### Strong practices

- Small runtime dependency set.
- Lockfile exists.
- `undici` is explicitly overridden.
- CI uses `npm ci`.
- Audit previously returned zero vulnerabilities.

#### Low — Some development dependencies are older major versions

This is not presently a release risk because the build and tests pass. Avoid a broad dependency upgrade before submission.

### DevEx and Operations

#### Strong CI gates

CI runs:

- install;
- format;
- lint;
- typecheck;
- tests;
- audit;
- build;
- bundle load;
- packaged verification.

Location: `.github/workflows/ci.yml:22-30`.

#### Low — Package runtime policy is wider than verified CI

Fact: `engines` allows Node 20, 22, and 24, but CI runs only Node 24.

Locations:

- `package.json:8-10`
- `.github/workflows/ci.yml:20`

Consequence: Node 20/22 compatibility is claimed but not continuously proven.

Recommendation: Either narrow `engines` to the supported release policy or add a lightweight compatibility matrix after the hackathon.

### Documentation

#### High — Submission video is still missing

Fact: `docs/SUBMISSION.md:7` says the video is pending.

Consequence: The hackathon package is incomplete.

#### Medium — Current project state contradicts itself

Fact: Phase 4 is in progress, but “Not Started” still lists all implementation phases and live evidence.

Locations:

- `PROJECT_STATE.md:65-67`
- `PROJECT_STATE.md:74-78`

Consequence: Judges probably will not read it, but future executors and reviewers may misinterpret project status.

#### Low — Post-tag work lacks a checkpoint

The release pinning and link archive were committed after CP-028 without a new checkpoint.

## 3. Hackathon Audit

### Product and Feature Score: 8/10

The core feature is narrow, demonstrable, and sponsor-relevant.

Best product proof:

- one confirmed payment;
- replay with no second payment;
- refusal before broadcast;
- uncertain provider response without rebroadcast.

The project’s strongest feature is its explicit treatment of uncertainty. That is more persuasive than simply showing a successful transaction.

### Technical Execution Score: 8/10

The repository has:

- real on-chain evidence;
- deterministic policy;
- replay protection;
- signed receipts;
- exact simulation/broadcast parity;
- source/bundle reproducibility;
- adversarial tests.

The technical story is credible.

### Security Score: 8/10

The previous rebrand defect is now technically addressed. Formal governance remains incomplete, but the implementation itself is materially safer.

### KeeperHub Integration Score: 9/10

KeeperHub is central rather than decorative:

- simulation;
- direct execution;
- execution IDs;
- polling;
- idempotency;
- uncertain-response recovery;
- public on-chain proof.

### UX Score: 7/10

The site explains the product well but does not yet optimize the first-time maintainer’s decision path.

A visitor must answer four questions:

1. Is this real?
2. Is it safe?
3. Can I install it?
4. What happens when it fails?

The page contains all four answers, but proof and setup are denser than necessary.

### Submission Completeness Score: 5/10

Present:

- public repository;
- release tag;
- public site;
- acceptance repository;
- transaction evidence;
- demo script;
- submission archive.

Missing:

- actual video;
- video URL;
- final submission page/archive;
- formal AMD record;
- final release checkpoint.

### Competitive Positioning

Best positioning:

> Skirwith pays an approved contributor after a verified merge—once—with signed proof and no automatic rebroadcast.

Do not lead with “crypto payroll.” Lead with “safe settlement after accepted work.”

Competitive advantages:

- deterministic rather than AI-decided authorization;
- GitHub-native;
- observable refusal states;
- signed replay evidence;
- explicit uncertainty handling.

Competitive weaknesses:

- self-payment live proof is less emotionally persuasive than paying a separate controlled wallet;
- setup remains configuration-heavy;
- there is no one-command installer;
- no final demo exists.

### Five-Judge Simulation

| Judge | Score | Likely response |
|---|---:|---|
| Product | 7.5/10 | Clear problem and focused MVP; wants stronger adoption story |
| Engineering | 8.5/10 | Strong architecture, tests, and failure handling |
| Security | 8/10 | Good controls; asks about migration governance and secret rotation |
| Design | 7/10 | Clean proof page, but setup and evidence are dense |
| End user | 6.5/10 | Understands the value but may hesitate during configuration/recovery |

Combined: **7.5/10 before video**, potentially **8+/10 with an excellent demo**.

## 4. Page and Product Audit

### Existing Page Inventory

Because this is a GitHub Action, “pages” include GitHub-generated action surfaces and documentation—not only HTML routes.

| Surface | Status | Purpose | Main gap |
|---|---|---|---|
| Public landing page | Complete | Value, proof, safety, setup, docs | Dense proof/setup; no video CTA |
| README | Complete | Repository onboarding | Long for judge scanning |
| GitHub Action summary | Partial | Run outcome | Missing human next step |
| PR receipt comment | Partial | Durable evidence | Missing plain-language status explanation |
| Phase 3 evidence document | Complete | Audit trail | Technical density |
| Configuration guide | Complete | Setup reference | Could benefit from copy-ready starter block |
| Security guide | Complete | Trust model | Strong but judge-unfriendly |
| Demo plan | Complete as plan | Recording script | Actual video absent |
| Submission archive | Partial | Final links and disclosure | Video/submission URL pending |
| Recovery/troubleshooting | Partial | Resolve blocked/pending states | Split across README and docs |
| Release page | Partial external surface | Immutable version | Needs release notes optimized for judges |

### Missing Pages or Surfaces

#### P0: Demo/video surface

Not necessarily a new route. Add a hero or proof-section link once the video exists:

- “Watch the 3-minute demo”
- release SHA shown beside it
- runtime under three minutes
- clear testnet disclosure

#### P1: Dedicated recovery guide

A concise document or landing-page anchor covering:

- blocked;
- pending;
- manual review;
- duplicate;
- failed;
- missing secret;
- insufficient funds;
- provider unavailable.

This should not become an admin dashboard.

#### P1: Judge verification path

Create a compact section or document:

> Verify Skirwith in five minutes

It should link, in order, to:

1. confirmed PR;
2. GitHub Actions run;
3. KeeperHub execution ID;
4. explorer transaction;
5. replay evidence;
6. refusal evidence;
7. release tag.

#### P2: Copy-ready starter page

The current setup is adequate, but a single copy sequence would improve activation:

1. create secret;
2. copy config;
3. copy workflow;
4. add labels;
5. merge controlled test PR;
6. verify result.

Do not build a configuration wizard before submission.

## 5. Implementation Mapping

### Landing Page

#### Components

- fixed navigation;
- hero;
- workflow steps;
- proof statistics;
- transaction table;
- safety list;
- setup steps;
- recovery section;
- documentation links;
- footer disclosure;
- theme toggle.

#### Data Requirements

Currently hardcoded:

- transaction count;
- transaction rows;
- evidence links;
- release SHA;
- testnet disclosures.

That is appropriate for a static hackathon site. Avoid introducing an API or database.

#### Required States

- external font unavailable;
- background image unavailable;
- narrow viewport;
- table horizontal overflow;
- reduced motion;
- JavaScript/localStorage unavailable;
- broken external link;
- light and dark contrast;
- keyboard focus.

### Action Summary

#### Components

- outcome heading;
- status explanation;
- policy decision;
- transaction proof;
- reason list;
- next action;
- security note when no broadcast occurred.

#### Data Requirements

Already available through `EvidenceRecord` and display metadata.

#### Required States

- confirmed;
- duplicate;
- blocked;
- pending;
- manual review;
- failed;
- unexpected bootstrap failure.

### Receipt Comment

#### Components

- human-readable status;
- transaction/execution identifiers;
- next step;
- hidden authenticated marker.

#### Required States

- confirmed;
- pending;
- failed;
- duplicate;
- manual review.

## 6. Content Wireframes

### Page 1: Landing and Judge Proof

#### Hero

- Eyebrow: “GitHub-native contributor settlement”
- Headline: “Pay approved contributors after a verified merge—once.”
- Supporting copy: “Skirwith reads trusted repository policy, simulates the exact USDC transfer through KeeperHub, broadcasts once, and posts signed evidence back to the pull request.”
- Primary CTA: “Watch the 3-minute demo”
- Secondary CTA: “Verify the live proof”
- Disclosure: “Ethereum Sepolia testnet proof of concept.”

#### Sections

1. The problem
   - Accepted work and payment are separate processes.
   - Manual settlement creates delays, wrong recipients, and duplicate-payment risk.
2. How it works
   - Verify merge.
   - Load trusted policy.
   - Resolve recipient and fixed amount.
   - Save reservation.
   - Simulate.
   - Broadcast once.
   - Post receipt.
3. Three-state proof
   - Confirmed transfer.
   - Replay, no second transfer.
   - Refusal, no broadcast.
4. What happens on uncertainty
   - Preserve existing execution.
   - Stop automatic processing.
   - Require manual review.
   - Never automatically rebroadcast.
5. Setup preview
   - Config.
   - Workflow.
   - Secrets.
   - Labels.
   - Controlled test PR.

#### Cards

- “Confirmed” — one on-chain transaction with matching proof.
- “Duplicate” — original proof returned, zero new broadcasts.
- “Blocked” — policy stopped the run before KeeperHub broadcast.
- “Manual review” — outcome is uncertain; the action refuses to try again automatically.

#### Social Proof

Use evidence rather than testimonials:

- 7 on-chain-confirmed testnet transactions.
- 1 verified replay with no second transfer.
- 2 refusal types with `broadcastMade: false`.
- 235 automated tests.
- Immutable `v0.1.0` release SHA.

#### Final CTA

- Primary: “Copy the trusted workflow”
- Secondary: “Read the security model”
- Small print: “Testnet only. One chain and one token. No production or mainnet claim.”

### Page 2: Setup Guide

#### Hero

- Headline: “Run a controlled Skirwith test in your repository.”
- Supporting copy: “Start on Sepolia with a funded KeeperHub organization wallet and one test contributor mapping.”
- CTA: “Copy the configuration”

#### Sections

1. Before you begin
2. Create the receipt-signing secret
3. Add trusted default-branch configuration
4. Add the pinned workflow
5. Create required labels
6. Merge a controlled test PR
7. Verify the receipt and transaction
8. Troubleshoot safely

#### Cards

- Required secret
- Required GitHub permissions
- Required testnet funds
- Required labels

#### Social Proof

- Link to the exact acceptance repository setup.
- Link to a successful action run.
- Link to the immutable release.

#### Final CTA

- “Run your first controlled test”
- Secondary: “Check troubleshooting before retrying”

### Page 3: Recovery Guide

#### Hero

- Headline: “Understand the outcome before taking another action.”
- Supporting copy: “Skirwith does not automatically retry uncertain payments. Use the recorded status and execution ID to choose the safe next step.”
- CTA: “Find your status”

#### Sections

1. Blocked
2. Pending
3. Manual review
4. Duplicate
5. Failed
6. Missing configuration or secret
7. Provider unavailable

#### Cards

Each state card should contain:

- What happened
- Whether a broadcast occurred
- What to verify
- What not to do
- Safe next step

#### Social Proof

Link to PRs #4, #6, and #7 as real uncertain-response examples with no second broadcast.

#### Final CTA

- “Review the evidence before retrying”
- Secondary: “Open the KeeperHub integration guide”

### Page 4: Judge Verification Guide

#### Hero

- Headline: “Verify Skirwith’s claims from public evidence.”
- Supporting copy: “Every core claim maps to a GitHub run, signed receipt, execution ID, or Sepolia transaction.”
- CTA: “Start with the confirmed payout”

#### Sections

1. Verify confirmed payment
2. Verify replay suppression
3. Verify refusal before broadcast
4. Verify uncertain-response handling
5. Verify tagged source and bundle
6. Review limitations

#### Cards

- Claim
- Evidence
- Independent verification method
- Expected result

#### Social Proof

The evidence itself is the proof. Avoid testimonials or invented adoption claims.

#### Final CTA

- “Review the release”
- Secondary: “Watch the demo”

## 7. UX Writing and Microcopy Audit

| Location | Current copy | Improved copy | Reason |
|---|---|---|---|
| Hero | “Pay approved contributors after a merged pull request.” | “Pay approved contributors after a verified merge—once.” | Adds the central replay-safety differentiator. |
| Hero lead | “Policy controls the payout. Replays never pay twice.” | “Repository policy controls the recipient and amount. A replay returns the existing proof instead of sending another payment.” | Explains how the claim is achieved. |
| CTA | “Set it up” | “Copy the setup” | More specific and lower-friction. |
| CTA | “View the acceptance repo” | “Verify the live proof” | Speaks to the visitor’s goal rather than the destination type. |
| Proof heading | “Confirmed transactions” | “On-chain transaction evidence” | Avoids conflict with pending action-receipt states. |
| Status cell | `pending*` | “Receipt pending · transaction confirmed” | An asterisk requires extra cognitive work and can look contradictory. |
| Proof statistic | “0 double payments.” | “0 additional transactions across tested replays and uncertain outcomes.” | Bounds the claim to demonstrated evidence. |
| Setup prerequisite | “Use any long random string.” | “Generate a unique, high-entropy receipt-signing secret and store it as `SKIRWITH_RECEIPT_SECRET`.” | Safer and more actionable. |
| Expected result | “If policy passes…” | “When policy passes and KeeperHub completes the transfer, Skirwith posts a receipt with the execution ID and Sepolia transaction link.” | States observable output more precisely. |
| Recovery | “Check the run log for the reason code…” | “Open the action summary, find the status and reason code, then follow the matching recovery step below.” | Gives a deterministic sequence. |
| Action summary | `Status: manual-review` | “Status: Manual review required” | Human-readable and action-oriented. |
| Action summary | `Broadcast made: no` | “Broadcast: Not attempted” or “Broadcast: Not repeated” | “No” is ambiguous across blocked and replay states. |
| Action summary | `Reasons: blocked-missing-required-label` | “Why it stopped: The required payout label is missing.” | Display the safe message prominently; retain the code secondarily. |
| Error heading | `Error:` | “What needs attention:” | Less alarming and more useful for expected operational conditions. |
| Receipt | `Status: pending` | “Status: Waiting for confirmation” | Better communicates state without implying failure. |
| Receipt | `Status: duplicate` | “Status: Existing payment found” | “Duplicate” can imply an unwanted duplicate transaction occurred. |
| Receipt | `Status: blocked` | “Status: Stopped before broadcast” | Reinforces the safety outcome. |
| Manual review copy | “A prior execution for this payment requires manual review.” | “A previous attempt has an uncertain outcome. Review its execution evidence before taking further action. Skirwith will not broadcast again automatically.” | Explains why and gives the safe next step. |
| Auth failure | “KeeperHub authentication failed.” | “KeeperHub could not authenticate this request. Verify the configured API secret and try again. The secret value was not logged.” | Adds next action without exposing internals. |
| Rate limit | “KeeperHub rate limit reached.” | “KeeperHub temporarily limited this request. Wait before running the workflow again. Confirm the existing receipt first to avoid unnecessary retries.” | Guides safe retry behavior. |
| Generic error | “An unexpected error occurred.” | “Skirwith could not complete this run safely. No further action was taken automatically. Review the action logs and existing receipt before retrying.” | Gives safe recovery while avoiding internal details. |
| Theme toggle aria-label | Static “Toggle dark mode” | Dynamic “Switch to light theme” / “Switch to dark theme” | Current label becomes inaccurate after toggling. |

### Reusable Status-Copy System

Use consistent fields across summaries, receipts, docs, and the website:

- **Outcome:** Confirmed / Existing payment found / Stopped before broadcast / Waiting for confirmation / Manual review required / Failed safely
- **Broadcast:** Sent once / Not attempted / Not repeated / Outcome uncertain
- **What happened:** One sentence
- **Next step:** One explicit action
- **Reference:** reason code, payment key, execution ID, or transaction

This improves cognitive clarity and screen-reader navigation.

## 8. Improvement Strategy

### Theme 1: Finish evidence before adding product scope

Target state: every submission requirement has a public immutable URL tied to the release SHA.

Principle: evidence outranks polish.

Done when:

- video exists and is under three minutes;
- video references `v0.1.0`;
- final submission URL is archived;
- all links work logged out;
- claims match the repository and transaction evidence.

### Theme 2: Make operational outcomes self-explanatory

Target state: every action outcome tells the maintainer what happened, whether a broadcast occurred, and what to do next.

Principle: safe systems must make the safe next action obvious.

Done when:

- summaries contain status-specific guidance;
- receipt wording distinguishes action state from chain state;
- recovery documentation covers every supported terminal state;
- no message blames the user or recommends blind retrying.

### Theme 3: Preserve auditability

Target state: migration and release history follow the project’s own AMD/checkpoint rules.

Principle: security decisions must remain understandable after the original implementer leaves.

Done when:

- numbered AMD entry exists;
- post-tag checkpoint exists;
- stale status sections are corrected;
- state, tag, bundle, and submission archive agree.

### Theme 4: Keep the product surface intentionally small

Target state: one high-quality landing page plus focused setup, recovery, and judge-verification documents.

Principle: the product is the GitHub Action, not a dashboard.

Do not build:

- database;
- dashboard;
- account system;
- dynamic transaction API;
- multi-chain interface;
- visual configuration builder;
- analytics platform.

These are poor effort-to-value trades before submission.

## 9. Prioritized Task Plan

| Milestone | Task | Areas | Acceptance criteria | Effort | Change risk | Dependencies |
|---|---|---|---|---:|---|---|
| M0 | Repair coverage command | `package.json`, lockfile, Vitest config | `npm run test:coverage` runs successfully | S | Low | None |
| M0 | Capture final manual accessibility checklist | `docs/SUBMISSION.md` or release evidence | Keyboard, focus, 200% zoom, mobile, contrast, reduced-motion results recorded | S | None | Live site |
| M1 | Create formal AMD migration record | Plan/state governance | Numbered approved AMD contains every required field | S | None | Human approval |
| M1 | Record and publish demo video | Demo and submission assets | Under 3 minutes, logged-out URL, exact release SHA, no secrets | M | Low | Stable release |
| M1 | Archive final submission | `docs/SUBMISSION.md`, state | Submission URL and final payload recorded | S | None | Video |
| M2 | Add outcome-specific next steps | Action summary and receipt presentation | Every status explains broadcast state and safe next action; tests pass | M | Medium | Copy approval |
| M2 | Add focused recovery guide | Docs/site | Covers blocked, pending, manual review, duplicate, failed, config, funding | S | None | Status copy |
| M2 | Add judge verification path | Site/docs | Core claims verifiable in five minutes from ordered links | S | None | Video URL |
| M2 | Add packaged legacy fixture | Packaged verification | `dist` proves legacy confirmed receipt causes zero broadcast | M | Low | Existing legacy tests |
| M3 | Add static accessibility smoke check | CI/site | Automated semantic/accessibility test runs in CI | M | Low | Tool selection |
| M3 | Narrow or matrix-test Node support | CI/package | Every claimed Node major is tested, or engines reflect actual support | S/M | Low | Release policy |
| M3 | Decompose orchestrator only if scope grows | Execution modules | No behavior change; existing tests stay green | L | High | Post-hackathon only |

### Quick Wins

1. Change “pending*” to “Receipt pending · transaction confirmed.”
2. Add a “Watch the demo” CTA once the video exists.
3. Fix the dynamic theme-toggle accessible label.
4. Repair `npm run test:coverage`.
5. Correct stale “Not Started” state text.
6. Add the missing post-tag checkpoint.

### Top-Three Implementation Sketches

#### 1. Formal migration amendment

- Create the required numbered AMD artifact through the authorized planning workflow.
- State the original persisted identity contract.
- State the rebrand-induced incompatibility.
- Record dual-read behavior and new-write behavior.
- Define the migration window and removal condition.
- Include affected requirements, tests, risks, rollback, approval, and checkpoint.
- Ensure DEC-012 references the AMD rather than replacing it.

Gotcha: do not rewrite historical live receipt evidence.

#### 2. Demo video

- Record against the immutable release SHA.
- Open every tab before recording.
- Show the confirmed PR, action run, KeeperHub execution ID, and Transfer event.
- Show replay with the same receipt and no second transaction.
- Show refusal with `broadcastMade: false`.
- State that transactions are Sepolia self-payments.
- End with repository, release, site, and submission URLs.

Gotcha: distinguish “on-chain confirmed” from “action receipt pending” for PRs #4/#6/#7.

#### 3. Outcome-specific summary copy

- Add a pure mapper from `EvidenceRecord.status` plus broadcast state to:
  - display title;
  - explanation;
  - next step.
- Render it in summaries and optionally receipt comments.
- Keep stable machine codes unchanged.
- Add table-driven tests for every state.
- Never recommend rerunning before checking existing evidence.

Gotcha: a blocked run and duplicate run both have no broadcast, but for different reasons.

## 10. Open Questions

1. Is the user-facing product intended to remain testnet-only after the hackathon?
2. How long must legacy `mergepay:` receipts and environment names remain supported?
3. Should Node 20 and 22 remain officially supported, or is Node 24 now the sole release target?
4. Will the final video use only the original confirmed PR, or also show one uncertain-response case?
5. Is a separate controlled recipient wallet available for a stronger demonstration without involving real third-party funds?
6. Does the hackathon provide a specific scoring rubric or onboarding bounty requirement that should alter the final pitch?
7. Should the final submission optimize primarily for technical judges, product judges, or the KeeperHub onboarding bounty?

## Final Assessment

The project does not need more product scope. It needs completion, sharper operational language, and a judge-proof evidence path.

The technical foundation is strong enough to compete. The missing demo and incomplete governance trail are now more dangerous than the remaining code-quality issues.

## Audit Methods and Limitations

### Skills Applied

- Elite Hackathon Submission Audit
- Repository Audit and Improvement Plan
- UX Writing and Microcopy Audit
- Page Planning and Product Audit

### Reproduced Evidence

- Repository HEAD inspected: `c28b5727d8c13082d4227941a3a155fa7130e003`
- Release tag inspected: `v0.1.0`
- Full test suite previously reproduced: 235/235 passing
- Format, lint, typecheck, bundle load, packaged verification, clean bundle diff, and dependency audit previously passed
- `npm run test:coverage` reproduced as failing due to missing `@vitest/coverage-v8`

### Limitations

- Browser automation was unavailable.
- Live responsive behavior, keyboard navigation, zoom, contrast, and screen-reader output were not independently exercised.
- Public HTTP links had previously been checked successfully, but network resolution was unavailable during the latest combined audit pass.
- No live KeeperHub transaction, GitHub mutation, deployment, release, or submission action was performed.
- The demo video and final submission page did not exist and could not be reviewed.
