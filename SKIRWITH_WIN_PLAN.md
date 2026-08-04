# Skirwith — Win Plan

## 1. Executive Verdict

Skirwith can place highly, but it is not ready to win today.

The engineering is stronger than the submission. That imbalance will cost points unless corrected. Judges will see a thoughtful GitHub Action, real KeeperHub transactions, replay protection, signed receipts, and refusal-before-broadcast. They will also see an absent demo video, a confusing repository history, self-payment evidence, stale documentation, and claims that require too much reading to verify.

The most dangerous weakness is not the code. It is presentation latency: the core value takes too long to understand.

A tired judge must grasp this within ten seconds:

> A merge triggers one policy-approved KeeperHub payment. A replay returns the original proof. An invalid payout stops before broadcast.

Current one-line pitch:

> Skirwith is a GitHub Action. It pays an approved contributor after a merged pull request.

This undersells the security differentiator and sounds like generic payment automation.

Use:

> **Skirwith turns a verified merged pull request into one policy-controlled KeeperHub payment—with signed proof, replay suppression, and refusal before broadcast.**

### Verified Hackathon Facts

- Hackathon: KeeperHub Agents Onchain
- Sponsor: KeeperHub
- Deadline recorded in project evidence: August 13, 2026 at 10:00
- Required:
  - public source repository;
  - demo video;
  - real on-chain KeeperHub execution evidence.
- Prize pool recorded in project evidence: $5,000
- Official judging rubric: **not present in the repository and not independently verified during this review**
- Possible onboarding UX bounty: mentioned through a secondary source, not sufficiently authoritative to treat as guaranteed

### Immediate Losing Conditions

1. Demo video remains missing.
2. The opening 30 seconds explain configuration before proving the result.
3. “Seven confirmed transactions” is shown beside three `pending` receipts without immediate clarification.
4. Self-payments are presented as contributor payouts without a prominent disclosure.
5. The repository remote still references the old `mergepay` name locally.
6. The release tag predates later documentation commits, making the final evaluated revision ambiguous.
7. The project’s mandatory `AMD-*` migration process was not followed.
8. The README asks a tired judge to read too much before showing the best evidence.
9. The video script claims “people get paid late, paid twice, or not paid at all” without a documented founder incident or supporting evidence.
10. No final submission URL or video URL exists.

### Brutal Conclusion

Do not add another feature.

The fastest route from “good” to “winner” is:

1. produce an unfakeable three-state demo;
2. restructure the README around verification;
3. make the release and evaluated SHA unambiguous;
4. close the contradictory documentation;
5. replace broad claims with exact public evidence.

## 2. Estimated Judge Score

Because the official rubric is missing, this estimate uses verified requirements and common sponsor-hackathon proxy surfaces. These are not represented as official criteria.

| Surface | Current score | Winning target |
|---|---:|---:|
| Problem clarity | 8/10 | 9/10 |
| Sponsor integration | 9/10 | 10/10 |
| Technical execution | 8.5/10 | 9/10 |
| Security and correctness | 8/10 | 9/10 |
| Live proof | 8/10 | 10/10 |
| Innovation/differentiation | 7/10 | 8/10 |
| User experience/onboarding | 6.5/10 | 8.5/10 |
| Demo quality | 0/10 | 9/10 |
| Repository quality | 7/10 | 9/10 |
| Submission completeness | 4/10 | 10/10 |
| Narrative clarity | 6.5/10 | 9/10 |
| Reproducibility | 8/10 | 9/10 |

Estimated score today: **67/100**

Estimated score after the P0 work in this plan: **88–91/100**

The project is losing roughly twenty points to packaging, evidence presentation, and completion—not missing technical depth.

## 3. Scoring Surface Map

| Judging Surface | Score | Evidence Currently Present | Missing Evidence | Risk | Fix |
|---|---:|---|---|---|---|
| Public repository | 8 | Public GitHub repository and tagged source | Repository URL/name consistency; cleaner audit surface | MEDIUM | Align remote and public naming; remove or relocate internal audit clutter |
| Demo video | 0 | Detailed video plan | Actual video and public URL | HIGH | Record, upload, verify logged out, archive URL |
| Real KeeperHub execution | 9 | Execution ID, action run, Sepolia transaction and Transfer event | Clean visual capture tying all identifiers together | LOW | Show the full evidence chain in one continuous demo sequence |
| Sponsor necessity | 9 | Simulation, execution, polling, idempotency and recovery depend on KeeperHub | Concise explanation of why a direct RPC substitute would not demonstrate the same workflow | LOW | Explicitly show KeeperHub simulation and execution record |
| Confirmed outcome | 9 | Confirmed PR, run, execution ID, transaction | Final screenshot/video frame | LOW | Put the exact run and explorer proof in README and video |
| Replay suppression | 8 | Re-run evidence, unchanged receipt and wallet balance | A compact public “before/after transaction count” visual | MEDIUM | Capture one frame showing the same execution and zero new transaction |
| Refusal before broadcast | 9 | Missing-label and ambiguous-label refusal evidence | More legible summary showing `broadcastMade: false` | LOW | Zoom into the result; avoid showing irrelevant logs |
| Uncertain execution safety | 9 | Three on-chain-confirmed transactions whose receipts stayed pending; no rebroadcast | Simple explanation understandable within ten seconds | MEDIUM | Present one uncertain case, not all three |
| Trust boundaries | 8 | Default-branch config, no checkout, minimum permissions | One diagram or annotated workflow screenshot | MEDIUM | Use a single trust-boundary diagram in README/video |
| Security claims | 8 | Signed receipts, redaction, parity checks, legacy compatibility tests | Formal migration amendment and packaged legacy fixture | MEDIUM | Add AMD record; optionally package-test legacy replay |
| Architecture | 8 | Clear modular TypeScript design and documentation | Short judge-level architecture overview | LOW | Use one diagram, not duplicated prose |
| Test quality | 8 | 235 behavioral tests and packaged verification | Broken coverage command; no site accessibility automation | MEDIUM | Repair or remove broken coverage command |
| Reproducibility | 8 | Lockfile, pinned actions, committed NCC bundle, tag | Clear exact evaluation SHA; final post-video verification | MEDIUM | Create final immutable submission release after all required assets are fixed |
| Onboarding | 6 | README, workflow example, config example | Copy-ready five-minute path; known-good controlled test instructions | MEDIUM | Put one complete setup path before detailed architecture |
| UX | 7 | Polished static proof page | Video CTA, clearer status language, accessible toggle label | MEDIUM | Make proof and next actions primary |
| Accessibility | 5 | Semantic HTML and responsive intent | Recorded keyboard, zoom, mobile and contrast checks | MEDIUM | Perform and archive manual AA-oriented checks |
| Honest disclosures | 9 | Testnet, self-payment, one-chain/token and provider limits disclosed | More prominent disclosure near proof count | LOW | Put disclosure directly beneath the first transaction claim |
| Founder motivation | 2 | Generic problem statement | Verified first-person incident with date, amount, token, chain and consequence | HIGH if used | Do not invent it; omit personal story unless the founder supplies facts |
| Competitive differentiation | 7 | Replay/refusal/uncertainty safety | One decisive comparison against naïve payout automation | MEDIUM | Contrast “trigger a payment” with “prove when not to pay” |
| Submission form | 0 | Preflight template | Final submission URL and archived form contents | HIGH | Complete and save exact submitted text and URLs |
| Eligibility/compliance | 5 | Deadline and basic requirements recorded | Official eligibility and final rubric independently archived | HIGH | Capture official rules before submission |
| Social credibility | 2 | Public evidence exists | No structured proof-led posting record | LOW/MEDIUM | Publish evidence posts, not progress posts |

## 4. Positioning Rewrite

### Winning Frame

Do not frame Skirwith as a broad payroll startup.

Do not frame it as “automating contributor payments.”

That sounds ordinary and immediately invites questions about taxes, mainnet safety, custody, payroll compliance, budgets, approvals, and production readiness.

Frame it as a verifiable settlement primitive:

> **Skirwith converts a maintainer-approved GitHub merge into one bounded KeeperHub testnet payment. It proves three outcomes: successful settlement, replay without a second payment, and policy refusal before broadcast.**

### Judge-First Introduction

> A merged pull request proves that work was accepted. It does not prove that the correct contributor was paid once—or that an invalid or repeated event was safely refused. Skirwith closes that verification gap. It reads recipient and amount only from trusted default-branch policy, simulates the exact transfer through KeeperHub, writes a durable signed reservation, broadcasts once, and posts evidence back to GitHub. The public acceptance repository proves a confirmed Sepolia USDC transfer, a replay with no second transaction, and two policy refusals with no broadcast.

### Founder Story Constraint

The requested founder-story format requires:

- date;
- real situation;
- transaction amount;
- token;
- chain;
- consequence.

No such personal incident is verified in the repository.

Do not invent one.

If a genuine incident exists, use this structure:

> On **[date]**, after **[specific merged contribution]**, I needed to send **[amount] [token]** on **[chain]** to **[role, not private identity]**. The payment required **[specific manual steps]**, and **[specific consequence: delay, wrong address risk, duplicate attempt, lost evidence]** happened. I built Skirwith so the repository—not a chat message or copied wallet address—defines the payment policy, and every execution or refusal leaves verifiable evidence.

If no genuine incident exists, use the proof-based introduction instead.

### Intentional Exclusions

Judges should understand that missing complexity is deliberate:

- No database: GitHub signed receipts and KeeperHub execution identity are sufficient for the testnet proof.
- No daily budget accounting: a stateless action cannot enforce cumulative treasury limits safely without new durable infrastructure.
- No dashboard: GitHub remains the operator and evidence interface.
- No AI decision-maker: authorization must remain deterministic.
- No contributor-controlled amount or wallet: both come from protected policy.
- No automatic uncertain retry: avoiding duplicate payments is more important than automatic recovery.
- No multi-chain or multi-token abstraction: one verified flow is stronger than several unproven integrations.
- No custom contract: KeeperHub is the execution rail; another contract would add attack and review surface without proving the core idea.
- No mainnet claim: all evidence is explicitly Sepolia testnet evidence.

### Sponsor-Native Explanation

> KeeperHub is load-bearing. Skirwith uses KeeperHub to simulate the exact transfer, execute it with a stable idempotency key, return an execution ID, expose execution status, and recover uncertain responses without creating a new transaction. Removing KeeperHub removes the settlement and recovery proof.

## 5. README Blueprint

### Exact Section Order

| Order | Section | Purpose | Maximum length | Required assets |
|---:|---|---|---:|---|
| 1 | Hero | Explain outcome and differentiation instantly | 5 lines | One-line pitch, testnet badge, demo CTA |
| 2 | Watch and verify | Give judges the shortest evidence path | 8 lines | Video, confirmed PR, run, execution ID, explorer link |
| 3 | Three-state proof | Show success, replay and refusal | One compact table | Three screenshots or linked evidence rows |
| 4 | Why KeeperHub is essential | Prove sponsor-native integration | 100 words | Execution-flow diagram |
| 5 | How it works | Explain the seven-step path | 7 bullets | One architecture diagram |
| 6 | Security invariants | State the rules that cannot be bypassed | 8 bullets | Links to security tests |
| 7 | Quickstart | Enable a controlled first run | 40 lines plus code | Pinned workflow and config |
| 8 | Outcome guide | Explain statuses and next actions | One table | Confirmed, duplicate, blocked, pending, manual review, failed |
| 9 | Evidence and limitations | Prevent claim disputes | 120 words | Self-payment and testnet disclosure |
| 10 | Reproduce locally | Prove build and tests | 12 lines | Exact commands |
| 11 | Repository map | Help technical judges navigate | 8 bullets | File links |
| 12 | License and submission | Close cleanly | 6 lines | MIT reference, release, submission link |

### Section Specifications

#### Hero

Purpose: establish the project’s exact value before scrolling.

Use:

> # Skirwith  
> **One verified merge. One policy-controlled KeeperHub payment. Signed proof.**  
> Skirwith refuses invalid payouts before broadcast and resolves replays without sending a second transaction.  
> Ethereum Sepolia testnet proof of concept.

Assets:

- “Watch the 3-minute demo”
- “Verify the confirmed transaction”
- “Inspect v0.1.0”

#### Watch and Verify

Purpose: give judges public links without making them search.

Required:

- demo video;
- PR #1;
- action run `30886636409`;
- execution `mn7vnwz2rednekykkww8d`;
- transaction `0x4c2e…dddb0`;
- replay evidence;
- refusal run.

#### Three-State Proof

Use:

| State | Trigger | Observable result | Proof |
|---|---|---|---|
| Confirmed | Eligible merged PR | One 5 USDC Sepolia transfer | Run + execution + explorer |
| Replay | Same event again | Existing receipt; zero new transactions | Same execution and hash |
| Blocked | Required label absent | `broadcastMade: false`; no execution ID | Blocked run |

Do not place seven transaction rows before this table.

#### KeeperHub Section

Maximum 100 words.

Explain exact endpoints and functions. Avoid copying the full integration guide.

#### Security Invariants

Use precise statements:

- PR code is never checked out in the secret-bearing job.
- Recipient and amount come only from protected default-branch configuration.
- Signed reservation must persist before broadcast.
- Simulation and broadcast parameters must match exactly.
- Existing or uncertain execution state prevents a new broadcast.
- Receipt comments must authenticate before becoming authoritative.
- Legacy MergePay receipts remain authoritative.
- Provider errors are mapped to safe public messages.

#### Quickstart

Use one pinned SHA. Do not show placeholders.

Add a warning:

> Run the first test only with a funded testnet wallet and a controlled recipient mapping.

#### Outcome Guide

| Outcome | Meaning | Broadcast state | Next step |
|---|---|---|---|
| Confirmed | Transfer completed | Sent once | Verify explorer link |
| Existing payment found | Matching receipt already exists | Not repeated | Use original proof |
| Stopped before broadcast | Policy failed | Not attempted | Correct trusted config/labels |
| Waiting for confirmation | Existing execution remains active | Not repeated | Check execution status |
| Manual review required | Outcome is uncertain or conflicting | Never automatically repeated | Review receipt and execution |
| Failed safely | No safe settlement completed | See evidence | Correct cause before a controlled rerun |

### Must Include

- One-line differentiated pitch
- Demo video above the fold
- Exact release SHA
- Three-state evidence table
- KeeperHub execution ID
- Explorer transaction link
- Screenshot of the Transfer event
- Screenshot of replay resolving the same proof
- Screenshot of refusal showing no broadcast
- Testnet and self-payment disclosure
- No-checkout trust boundary
- Pinned workflow
- Known limitations
- Reproduction commands
- License
- Submission link once available

### Remove Immediately

- “Who it is for” as a separate section; it adds little judging value.
- Repeated explanations of the same workflow.
- Generic phrases such as “people get paid late, paid twice, or not paid at all” unless grounded in a real story.
- Broad “replays never pay twice” language without “tested” or linked proof.
- Seven-transaction detail before the three-state proof.
- Detailed configuration rules in the top half.
- Redundant architecture lists already present in linked documentation.
- Future roadmap.
- Market-size discussion.
- Tokenomics.
- AI language.
- “Autonomous” if the system is deterministic automation.
- “Production-ready.”
- “Secure” without naming the control.
- Internal audit reports in the primary judge path.
- Historical planning files from the README navigation.
- Stale MergePay names except in the migration disclosure.
- Any placeholder URL.
- Any claim that testnet self-payment is equivalent to production contributor payroll.

### Repository Hygiene

#### Commit Naming

Use:

- `fix:`
- `feat:`
- `test:`
- `docs:`
- `build:`
- `release:`

Avoid vague final commits such as:

> Add comprehensive audit documentation…

Prefer:

> `docs: add final judging and submission audit`

#### Branching

- Freeze production source.
- Use one short-lived `submission/finalize` branch for documentation and video links.
- Require CI before merging.
- Avoid unrelated changes.

#### Tags and Releases

- The judge should evaluate one final release.
- If any production, bundle, README proof, or submission-critical metadata changes after `v0.1.0`, create a new final tag such as `v0.1.1`.
- The video, README and submission form must reference the same release SHA.
- Add release notes with:
  - what is proven;
  - exact KeeperHub transaction;
  - testnet disclosure;
  - known limitations;
  - reproduction commands.

#### File Organization

Keep judge-facing files prominent:

```text
README.md
LICENSE
action.yml
docs/
  DEMO.md
  PHASE3-EVIDENCE.md
  SECURITY.md
  CONFIGURATION.md
  SUBMISSION.md
```

Move internal audit/planning material out of the primary navigation. Do not delete protected project history solely for aesthetics.

#### Licensing

`package.json` says MIT, but no root `LICENSE` file was found.

Add the actual MIT license file before submission.

#### Reproducibility

A fresh clone must support:

```bash
npm ci
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
npm run bundle:check
npm run verify:packaged
```

Repair or remove the broken coverage command before advertising it.

## 6. Architecture Locks

| Decision to freeze | Final decision | Why judges care | Consequence if changed later |
|---|---|---|---|
| Product scope | One GitHub Action, one chain, one token | Demonstrates focus and verified depth | New scope invalidates proof and expands attack surface |
| Chain | Ethereum Sepolia, chain 11155111 | All evidence and token configuration depend on it | New chain requires new discovery, simulation and acceptance proof |
| Token | Sepolia USDC at the documented address, 6 decimals | Amount correctness and explorer evidence depend on it | New token requires precision, allowlist and funding verification |
| Execution rail | KeeperHub Direct Execution API | Sponsor must be essential | Alternate execution weakens sponsor alignment and changes failure semantics |
| Authorization | Maintainer-controlled default-branch config | Prevents contributor-controlled payouts | Moving it into PR content creates a direct theft path |
| Workflow event | `pull_request.closed` with fresh merged-state verification | Avoids trusting stale event claims | Alternate triggers require a new trust analysis |
| Secret-bearing job | Never checkout or execute PR code | Core trust boundary | Any checkout invalidates the security story |
| Recipient source | Protected login-to-wallet mapping | Blocks wallet spoofing | Dynamic recipient input creates payout redirection risk |
| Amount source | One configured label-to-fixed-amount mapping | Blocks amount manipulation | Free-form amounts require new validation and approval design |
| Maximum | Per-payment maximum only | Honest stateless limitation | Daily accounting requires durable storage |
| Payment identity | Repository, PR, merge SHA, version and immutable purpose | Drives replay safety | Any identity change can make old payments invisible |
| Legacy identity | Dual-read `mergepay:` receipts; new writes use `skirwith:` | Preserves live evidence across rename | Removing early can cause duplicate payment |
| Request integrity | Separate canonical request hash | Detects changed content under the same identity | Combining identity and content weakens conflict detection |
| Reservation | Signed durable pending receipt before broadcast | Proves refusal if persistence fails | Broadcast-first ordering reopens cross-run duplicate risk |
| Simulation | Exact transfer parameters, compared before broadcast | Prevents bait-and-switch execution | Any mutable field between stages invalidates simulation proof |
| Broadcast | At most once automatically | Central financial invariant | Automatic retry can duplicate uncertain execution |
| Idempotency | Stable payment key passed to KeeperHub | Provider-side duplicate control | Random keys defeat replay suppression |
| Receipt authority | HMAC-authenticated marker only | Stops fake comments suppressing payments | Syntactic markers alone are forgeable |
| Key rotation | Active and one previous receipt-signing key | Preserves historical receipts | Unlimited keys complicate trust; no previous key breaks rotation |
| Existing confirmed state | Return original proof as duplicate | Judge-visible replay guarantee | Re-execution risks double payment |
| Existing pending with ID | Resume polling original execution | Safely handles delays | New execution creates race/duplicate risk |
| Pending without ID | Manual review | Unknown outcome cannot be retried safely | Automatic retry risks a second transfer |
| Changed request | Manual-review conflict | Prevents silent mutation | Accepting changes can redirect or alter payment |
| Storage model | GitHub signed receipt comments; no database | Keeps hackathon architecture minimal | Database adds migrations, operations and new source-of-truth questions |
| Upgradeability | No smart contract or upgrade proxy | Avoids irrelevant contract governance | Adding one introduces ownership and upgrade-risk review |
| UI | GitHub is the operator surface; static proof site only | Keeps product aligned to workflow | Dashboard creates unproven product scope |
| Release | Immutable commit SHA in consumer workflow | Reproducible evaluation | Mutable tags allow post-review changes |
| Error handling | Stable safe codes; no raw provider errors | Prevents secret/internal leakage | Raw errors weaken security claims |
| Production claim | Testnet proof of concept only | Preserves honesty | Mainnet claim triggers much higher security and compliance expectations |

## 7. Attack & Escape Review

| Attack | Expected result | Mitigation | Automated test | README proof | Demo proof |
|---|---|---|---|---|---|
| Replay same merged event | Original proof returned; zero new broadcast | Current and legacy receipt lookup plus KeeperHub idempotency | Two-run orchestrator/action test with zero second provider calls | Three-state proof table | Show same execution/hash after rerun |
| Rename hides old receipt | Legacy `mergepay:` receipt remains authoritative | Dual-read old purpose, prefix, envelope and signed marker | Legacy confirmed receipt resolves duplicate | Migration note | Optional; do not spend main demo time |
| Same identity, changed amount | Manual review; no broadcast | Separate request hash comparison | Conflict test | Security invariants | Show only if judge asks |
| Forged confirmed comment | Ignored; legitimate payment can proceed | HMAC verification and known key ID | Forged-marker receipt tests | Signed receipt explanation | Zoom into hidden marker only if technically useful |
| Forged comment squats update target | Action creates/updates only authenticated owned receipt | Verify marker before update | Forged-squatter test | Receipt authority statement | Not needed |
| Contributor changes config in PR | Ignored | Fetch config from default branch using GitHub API | Wrong-repository/trusted-ref tests | Trust-boundary diagram | Show default-branch file |
| Contributor changes workflow code | No PR code is checked out or executed | Trusted base workflow and no checkout step | Packaged workflow fixture/manual inspection | Highlight no checkout | Show workflow permissions |
| Contributor supplies wallet in PR text | Ignored | Recipient comes only from protected mapping | Policy/config tests | Security invariant | Show recipient mapping |
| Contributor supplies amount in PR title/body | Ignored | Fixed labels map to configured values | Ambiguous/missing label tests | Security invariant | Show label-to-amount config |
| Two simultaneous workflow runs | Serialized per PR; existing receipt prevents duplicate | GitHub concurrency plus durable reservation | Cross-run tests; workflow review | Workflow snippet | Do not demo unless asked |
| Race after both runs see no receipt | Only persisted reservation permits broadcast | Save reservation before broadcast | Reservation failure and two-run tests | “No reservation, no broadcast” | Mention in narration |
| Reservation save fails | No broadcast | Fail closed before provider call | Save-failure test | Safety invariant | Optional blocked proof |
| Simulation reverts | Failed safely; no broadcast | Broadcast gated on successful simulation | Reverted simulation test | KeeperHub flow | Show simulation only if legible |
| Simulation parameters differ from broadcast | Abort; no broadcast | Exact parity comparison | Parity mismatch tests | Security invariants | One caption: “same exact request” |
| Provider returns malformed JSON | Safe mapped failure | Strict response validation | KeeperHub malformed-response tests | Technical proof link | Not demo-worthy |
| Provider returns no execution ID after broadcast | Durable reservation remains; manual review; no retry | Reservation-first ordering | Post-broadcast failure tests | Uncertain-outcome explanation | Strong optional final technical proof |
| Polling times out | Manual review; no new broadcast | Bounded polling and existing execution ID | Poll-timeout test | Outcome guide | Do not wait live |
| Receipt save fails after broadcast | Retry persistence; fallback preserves reservation | Three bounded receipt-save attempts | Transient and persistent failure tests | Recovery section | Mention real uncertain examples |
| GitHub pagination cycles | Fail closed within request cap | Request counter and visited-page set | Pagination cycle test | Not necessary in main README | Do not demo |
| More than 1,000 comments hide receipt | Fail closed instead of treating it as missing | Ten-page cap | Page-limit test | Limit disclosure | Do not demo |
| Receipt secret rotated | Active or previous key verifies | One previous-key migration window | Rotation tests | Secret rotation section | Not demo |
| KeeperHub API key rotated | Receipt validity unchanged | Separate receipt-signing secret | Key-separation tests | Security section | Not demo |
| Attacker learns receipt key | Can forge receipt state | Secret storage and rotation; repository secret controls | Cannot fully mitigate in code | Residual risk disclosure | Do not imply impossible protection |
| Maintainer account compromised | Attacker can change trusted policy/secrets | Protected branch and GitHub access controls | Outside application boundary | Explicit residual risk | Do not hide |
| Wrong repository config reused | Config rejected | Repository match validation | Config semantic test | Configuration rules | Not demo |
| Wrong chain/token | Blocked | Frozen allowlist | Policy tests | One-chain/token disclosure | Show Sepolia + USDC |
| Invalid recipient address | Config rejected | Address validation/normalization | Config tests | Configuration guide | Not demo |
| Zero or over-cap amount | Blocked | Decimal parsing and maximum checks | Amount tests | Policy proof | Ambiguous/refusal scene |
| Precision overflow | Config rejected | Atomic-unit conversion | Decimal precision tests | Config documentation | Not demo |
| Provider idempotency conflict | Existing/uncertain state; no blind retry | Stable key and conflict mapping | Conflict tests | KeeperHub integration | Not demo |
| Explorer link is fake | Judge should independently inspect hash and Transfer event | Public explorer and RPC evidence | Not a unit test | Direct transaction URL | Show Transfer event |
| UI claims seven confirmed while receipts show pending | Judge sees contradiction | Distinguish chain status from receipt status | Documentation check | Use explicit terminology | Narrate distinction or omit pending rows |
| Self-payment presented as contributor payout | Judge sees inflated claim | Prominent self-payment disclosure | Documentation check | Direct disclosure near proof | Say it aloud |
| Screenshot hides testnet | Judge assumes deception | Keep “Sepolia testnet” visible | Manual review | Badge/disclosure | Show explorer network header |
| Video uses different SHA than release | Evidence becomes non-reproducible | One immutable final release | Release verification | Display SHA | End card includes short SHA |
| Raw exception prints secrets/internal data | Potential leakage | Route bootstrap errors through safe redaction | Add bootstrap error test | Security claim only after fix | Never show error logs containing internals |
| Broken coverage command | Judge sees unreliable verification claims | Install provider or remove command | CI run | Do not claim coverage until fixed | Do not mention coverage |
| Mutable release reference | Code could change after review | Pin full commit SHA | Workflow fixture | Installation section | Show pinned SHA |
| Missing license file | Open-source compliance doubt | Add root MIT `LICENSE` | Repository check | License section | Not demo |
| Old Git remote name | Creates brand/release confusion | Align origin with public Skirwith repository | `git remote -v` check | None | Not demo |
| Audit documents dominate repository | Judge sees unfinished/internal process instead of product | Keep README path clean; archive internal reports | Repository review | Judge path links only | Not demo |

### Thirty-Second Mental Attacks Judges Are Most Likely to Try

1. “What if GitHub fires the event twice?”
2. “Can the contributor edit the amount?”
3. “Can the contributor change the wallet?”
4. “What if broadcast succeeds but the response disappears?”
5. “What proves this transaction came through KeeperHub?”
6. “Why are three receipts pending if you claim seven confirmed transactions?”
7. “Why is the recipient the same as the sender?”
8. “Is this just a cron script around an API?”
9. “What happens if someone writes a fake receipt comment?”
10. “Does the secret-bearing job execute PR code?”

The README and video must answer all ten without requiring a deep source review.

## 8. Demo Storyboard

Maximum duration: 2:55. Leave five seconds of safety margin.

### Second-by-Second Plan

| Time | Screen | Narration | Action | Proof created | Sponsor technology | Judging objective |
|---|---|---|---|---|---|---|
| 0:00–0:04 | Black title card: “One merge. One payment. No blind retries.” | “A merge should produce one payment—not zero, and not two.” | Hard cut | Memorable thesis | — | Hook |
| 0:04–0:10 | PR #1 with merged badge and payout labels | “This pull request was merged and approved for a five-USDC testnet payout.” | Highlight merged badge and labels | Trigger legitimacy | — | Problem clarity |
| 0:10–0:17 | Trusted `.github/skirwith.yml` | “The recipient and amount come only from protected default-branch policy.” | Highlight mapping and label amount | Trust boundary | — | Security |
| 0:17–0:23 | Workflow file | “The job never checks out contributor code and pins Skirwith by commit SHA.” | Highlight no checkout, permissions, SHA | Supply-chain and secret boundary | GitHub Action integration | Architecture |
| 0:23–0:31 | Action summary beginning | “Skirwith fetches fresh GitHub state and writes a signed reservation before execution.” | Zoom into status/payment key | Durable identity | — | Technical depth |
| 0:31–0:40 | KeeperHub simulation evidence | “KeeperHub simulates the exact transfer. A parameter mismatch or revert stops here.” | Highlight simulation result | Pre-broadcast gate | KeeperHub simulation | Sponsor integration |
| 0:40–0:52 | KeeperHub execution record | “The same request is executed once through KeeperHub. This is execution `mn7…ww8d`.” | Highlight execution ID | Sponsor-native execution | KeeperHub Direct Execution | Sponsor necessity |
| 0:52–1:06 | Sepolia Etherscan transaction | “Here is the confirmed Sepolia transaction. The USDC Transfer event is exactly five USDC.” | Highlight status, token, from/to, amount | Independent on-chain proof | Result of KeeperHub execution | Live proof |
| 1:06–1:14 | Receipt comment on PR | “Skirwith posts the matching execution and transaction back to the pull request.” | Highlight same execution/hash | Evidence agreement | KeeperHub ID linked to GitHub | Auditability |
| 1:14–1:19 | Minimal separator card: “Now attack it.” | “Success is easy. The real test is what happens next.” | Hard cut | Reframes demo | — | Differentiation |
| 1:19–1:30 | Re-run same workflow | “I replay the same event.” | Start or show completed rerun | Replay attempt | — | Adversarial proof |
| 1:30–1:42 | Duplicate outcome and unchanged receipt | “Skirwith finds the signed receipt and returns the original proof. No simulation. No second broadcast.” | Highlight duplicate, broadcast false, same hash | Replay suppression | KeeperHub not called again | Correctness |
| 1:42–1:49 | Explorer/address transaction list or documented transfer count | “The transaction count does not increase.” | Show unchanged count | Independent negative proof | — | Unfakeable replay evidence |
| 1:49–1:59 | PR #2 without required label | “Next, I remove the approval condition.” | Highlight missing label | Invalid request | — | Policy |
| 1:59–2:10 | Blocked action summary | “Policy stops the run before KeeperHub: no execution ID and `broadcastMade: false`.” | Highlight reason, execution none, broadcast false | Refusal proof | No KeeperHub broadcast | Safety |
| 2:10–2:22 | One uncertain-response PR and transaction | “In a harder case, KeeperHub confirmed on-chain but its response did not reach the action.” | Show pending receipt and confirmed transaction side by side | Real partial-failure evidence | KeeperHub execution/idempotency | Reliability |
| 2:22–2:33 | Reconciliation note/idempotent replay evidence | “The same KeeperHub idempotency key recovered the original execution. Skirwith did not rebroadcast.” | Highlight `idempotentReplay: true` and execution | Uncertainty recovery | KeeperHub idempotency | Technical differentiation |
| 2:33–2:43 | Simple architecture diagram | “That safety comes from four locks: trusted policy, signed reservation, exact simulation parity, and authenticated receipts.” | Reveal four labels sequentially | Architecture summary | KeeperHub centered | Comprehension |
| 2:43–2:50 | Test summary and release tag | “The release is pinned, the bundle matches source, and 235 automated tests pass.” | Highlight tag and test result | Reproducibility | — | Engineering quality |
| 2:50–2:55 | End card | “Skirwith: verified merge to one KeeperHub payment—with proof.” | URLs and release SHA | Clear close | KeeperHub named | Memorability |

### What to Remove from the Existing Video Plan

- Remove the first 18 seconds of generic problem narration.
- Remove the long site hero opening.
- Do not show seven transactions individually.
- Do not show two refusal types; one is enough.
- Do not spend 20 seconds on the end card.
- Do not say “people get paid twice” without a verified story.
- Do not narrate every internal component.
- Do not show wallet balance alone as the primary replay proof; show unchanged transaction/execution evidence.

### Judge Double-Click Review

| Doubt-producing frame | Why it hurts | Fix |
|---|---|---|
| Site hero with no demo/proof CTA | Looks like a generic landing page | Start on the merged PR, not the website |
| PR labels without showing trusted config | Judge may think contributor controls payout | Immediately show default-branch config |
| Config containing `checks.required: false` | Looks like checks were disabled to force a demo | Either explain the demo configuration or use evidence where checks are not the focus |
| Workflow with secrets visible | Even secret names can distract; values must never appear | Show only secret references and minimum permissions |
| KeeperHub execution ID without provider UI/context | Could be an arbitrary string | Show KeeperHub branding and execution status together |
| Explorer page without Sepolia label | Could be implied mainnet or wrong chain | Keep network header visible |
| Transfer from and to the same address | Judge may call the payout fake | Say “controlled self-payment test” before the frame appears |
| Receipt says `mergepay:` while product is Skirwith | Looks stale or fraudulent | Add a caption: “Pre-rebrand receipt, preserved by migration compatibility” or use a newer confirmed receipt |
| Wallet balance remains 40 USDC | Self-payment explains why; otherwise looks meaningless | Do not make balance the primary proof |
| `pending*` status beside “confirmed transactions” | Obvious contradiction | Show one fully confirmed row in main demo; explain uncertain case separately |
| Action run marked success for blocked outcome | Judge may think blocking failed | Narrate that successful policy refusal is an expected safe outcome |
| `broadcastMade: false` without context | Judge may not know whether a broadcast happened elsewhere | Show “execution ID: none” on the same frame |
| Long console logs | Judges stop processing | Crop to four relevant fields |
| Internal payment/request hashes without explanation | Looks like meaningless technical noise | Show only if tied to replay identity |
| Test count with no command or CI | Could be a decorative number | Show CI/check summary or terminal result briefly |
| Release tag does not match HEAD | Judge may question what was evaluated | Create or clearly identify the final immutable submission release |
| Repository includes several audit reports | Looks unfinished and AI-heavy | Keep the README path focused; do not browse internal audit files in the video |
| Google/Unsplash assets load slowly | Demo begins with visual instability | Preload pages and record locally if necessary |
| Any notification/avatar/private tab | Looks careless | Use a clean browser profile and crop |
| Tiny transaction fields | Proof becomes unverifiable | Use 150–175% browser zoom |
| Cursor circles without purposeful highlight | Feels rehearsed but unclear | Use deliberate zoom/callout overlays |

## 9. Frontend Identity

### Current Verdict

It does not look like another dashboard.

It does partly look like an AI-generated editorial landing page:

- large product-name hero;
- abstract background image;
- generic numbered workflow;
- dark/light toggle;
- long static proof section;
- minimal product-specific visual metaphor.

The page is clean, but the first screenshot is not uniquely Skirwith. Replace “editorial technology site” with “settlement evidence terminal.”

### Visual Metaphor

Use a **three-state settlement ledger**:

```text
MERGED → PAID
REPLAYED → ORIGINAL PROOF
INVALID → STOPPED BEFORE BROADCAST
```

The product identity should be based on evidence transitions, not blockchain decoration.

### Signature Screenshot

One memorable screen:

```text
PR #1 · MERGED
Policy · APPROVED
KeeperHub · EXECUTED ONCE
USDC · 5
Replay · ORIGINAL PROOF RETURNED
Broadcasts after replay · 0
```

Beside it:

- execution ID;
- short transaction hash;
- green “On-chain confirmed” stamp;
- signed-receipt indicator.

A judge should remember “the product with the three-state proof.”

### Interaction Style

- Evidence-first.
- No carousel.
- No animated counters.
- No dashboard chrome.
- Each proof row expands into its public links.
- One primary action at a time.
- Copyable release SHA and workflow.
- Status details should appear without requiring hover.

### Typography

- Headline: Inter or system sans, heavy but compact.
- Evidence labels: monospaced.
- Avoid huge six-rem product-name typography as the dominant identity.
- Make the outcome line larger than the brand name.
- Use tabular numerals for amounts, execution IDs, and hashes.

### Spacing

- 8px base grid.
- 24px inside proof cards.
- 48–64px between major sections.
- Reduce current 72–96px vertical gaps where they slow scanning.
- Keep proof visible within the first viewport.

### Color Logic

- Neutral dark canvas.
- Confirmed: green plus check icon and explicit word.
- Duplicate/existing proof: blue plus link/return icon.
- Blocked: amber, not red—the system behaved correctly.
- Failed: red.
- Manual review: purple or amber with pause icon.
- Never communicate status through color alone.

### Motion

- Minimal.
- Respect `prefers-reduced-motion`.
- The only meaningful animation should be the three-state path resolving:
  - merged → confirmed;
  - replay → original proof;
  - invalid → stopped.
- Under 250ms.
- No parallax, particles, gradients-in-motion or crypto effects.

### Empty States

For missing demo:

> Demo video is being finalized. Verify the public transaction and action evidence now.

Do not show a broken or disabled generic button.

For unavailable external proof:

> This evidence link could not be loaded. Open the repository evidence record or copy the transaction hash.

### Loading States

The static site should not need a loading state.

For external verification tools, use:

> Opening public evidence…

Do not add a spinner to the landing page.

### Success Moments

Success is not confetti.

Use a sharp evidence lockup:

> **Confirmed on Sepolia**  
> 5 USDC · KeeperHub execution `mn7…ww8d`  
> Signed receipt posted to PR #1

For replay:

> **Existing payment found**  
> Original transaction returned · No new broadcast

For refusal:

> **Stopped before broadcast**  
> Required payout label missing · No KeeperHub execution created

## 10. Social Strategy

Current date: August 4, 2026. Recorded deadline: August 13, 2026 at 10:00.

Do not post “Day 3 building my hackathon project.”

Every post must prove one claim.

| Date | Concrete hook | Proof | Screenshot/video | Lesson | CTA |
|---|---|---|---|---|---|
| Aug 4 | “A successful payment is the easy case. The dangerous case is the same GitHub event firing twice.” | Same event resolves original execution with zero second broadcast | Split image: original receipt and replay result | Financial automation must prove non-execution as well as execution | “Inspect the replay evidence” |
| Aug 5 | “This GitHub Action never reads payout details from contributor-controlled code.” | Default-branch policy plus workflow with no checkout | Annotated config/workflow screenshot | Authorization belongs in trusted policy, not PR text | “Review the trust boundary” |
| Aug 6 | “No durable reservation, no broadcast.” | Reservation-first test and action summary | Short terminal/test clip plus state diagram | Persistence ordering is a financial safety control | “Read the security design” |
| Aug 7 | “KeeperHub is not a logo in this project—it is the execution and recovery rail.” | Simulation, execution ID, transaction | 15-second clip from final demo | Sponsor integrations win when removal breaks the product | “Verify the execution” |
| Aug 8 | “This five-USDC Sepolia transfer is tied to a merged PR, action run, KeeperHub execution and signed receipt.” | Complete identifier chain | Four-panel evidence image | Evidence should reconcile across systems | “Follow the proof chain” |
| Aug 9 | “An invalid payout should succeed by doing nothing.” | Missing-label refusal, no execution ID, broadcast false | Blocked summary screenshot | Safe refusal is a product feature | “Inspect the refusal run” |
| Aug 10 | “KeeperHub confirmed on-chain, but the response never reached the Action. Skirwith still refused to rebroadcast.” | Pending receipt plus recovered execution, `idempotentReplay: true` | Side-by-side uncertain receipt and transaction | Unknown outcomes require reconciliation, not optimism | “Read the failure-recovery evidence” |
| Aug 11 | “The entire release can be reproduced from one commit.” | Tag, bundle hash/source match, CI | Release page and CI screenshot | Immutable builds make demos auditable | “Clone and run the checks” |
| Aug 12 | “Three minutes: confirmed payment, replay with zero second transaction, refusal before broadcast.” | Final demo video | 20–30 second trailer | A narrow, proven workflow beats broad vaporware | “Watch the full demo” |
| Aug 13 before deadline | “Submitted: one verified merge, one KeeperHub payment, signed proof.” | Submission page, release, transaction | Final submission card | The submission is evidence, not promises | “Review Skirwith” |

### Posting Rules

- Use exact transaction and execution identifiers when space permits.
- Always say Sepolia testnet.
- Disclose controlled self-payment when showing transfer proof.
- Never claim production adoption.
- Never claim users.
- Never quote unverified bounty amounts.
- Never use “revolutionary,” “game-changing,” “world-first,” or “AI-powered.”
- Tag KeeperHub only when the post demonstrates a KeeperHub-native function.
- Do not publish secret-bearing logs or wallet operational details.

## 11. Day-by-Day Execution Plan

| Day | Objective | Deliverable | Exit Criterion | Risk | Backup Plan |
|---|---|---|---|---|---|
| Aug 4 | Freeze truth and submission scope | One approved claim/evidence matrix | Every public claim maps to a URL, test or explicit limitation | Continued contradictory copy | Remove any claim without proof |
| Aug 5 | Close repository rejection risks | Root MIT `LICENSE`; remote/name decision; fixed coverage command; clean status docs | Fresh clone passes every documented command; no broken advertised check | Dependency/tool change destabilizes CI | Remove coverage claim/script instead of adding scope |
| Aug 6 | Close governance and release identity | Numbered AMD record; post-tag checkpoint; final release strategy | Plan/state/release SHA agree; reviewer can identify one evaluation commit | Retagging creates more confusion | Keep code frozen and create one final documentation release |
| Aug 7 | Rebuild README around judging | Judge-first README with three-state evidence above quickstart | A reviewer finds demo/proof/release in under 20 seconds | README becomes too long | Move implementation detail into linked docs |
| Aug 8 | Capture definitive visual evidence | High-resolution screenshots for confirmed, replay, refused and uncertain states | Each screenshot is legible at 1080p and contains no secrets | External pages unavailable | Use previously captured evidence plus public links |
| Aug 9 | Record demo rough cut | First complete video under 3 minutes | Every required scene exists; KeeperHub execution and Transfer event are readable | Live pages fail or video exceeds time | Pre-open pages; use hard cuts; remove architecture detail |
| Aug 10 | Adversarial video review | Revised second cut with captions | Three skeptical viewers can answer what, why KeeperHub, proof, replay and refusal | Viewers misunderstand self-payment/pending status | Add explicit captions and remove ambiguous evidence |
| Aug 11 | Finalize visual and accessibility surface | Final site/README proof CTAs, thumbnail, manual accessibility record | Keyboard, mobile, 200% zoom and contrast checks documented | UI changes threaten release stability | Limit changes to static documentation/site |
| Aug 12 | Final release and preflight | Final immutable tag/release, uploaded video, populated submission form draft | All links work logged out; video SHA matches release; checklist is fully checked except submit | Late CI failure | Fall back to last green tag and update video/end card |
| Aug 13 | Submit early and archive | Submission confirmation and exact payload | Submission accepted before deadline; confirmation saved publicly/privately as appropriate | DoraHacks outage or upload failure | Submit at least two hours early; keep video on two accessible hosts |

### Non-Negotiable Scheduling Rule

Do not leave video upload, final tag or submission-form completion to August 13.

## 12. Submission Preflight Checklist

### Repository

- [ ] Public repository opens while logged out.
- [ ] Repository name is consistently Skirwith.
- [ ] Git remote points to the intended public repository.
- [ ] Default branch is correct.
- [ ] Working tree for the release is clean.
- [ ] Final evaluation commit is identified.
- [ ] Final release tag points to that commit.
- [ ] README references the same release SHA.
- [ ] Demo references the same release SHA.
- [ ] Submission form references the same release or repository state.
- [ ] Generated `dist/` is committed.
- [ ] Clean rebuild matches committed `dist/`.
- [ ] No nested repository or accidental gitlink exists.
- [ ] No secret, private key or live credential is tracked.
- [ ] No internal `.env` file is tracked.
- [ ] `.env.example` contains synthetic placeholders only.
- [ ] Root MIT `LICENSE` file exists.
- [ ] Package license matches root license.
- [ ] No unexplained binary or generated artifacts exist.
- [ ] Internal audit files do not obscure the judge-facing path.

### README

- [ ] One-line pitch is visible without scrolling.
- [ ] Sepolia testnet disclosure is above the fold.
- [ ] Demo video link is above the fold.
- [ ] Confirmed transaction link is above the fold.
- [ ] Three-state proof table is above detailed setup.
- [ ] KeeperHub’s role is described as load-bearing.
- [ ] Confirmed, replay and refusal each have public proof.
- [ ] Self-payment evidence is disclosed clearly.
- [ ] Pending receipt versus confirmed chain status is explained.
- [ ] Exact pinned workflow SHA is included.
- [ ] Quickstart is copy-ready.
- [ ] Outcome statuses have safe next steps.
- [ ] Limitations are explicit.
- [ ] Reproduction commands are current.
- [ ] No broken coverage claim exists.
- [ ] No placeholders remain.
- [ ] No speculative roadmap appears.
- [ ] No duplicated architecture prose appears.
- [ ] No unsupported mainnet or production claim appears.

### Architecture and Security

- [ ] Trust-boundary diagram is current.
- [ ] Contributor-controlled inputs are identified.
- [ ] Default-branch policy source is documented.
- [ ] Secret-bearing job performs no checkout.
- [ ] Minimum GitHub permissions are visible.
- [ ] Payment identity fields are frozen.
- [ ] Legacy receipt compatibility is documented.
- [ ] Request hash conflict behavior is documented.
- [ ] Reservation-before-broadcast is documented.
- [ ] Simulation/broadcast parity is documented.
- [ ] Replay behavior is documented.
- [ ] Pending and unknown-outcome behavior is documented.
- [ ] Receipt authentication is documented.
- [ ] Key rotation behavior is documented.
- [ ] Residual maintainer-account and provider risks are disclosed.
- [ ] Numbered AMD migration record exists and is approved.

### Tests and Reproducibility

- [ ] `npm ci` passes from a fresh clone.
- [ ] `npm run format:check` passes.
- [ ] `npm run lint` passes.
- [ ] `npm run typecheck` passes.
- [ ] `npm test` passes.
- [ ] Test count is accurately reported.
- [ ] `npm run build` passes.
- [ ] `npm run bundle:check` passes.
- [ ] `npm run verify:packaged` passes.
- [ ] Dependency audit passes or any exception is disclosed.
- [ ] Secret scan passes.
- [ ] Legacy confirmed replay test passes.
- [ ] Pending execution resume test passes.
- [ ] Conflict/manual-review test passes.
- [ ] Forged receipt test passes.
- [ ] Reservation failure produces zero broadcasts.
- [ ] Post-broadcast persistence failure produces zero later rebroadcasts.
- [ ] Pagination cycle test fails closed.
- [ ] Every documented verification command actually exists and works.

### Demo

- [ ] Video duration is below three minutes.
- [ ] Video begins with proof, not a generic landing page.
- [ ] Merged PR is visible.
- [ ] Approval and amount labels are visible.
- [ ] Trusted config is visible.
- [ ] No-checkout workflow and pinned SHA are visible.
- [ ] KeeperHub simulation is visible.
- [ ] KeeperHub execution ID is visible.
- [ ] Sepolia network is visible.
- [ ] USDC Transfer event is visible.
- [ ] Five-USDC value is legible.
- [ ] PR receipt uses the same execution and transaction.
- [ ] Replay shows the original proof.
- [ ] Replay shows zero second broadcasts.
- [ ] Refusal shows `broadcastMade: false`.
- [ ] Refusal shows no execution ID.
- [ ] One uncertain-response case is explained clearly.
- [ ] `idempotentReplay: true` is visible if that case is used.
- [ ] Self-payment is disclosed aloud or on screen.
- [ ] Testnet limitation is disclosed aloud or on screen.
- [ ] Captions are burned in.
- [ ] Text is readable at normal video size.
- [ ] No secrets or private browser data appear.
- [ ] No notification appears.
- [ ] No dead air remains.
- [ ] End card includes repository, demo site and release SHA.
- [ ] Video works while logged out.
- [ ] Video has a backup host or local master file.

### Thumbnail

- [ ] Thumbnail communicates one merge → one payment.
- [ ] KeeperHub name is visible but not used as decorative logo stuffing.
- [ ] “Replay: 0 new transactions” is legible.
- [ ] Sepolia/testnet is visible.
- [ ] Thumbnail uses no tiny code.
- [ ] Thumbnail does not look like a generic dashboard.
- [ ] Thumbnail matches actual product visuals.

### Landing Page

- [ ] Demo CTA exists.
- [ ] Live-proof CTA exists.
- [ ] First viewport explains differentiation.
- [ ] Proof appears before detailed setup.
- [ ] “On-chain confirmed” and “receipt pending” are distinct.
- [ ] Claims are bounded to tested evidence.
- [ ] Theme-toggle accessible label updates correctly.
- [ ] Keyboard focus is visible.
- [ ] Navigation works with keyboard.
- [ ] Page remains usable at 200% zoom.
- [ ] Mobile layout has no overlap.
- [ ] Transaction table remains usable on narrow screens.
- [ ] Status is not communicated by color alone.
- [ ] Light and dark contrast are manually checked.
- [ ] Reduced-motion preference is respected or motion is negligible.
- [ ] External image/font failure leaves content usable.
- [ ] All public links work logged out.

### Submission Form

- [ ] Official hackathon name is exact.
- [ ] Project name is exact.
- [ ] One-line pitch matches README and video.
- [ ] Description leads with verified three-state proof.
- [ ] KeeperHub integration is explicitly described.
- [ ] Repository URL is correct.
- [ ] Video URL is correct.
- [ ] Live site URL is correct.
- [ ] Release URL is correct.
- [ ] Transaction URL is correct.
- [ ] Execution ID is included where allowed.
- [ ] Sponsor category is selected correctly.
- [ ] Relevant ecosystem tags are selected.
- [ ] No unsupported x402, MPP, MCP-execution, gas-sponsorship or mainnet claim is made.
- [ ] Testnet status is disclosed.
- [ ] Self-payment evidence is disclosed.
- [ ] One-chain/one-token scope is disclosed.
- [ ] No-database and no-daily-limit limitations are disclosed if relevant.
- [ ] Team member names and roles are accurate.
- [ ] Eligibility has been checked against official rules.
- [ ] Submission timestamp is before the deadline.
- [ ] Final submitted text is archived.
- [ ] Submission confirmation is saved.

### Contracts, Wallets and Proof Links

- [ ] State explicitly that no custom contract is deployed.
- [ ] Sepolia chain ID is `11155111`.
- [ ] USDC contract address is correct.
- [ ] Token decimals are six.
- [ ] Controlled execution wallet address is accurate.
- [ ] Self-payment recipient relationship is disclosed.
- [ ] Confirmed transaction hash is exact.
- [ ] Backup transaction hash is exact.
- [ ] KeeperHub execution ID is exact.
- [ ] GitHub action-run ID is exact.
- [ ] PR URL is exact.
- [ ] Replay evidence URL is available.
- [ ] Refusal evidence URL is available.
- [ ] Every explorer link resolves.
- [ ] No private signing material is disclosed.

### Open-Source Compliance

- [ ] Root license exists.
- [ ] Dependency licenses present no known conflict.
- [ ] Third-party image attribution/licensing is acceptable.
- [ ] Google Fonts usage complies with its license.
- [ ] Unsplash image use complies with its terms or is removed.
- [ ] No copied proprietary assets exist.
- [ ] Generated bundle corresponds to declared dependencies.
- [ ] Source is sufficient to reproduce the action.

### Sponsor and Ecosystem

- [ ] KeeperHub is shown executing, not merely mentioned.
- [ ] Simulation is shown or clearly evidenced.
- [ ] Execution ID is shown.
- [ ] Idempotency/recovery behavior is explained.
- [ ] Exact API integration is documented.
- [ ] Sponsor technology is necessary for the demonstrated outcome.
- [ ] No alternative RPC execution is falsely attributed to KeeperHub.
- [ ] Sponsor terminology matches current documentation.
- [ ] Any bounty claim is verified from an authoritative source.

### Final Reliability Drill

- [ ] Full demo can be performed from pre-opened tabs.
- [ ] Backup screenshots exist for every external service.
- [ ] Backup explorer/RPC verification exists.
- [ ] Backup confirmed transaction exists.
- [ ] Backup video file exists locally.
- [ ] README remains useful if the live site fails.
- [ ] Evidence document remains useful if Etherscan blocks automated requests.
- [ ] No live transaction is required during judging.
- [ ] No mutable external state is required to prove replay/refusal.
- [ ] A two-minute fallback demo exists.

## 13. Immediate Kill List (things to remove)

1. Generic opening about people being paid late or twice without a real incident.
2. Any implication that self-payment proves production contributor payroll.
3. “Seven confirmed transactions” without immediately distinguishing chain and receipt status.
4. Long hero-first demo opening.
5. Showing all seven transactions in the video.
6. Showing both refusal cases in the main video.
7. Broad “replays never pay twice” wording without linking it to tested evidence.
8. Broken `test:coverage` command or any coverage claim until repaired.
9. Placeholder video and submission URLs before final delivery.
10. Internal audit documents from the README’s primary navigation.
11. Duplicate architecture explanations.
12. “Who it is for” section if space is needed.
13. Future plans and roadmap.
14. Investor framing.
15. Market-size claims.
16. Tokenomics.
17. “Autonomous agent” framing.
18. AI terminology.
19. Mainnet implications.
20. Claims about x402, MPP, private routing or gas sponsorship unless independently demonstrated.
21. Decorative crypto imagery.
22. Long end card.
23. Tiny console text.
24. Wallet balance as the primary replay proof.
25. Mutable tag references in consumer workflow.
26. Old MergePay branding outside explicit migration evidence.
27. Stale “Not Started” project-state claims.
28. Local origin mismatch with the public repository.
29. Unnecessary dependency upgrades.
30. Any new product feature before submission.

## 14. Immediate Build List (highest ROI additions)

1. **Final demo video**
   - Highest possible ROI.
   - Without it, the submission is incomplete.
2. **Judge-first README**
   - Three-state proof above setup.
   - Video and transaction above the fold.
3. **One-screen proof graphic**
   - Confirmed / replay / refused.
   - Reuse in README, landing page, thumbnail and social posts.
4. **Formal AMD migration record**
   - Removes a governance contradiction around the most sensitive security change.
5. **Final immutable submission release**
   - Video, README, bundle and submission must all point to one SHA.
6. **Root MIT license file**
   - Small effort, removes open-source uncertainty.
7. **Working verification command set**
   - Repair or remove broken coverage command.
8. **Outcome-specific next-step copy**
   - Makes blocked, pending and manual-review results usable without documentation archaeology.
9. **Judge verification guide**
   - One ordered path from PR to run to KeeperHub to explorer to replay/refusal.
10. **Manual accessibility evidence**
    - Keyboard, focus, mobile, zoom and contrast results.
11. **Backup demo package**
    - Local video, screenshots, transaction hashes, public evidence document.
12. **Final submission archive**
    - Exact submitted title, pitch, description, categories and URLs.

## 15. The Card No One Else Holds

The strongest proof is not the confirmed transaction.

Many competitors can show a successful testnet transfer.

The card competitors will struggle to fake is:

> **A real KeeperHub broadcast whose response was lost, followed by an independently confirmed on-chain transaction, a durable pending receipt, an idempotent recovery of the original KeeperHub execution, and a replay that creates zero second transactions.**

This demonstrates all of the following simultaneously:

- a real external partial failure;
- durable state written before broadcast;
- correct treatment of an unknown outcome;
- provider-native idempotency;
- recovery of the original execution;
- no simulation or rebroadcast on replay;
- public on-chain reconciliation;
- a system designed for what happens when success is uncertain.

A happy-path transaction proves integration.

This proves engineering judgment.

Make this the technical climax of the demo—not an obscure footnote.
