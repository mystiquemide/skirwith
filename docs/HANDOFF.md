# MergePay Implementation Handoff

This is the execution handoff for a future orchestrator. The current repository is planning-only. The orchestrator must not write production code.

## Source Of Truth

Read in this order:

1. `AGENTS.md`
2. `docs/ORCHESTRATION.md`
3. `docs/PRD.md`
4. `docs/ARCHITECTURE.md`
5. `docs/SECURITY.md`
6. `docs/CONFIGURATION.md`
7. `docs/KEEPERHUB-INTEGRATION.md`
8. `docs/TEST-STRATEGY.md`
9. `docs/TASKS.md`
10. `memory.md`

`last stop.md` is historical research only. New live KeeperHub observations override every provisional provider assumption.

## Requirement Coverage Audit

| Requirement group | Covered by |
|---|---|
| Trusted merged-PR trigger | PRD; ARCHITECTURE; TASKS 24-30, 69-70; SECURITY |
| Maintainer-controlled config | PRD; CONFIGURATION; TASKS 19-23 |
| Deterministic policy and reason codes | PRD; ARCHITECTURE; TASKS 31-36 |
| Canonical request and replay identity | PRD; ARCHITECTURE; TASKS 37-40, 58-64 |
| KeeperHub simulation/execution/polling | PRD; KEEPERHUB-INTEGRATION; TASKS 41-57 |
| Exact simulation/broadcast parity | SECURITY; ARCHITECTURE ADR-006; TASKS 52-54 |
| GitHub receipt and Actions summary | PRD; ARCHITECTURE; TASKS 66-72 |
| Secret and fork safety | SECURITY; AGENTS; TASKS 4, 22, 30, 50, 78, 82 |
| Success/replay/refusal proof | PRD; DEMO; TASKS 5, 87-91 |
| Reusable onboarding template | PRD; TASKS 97-99 |
| Public release and submission | SUBMISSION; TASKS 92-113 |

## Non-Goals Confirmed

No custom daily limit, database, dashboard, LLM, arbitrary PR amount/address, automatic rebroadcast, multi-chain, multi-token, custom contract, gas-sponsorship claim, private-routing claim, x402/MPP claim, or production treasury guarantee is part of v0.1.

## Dependency-Safe Execution Waves

Only start a wave after its gate passes. Tasks within a wave may run in parallel only when their allowed files do not overlap.

### Wave 0: Orchestrator orientation

Tasks: 1-6

Gate: requirements, planning-only repository, threat model, three-state acceptance protocol, and architecture decisions are documented.

### Wave 1: Foundation

Tasks: 7-16

Owner split: fast for metadata/configuration/docs; deep for CI security and action packaging.

Gate A: reproducible install and quality commands exist and pass.

### Wave 2: Contracts

Tasks: 17-23

Owner split: deep for domain/config boundary; fast for fixtures.

Gate B: config and domain contracts reviewed before consumers are built.

### Wave 3: GitHub trust and policy

Tasks: 24-40

Owner split: deep for trusted state and policy composition; fast for pure reason codes and fixtures.

Gate: no contributor-controlled input can affect payout identity; policy tests prove blocked paths.

### Wave 4: KeeperHub discovery

Tasks: 41-48

Owner: deep only. No hard-coded chain/token implementation may begin before this wave.

Gate C: live provider contract and first stablecoin transaction are recorded.

### Wave 5: Provider implementation

Tasks: 49-57

Owner: deep only; reviewer must receive only the final diff and task packet.

Gate: provider contract tests, redaction, simulation, broadcast, polling, and fake provider pass.

### Wave 6: Settlement state machine

Tasks: 58-64

Owner: deep only.

Gate: duplicate, conflict, pending, uncertain, and no-rebroadcast states are tested.

### Wave 7: Action and CLI surfaces

Tasks: 65-76

Owner split: deep for action/trust boundary; fast for rendering and read-only CLI.

Gate: packaged trusted workflow runs all terminal outcomes against fixtures.

### Wave 8: Security and clean-room QA

Tasks: 77-84

Owner: fresh QA/security agents; no implementer should self-certify these gates.

Gate D: adversarial matrix and clean-room verification pass.

### Wave 9: Live acceptance

Tasks: 85-91

Owner: QA/product with deep backend support.

Gate E: independently verifiable success, replay, and refusal evidence.

### Wave 10: Documentation and onboarding

Tasks: 92-100

Owner split: fast for docs/templates; deep review for security and integration claims.

### Wave 11: Optional site

Tasks: 101-105

The product is complete without this wave. Task 101 decides whether schedule permits it.

### Wave 12: Demo and submission

Tasks: 106-113

Gate F: logged-out public verification and release tag match the demonstrated build.

## Ready-To-Send Task Packets

### Packet P1 - Foundation bootstrap

```text
Task IDs: 7-16
Owner: implementer-fast for 7, 9-11, 14, 16; implementer-deep for 8, 12, 13, 15
Root behavior: The repository is planning-only and needs a reproducible strict TypeScript GitHub Action toolchain before domain code can be safely delegated.
Read first: AGENTS.md, docs/ORCHESTRATION.md, docs/TASKS.md Tasks 1-16.
Allowed changes: package/tooling files, action metadata, CI, license, docs for local commands. No src business logic.
Required tests: foundation smoke test written first; clean install, typecheck, lint, test, build, audit, secret scan, bundle verification.
Invariants: no secrets; pinned CI actions; generated bundle policy documented; no production behavior.
Done: Gate A passes from a clean checkout and a fresh reviewer approves the diff.
Reviewer focus: reproducibility, Node/action compatibility, CI privilege scope, bundle correctness, and scope containment.
```

### Packet P2 - Domain contracts and policy

```text
Task IDs: 17-40
Owner: implementer-deep for trust/config/policy/payment identity; implementer-fast for fixtures and pure mappings.
Root behavior: Payment decisions must be derived only from normalized trusted inputs and stable canonical identity.
Read first: PRD, ARCHITECTURE data models, SECURITY, CONFIGURATION, TEST-STRATEGY, TASKS 17-40.
Allowed changes: src/domain, src/config, src/github event/check adapters, src/policy, src/payment, corresponding tests/fixtures.
Required tests: failing tests for every validator, parser, policy reason, canonical serialization, hash, and payment-key invariant.
Invariants: no provider calls from pure policy; no PR text as amount/address; decimal-safe arithmetic; stable hash; explicit broadcast eligibility.
Done: Gate B and the policy/no-broadcast invariants pass.
Reviewer focus: trust-boundary bypasses, normalization, decimal precision, hash stability, and caller compatibility.
```

### Packet P3 - KeeperHub provider

```text
Task IDs: 41-57
Owner: implementer-deep.
Root behavior: The live provider contract must be discovered before it is encoded, then wrapped behind a typed mockable seam.
Read first: KEEPERHUB-INTEGRATION, ARCHITECTURE provider boundary, SECURITY, TASKS 41-57.
Allowed changes: src/keeperhub, provider tests, redaction utilities, live smoke scripts/docs, no policy or action workflow changes.
Required tests: red, then transport/decoder, simulation, parity, broadcast, polling, terminal-state, redaction, and fake-provider tests.
Invariants: observed API overrides placeholders; bounded timeouts; no raw response logging; exact request parity; no automatic rebroadcast.
Done: Gate C provider evidence and all provider contract tests pass.
Reviewer focus: authentication leakage, request mutation, idempotency headers, status mapping, polling bounds, and unsupported claims.
```

### Packet P4 - Settlement and action

```text
Task IDs: 58-76
Owner: implementer-deep for state machine and action; implementer-fast for renderers/read-only CLI.
Root behavior: One trusted merge must safely transition through policy, duplicate resolution, simulation, execution, polling, and evidence without a second payment.
Read first: ARCHITECTURE flow/failure model, SECURITY, DEMO, TASKS 58-76.
Allowed changes: src/execution, src/evidence, src/output, src/action, src/cli, workflow examples, tests.
Required tests: state-machine red tests, receipt integrity, uncertain submission, output renderers, action fixture integration, guarded CLI behavior.
Invariants: blocked means no broadcast; same key/same body resolves original; changed body conflicts; receipt and summary share evidence source; secret job never executes PR code.
Done: packaged action passes fixture integration and Gate D prerequisites.
Reviewer focus: duplicate race paths, side-effect ordering, GitHub permissions, exit semantics, and output truthfulness.
```

### Packet P5 - Adversarial QA

```text
Task IDs: 77-84
Owner: fresh QA/security implementers; fresh reviewer required.
Root behavior: The system must fail closed under malicious GitHub input, provider errors, replays, secret exposure attempts, and build drift.
Read first: SECURITY, TEST-STRATEGY, ORCHESTRATION, TASKS 77-84; inspect the final diff and callers before adding fixtures.
Allowed changes: tests, fixtures, CI checks, and narrowly scoped bug fixes returned through a new implementer packet.
Required tests: full policy matrix, fork/config spoofing, provider failures, idempotency/replay, no-broadcast spies, secret scanning, bundle/audit checks.
Invariants: tests assert observable security behavior, not mocks alone; no waiver without decision record.
Done: Gate D passes with a fresh reviewer report containing no blocker/major findings.
Reviewer focus: missing attack cases, false-positive tests, test isolation, and whether assertions prove no side effect.
```

### Packet P6 - Live acceptance and proof

```text
Task IDs: 85-91
Owner: QA/product; deep implementer only for live integration defects.
Root behavior: The shipped workflow must produce independently verifiable success, replay suppression, and refusal evidence.
Read first: PRD acceptance criteria, DEMO, SUBMISSION, KEEPERHUB-INTEGRATION, TASKS 85-91.
Allowed changes: private acceptance repository settings, redacted evidence records, tests/docs for observed behavior; no unreviewed production shortcuts.
Required evidence: one confirmed stablecoin transfer, one replay with no second transfer, one blocked run with no execution/broadcast, plus backup success.
Invariants: real links only; no secrets/screenshots of credentials; chain/token/amount/hash agree across surfaces.
Done: Gate E evidence index is complete and independently checked.
Reviewer focus: authenticity, repeatability, explorer proof, duplicate count, and blocked-path proof.
```

### Packet P7 - Release package

```text
Task IDs: 92-113
Owner: implementer-fast for documentation/templates; product/video/devops for release; deep reviewer for claims/security.
Root behavior: Public materials must describe exactly what the reviewed build proves and make reproduction possible.
Read first: all source-of-truth docs plus evidence index from Task 91.
Allowed changes: README, docs, diagrams, starter template, optional site, demo assets, release metadata, submission fields.
Required checks: docs links, logged-out verification, video timing, secret scan, release tag/build match, submission preflight.
Invariants: no fake metrics/hashes, no unsupported sponsor claims, limitations visible, optional site cannot delay backend proof.
Done: Gate F passes and submission confirmation is archived.
Reviewer focus: proof placement, claim/evidence consistency, accessibility, public link behavior, and release reproducibility.
```

## First Handoff Message

```text
You are the implementation orchestrator for MergePay. This repository is planning-only. Read AGENTS.md, docs/ORCHESTRATION.md, docs/PLAN.md, docs/PRD.md, docs/ARCHITECTURE.md, docs/SECURITY.md, docs/CONFIGURATION.md, docs/KEEPERHUB-INTEGRATION.md, docs/TEST-STRATEGY.md, docs/TASKS.md, and memory.md before splitting work. Do not write production code yourself. Begin with Tasks 1-6, state the repository/trust-boundary root behavior in one sentence, then delegate Packet P1 only after the read-before-split checks pass. Every implementer diff must receive review from a fresh reviewer that did not see implementation reasoning. Do not proceed past a gate with an unresolved blocker.
```

