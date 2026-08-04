# Skirwith Planning Index

Use these documents in this order when execution begins:

1. `PRD.md` - product outcome, users, requirements, scope, and acceptance criteria.
2. `ARCHITECTURE.md` - system boundaries, components, models, failure behavior, and ADRs.
3. `SECURITY.md` - trust model, threats, controls, and residual risk.
4. `CONFIGURATION.md` - trusted YAML contract and validation rules.
5. `KEEPERHUB-INTEGRATION.md` - live discovery and provider execution contract.
6. `TEST-STRATEGY.md` - test layers, invariants, and quality gates.
7. `TASKS.md` - authoritative 113-task dependency graph and code map.
8. `DEMO.md` - three-state demonstration and evidence capture.
9. `SUBMISSION.md` - release and hackathon preflight.
10. `ORCHESTRATION.md` - implementer/reviewer roles, delegation packets, gates, and integration rules.
11. `HANDOFF.md` - requirement audit, execution waves, ready-to-send packets, and first handoff prompt.

`../AGENTS.md` contains implementation rules. `../memory.md` is the concise resume point. `../last stop.md` is historical research and should not override newer decisions.

## Execution Start

Begin at Task 1 in `TASKS.md`. The repository is intentionally planning-only: implementer agents must create all package, tooling, test, action, and production files. Do not write production behavior without a failing test first. Do not begin site or presentation work before live success, replay, and refusal evidence exists.
