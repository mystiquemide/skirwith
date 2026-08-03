# MergePay Agent Orchestration Plan

This document governs the later implementation session. The orchestrator decomposes, routes, gates, and integrates. It does not write shipped production code.

## Roles

| Role | Responsibility | Must not do |
|---|---|---|
| Orchestrator | Inspect repository, understand flow, split work, route tasks, enforce gates, integrate approved changes | Write production code or approve its own implementation |
| Implementer-fast | Complete small, bounded, well-specified tasks | Expand scope, alter architecture, or skip tests |
| Implementer-deep | Complete security-sensitive, cross-cutting, unclear, or provider/concurrency tasks | Make undocumented architecture decisions |
| Reviewer | Review a diff adversarially with fresh context | Rely on implementer reasoning or silently fix the diff |
| QA runner | Execute prescribed quality and acceptance gates | Waive failures without an explicit decision record |

## Mandatory Orchestrator Loop

For every implementation task:

1. Read every file the task may touch.
2. Trace the relevant flow end to end.
3. Grep every caller of functions or contracts that may change.
4. State the root cause or intended behavior in one sentence.
5. If the root cause/behavior is unclear, do not delegate; investigate or split the task.
6. Create a bounded task packet with context, files, invariants, tests, and done state.
7. Route routine work to `implementer-fast`; route security, provider, state, or cross-cutting work to `implementer-deep`.
8. Require the implementer to write a failing test before production behavior and report the red-green evidence.
9. Send only the resulting diff and task contract to a fresh `reviewer` that did not receive implementation reasoning.
10. Reject the change if review finds correctness, security, scope, test, or documentation defects.
11. Run the relevant local gates after review; run the full suite at phase boundaries.
12. Integrate only reviewed, passing changes and update `docs/TASKS.md`, architecture, security, and memory when contracts change.

## Task Packet Template

```text
Task ID and title:
Owner role: implementer-fast | implementer-deep
Objective:
Root cause or intended behavior in one sentence:
Files read by orchestrator:
Files allowed to change:
Callers/dependents inspected:
Inputs and trust boundary:
Invariants that must remain true:
Required failing test:
Acceptance tests:
Documentation to update:
Out of scope:
Done state:
Reviewer focus:
```

## Routing Rules

### Implementer-fast

Use for isolated config validators, pure reason-code mappings, renderers, fixtures, documentation, formatting, and other tasks with an unambiguous contract and no concurrency or trust-boundary impact.

### Implementer-deep

Use for GitHub trust-boundary code, canonical serialization, idempotency, duplicate state transitions, KeeperHub transport, polling, secret redaction, action entrypoint composition, CI security, and live acceptance tooling.

## Reviewer Protocol

The reviewer receives:

- task packet;
- final diff;
- relevant tests and command output;
- current acceptance criteria;
- security invariants.

The reviewer does not receive:

- implementer chain-of-thought;
- informal intent not present in the packet;
- uncommitted unrelated work.

Reviewer output must classify findings as blocker, major, minor, or none and explicitly check:

- requested behavior;
- callers and compatibility;
- trust-boundary bypasses;
- replay/double-payment paths;
- simulation-to-broadcast parity;
- secret leakage;
- error and timeout behavior;
- tests that would fail if the change regressed;
- scope creep and undocumented decisions.

## Integration Gates

### Gate A: Foundation

Clean install, lockfile, format, lint, typecheck, tests, build, audit, secret scan, and bundle verification pass.

### Gate B: Contract freeze

Configuration, domain types, policy reason codes, canonical request, payment key, provider types, and receipt marker are reviewed before dependent implementation proceeds.

### Gate C: Provider proof

KeeperHub capability discovery, simulation, first smoke transaction, stablecoin verification, and API contract capture are complete.

### Gate D: Security proof

Fork/config spoofing/secret-redaction/no-broadcast/idempotency tests pass under fresh review.

### Gate E: Three-state acceptance

Success, replay without a second transfer, and blocked/no-broadcast are repeatable and independently evidenced.

### Gate F: Release

README, demo, transaction links, release tag, public-link verification, and submission fields all match the reviewed commit.

## Change Integration Rules

- One task packet maps to one focused branch/diff.
- No implementer edits another agent’s active files without orchestrator reassignment.
- Contract changes require architecture/security review before implementation continues.
- A reviewer may recommend a fix but must not silently modify the reviewed diff.
- Failed review returns to the implementer with a concrete finding; the corrected diff receives a fresh review.
- The orchestrator may merge only after reviewer approval and required gates pass.
- Never mark a task complete based on code presence alone; use its testable done state.

## Handoff Order

Use the dependency order in `docs/TASKS.md`. Parallelize only tasks whose dependency lists are complete and whose allowed files do not overlap. Do not parallelize KeeperHub discovery with code that hard-codes chain/token behavior. Do not parallelize action trust-boundary implementation with unrelated presentation work when the security model is still changing.

