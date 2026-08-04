# Skirwith Project Plan

## Document Control

- Status: Planned
- Version: 1.0
- Created: 2026-08-03 (Africa/Lagos)
- Last updated: 2026-08-03
- Planning mode: Deep
- Research depth: Standard, with live-provider validation still required
- Planning confidence: 84/100 (Medium)
- Intended audience: Future execution orchestrator and implementation/review agents
- Source request summary: Convert the existing Skirwith hackathon concept into a complete implementation-ready plan while preserving planning-only boundaries.

## Executive Summary

Skirwith is a GitHub JavaScript Action that pays a maintainer-approved contributor after a genuinely merged pull request. It obtains trusted GitHub state and default-branch configuration, evaluates a deterministic payout policy, simulates the exact transfer through KeeperHub, broadcasts once, polls to terminal status, and posts an auditable receipt to GitHub.

The smallest coherent proof is three states for the same workflow: one confirmed payment, replay suppression with no second payment, and policy refusal before broadcast. The project is for the Agents on Chain hackathon and must produce a public repository, demo video, and real KeeperHub transaction evidence.

## Project Definition

- Primary category: Hackathon / open-source developer tool / Web3 payment automation.
- Secondary categories: GitHub Action, workflow automation, security-sensitive payment system.
- Intended outcome: A verifiable testnet MVP, not a production treasury system.
- Primary delivery surface: GitHub Actions summary and pull-request receipt comment.
- Supporting surfaces: KeeperHub execution evidence, block explorer, repository documentation, optional lightweight public site.
- Complexity: High for a hackathon MVP because payment execution, replay prevention, GitHub trust boundaries, and sponsor proof are load-bearing.
- Risk: High; a mistaken transfer or unsupported provider claim can invalidate the project.
- Software architecture applies: Yes.
- Business planning: Limited; adoption and positioning matter, but monetization is not required for the hackathon.
- UX planning: Yes; GitHub receipts, summaries, setup, blocked states, and evidence are the product experience.
- Security/privacy planning: Required.
- Compliance research: Limited MVP review; testnet disclosure, credential handling, financial-risk disclaimers, and no production-funds claims are required. Jurisdiction-specific legal advice is unresolved and out of scope.

## Problem Statement

Merging a pull request proves accepted work, but settlement remains a separate manual wallet or treasury action. That creates delay, recipient mistakes, duplicate payments, and weak evidence. Skirwith connects the acceptance event to a bounded settlement path without allowing contributor-controlled content to choose payment parameters.

## Target Users or Audience

- Maintainer: configures labels, amounts, wallets, checks, secrets, and merge authority.
- Contributor: receives the fixed configured amount after accepted work.
- Reviewer/judge: verifies trust boundaries, policy, KeeperHub execution, explorer proof, duplicate suppression, and refusal evidence.

## Scope

### Core scope

- Trusted `pull_request.closed` with `merged === true` handling.
- Fresh GitHub API verification of repository, branch, PR, merge SHA, labels, and required checks.
- Trusted default-branch `.github/skirwith.yml` loading.
- Maintainer-controlled GitHub-login-to-wallet mapping.
- Maintainer-controlled label-to-fixed-amount mapping.
- One KeeperHub-supported testnet and one verified stablecoin.
- Per-payment maximum.
- Deterministic policy reason codes.
- Canonical request, request hash, and stable payment key.
- KeeperHub simulation, exact simulation-to-broadcast parity, one broadcast, bounded polling, terminal evidence.
- Duplicate and uncertain-state handling without automatic rebroadcast.
- GitHub Actions summary, PR receipt, action outputs, secret-free evidence record.
- Automated unit, integration, contract, security, failure, and acceptance tests.

### Supporting scope

- Reusable workflow/configuration starter template.
- KeeperHub first-transaction troubleshooting and onboarding teardown.
- CLI for validation, fixture replay, policy inspection, simulation, polling, and explicitly guarded live testing.
- Architecture, security, configuration, integration, demo, and submission documentation.
- Optional lightweight documentation site only after live proof is complete.

### Future scope

- Durable cumulative budgets, if a state store and accounting model are justified.
- Additional chains/assets after separate provider and security validation.
- Production treasury controls, refunds, reconciliation, and richer operator tooling.

### Explicit exclusions

- LLM payout decisions, natural-language payment commands, arbitrary PR-supplied amounts or wallets.
- DAO/payroll/accounting/dashboard-first features.
- Custom smart contracts, automatic token approvals, multi-chain/multi-token support.
- Automatic rebroadcast after uncertain or terminal failure.
- Claims about gas sponsorship, private routing, x402, MPP, mainnet readiness, or MCP execution unless live evidence proves them.

## Success Criteria

- `SC-001`: One eligible real merged PR produces exactly one confirmed KeeperHub stablecoin transaction.
- `SC-002`: Replaying the same event resolves to the original execution and produces no second transaction.
- `SC-003`: An over-limit or invalid payout is blocked before KeeperHub broadcast with `broadcastMade: false` and no execution ID.
- `SC-004`: GitHub receipt, action summary, KeeperHub execution, and explorer evidence agree on chain, token, amount, recipient, status, and identifiers.
- `SC-005`: Fork/contributor-controlled code and configuration cannot access the KeeperHub secret or alter payout identity.
- `SC-006`: A clean checkout passes format, lint, typecheck, tests, build, dependency audit, secret scan, and bundle verification.

## Core Workflow or Delivery Model

```text
Trusted merged PR event
 -> fresh GitHub state and trusted default-branch config
 -> deterministic policy decision
 -> canonical request and payment key
 -> existing receipt/execution lookup
 -> KeeperHub simulation
 -> exact-body broadcast once
 -> bounded terminal polling
 -> evidence record, Actions summary, PR receipt
```

Blocked policy paths stop before provider calls. Confirmed/pending replays resolve existing evidence. Changed request content under an existing key becomes manual review.

## Requirements

### Functional requirements

- `FR-001`: Accept only a closed, genuinely merged pull request from the configured repository/base branch.
- `FR-002`: Re-fetch authoritative PR, labels, checks, repository, branch, and merge SHA state.
- `FR-003`: Load and semantically validate versioned configuration from the trusted default branch.
- `FR-004`: Resolve recipient and amount only from maintainer-controlled mappings.
- `FR-005`: Return deterministic approved/blocked decisions with stable reason codes.
- `FR-006`: Construct and hash a canonical request containing repository, PR, merge SHA, recipient, atomic amount, token, chain, and purpose.
- `FR-007`: Derive a stable provider-safe payment key and detect changed content under the same key.
- `FR-008`: Discover and freeze a live KeeperHub-supported chain, wallet, token, and API contract before final configuration.
- `FR-009`: Simulate before broadcast and require successful, non-reverting simulation.
- `FR-010`: Broadcast the exact simulated request once using idempotency identity.
- `FR-011`: Poll with bounded timing and provider hints to a terminal state.
- `FR-012`: Resolve receipts/executions before any replay broadcast; never automatically rebroadcast uncertain states.
- `FR-013`: Publish summary, receipt, action outputs, and secret-free evidence for all terminal outcomes.

### Non-functional requirements

- `NFR-001`: No secret, authorization header, private key, or raw sensitive provider payload appears in output artifacts.
- `NFR-002`: Every network operation has timeout, safe decoding, typed error mapping, and bounded polling.
- `NFR-003`: Policy logic is pure and provider/GitHub boundaries are injectable for tests.
- `NFR-004`: CI is reproducible from a committed npm lockfile and generated action bundle is verified against source.
- `NFR-005`: User-visible blocked, pending, duplicate, failed, and confirmed states explain the next safe action.
- `NFR-006`: Documentation and any site meet practical accessibility requirements for contrast, keyboard navigation, semantic structure, and mobile layout.

### Business and safety rules

- `BR-001`: Maintainers control wallet mappings, labels, amounts, chain, token, and cap.
- `BR-002`: Contributor text, files, code, and head-branch configuration are untrusted.
- `BR-003`: Blocked policy means no simulation/broadcast as defined by the decision stage; evidence must state what did not occur.
- `BR-004`: Simulation and broadcast request hashes must match.
- `BR-005`: A matching confirmed payment key returns the original proof, not a new payment.
- `BR-006`: A matching key with a changed canonical request is a conflict requiring manual review.
- `BR-007`: No custom daily limit is promised in v0.1; provider organization limits are the cumulative control.

## Architecture and Technology Plan

Use the simplest modular monolith: strict TypeScript ESM compiled into a Node GitHub Action bundle. Modules are config, GitHub adapters, pure policy, canonical payment identity, KeeperHub client, execution state machine, evidence, outputs, security redaction, and a shared-contract CLI.

### Component responsibilities

- Config: parse trusted YAML; validate schema and semantics; failure is block-before-provider.
- GitHub adapter: normalize event; fetch current PR/check/config/comment state; failure is safe stop.
- Policy: pure decision; owns reason codes and broadcast eligibility.
- Payment identity: normalize atomic values; serialize canonical request; hash/key.
- KeeperHub client: authenticate, simulate, broadcast, lookup, poll; owns provider error mapping.
- Execution: receipt integrity, duplicate state machine, settlement orchestration; owns side-effect ordering.
- Evidence/output: derive summary, comment, outputs, and evidence from one record.
- Security: recursive redaction and safe error projection.

### Trust boundaries

The trusted base repository workflow and GitHub API state are separated from contributor-controlled PR content. The KeeperHub credential exists only in the trusted settlement job. No PR code is checked out or executed there. Provider responses are external input and are validated before use.

### State model

`blocked -> terminal`; `approved -> simulation`; `simulation -> broadcastable | failed`; `broadcastable -> submitted`; `submitted -> pending | confirmed | failed | manual-review`; `pending -> confirmed | failed | manual-review`; `confirmed -> duplicate`; `conflict -> manual-review`. Invalid transitions must fail closed.

### Data ownership

- GitHub owns merge/check/label/config/comment state.
- Skirwith owns normalized decisions, canonical identity, and evidence projection during a run.
- KeeperHub owns execution state and provider audit identity.
- The chain owns final transfer and receipt.
- No database is used in v0.1.

### Major ADRs

- `ADR-001`: JavaScript GitHub Action bundle rather than service deployment; minimizes runtime surface.
- `ADR-002`: KeeperHub Direct Execution API for headless CI; MCP remains discovery/manual surface unless verified otherwise.
- `ADR-003`: Trusted default-branch config through GitHub API; prevents contributor policy substitution.
- `ADR-004`: No database or custom daily limit in v0.1; avoids unreliable stateless accounting.
- `ADR-005`: Exact immutable request body for simulation and broadcast; prevents mutation between approval and execution.
- `ADR-006`: Stable payment key plus provider lookup and structured GitHub receipt; prevents duplicate payment.
- `ADR-007`: No automatic rebroadcast; uncertain state requires lookup or manual review.

## Research and Feasibility

### Research questions

1. Which KeeperHub chains, wallets, assets, endpoints, statuses, limits, and explorer links are currently enabled?
2. What exact request/response semantics, idempotency behavior, and polling hints does KeeperHub provide?
3. What GitHub event/API permissions and workflow boundary are safest for this Action?
4. What are the current hackathon deadline, sponsor, submission, and onboarding-bounty requirements?

### Current findings

- `Verified from existing project research`: hackathon requires public repository, demo video, and real transaction link; KeeperHub must execute a real onchain transaction. Source: `memory.md` and `last stop.md`; access date 2026-08-03; confidence medium because live contest pages were not rechecked in this planning pass.
- `Inferred`: GitHub Actions and PR comments are the strongest MVP interface because they already contain the acceptance event and evidence surface.
- `Unresolved/Blocking`: KeeperHub tool visibility, authentication, supported chain/token, execution wallet, and exact Direct API contract. Must be validated before implementation hard-codes provider behavior.

### Feasibility scores

| Dimension | Score | Evidence / uncertainty | Proof required |
|---|---:|---|---|
| Problem clarity | 5/5 | Merge-to-payment workflow is specific | User/judge acceptance of narrow scope |
| User clarity | 4/5 | Maintainer, contributor, reviewer identified | Usability walkthrough |
| Technical feasibility | 3/5 | Architecture is straightforward; KeeperHub contract unverified | Simulation and first live transaction |
| Operational feasibility | 3/5 | GitHub secret/workflow boundary is manageable | Fork/security fixtures and clean acceptance run |
| Schedule feasibility | 3/5 | 113 tasks are substantial; optional site can be cut | Critical-path execution burndown |
| Budget feasibility | 4/5 | Testnet/provider costs expected to be limited | Live account limits and pricing check |
| Security feasibility | 3/5 | Threats are identifiable but payment risk is real | Independent security review and no-broadcast tests |
| Regulatory feasibility | 3/5 | Testnet hackathon disclosure reduces exposure; jurisdiction unknown | Legal boundary review if mainnet/real funds appear |
| Dependency feasibility | 2/5 | KeeperHub access is currently unresolved | Restore/authenticate provider |
| Adoption feasibility | 3/5 | GitHub-native onboarding is clear; no user validation yet | Starter template walkthrough |

### Verdict

Proceed with prerequisite validation and scope discipline. The project is viable as a testnet hackathon proof, but live KeeperHub discovery is a blocking prerequisite. If provider access or a real transaction cannot be established early, cut all site/polish work and reassess the project.

## Risks

| ID | Risk | Likelihood | Impact | Prevention / detection / recovery |
|---|---|---:|---:|---|
| RISK-001 | KeeperHub API or auth unavailable | High | Critical | Validate first; preserve observed contract; stop presentation work |
| RISK-002 | Fork or PR code reaches secret | Medium | Critical | Trusted workflow, no checkout, minimum permissions, security fixtures |
| RISK-003 | Duplicate payment after replay or timeout | Medium | Critical | Canonical key, hash comparison, provider lookup, no rebroadcast |
| RISK-004 | Simulation/body mismatch | Medium | Critical | Immutable body and parity hash assertion |
| RISK-005 | Wrong token/chain/wallet funding | Medium | High | Live capability and explorer verification before config freeze |
| RISK-006 | Provider status semantics misunderstood | Medium | High | Contract tests and observed state mapping |
| RISK-007 | Scope consumes hackathon time | High | High | Optional site last; cut decorative work first |
| RISK-008 | Secrets appear in public proof | Low/Medium | Critical | Recursive redaction, secret scan, logged-out review |
| RISK-009 | GitHub receipt is spoofed or stale | Medium | High | Structured marker plus request/provider integrity checks |
| RISK-010 | Unsupported sponsor claims damage judging | Medium | High | Claims boundary and evidence review |

## Assumptions

- `ASM-001`: A KeeperHub headless credential can be obtained without exposing it in planning or public artifacts.
- `ASM-002`: At least one KeeperHub testnet supports the required transfer, simulation, execution, status, and explorer proof.
- `ASM-003`: The final asset can be verified as a stablecoin supported by the funded execution wallet.
- `ASM-004`: GitHub API permissions allow trusted config/state reads and receipt comments under a safe workflow.
- `ASM-005`: Testnet execution is acceptable for the hackathon if clearly disclosed.
- `ASM-006`: No custom cumulative accounting is required for the first release.

## Open Decisions

- `DEC-001` / Blocking: KeeperHub API/MCP availability and authentication path.
- `DEC-002` / Blocking: Selected chain, token contract, decimals, explorer, and execution wallet.
- `DEC-003`: Exact KeeperHub status values, idempotency semantics, rate limits, and poll-hint behavior.
- `DEC-004`: Final GitHub repository visibility and ownership.
- `DEC-005`: Whether optional public site fits after evidence gates.
- `DEC-006`: Whether any jurisdiction-specific disclosure or legal review is needed if scope changes beyond testnet.

## Ordered Phases

## Phase 0: Planning and prerequisite validation

### Objective
Confirm requirements, repository constraints, threat model, and provider feasibility.

### Requirements covered
`FR-008`, `NFR-001`, `SC-005`, `SC-006`.

### Scope
Read existing documents; verify hackathon facts; restore KeeperHub access; discover capabilities; select smoke-test path.

### Planned work
Resolve `DEC-001` through `DEC-003` before provider-dependent implementation. Do not create application files in this planning phase.

### Dependencies
Existing project documents and a safe provider credential supplied later.

### Acceptance criteria
KeeperHub capability access, wallet, chain/token candidates, and the first smoke-test contract are documented without secrets.

### Verification
Authoritative provider responses, redacted evidence, and decision record.

### Risks
Provider unavailable or sponsor requirements changed.

### Exit gate
Provider access and a responsible testnet path exist, or the project is paused/reframed.

## Phase 1: Foundation and contract freeze

### Objective
Create the reviewed implementation foundation and freeze domain/config contracts.

### Requirements covered
`FR-003` to `FR-007`, `NFR-003`, `NFR-004`, `BR-001` to `BR-007`.

### Scope
Toolchain, strict types, configuration, event normalization, policy reason codes, canonical request, payment key, and test harness.

### Planned work
Implement only through failing tests and independent review. Keep pure policy separate from GitHub/provider side effects.

### Dependencies
Phase 0 provider/architecture decisions; trusted GitHub contract.

### Acceptance criteria
Malformed and unsafe config fails; valid policy is deterministic; canonical identity is stable; foundation gates pass.

### Verification
Unit, contract, lint/typecheck/build/CI checks and fresh review.

### Risks
Provider-dependent fields may change after live discovery.

### Exit gate
Contract review approves the types and tests before provider/action implementation.

## Phase 2: Trusted GitHub and KeeperHub execution

### Objective
Implement the provider seam, parity enforcement, settlement state machine, and trusted Action.

### Requirements covered
`FR-001`, `FR-002`, `FR-009` to `FR-013`, `NFR-001` to `NFR-005`.

### Scope
Fresh GitHub state, checks, receipts, KeeperHub client, simulation, broadcast, polling, duplicate handling, evidence, summaries, comments, action entrypoint, and CLI.

### Planned work
Build highest-risk trust/provider/state paths first. No automatic retry. All outputs derive from one evidence record.

### Dependencies
Phase 1 contracts and Phase 0 live provider contract.

### Acceptance criteria
Success, duplicate, blocked, failure, pending, conflict, and manual-review outcomes are deterministic and safe.

### Verification
Contract, integration, failure, security, and fixture-based action tests.

### Risks
Side-effect ordering and uncertain provider state.

### Exit gate
Security review and clean-room QA pass before live acceptance.

## Phase 3: Live three-state acceptance

### Objective
Prove the product with real GitHub and KeeperHub evidence.

### Requirements covered
`SC-001` to `SC-005`.

### Scope
Private acceptance repository, simulation-only run, one real payout, replay, refusal, backup transaction, evidence archive.

### Planned work
Use funded testnet wallets and redacted screenshots/links. Never substitute mocks for live proof.

### Dependencies
Phase 2 and live provider funding/configuration.

### Acceptance criteria
One confirmed transfer, no second transfer on replay, and blocked no-broadcast result independently verified.

### Verification
Explorer, KeeperHub, GitHub run/receipt, and evidence cross-check.

### Risks
Flaky provider or insufficient funds.

### Exit gate
Evidence index complete; keep at least one backup successful transaction.

## Phase 4: Documentation, onboarding, optional site, and submission

### Objective
Make the verified build understandable, reproducible, and submittable.

### Requirements covered
Submission evidence, onboarding, accessibility, and release criteria.

### Scope
README, architecture/security/configuration/integration docs, starter template, onboarding teardown, demo, optional site, logged-out verification, release tag, submission.

### Dependencies
Phase 3 evidence.

### Acceptance criteria
Every public claim maps to live evidence or is labeled as a fixture/limitation; all links work logged out; release tag matches demo.

### Verification
Documentation review, secret scan, video timing, public-link check, release preflight.

### Risks
Presentation work displacing core proof.

### Exit gate
Submission confirmation archived; no unresolved critical blocker.

## Critical Dependencies

1. KeeperHub access and live API contract.
2. Funded execution wallet and verified stablecoin.
3. Safe GitHub Actions trust boundary.
4. Canonical payment identity and duplicate semantics.
5. Exact simulation-to-broadcast parity.
6. Repeatable three-state acceptance evidence.

## Definition of Ready

A phase/task is ready only when its dependencies are complete, its intended behavior is stated in one sentence, callers and touched files are inspected, trust inputs are identified, acceptance tests are named, allowed scope is bounded, and required provider assumptions are either verified or explicitly marked unresolved.

## Definition of Done

A task is done only when its stated acceptance criterion is observed, required tests/checks pass, a fresh review has no blocker/major finding, changed contracts are documented, no secrets are exposed, and `PROJECT_STATE.md` records the checkpoint evidence and next action.

## Implementation Handoff Protocol

The future executor must read this plan and `PROJECT_STATE.md`, inspect actual repository/environment state, follow phase dependencies, use test-first implementation, and update state after every checkpoint. The orchestrator may decompose and integrate but must not write production code or approve its own implementation. Each implementation change must be independently reviewed from the final diff without implementation reasoning. Plan changes require the amendment protocol in `PROJECT_STATE.md`.

## Planning Audit

- Problem, users, outcome, core workflow, exclusions, and evidence are explicit.
- Requirements have stable IDs and map to phases and verification.
- Provider, GitHub, chain, token, and credential uncertainties are visible.
- Security, duplicate effects, failure recovery, secret handling, and no-broadcast behavior are defined.
- Scope reduction preserves the core payment proof and removes site/decorative work first.
- Existing documents were treated as constraints and not modified.
- No production code, scaffold, dependency installation, delegation, or execution was performed.

## Research Sources

Planning sources are the existing repository documents: `memory.md`, `last stop.md`, `docs/TASKS.md`, `docs/ARCHITECTURE.md`, `docs/SECURITY.md`, `docs/CONFIGURATION.md`, `docs/KEEPERHUB-INTEGRATION.md`, and `docs/TEST-STRATEGY.md`. These are project evidence, not fresh authoritative external verification. Live KeeperHub and hackathon facts remain unresolved until checked during Phase 0.

