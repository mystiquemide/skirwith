# MergePay Project Memory

Last updated: August 3, 2026 (Africa/Lagos)

## Current status

- Research, idea selection, adversarial review, win planning, and detailed implementation planning are complete.
- The complete execution plan is now in `docs/TASKS.md`: 113 dependency-aware tasks spanning architecture, code modules, tests, KeeperHub discovery, live proof, documentation, optional site work, demo, release, and submission.
- The full deferred-build planning package is indexed in `docs/PLAN.md` and includes `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/SECURITY.md`, `docs/CONFIGURATION.md`, `docs/KEEPERHUB-INTEGRATION.md`, `docs/TEST-STRATEGY.md`, `docs/DEMO.md`, and `docs/SUBMISSION.md`.
- `AGENTS.md` defines stack, code conventions, security invariants, verification requirements, and documentation discipline for future implementation sessions.
- `docs/ORCHESTRATION.md` defines the required future agent workflow: orchestrator-only decomposition/integration, bounded implementer packets, fresh-instance adversarial review, and phase gates. The orchestrator must not write shipped production code.
- `docs/HANDOFF.md` is the ready-to-use implementation handoff: requirement coverage audit, dependency-safe waves, seven task packets, and the first orchestrator prompt.
- The repository is planning-only. The earlier provisional Node/TypeScript scaffold was removed so all implementation and shipped code can be created later by implementer agents and independently reviewed.
- The project directory is not yet a Git repository.
- KeeperHub MCP configuration has been added to `/home/mide/.codex/config.toml`:

```toml
[mcp_servers.keeperhub]
url = "https://app.keeperhub.com/mcp"
```

- KeeperHub tools were not visible in the active session after the config change. Codex must be fully restarted, then the MCP tool registry and authentication must be checked again.
- A provider credential was found exposed in the Codex configuration during inspection. It must be rotated. Never reproduce it in chat, documentation, commits, or logs.

## Hackathon context

- Hackathon: Agents on Chain
- URL: `https://dorahacks.io/hackathon/agents-onchain/detail`
- Deadline recorded during research: August 13, 2026 at 12:00 UTC+2
- Prize pool recorded during research: $5,000
- Required proof: public GitHub repository, demo video, and a real transaction link.
- Mandatory sponsor requirement: KeeperHub must execute a real onchain transaction.
- Strong judging signals: reliable execution, visible simulation/execution evidence, safe failure handling, auditability, and clear onboarding.
- Stackable opportunity: KeeperHub onboarding starter/template/tutorial or documented onboarding teardown.

## Product decision

Project name: MergePay

Positioning:

> MergePay turns verified GitHub contributions into policy-controlled, auditable stablecoin payments through KeeperHub.

Core flow:

```text
Merged pull request
→ trusted configuration and event validation
→ deterministic payment policy
→ KeeperHub simulation
→ KeeperHub execution
→ terminal status polling
→ transaction and audit evidence posted to GitHub
```

The product is a GitHub Action, not a DAO platform, payroll dashboard, marketplace, or chat agent. GitHub is the primary interface.

## Winning proof

The final submission must demonstrate three independently verifiable states for the same workflow:

1. A real merged pull request produces exactly one confirmed KeeperHub transaction.
2. Replaying the same event produces no second payment.
3. A policy-violating payment is blocked before KeeperHub broadcast, with explicit proof that no transaction was submitted.

This success/duplicate/refusal evidence set is the project's central differentiator.

## MVP scope

Required:

- GitHub Action triggered only for a genuinely merged pull request.
- Trusted `.github/mergepay.yml` configuration.
- Maintainer-controlled contributor-to-wallet mapping.
- Maintainer-controlled bounty labels mapped to fixed amounts.
- One chain and one asset for the MVP.
- Per-payment maximum.
- Required status-check enforcement if configured.
- Deterministic policy reason codes.
- Canonical payment request and stable payment key.
- KeeperHub simulation before broadcast.
- Exact simulation-to-broadcast request parity.
- Real KeeperHub execution and status polling.
- Duplicate-payment protection.
- Bounded failure handling.
- GitHub Actions summary and pull-request receipt comment.
- Execution ID, transaction hash, explorer link, chain, token, recipient, amount, policy result, and audit reference in evidence.
- Reusable starter template and KeeperHub onboarding notes.

Explicitly out of scope for the MVP:

- LLM-based code-quality or payout decisions.
- Natural-language payment commands.
- Multi-chain support.
- DAO treasury management.
- Generic payroll or accounting.
- Contributor-controlled wallet addresses or arbitrary amounts from PR content.
- Automatic token approvals.
- Broad retry loops.
- A dashboard-first frontend.
- Unsupported claims about private routing, gas sponsorship, x402, or MPP.

## Trusted configuration direction

Provisional configuration shape:

```yaml
chain: base-sepolia
token: USDC
maximum_payout: "25"
required_label: mergepay-approved
require_checks: true

contributors:
  alice: "0x..."

bounties:
  mergepay-5: "5"
  mergepay-10: "10"
  mergepay-25: "25"
```

This schema is not yet final. Chain and token must be confirmed using live KeeperHub capabilities. Amounts and wallet addresses must never be accepted from arbitrary PR text.

## Chain and asset plan

- Begin with a KeeperHub-supported testnet.
- Preferred candidate: Base Sepolia, if KeeperHub supports the complete simulation and execution path.
- Fallback candidate: Ethereum Sepolia or the best-supported KeeperHub testnet.
- Confirm the KeeperHub execution wallet, available test funds, supported token contract, and correct explorer.
- If test USDC blocks the first smoke test, prove the integration with a native-token transfer first, then move to USDC for the final MergePay proof.
- Never claim USDC support until the exact token contract and transfer are verified.

## Required wallets and secrets

Test identities needed:

- KeeperHub-controlled treasury/sender wallet.
- Approved contributor recipient wallet.
- Invalid or blocked-case fixture wallet/address.

Rules:

- Never place a wallet private key in the repository, GitHub configuration, chat, logs, screenshots, or documentation.
- The KeeperHub API key must exist only in the trusted secret-bearing job.
- Mask and redact secrets in all failures and HTTP responses.
- Use minimum GitHub token permissions.

## Security model

The GitHub Actions trust boundary is the most important security surface.

- Fork and contributor-controlled code must never run with `KEEPERHUB_API_KEY`.
- Payment execution must use trusted repository configuration and trusted GitHub event/API state.
- Never check out or execute untrusted PR code in the secret-bearing settlement job.
- Fetch the current merged PR state and check results before execution.
- Maintainers control wallet mappings, labels, token, chain, and limits.
- Simulation must succeed and report no revert before broadcast.
- The request simulated must be identical to the request broadcast.
- Use a deterministic payment key based on repository, PR number, merge SHA, recipient, amount, token, and chain.
- A rerun must resolve or poll the original execution, never send again.
- Reusing an idempotency key with changed request content must be rejected.
- A blocked decision must produce a first-class `No broadcast request made` result.
- Do not implement a daily limit until durable state exists and is tested.
- Do not implement automatic retries until terminal status and idempotency behavior are proven.

## Backend-first execution order

The agreed order is:

1. Restart Codex and confirm KeeperHub MCP tools/authentication.
2. Confirm KeeperHub-supported chains, execution wallet, and available execution/simulation tools.
3. Run a live KeeperHub smoke test before building the full product.
4. Initialize the TypeScript backend/GitHub Action project and quality gates.
5. Freeze and implement the trusted configuration schema.
6. Implement merged-PR parsing and the GitHub trust boundary.
7. Implement deterministic policy evaluation.
8. Implement canonical payment requests and deterministic payment keys.
9. Build the typed, mockable KeeperHub client.
10. Enforce simulation-to-broadcast parity.
11. Implement idempotency, duplicate suppression, polling, and safe errors.
12. Integrate the trusted GitHub workflow and receipt comments.
13. Prove the full backend flow end to end.
14. Prove successful, duplicate, and blocked/no-broadcast states.
15. Add security fixtures and complete automated tests.
16. Build a CLI that calls the same backend contracts for manual testing and inspection. It must not duplicate payment logic.
17. Add documentation, starter template, and onboarding teardown.
18. Add a lightweight landing page and public app documentation only after the backend and CLI are reliable.
19. Record the demo, verify proof links, and complete submission QA.

## Locked v0.1 architecture refinements

- Use npm and commit a reproducible lockfile.
- Use strict TypeScript, Node.js, a JavaScript GitHub Action bundle, Vitest, ESLint, Prettier, and NCC.
- Use the KeeperHub Direct Execution API for the production GitHub Actions path; MCP is for capability discovery/manual development when available.
- Remove the custom daily limit from v0.1 because a stateless GitHub Action cannot enforce it reliably without durable storage.
- Use a per-payment cap, KeeperHub organization limits, trusted label-to-amount mappings, and maintainer wallet mappings.
- Do not add a database for v0.1.
- Duplicate protection combines a canonical payment key, canonical request hash comparison, KeeperHub idempotency/execution lookup, and a versioned structured marker in the GitHub receipt.
- Do not automatically rebroadcast after an uncertain or terminal failure. Resume or inspect the original execution and require manual review when state cannot be proven.
- Load `.github/mergepay.yml` from the trusted default-branch commit through the GitHub API, never from contributor-controlled checkout content.
- The secret-bearing workflow must not check out or execute pull-request code.
- The public site is optional and starts only after the live success, replay, and refusal evidence set is complete.

## CLI role

The CLI is a later developer/testing surface, not a second implementation.

It should eventually support commands such as:

- Validate configuration.
- Parse or replay a saved GitHub event fixture.
- Evaluate a payment policy without broadcasting.
- Simulate the canonical KeeperHub request.
- Execute only with explicit live-mode confirmation.
- Poll an execution ID.
- Inspect a payment key and duplicate status.
- Render the same receipt data used by the GitHub Action.

The GitHub Action and CLI must call the same core modules.

## Frontend and public documentation

No custom dashboard is required for the MVP. The primary product surfaces are:

- GitHub pull request.
- GitHub Actions summary.
- GitHub receipt comment.
- KeeperHub execution evidence.
- Block explorer transaction page.

After the backend, three-state proof, automated tests, and CLI work reliably, add a lightweight site if time permits.

Suggested site navigation:

- Overview
- How it works
- Documentation
- GitHub
- Transaction proof

The public documentation should cover:

- Quick start and installation.
- `.github/mergepay.yml` configuration.
- GitHub secret setup.
- Supported chain and token.
- Payment lifecycle.
- Security and trust model.
- Common failures.
- Duplicate suppression.
- Blocked/no-broadcast behavior.

The repository remains the canonical detailed documentation source. Site documentation is a concise onboarding layer.

## Writing style

Use the requested Ade technical-writing style throughout product and public documentation:

- Direct and precise.
- Evidence-led.
- Minimal marketing language.
- Clear assumptions and constraints.
- Operational, testable instructions.
- Honest boundaries and limitations.
- Explain how claims can be independently verified.

## Demo plan

Target length: under three minutes.

Show:

1. Final successful GitHub receipt first.
2. Trusted MergePay configuration.
3. Approved and passing PR.
4. Real merge event.
5. Policy decision.
6. KeeperHub simulation.
7. KeeperHub execution and terminal status.
8. Explorer-confirmed transaction.
9. Receipt comment with execution evidence.
10. Oversized or invalid payout blocked before broadcast.
11. Duplicate rerun resolving to the original payment without a second transaction.

Keep chain, token, amount, execution ID, payment key, and transaction hash visible. Never use fake hashes or mock output as live proof. Record at least two authentic successful transactions before submission as operational backup.

## Documentation deliverables

Repository documentation eventually required:

- `README.md`
- `docs/ARCHITECTURE.md`
- `docs/SECURITY.md`
- `docs/CONFIGURATION.md`
- `docs/KEEPERHUB-INTEGRATION.md`
- `docs/DEMO.md`
- `docs/ONBOARDING-TEARDOWN.md`
- Reusable workflow/example configuration
- Architecture and three-state evidence diagrams

The proof-first README must place the real transaction link, video link, chain/token status, and exact KeeperHub integration above or near the fold.

## Critical-path gates

1. KeeperHub MCP connection and authentication.
2. First live KeeperHub simulation and transaction.
3. Safe GitHub Actions trust boundary.
4. Canonical request/idempotency/duplicate protection.
5. Trusted GitHub Action end-to-end execution.
6. Repeatable three-state acceptance run.

No landing-page polish should happen before these gates pass. If the first real KeeperHub transaction fails, stop all presentation work and fix the sponsor integration.

## Next action after restart

Resume at Task 1 in `docs/TASKS.md`. During execution, first audit the planning-only repository and current hackathon requirements, initialize Git, delegate foundation creation to an implementer, pass independent review and quality gates, then restore KeeperHub access and follow the dependency graph. Do not skip ahead to site or presentation work.

## Source files

- `last stop.md` — full prior research, skill output, win plan, gap review, adversarial review, and stopped execution context.
- `docs/TASKS.md` — current 28-task dependency-aware implementation plan.
- `memory.md` — concise source of truth for resuming the project.
