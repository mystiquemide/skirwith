# Skirwith End-to-End Execution Plan

Last planned: August 3, 2026 (Africa/Lagos)

## Objective

Build and submit a GitHub JavaScript Action that turns a trusted merged pull request into a deterministic, policy-controlled payment through KeeperHub. The final evidence must prove three states for the same workflow:

1. One eligible merge produces exactly one confirmed onchain transaction.
2. Replaying the same payment resolves to the original execution and produces no second transaction.
3. A policy violation is blocked before KeeperHub broadcast, with explicit no-broadcast evidence.

## Locked MVP Decisions

- Runtime: Node.js 20 or the current GitHub-supported LTS at execution time.
- Language: strict TypeScript using ESM source and an NCC-generated JavaScript action bundle.
- Package manager: npm with a committed lockfile.
- Primary interface: GitHub Actions summary and pull-request receipt comment.
- Production integration: KeeperHub Direct Execution API with a headless organization credential.
- Development integration: KeeperHub MCP may be used for discovery and manual smoke testing when available.
- Chain: one KeeperHub-supported EVM testnet, selected only after live capability discovery.
- Asset: one verified stablecoin for final proof; native token is allowed only for the first integration smoke test.
- Policy: deterministic code only, with no LLM payout decisions.
- Configuration: maintainer-controlled `.github/skirwith.yml` loaded from the trusted default branch.
- Recipient: maintainer-controlled GitHub-login-to-wallet mapping.
- Amount: fixed label-to-amount mapping from trusted configuration.
- Limits: per-payment maximum plus KeeperHub organization limits. No custom daily limit in v0.1.
- State: no database in v0.1. Duplicate control uses a canonical payment key, KeeperHub idempotency, canonical request comparison, execution lookup, and GitHub receipt lookup.
- Retry: no automatic rebroadcast after an uncertain or terminal failure. Resume/poll the original execution only.
- Workflow: no checkout or execution of pull-request code in the secret-bearing settlement job.
- Scope exclusions: dashboard, custom contract, multi-chain, arbitrary contributor input, automatic approvals, payroll, DAO treasury features, and unverified sponsor claims.

## Planned Code Map

```text
skirwith/
├── .github/
│   ├── workflows/ci.yml
│   ├── workflows/skirwith-example.yml
│   └── skirwith.example.yml
├── src/
│   ├── action.ts
│   ├── cli.ts
│   ├── config/schema.ts
│   ├── config/load-config.ts
│   ├── domain/types.ts
│   ├── domain/errors.ts
│   ├── github/event.ts
│   ├── github/api.ts
│   ├── github/checks.ts
│   ├── github/receipts.ts
│   ├── policy/evaluate-policy.ts
│   ├── policy/reason-codes.ts
│   ├── payment/canonical-request.ts
│   ├── payment/payment-key.ts
│   ├── keeperhub/types.ts
│   ├── keeperhub/client.ts
│   ├── keeperhub/errors.ts
│   ├── keeperhub/poll.ts
│   ├── execution/settle-payment.ts
│   ├── execution/duplicate.ts
│   ├── evidence/record.ts
│   ├── output/summary.ts
│   ├── output/comment.ts
│   └── security/redact.ts
├── tests/
│   ├── config/
│   ├── github/
│   ├── policy/
│   ├── payment/
│   ├── keeperhub/
│   ├── execution/
│   ├── security/
│   └── fixtures/
├── examples/skirwith.yml
├── docs/
├── action.yml
├── package.json
└── tsconfig.json
```

## Execution Rules

- Implement production behavior test-first: failing focused test, minimal implementation, full-suite verification, then refactor.
- Never log secrets, authorization headers, raw provider error bodies, or full wallet credentials.
- Never accept recipient, amount, chain, token, or policy rules from pull-request content.
- Never broadcast unless the exact canonical request has passed policy and simulation.
- Never describe mock output as live evidence.
- Stop presentation work whenever the live KeeperHub path is broken.

## Phase 0 - Discovery And Architecture Freeze

Task 1: Reconfirm hackathon requirements and deadline
Owner: Product / Research
Complexity: S
Depends on: none
Done when: Current deadline, eligibility, required links, sponsor criteria, judging criteria, and onboarding bounty rules are recorded with source URLs and access dates.

Task 2: Audit the planning-only repository
Owner: Tech Lead
Complexity: S
Depends on: none
Done when: Every planning file is inventoried, historical notes are separated from authoritative specifications, and the repository is confirmed to contain no implementation scaffold or shipped code.

Task 3: Freeze the v0.1 architecture decisions
Owner: Architect
Complexity: S
Depends on: 1, 2
Done when: An architecture decision record confirms runtime, package manager, action type, one-chain/one-token scope, direct API path, no database, no daily limit, and no automatic retry.

Task 4: Define the trust-boundary threat model **CRITICAL PATH**
Owner: Security
Complexity: M
Depends on: 3
Done when: Actors, trusted inputs, untrusted inputs, secrets, execution boundaries, attack paths, and required mitigations are documented and mapped to tests.

Task 5: Define the three-state acceptance protocol **CRITICAL PATH**
Owner: QA / Product
Complexity: M
Depends on: 1, 3
Done when: Exact success, replay, and refusal fixtures, observable evidence, pass criteria, and cleanup rules are specified before implementation.

Task 6: Create the implementation branch and repository baseline
Owner: Tech Lead
Complexity: S
Depends on: 2, 3
Done when: Git is initialized, the intended default branch exists, current planning files are preserved, and no secrets are tracked.

## Phase 1 - Project Foundation

Task 7: Finalize package metadata and Node version
Owner: Backend
Complexity: S
Depends on: 3, 6
Done when: `package.json`, `.nvmrc` or equivalent, engines, module format, scripts, and package metadata agree on the selected runtime.

Task 8: Install and lock dependencies **CRITICAL PATH**
Owner: Backend
Complexity: S
Depends on: 7
Done when: npm installation succeeds, `package-lock.json` is committed, and dependency versions are reproducible from a clean checkout.

Task 9: Configure strict TypeScript
Owner: Backend
Complexity: S
Depends on: 8
Done when: Source and tests typecheck under strict mode with no implicit any, unchecked indexed access, or inconsistent module resolution.

Task 10: Configure Vitest and coverage
Owner: QA
Complexity: S
Depends on: 8
Done when: One intentionally failing test can be run in isolation and the suite emits deterministic test and coverage output.

Task 11: Configure ESLint and Prettier
Owner: Backend
Complexity: S
Depends on: 8, 9
Done when: Source, tests, and configuration files pass consistent lint and formatting commands.

Task 12: Configure NCC action packaging
Owner: Backend
Complexity: S
Depends on: 8, 9
Done when: A minimal action entrypoint bundles to `dist/index.js` and can be loaded by Node without missing runtime dependencies.

Task 13: Finalize `action.yml`
Owner: DevOps
Complexity: S
Depends on: 12
Done when: Metadata, runtime, inputs, outputs, branding, and bundled entrypoint match the implemented action contract.

Task 14: Add repository hygiene files
Owner: DevOps
Complexity: S
Depends on: 6
Done when: `.gitignore`, `.env.example`, license, editor settings, secret exclusions, and generated-file policy are present and reviewed.

Task 15: Add continuous integration **CRITICAL PATH**
Owner: DevOps
Complexity: M
Depends on: 9, 10, 11, 12, 14
Done when: Pinned GitHub Actions run install, format, lint, typecheck, test, build, dependency audit, and bundle-diff checks on pull requests.

Task 16: Document local development commands
Owner: Documentation
Complexity: S
Depends on: 7, 15
Done when: A new developer can install, test, lint, typecheck, build, and run fixtures using documented commands.

## Phase 2 - Domain Contracts And Trusted Configuration

Task 17: Define shared domain types
Owner: Architect / Backend
Complexity: S
Depends on: 9
Done when: Types exist for repository identity, merged pull request, configured recipient, payout, policy decision, canonical request, execution, and evidence record.

Task 18: Define stable machine-readable error types
Owner: Backend
Complexity: S
Depends on: 17
Done when: Configuration, policy, GitHub, provider, execution, and security failures have typed categories and safe public messages.

Task 19: Freeze the configuration schema
Owner: Architect / Security
Complexity: M
Depends on: 3, 4, 17
Done when: The v0.1 YAML contract defines version, repository, chain, token, required label, label amounts, maximum payout, required checks, and contributor wallet mappings without a daily limit.

Task 20: Implement configuration parsing test-first
Owner: Backend
Complexity: M
Depends on: 10, 18, 19
Done when: Valid YAML produces a typed config and malformed YAML or unknown schema versions return actionable safe errors.

Task 21: Implement configuration semantic validation test-first
Owner: Backend
Complexity: M
Depends on: 20
Done when: Invalid addresses, decimals, amounts, duplicate labels, unsupported fields, cap violations, and empty mappings are rejected deterministically.

Task 22: Implement trusted default-branch config loading test-first **CRITICAL PATH**
Owner: Backend / Security
Complexity: M
Depends on: 4, 20
Done when: Config is fetched through the GitHub API at the trusted default-branch commit and never read from the pull-request checkout or head SHA.

Task 23: Create example configuration fixtures
Owner: Documentation / QA
Complexity: S
Depends on: 19, 21
Done when: Valid, malformed, unsafe, over-cap, and unsupported-version fixtures cover the configuration contract without real credentials.

## Phase 3 - GitHub Event And Repository Verification

Task 24: Define the accepted GitHub event contract
Owner: Backend / Security
Complexity: S
Depends on: 4, 17
Done when: Only `pull_request.closed` with `merged === true`, an expected repository, base branch, PR number, merge SHA, author login, and trusted API context is accepted.

Task 25: Implement event parsing test-first
Owner: Backend
Complexity: M
Depends on: 10, 24
Done when: Valid merged events produce a normalized domain object and unmerged, deleted, malformed, or wrong-repository events exit without payment.

Task 26: Implement fresh pull-request state verification test-first **CRITICAL PATH**
Owner: Backend / Security
Complexity: M
Depends on: 22, 25
Done when: The action fetches current PR state from GitHub and rejects stale or spoofed event fields before policy evaluation.

Task 27: Implement trusted label verification test-first
Owner: Backend / Security
Complexity: M
Depends on: 26
Done when: The required payout label is confirmed from fresh GitHub API data and is mapped only through trusted configuration.

Task 28: Implement required-check verification test-first
Owner: Backend
Complexity: M
Depends on: 26
Done when: Configured status checks are fetched for the merge SHA and policy receives a deterministic pass, pending, missing, or failed result.

Task 29: Implement repository and branch allowlisting test-first
Owner: Backend / Security
Complexity: S
Depends on: 26
Done when: Events outside the configured repository and base branch are blocked before any provider call.

Task 30: Define minimum GitHub token permissions
Owner: Security / DevOps
Complexity: S
Depends on: 4, 22, 26
Done when: The workflow requires only contents read, pull requests write, checks read, and any strictly necessary metadata permissions.

## Phase 4 - Deterministic Policy And Payment Identity

Task 31: Define policy reason codes
Owner: Backend / UX Writing
Complexity: S
Depends on: 18, 19, 24
Done when: Every allow or block path has a stable code, severity, safe message, and no-broadcast classification.

Task 32: Implement recipient resolution test-first
Owner: Backend
Complexity: S
Depends on: 21, 25, 31
Done when: The PR author resolves only through the maintainer mapping and unknown or invalid recipients are blocked.

Task 33: Implement label-to-amount resolution test-first
Owner: Backend
Complexity: S
Depends on: 21, 27, 31
Done when: Exactly one trusted payout label resolves to a fixed decimal amount and ambiguous or missing mappings are blocked.

Task 34: Implement amount and maximum checks test-first
Owner: Backend
Complexity: S
Depends on: 33
Done when: Human decimal amounts and the maximum convert to atomic integer units using the configured token decimals; fractional precision beyond token decimals is rejected; zero, negative, excessive, or precision-invalid amounts are blocked without floating-point arithmetic.

Task 35: Implement chain and token allowlisting test-first
Owner: Backend
Complexity: S
Depends on: 21, 31
Done when: Policy accepts only the configured chain ID, token address, symbol, and decimals selected during live discovery.

Task 36: Implement complete policy evaluation test-first **CRITICAL PATH**
Owner: Backend
Complexity: M
Depends on: 28, 29, 32, 34, 35
Done when: One pure function returns a deterministic approved or blocked decision containing inputs, reason codes, and explicit broadcast eligibility.

Task 37: Define canonical payment request serialization
Owner: Architect / Backend
Complexity: M
Depends on: 17, 36
Done when: Repository, PR, merge SHA, recipient, atomic amount, token, chain, and purpose serialize with documented stable field order and normalization.

Task 38: Implement canonical request hashing test-first
Owner: Backend
Complexity: S
Depends on: 37
Done when: Identical logical requests hash identically and any material payment field change produces a different hash.

Task 39: Implement deterministic payment key test-first **CRITICAL PATH**
Owner: Backend
Complexity: S
Depends on: 38
Done when: A namespaced key derives from the stable payment identity (version, repository, PR, merge SHA, purpose), is unchanged by material content changes (recipient, amount, chain, token), is provider-safe, and is documented for audit use; the canonical request hash remains a separate integrity value so same-key/different-hash conflicts are representable.

Task 40: Define evidence record schema
Owner: Backend / QA
Complexity: S
Depends on: 31, 37, 39
Done when: A versioned record captures payment key, request hash, policy, simulation, broadcast flag, execution ID, terminal status, transaction proof, timestamps, and safe errors.

## Phase 5 - KeeperHub Discovery And Live Smoke Test

Task 41: Restore KeeperHub tool/API access **CRITICAL PATH**
Owner: DevOps
Complexity: M
Depends on: 8
Done when: MCP or direct API authentication works without exposing credentials and a safe capability request succeeds.

Task 42: Discover enabled chains and execution wallet **CRITICAL PATH**
Owner: Backend / DevOps
Complexity: S
Depends on: 41
Done when: Enabled testnets, wallet address, balances, spending limits, and relevant transfer endpoints are recorded from live provider responses.

Task 43: Select and freeze the MVP chain
Owner: Architect / Backend
Complexity: S
Depends on: 42
Done when: One chain is selected based on complete simulation, execution, polling, funding, and explorer support.

Task 44: Run a simulation-only native transfer
Owner: Backend
Complexity: S
Depends on: 42, 43
Done when: The smallest safe native-token request simulates successfully and the redacted request/response contract is recorded.

Task 45: Execute the first minimal live transaction **CRITICAL PATH**
Owner: Backend / DevOps
Complexity: M
Depends on: 44
Done when: KeeperHub broadcasts and confirms a minimal testnet transaction with an execution ID, transaction hash, explorer link, and secret-free logs.

Task 46: Verify the final stablecoin contract and funding
Owner: Backend / DevOps
Complexity: M
Depends on: 43, 45
Done when: Token address, decimals, symbol, sender balance, transfer support, and explorer representation are independently confirmed.

Task 47: Run the first live stablecoin smoke transaction **CRITICAL PATH**
Owner: Backend / DevOps
Complexity: M
Depends on: 46
Done when: A minimal stablecoin transfer simulates, executes, reaches terminal confirmation, and matches the explorer evidence.

Task 48: Freeze the KeeperHub API contract
Owner: Architect / Backend
Complexity: M
Depends on: 45, 47
Done when: Base URL, authentication, request fields, simulation response, execution response, status states, polling hints, errors, limits, and transaction evidence are documented from observed behavior.

## Phase 6 - KeeperHub Provider Code

Task 49: Define provider interface and types
Owner: Backend
Complexity: S
Depends on: 17, 40, 48
Done when: A mockable interface covers capability validation, simulation, broadcast, execution lookup, polling hints, and terminal result mapping.

Task 50: Implement secret redaction test-first **CRITICAL PATH**
Owner: Security / Backend
Complexity: M
Depends on: 18, 49
Done when: API keys, authorization headers, provider tokens, sensitive query values, and nested error payloads are removed from all public errors and logs.

Task 51: Implement authenticated KeeperHub transport test-first
Owner: Backend
Complexity: M
Depends on: 49, 50
Done when: Requests use bounded timeouts, explicit headers, safe JSON parsing, redacted errors, and injectable transport for tests.

Task 52: Implement simulation call test-first
Owner: Backend
Complexity: M
Depends on: 37, 51
Done when: The canonical transfer request is simulated and revert, malformed response, authentication, balance, wallet, and provider errors map to typed outcomes.

Task 53: Implement simulation-to-broadcast parity test-first **CRITICAL PATH**
Owner: Security / Backend
Complexity: M
Depends on: 38, 52
Done when: The exact serialized request approved by simulation is the body used for broadcast and any mutation or hash mismatch is rejected locally.

Task 54: Implement broadcast call test-first
Owner: Backend
Complexity: M
Depends on: 39, 51, 53
Done when: Broadcast sends the payment key as the provider idempotency key and returns a validated execution identity without unsafe retries.

Task 55: Implement execution lookup test-first
Owner: Backend
Complexity: M
Depends on: 51, 54
Done when: Provider statuses map to pending, confirmed, failed, cancelled, unknown, or manual-review states with transaction evidence where available.

Task 56: Implement bounded polling test-first
Owner: Backend
Complexity: M
Depends on: 55
Done when: Polling honors provider hints within configured minimum/maximum intervals, respects an overall deadline, and never starts a second execution.

Task 57: Implement deterministic fake provider
Owner: QA / Backend
Complexity: M
Depends on: 49
Done when: Tests can reproduce simulation pass/revert, auth failure, rate limit, delayed confirmation, terminal failure, duplicate lookup, and transaction confirmation.

## Phase 7 - Duplicate Control And Settlement Orchestration

Task 58: Define duplicate-resolution algorithm **CRITICAL PATH**
Owner: Architect / Security
Complexity: M
Depends on: 39, 40, 48
Done when: Receipt lookup, canonical hash comparison, provider lookup, uncertain state, confirmed state, conflict state, and no-rebroadcast rules are specified as a state machine.

Task 59: Implement GitHub receipt discovery test-first
Owner: Backend
Complexity: M
Depends on: 26, 39, 40
Done when: Existing Skirwith comments are found by a versioned hidden marker and parsed without trusting arbitrary visible comment text.

Task 60: Implement receipt integrity validation test-first
Owner: Security / Backend
Complexity: M
Depends on: 40, 59
Done when: A receipt is accepted only when payment key, canonical request hash, repository, PR, and merge SHA match the current request.

Task 61: Implement duplicate resolver test-first **CRITICAL PATH**
Owner: Backend
Complexity: L
Depends on: 55, 58, 60
Done when: Confirmed executions return duplicate-success, pending executions resume polling, changed requests conflict, and missing evidence proceeds to first execution.

Task 62: Implement settlement orchestrator test-first **CRITICAL PATH**
Owner: Backend
Complexity: L
Depends on: 36, 40, 52, 54, 56, 61
Done when: The orchestrator produces blocked, simulated, submitted, confirmed, duplicate, failed, timed-out, or manual-review evidence while enforcing zero broadcast on blocked paths.

Task 63: Implement safe uncertain-state handling test-first
Owner: Backend / Security
Complexity: M
Depends on: 54, 55, 62
Done when: Network loss after submission leads to lookup/manual review with the same key and never to automatic rebroadcast.

Task 64: Implement audit record serialization test-first
Owner: Backend
Complexity: S
Depends on: 40, 62
Done when: Every terminal and nonterminal result serializes to stable, secret-free JSON suitable for fixtures and evidence archives.

## Phase 8 - GitHub Action Integration And Output

Task 65: Implement action input and environment parsing test-first
Owner: Backend
Complexity: S
Depends on: 13, 18
Done when: Required GitHub context and KeeperHub settings are validated without echoing secret values.

Task 66: Implement Actions job summary renderer test-first
Owner: Backend / UX Writing
Complexity: M
Depends on: 31, 40
Done when: Each outcome clearly shows policy, recipient, amount, chain, token, payment key, execution state, transaction evidence, and whether broadcast occurred.

Task 67: Implement pull-request receipt renderer test-first
Owner: Backend / UX Writing
Complexity: M
Depends on: 40, 59
Done when: Human-readable receipt text and the hidden structured marker are generated from the same evidence record.

Task 68: Implement GitHub comment create-or-update behavior test-first
Owner: Backend
Complexity: M
Depends on: 26, 67
Done when: The action creates one Skirwith receipt or safely updates its own matching receipt without modifying unrelated comments.

Task 69: Implement action entrypoint test-first **CRITICAL PATH**
Owner: Backend
Complexity: L
Depends on: 22, 26, 28, 62, 65, 66, 68
Done when: A trusted merged event runs the full flow and reports success, duplicate, block, failure, or manual review through GitHub outputs and exit behavior.

Task 70: Build the trusted example workflow **CRITICAL PATH**
Owner: DevOps / Security
Complexity: M
Depends on: 30, 69
Done when: The workflow triggers only for closed PRs, checks `merged`, uses the trusted action bundle, exposes no secret to PR code, checks out no untrusted code, and pins external actions by commit SHA.

Task 71: Add action outputs for automation
Owner: Backend
Complexity: S
Depends on: 69
Done when: Policy result, payment key, execution ID, status, transaction hash, transaction link, duplicate flag, and broadcast flag are exposed with documented semantics.

Task 72: Verify the packaged action locally
Owner: QA / DevOps
Complexity: M
Depends on: 12, 69, 70
Done when: The built `dist/index.js` runs against saved event fixtures in an isolated environment and matches source-test behavior.

## Phase 9 - CLI And Developer Inspection Surface

Task 73: Define CLI commands and safety model
Owner: Backend / Security
Complexity: S
Depends on: 62, 64
Done when: Commands for config validation, fixture parsing, policy evaluation, simulation, polling, receipt rendering, and explicitly confirmed live execution are specified without duplicating domain logic.

Task 74: Implement read-only CLI commands test-first
Owner: Backend
Complexity: M
Depends on: 20, 25, 36, 64, 73
Done when: Developers can validate config, inspect fixtures, evaluate policy, and render evidence locally through shared modules.

Task 75: Implement simulation and polling CLI commands test-first
Owner: Backend
Complexity: M
Depends on: 52, 56, 73
Done when: CLI simulation and execution-status inspection use the same provider client and redact secrets.

Task 76: Implement guarded live-execute CLI command test-first
Owner: Backend / Security
Complexity: M
Depends on: 62, 73
Done when: Live execution requires an explicit flag, interactive confirmation when possible, a testnet allowlist, and prints the canonical request before submission without secrets.

## Phase 10 - Automated Security And Reliability Testing

Task 77: Complete configuration and policy matrix
Owner: QA
Complexity: L
Depends on: 21, 36
Done when: Tests cover schema versions, malformed values, unknown users, invalid wallets, label ambiguity, caps, checks, repository mismatch, chain/token mismatch, and decimal boundaries.

Task 78: Complete GitHub event security fixtures **CRITICAL PATH**
Owner: QA / Security
Complexity: L
Depends on: 22, 26, 27, 28, 29
Done when: Fork, spoofed payload, contributor-edited config, wrong base branch, stale merge data, missing checks, and unmerged events all fail before provider access.

Task 79: Complete provider failure matrix
Owner: QA
Complexity: L
Depends on: 50, 52, 54, 55, 56, 57
Done when: Tests cover timeout, 401, 403, 404, 409, 429, 5xx, malformed JSON, simulation revert, insufficient balance, wallet failure, polling timeout, and terminal failure.

Task 80: Complete replay and idempotency matrix **CRITICAL PATH**
Owner: QA / Security
Complexity: L
Depends on: 61, 62, 63
Done when: Tests prove same event/same body, same key/changed body, pending replay, confirmed replay, missing receipt, provider conflict, and post-submit network loss behavior.

Task 81: Add no-broadcast assertions across blocked paths **CRITICAL PATH**
Owner: QA / Security
Complexity: M
Depends on: 36, 62, 77, 78
Done when: Every policy and trust-boundary rejection asserts zero simulation or zero broadcast as specified and reports `broadcastMade: false`.

Task 82: Add secret-leak regression suite **CRITICAL PATH**
Owner: QA / Security
Complexity: M
Depends on: 50, 65, 66, 67
Done when: Synthetic secrets never appear in thrown errors, summaries, comments, debug logs, snapshots, provider fixtures, or serialized evidence.

Task 83: Add bundle and dependency integrity checks
Owner: DevOps / Security
Complexity: M
Depends on: 12, 15, 72
Done when: CI detects an outdated bundle, audits dependencies, runs a secret scanner, and verifies external workflow actions are pinned.

Task 84: Run a clean-room local verification
Owner: QA
Complexity: M
Depends on: 72, 77, 78, 79, 80, 81, 82, 83
Done when: A fresh checkout installs from lockfile and passes format, lint, typecheck, tests, build, bundle check, audit, and fixture execution.

## Phase 11 - Live GitHub Acceptance And Evidence

Task 85: Create the private acceptance repository setup
Owner: DevOps / Product
Complexity: M
Depends on: 70, 84
Done when: Secrets, trusted config, branch settings, test wallets, labels, checks, and workflow permissions are configured without exposing credentials.

Task 86: Run a simulation-only merged-PR acceptance test
Owner: QA / Backend
Complexity: M
Depends on: 47, 69, 85
Done when: A real merged PR reaches approved simulation and receipt output while live broadcast is deliberately disabled.

Task 87: Run the first end-to-end stablecoin payout **CRITICAL PATH**
Owner: QA / Backend
Complexity: L
Depends on: 47, 80, 85, 86
Done when: One real merged PR produces one confirmed KeeperHub stablecoin transaction and a matching GitHub receipt with independently verified explorer evidence.

Task 88: Run the duplicate replay proof **CRITICAL PATH**
Owner: QA / Security
Complexity: M
Depends on: 87
Done when: Replaying the same workflow resolves to the original execution and explorer/wallet evidence confirms no second transfer.

Task 89: Run the blocked no-broadcast proof **CRITICAL PATH**
Owner: QA / Security
Complexity: M
Depends on: 87
Done when: An over-cap or otherwise invalid payout is blocked with a reason code, `broadcastMade: false`, no execution ID, and no new transaction.

Task 90: Repeat the success transaction for operational backup
Owner: QA / Backend
Complexity: M
Depends on: 87
Done when: A second independent valid PR confirms the process is repeatable and supplies backup live evidence for the demo.

Task 91: Archive the acceptance evidence
Owner: QA / Documentation
Complexity: S
Depends on: 88, 89, 90
Done when: Redacted event IDs, action run links, payment keys, execution IDs, hashes, explorer links, timestamps, screenshots, and expected assertions are indexed in a versioned evidence document.

## Phase 12 - Documentation And Starter Template

Task 92: Write proof-first README
Owner: Documentation
Complexity: L
Depends on: 91
Done when: Pitch, live transaction, video placeholder, three-state evidence, KeeperHub integration, architecture, security, setup, tests, limitations, and disclosures follow the approved section order.

Task 93: Write architecture documentation
Owner: Architect / Documentation
Complexity: M
Depends on: 62, 70, 91
Done when: Module map, data flow, state machine, provider boundary, GitHub trust boundary, and no-database duplicate strategy match the shipped code.

Task 94: Write security documentation
Owner: Security / Documentation
Complexity: M
Depends on: 82, 89
Done when: Threat model, permissions, secret handling, trusted config, replay handling, failure behavior, residual risks, and test evidence are explicit.

Task 95: Write configuration reference
Owner: Documentation
Complexity: M
Depends on: 19, 46, 91
Done when: Every field, constraint, example, chain/token value, label mapping, wallet rule, and validation error is documented.

Task 96: Write KeeperHub integration guide
Owner: Backend / Documentation
Complexity: M
Depends on: 48, 91
Done when: Authentication, wallet setup, simulation, broadcast, polling, idempotency, observed errors, explorer proof, and honest unsupported features are documented.

Task 97: Package the reusable starter workflow
Owner: DevOps / Documentation
Complexity: M
Depends on: 70, 85, 95
Done when: A maintainer can adopt the action using a copyable workflow, example policy, secret checklist, permissions, and test procedure.

Task 98: Write first-transaction troubleshooting
Owner: Documentation / Backend
Complexity: M
Depends on: 45, 47, 79, 91
Done when: Authentication, wallet funding, token, simulation, rate limits, polling, idempotency conflict, and explorer mismatch failures have evidence-based remediation steps.

Task 99: Write KeeperHub onboarding teardown
Owner: Product / Documentation
Complexity: M
Depends on: 41, 42, 45, 47, 98
Done when: Observed onboarding friction, time-to-first-transaction, documentation gaps, proposed fixes, and any submitted issue or pull request are recorded without invented claims.

Task 100: Create architecture and evidence diagrams
Owner: Designer / Documentation
Complexity: M
Depends on: 91, 93
Done when: Trusted execution flow, duplicate state machine, and success/replay/refusal evidence diagrams render correctly in GitHub.

## Phase 13 - Lightweight Public Site

Task 101: Decide whether the public site fits the remaining schedule
Owner: Product
Complexity: S
Depends on: 92, 97
Done when: The site is approved only if all critical acceptance evidence is complete and at least two days remain before submission.

Task 102: Define the site content model
Owner: Designer / Documentation
Complexity: S
Depends on: 101
Done when: Overview, how it works, documentation, GitHub, and transaction proof reuse verified repository content without introducing unsupported claims.

Task 103: Build the lightweight site
Owner: Frontend
Complexity: L
Depends on: 102
Done when: A responsive, accessible site presents the product, verified transaction, workflow, setup path, and repository links without becoming a dashboard.

Task 104: Verify the site across viewports
Owner: QA / Frontend
Complexity: M
Depends on: 103
Done when: Desktop and mobile visual checks show no overlap, broken links, inaccessible controls, missing proof, or misleading content.

Task 105: Deploy the public site
Owner: DevOps
Complexity: S
Depends on: 104
Done when: The site has a stable public URL, correct metadata, working proof links, and no exposed secrets or private repository assets.

## Phase 14 - Demo, Release, And Submission

Task 106: Write the under-three-minute demo script
Owner: Product / Video
Complexity: M
Depends on: 91, 92, 100
Done when: A timed script shows final receipt first, trusted config, merge, policy, simulation, execution, explorer proof, blocked path, and duplicate path.

Task 107: Prepare deterministic demo fixtures and backup links
Owner: QA / Product
Complexity: M
Depends on: 91, 106
Done when: Demo PRs, labels, wallets, run links, transaction links, backup transaction, and redacted screenshots are ready and verified.

Task 108: Record and edit the demo
Owner: Product / Video
Complexity: L
Depends on: 106, 107
Done when: The video is under three minutes, legible, correctly narrated, free of secrets, and contains no fake live evidence.

Task 109: Run repository launch hygiene
Owner: DevOps / Security
Complexity: M
Depends on: 92, 94, 97, 108
Done when: License, metadata, issue templates, contribution notes, generated bundle, dependency audit, secret scan, branch protection, and release notes are complete.

Task 110: Verify all public evidence logged out **CRITICAL PATH**
Owner: QA / Product
Complexity: M
Depends on: 101, 108, 109
Done when: Repository, video, action runs, transaction links, documentation anchors, and optional site work from a logged-out browser have no permission errors; if Task 101 declines the site, Task 105 is explicitly marked skipped and this gate verifies repository/docs links only.

Task 111: Create the final release tag
Owner: Tech Lead
Complexity: S
Depends on: 110
Done when: A versioned tag points to the exact commit whose bundle, tests, evidence, and demo were verified.

Task 112: Complete the submission form
Owner: Product
Complexity: M
Depends on: 111
Done when: Title, description, category, sponsor disclosures, repository, video, transaction, and optional site links match the verified release.

Task 113: Submit and preserve confirmation
Owner: Product
Complexity: S
Depends on: 112
Done when: Submission confirmation, timestamp, final URLs, release tag, and screenshots are archived in project memory.

## Critical Path Summary

The main blocking chain is:

```text
Architecture and threat model
-> reproducible toolchain
-> trusted config and GitHub verification
-> deterministic policy and payment key
-> live KeeperHub transaction
-> provider client and parity enforcement
-> duplicate resolver and settlement orchestrator
-> trusted GitHub Action
-> security matrix
-> three-state live acceptance
-> public evidence and submission
```

No site, branding polish, or demo recording begins before Tasks 87-91 are complete.

## Release Gates

1. Foundation gate: clean install, CI, tests, typecheck, lint, and bundle all pass.
2. Trust gate: contributor-controlled code and config cannot reach the secret-bearing path.
3. Policy gate: all blocked paths prove no broadcast.
4. Provider gate: a live simulation and stablecoin transaction are confirmed through KeeperHub.
5. Parity gate: simulated and broadcast request hashes match.
6. Replay gate: duplicate and uncertain-state behavior never creates an automatic second execution.
7. Acceptance gate: success, replay, and refusal evidence are repeatable.
8. Publication gate: secret scan is clean and all public links work while logged out.

## Build-Time Inputs Still Required

- A KeeperHub organization/API credential supplied through a local environment or GitHub secret, never chat.
- KeeperHub-enabled execution wallet and testnet funds.
- An approved contributor recipient wallet fixture.
- Live KeeperHub chain and token capability responses.
- GitHub repository ownership and final visibility decision.
- Real transaction, action-run, video, and submission URLs generated during execution.
