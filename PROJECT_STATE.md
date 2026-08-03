# MergePay Project State

## Project

- Plan file: `PROJECT_PLAN.md`
- Status: In progress
- Current phase: Phase 1 - Foundation and contract freeze
- Current checkpoint: CP-009
- Last updated: 2026-08-03 (Africa/Lagos)
- Last agent: Implementation lead
- Planning confidence: 84/100 (Medium)

## Execution Strategy

- Selected sequence: Follow the plan's dependency order.
- Reason: Phase 0 provider and hackathon validation is a strict prerequisite for provider-specific implementation.
- User preference: Begin executing the approved plan.
- Constraints: No implementation may begin while `BLK-001` remains unresolved; no push, merge, deploy, release, or destructive action is authorized.
- Revisit trigger: KeeperHub access and authoritative hackathon requirements are verified, or an approved amendment changes the prerequisite gate.

## Source of Truth Order

1. Repository or observable system state
2. Executed verification evidence
3. Approved `PROJECT_PLAN.md`
4. `PROJECT_STATE.md`
5. Unverified notes

The repository proves what exists. The plan defines intended scope, design, phases, and acceptance criteria. This state file records execution history, decisions, deviations, blockers, evidence, and handoff context.

## Execution Rules

1. Read the plan and state before changing project assets.
2. Inspect the actual environment before trusting prior state.
3. Follow phase dependencies and acceptance criteria.
4. Update this file after every checkpoint.
5. Do not mark tests as passed unless they ran successfully.
6. Record deviations and decisions.
7. Never erase checkpoint history.
8. End every session with one exact next action.
9. Keep entries factual and concise.
10. Change the plan only through the amendment protocol below.
11. Planning is complete here; future execution must not treat this file as evidence that implementation exists.

## Current Objective

- Phase: Phase 1 - Foundation and contract freeze
- Checkpoint: CP-009
- Goal: Pass the Phase 1 exit gate: an independent contract review of the completed Phase 1 contracts (toolchain, config schema, canonical payment identity, policy reason codes, pure policy evaluator) from the final diff, without implementation reasoning. No provider/action implementation until the review approves.
- Expected files or assets: Review record of the Phase 1 diff; no new implementation files until the gate passes.
- Acceptance criteria: Review approves types, domain contracts, and tests; foundation gates pass; Phase 2 (GitHub event + KeeperHub execution) may begin.
- Required verification: Independent review; if the review requires changes, re-run focused tests, `npm run lint`, `npm run typecheck`, `npm test`, build, and audit.

## Current Status

### Completed

- Phase 0 (CP-000 through CP-005): planning, repository baseline, authoritative hackathon facts, KeeperHub API contract, live chain list, org wallet discovery, funding verification, and a successful simulation-only USDC payout smoke test. Phase 0 exit gate passed.
- Existing MergePay documents were read and treated as constraints.
- Product, architecture, security, configuration, KeeperHub, test, demo, and submission intent were normalized into this plan.
- Planning mode, research depth, feasibility verdict, assumptions, risks, open decisions, phases, acceptance criteria, and definitions of ready/done were recorded.
- No implementation files were created by this planning operation.

### In Progress

- Phase 1 (Foundation and contract freeze): toolchain, domain/config contracts, canonical payment identity, and the policy reason-code registry with pure evaluator are implemented and green; only the Phase 1 exit gate (independent contract review) remains.

### Blocked (resolved / narrowed)

- `BLK-002`: RESOLVED — Authoritative DoraHacks facts retrieved from `dorahacks.io/hackathon/agents-onchain` (see Verification Evidence).
- `BLK-001`: RESOLVED — KeeperHub API contract, live chain list, org wallet, funding, and a successful simulation-only USDC payout smoke test verified through authenticated MCP access.

### Not Started

- All implementation and execution phases.
- Live authenticated KeeperHub capability/smoke evidence.
- Real transaction, replay, refusal, demo, and submission evidence.

## Checkpoint Log

### CP-000: Planning completed

- Status: Complete
- Date: 2026-08-03 (Africa/Lagos)
- Agent: Planner
- Phase: Planning
- Objective: Produce the project plan and persistent execution state.
- Work completed: Created the two requested planning artifacts from existing MergePay documents and constraints.
- Files or assets changed: `PROJECT_PLAN.md`, `PROJECT_STATE.md` only.
- Commands or checks run: Re-opened existing planning sources; reviewed artifact structure and required sections.
- Test results: Not applicable; no implementation tests were run.
- Acceptance criteria verified: Planning gates satisfied; no production code, scaffolding, dependencies, delegation, or execution performed.
- Decisions: Deep planning mode; standard research depth with live-provider validation required; proceed with prerequisite validation and scope discipline.
- Deviations: None.
- Risks introduced: None by planning operation.
- Known issues: Provider/hackathon facts remain unverified in this pass.
- Blockers: `BLK-001`.
- Next exact action: Verify current KeeperHub access and authoritative hackathon requirements before creating any implementation assets.

### CP-001: Prerequisite verification attempted

- Status: Blocked
- Date: 2026-08-03 (Africa/Lagos)
- Agent: Implementation lead
- Phase: Phase 0 - Planning and prerequisite validation
- Objective: Establish the repository baseline and verify KeeperHub and hackathon prerequisites.
- Requirements covered: `FR-008`, `NFR-001`, Phase 0 exit gate.
- Work completed: Read the approved plan, state, and repository instructions; inspected repository status, remote, file inventory, GitHub CLI state, KeeperHub MCP configuration, and relevant environment-variable names.
- Files or assets changed: `PROJECT_STATE.md` only.
- Commands or checks run: `find`, `git status --short --branch`, `git remote -v`, `gh auth status`, safe KeeperHub config inspection, environment-name inspection, and KeeperHub MCP resource/template readiness checks.
- Test results: No implementation tests exist or were run.
- Acceptance criteria verified: Repository is planning-only; Git is initialized on `master` tracking `origin/master`; remote is `https://github.com/mystiquemide/mergepay.git`; KeeperHub MCP URL is configured. Live KeeperHub authentication/capabilities and official hackathon facts were not verified.
- Security checks: No credential values were printed; only environment variable names were inspected. No KeeperHub credential was present in the agent environment.
- Decisions: Follow the plan dependency order and stop before implementation while the prerequisite gate is blocked.
- Deviations: Repository evidence shows Git and the private remote already exist, superseding older notes that described a non-Git planning directory.
- Amendments: None.
- Risks introduced: None.
- Known issues: Agent sandbox reports GitHub CLI authentication invalid despite the user's interactive shell showing valid authentication; KeeperHub MCP server reports not ready.
- Blockers: `BLK-001`, `BLK-002`.
- Next exact action: Make KeeperHub MCP/API access available in this execution environment and provide authoritative hackathon-page access, then rerun CP-001 verification.

### CP-002: Prerequisite verification re-run (web access available)- Status: Partial
- Date: 2026-08-03 (Africa/Lagos)
- Agent: Implementation lead
- Phase: Phase 0 - Planning and prerequisite validation
- Objective: Re-run CP-001 acceptance criteria now that web access and the KeeperHub MCP endpoint are available.
- Requirements covered: `FR-008`, `NFR-001`, Phase 0 exit gate; hard boundary on no implementation until prerequisites verify.
- Work completed: Read the approved plan, state, AGENTS.md, and handoff docs; inspected repository and git state; verified official KeeperHub docs (Authentication, Chains, Direct Execution); verified the authoritative DoraHacks hackathon page; registered the KeeperHub remote MCP server in the global opencode config; performed a live reachability check of the KeeperHub MCP endpoint and its OAuth resource metadata.
- Files or assets changed: `PROJECT_STATE.md`; `/home/mide/.config/opencode/opencode.json` and `opencode.jsonc` (KeeperHub MCP registration). No implementation files in the repository.
- Commands or checks run: `git status --short --branch`, `git remote -v`, `git log --oneline -5`, `grep` for KeeperHub config/credentials (no values printed), `curl -sS https://app.keeperhub.com/mcp`, `curl -sS https://app.keeperhub.com/.well-known/oauth-protected-resource`, JSON validation of the edited opencode config.
- Test results: MCP endpoint reachable: HTTP 200, `{"name":"keeperhub","version":"1.2.0","protocol":"mcp","status":"ok","authentication":{"required":true,...}}`. OAuth resource metadata confirms bearer scopes `mcp:read`, `mcp:write`, `mcp:admin` at `https://app.keeperhub.com`.
- Acceptance criteria verified:
  - `BLK-002` resolved: DoraHacks "KeeperHub - Agents Onchain Hackathon" (dorahacks.io/hackathon/agents-onchain): prize pool USD 5,000; pre-registration 2026-07-02 10:00; submission opens 2026-07-27 05:01; deadline 2026-08-13 10:00; virtual; submission requires GitHub/GitLab/Bitbucket link and demo video; tags include KeeperHub, MCP, x402, MPP, Ethereum. A `$1,000` Best Onboarding UX bounty is referenced by an independent tracker (agentdeadlines.com).
  - `BLK-001` contract level resolved: Direct Execution API requires org API key (`kh_`) via `Authorization: Bearer`; `POST /api/execute/transfer` accepts `chainId`, `recipientAddress` (strict EIP-55 validation), `amount` (human units), optional `tokenAddress`, `tokenConfig`, `gasLimitMultiplier`; `simulate: true` dry-runs without signing or broadcast and returns `wouldRevert`; broadcast returns HTTP 202 with `executionId`, `status`, and `transactionHash`/`transactionLink` when completed; `Idempotency-Key` header gives replay (same body returns original execution), `idempotency_conflict` 409 on changed body, `idempotency_in_progress` 409 while running, keys scoped per org, replay window 24h; polling `GET /api/execute/{executionId}/status` with `X-Poll-Interval-Hint`, terminal when hint is `0`; statuses `pending | running | completed | failed`; rate limit 60 req/min/key with `X-RateLimit-*` headers and `Retry-After` on 429; daily spending caps in wei with 403 `Daily spending cap exceeded`; `GET /api/chains` returns chain objects with `id`, `chainId`, `isTestnet`, `isEnabled`, `explorerUrl`, `explorerAddressPath`; chain name aliases include `sepolia` (11155111) and `base-sepolia` (84532).
- Security checks: No credential values were read, logged, or written. MCP reachability check transmitted no credentials. OAuth scopes `mcp:read`/`mcp:write` are least-privilege for discovery versus `mcp:admin`; the config registers the MCP server without embedding any token.
- Decisions: Treat the official docs as the provider contract baseline and the DoraHacks page as the authoritative hackathon source. Defer chain/token/wallet selection until authenticated capability discovery confirms what the funded organization wallet can actually execute. Keep planning-only status in the repository until Phase 0 exit gate passes.
- Deviations: None. No implementation files were created in the repository.
- Amendments: None.
- Risks introduced: None. KeeperHub MCP now requires an interactive OAuth handshake to complete on opencode restart; until then no authenticated tool is available in this session.
- Known issues: `KI-002` superseded (hackathon facts now authoritative); `KI-001` narrowed to authenticated capability discovery; `KI-003` unchanged (GitHub CLI auth still differs in sandbox).
- Blockers: `BLK-001` remains only for authenticated live capability and funded-wallet discovery.
- Next exact action: Restart opencode so the registered KeeperHub MCP completes the OAuth handshake, then run `GET /api/chains` and the discovery flow to pick the testnet stablecoin candidate and document the first smoke-test contract.

### CP-003: Live chain capability discovery

- Status: Partial
- Date: 2026-08-03 (Africa/Lagos)
- Agent: Implementation lead
- Phase: Phase 0 - Planning and prerequisite validation
- Objective: Verify live KeeperHub chain capability data after MCP registration, without credentials.
- Requirements covered: `FR-008`, Phase 0 exit gate.
- Work completed: Confirmed the MCP endpoint remains reachable and OAuth-gated; confirmed no KeeperHub tool or credential is loaded in the current session; performed an unauthenticated `GET /api/chains` which is public and returned the authoritative live chain list.
- Files or assets changed: `PROJECT_STATE.md` only.
- Commands or checks run: `curl https://app.keeperhub.com/mcp`, `curl https://app.keeperhub.com/.well-known/oauth-protected-resource`, `curl https://app.keeperhub.com/api/chains`, `env` inspection (no credential values printed).
- Test results: HTTP 200 on all three endpoints. Chain list: 22 chains total, 11 enabled testnets: Ethereum Sepolia (11155111), Base Sepolia (84532), BNB Chain Testnet (97), Polygon Amoy (80002), Arbitrum Sepolia (421614), Optimism Sepolia (11155420), Avalanche Fuji (43113), Tempo Testnet (42431), Solana Devnet (103), Plasma Testnet (9746), 0G Galileo (16602).
- Acceptance criteria verified: Live chain list proven without secrets; capability surface now narrowed to EVM testnets with strong stablecoin candidates (Sepolia, Base Sepolia) pending wallet/contract verification.
- Security checks: No credential used or logged; only public discovery data captured.
- Decisions: Prefer an EVM testnet (Ethereum Sepolia or Base Sepolia) as the smoke-test target; freeze only after wallet balance and stablecoin contract are confirmed via authenticated access.
- Deviations: None.
- Amendments: None.
- Risks introduced: None.
- Known issues: Authenticated wallet balance and stablecoin contract availability remain unproven.
- Blockers: `BLK-001` narrowed to authenticated wallet/balance/contract discovery.
- Next exact action: Complete the KeeperHub OAuth MCP handshake (restart opencode) or provide a `kh_` org API key, then verify the execution wallet balance and a testnet stablecoin contract on the chosen chain.

### CP-004: Authenticated capability discovery

- Status: Partial
- Date: 2026-08-03 (Africa/Lagos)
- Agent: Implementation lead
- Phase: Phase 0 - Planning and prerequisite validation
- Objective: Verify authenticated KeeperHub capabilities: org wallet, native gas, and candidate stablecoin contracts.
- Requirements covered: `FR-008`, Phase 0 exit gate.
- Work completed: Confirmed the KeeperHub MCP tools are loaded and authenticated; listed integrations to discover the org wallet; ran simulated native transfers (no broadcast) on both candidate testnets; read balances and stablecoin contract metadata through authenticated contract reads; cross-checked native balance on public explorers.
- Files or assets changed: `PROJECT_STATE.md` only.
- Commands or checks run: `keeperhub_list_integrations`, `keeperhub_execute_transfer` with `simulate: true` on chain 11155111 and 84532, `keeperhub_execute_contract_call` (symbol/decimals/balanceOf) on Sepolia and Base Sepolia USDC, `curl` of both block explorers for the org address.
- Test results: Org wallet discovered (`0x05619d1a133623B322a8f366ea9594e4e586f26D`). Simulated native transfers revert (`CALL_EXCEPTION`, missing revert data) on both testnets; explorers confirm `0 ETH`. Sepolia USDC `0x1c7d4b...7238` verified `USDC`, `6` decimals, balance `0`. Base Sepolia USDC `0x036cbd...cf7e` verified `USDC`, `6` decimals. Both chains `stable` + testnet + enabled.
- Acceptance criteria verified: Authenticated capability access proven; chain/token/wallet candidates identified and their on-chain metadata verified. Remaining gate: wallet must be funded with testnet gas and USDC.
- Security checks: Only read operations and `simulate: true` (no broadcast, no execution row) were executed. No secrets logged. Recipient for simulation was the org's own wallet.
- Decisions: Lock candidate smoke-test contract as Ethereum Sepolia chain 11155111, USDC `0x1c7d4b196cb0c7b01d743fbc6116a902379c7238`, decimals 6, org wallet `0x05619d1a133623B322a8f366ea9594e4e586f26D`; Base Sepolia as verified fallback. Freeze final configuration only after the wallet is funded and the first simulated payout passes end-to-end.
- Deviations: None.
- Amendments: None.
- Risks introduced: Wallet funding dependency for live acceptance remains open (matches plan RISK-005).
- Known issues: Org wallet currently has `0` testnet gas and `0` USDC on both candidate chains.
- Blockers: `BLK-001` reduced to a funding prerequisite.
- Next exact action: Fund the org wallet with Sepolia ETH (and USDC) from a testnet faucet, then run the first simulation-only smoke test of a small USDC payout to confirm success before Phase 1.

### CP-005: Wallet funding verified and simulation-only smoke test

- Status: Complete
- Date: 2026-08-03 (Africa/Lagos)
- Agent: Implementation lead
- Phase: Phase 0 - Planning and prerequisite validation
- Objective: Confirm the org wallet is funded and that a USDC simulated payout passes, completing Phase 0 prerequisites.
- Requirements covered: `FR-008`, `FR-009` (simulation semantics), Phase 0 exit gate, `AGENTS.md` live-execution preconditions.
- Work completed: Re-checked native gas via a simulated native transfer and USDC balance via authenticated balanceOf read after the user claimed faucets; ran a simulation-only 2.5 USDC payout smoke test.
- Files or assets changed: `PROJECT_STATE.md` only.
- Commands or checks run: `keeperhub_execute_transfer` simulate on chain 11155111 (native self-transfer), `keeperhub_execute_contract_call` balanceOf on Sepolia USDC, `keeperhub_execute_transfer` simulate of 2.5 USDC from org wallet.
- Test results: Native gas available (`wouldRevert: false`, gas 21000). USDC balance 40 USDC. Simulated USDC payout 2.5 succeeded: `wouldRevert: false`, `simulatedReturnValue: true`, gas 40705, `value: 0` (pure ERC-20 transfer). No broadcast or execution row was created.
- Acceptance criteria verified: Phase 0 exit gate conditions met — provider access, funded testnet wallet, verified stablecoin contract, and a successful simulation-only smoke path all evidenced.
- Security checks: All operations were `simulate: true` (dry run; no signing, no broadcast, no funds reserved). Recipient of the smoke test was the org's own wallet. No secrets logged.
- Decisions: Freeze final scope for Phase 1 smoke-test contract as Sepolia USDC (chain 11155111, token `0x1c7d4b196cb0c7b01d743fbc6116a902379c7238`, 6 decimals, org wallet `0x05619d1a133623B322a8f366ea9594e4e586f26D`). Simulation-to-broadcast parity rule (BR-004) retained: the exact simulated body must be broadcast, never rebuilt.
- Deviations: None.
- Amendments: None.
- Risks introduced: None beyond plan RISK-005 (wrong token/chain/wallet) which is mitigated by the verified contract + wallet and the simulation gate.
- Known issues: None blocking. Live funding amount is faucet-limited (current USDC 40, gas sufficient); enough for small payouts.
- Blockers: None.
- Next exact action: Begin Phase 1 (Foundation and contract freeze) test-first: toolchain, strict types, config schema, policy reason codes, canonical request identity, and pure-domain test harness — with the frozen Sepolia USDC contract as the integration target.

### CP-006: Phase 1 toolchain scaffold

- Status: Complete
- Date: 2026-08-03 (Africa/Lagos)
- Agent: Implementation lead
- Phase: Phase 1 - Foundation and contract freeze
- Objective: Stand up the reproducible, strict TypeScript ESM toolchain per plan Tasks 7-12 and 14: package metadata, locked dependencies, strict TS, Vitest, ESLint, Prettier, NCC bundle, hygiene files.
- Requirements covered: `NFR-004`, `SC-006` (partial), Phase 1 scope; `AGENTS.md` required verification.
- Work completed: Created `package.json` (Node ^20 || ^22, ESM, `type: module`), `tsconfig.json` (strict, NodeNext, noUncheckedIndexedAccess), `.nvmrc` (20), `vitest.config.ts`, `eslint.config.mjs` (flat config + prettier), `.prettierrc.json`, `.gitignore`, `.env.example`, minimal `src/action.ts` entrypoint, and `tests/action.test.ts`. Installed and committed `package-lock.json`. Upgraded `@actions/github@^9` and `vitest@^3.2.6`, added `overrides: undici ^6.28.0` to clear the audit.
- Files or assets changed: `package.json`, `package-lock.json`, `tsconfig.json`, `.nvmrc`, `.gitignore`, `.env.example`, `.prettierrc.json`, `eslint.config.mjs`, `vitest.config.ts`, `src/action.ts`, `tests/action.test.ts`, `PROJECT_STATE.md`.
- Commands or checks run: `npm install` (twice), `npm ls undici @actions/github vitest vite esbuild`, `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm test`, `npm run build`, `npm run bundle:check`, `npm run audit`.
- Test results: typecheck clean; lint clean (`--max-warnings 0`); format:check clean for scoped files; 1 test passes; ncc build succeeds (dist/index.js 1kB); bundle loads in Node; `npm audit` = 0 vulnerabilities after upgrades.
- Acceptance criteria verified: reproducible lockfile; strict TS with no unchecked indexed access; deterministic vitest; lint/format pass; minimal bundle builds and loads; hygiene files present; no secrets committed (`.env.example` uses placeholders).
- Security checks: `npm audit` cleared 8 findings (undici high/critical via @actions/http-client, vite/vitest/esbuild chain) via non-breaking upgrades + a targeted `undici` override; no `--force` used; `.env.example` contains only placeholder values; dist and node_modules are gitignored.
- Decisions: Scoped Prettier to source/test/config files instead of the pre-existing planning markdown (which the planner formatted differently and I must not reformat). Kept `dist/` gitignored (bundle is regenerated; per repo practice it is committed separately at release). Node 20 as target LTS via `.nvmrc` while supporting ^22 locally.
- Deviations: Minor — the plan's phase-level "contract freeze" work is split across CP-006 (toolchain) and CP-007 (domain/config contracts) to keep each diff coherent and verifiable. Approved outcome unchanged.
- Amendments: None.
- Risks introduced: `overrides` pin of undici is a forced transitive resolution; validated by `npm audit` (0) and `npm ls` (single deduped 6.28.0) — documented in package.json.
- Known issues: None blocking.
- Blockers: None.
- Next exact action: CP-007 — define shared domain types, stable error types, and the configuration schema/parsing/semantic validation test-first (plan Tasks 17-21), then wire the frozen Sepolia USDC contract as the integration target.

### CP-007: Domain contracts and trusted configuration

- Status: Complete
- Date: 2026-08-03 (Africa/Lagos)
- Agent: Implementation lead
- Phase: Phase 1 - Foundation and contract freeze
- Objective: Define shared domain types, stable error types, the configuration schema, parsing, semantic validation, and the canonical payment identity — test-first.
- Requirements covered: `FR-003` to `FR-007`, `NFR-003`, `BR-001` to `BR-007` (contract portions); plan Tasks 17-21, 37-39.
- Work completed: Created `src/domain/types.ts` (repository identity, merged PR, payout candidate, chain/token, policy decision, canonical request, execution status, evidence record); `src/domain/errors.ts` (MergePayError with category/code/cause and PolicyBlockError, both with safe `toPublic()`); `src/security/validate.ts` (hex-address check + normalization); `src/config/schema.ts` + `src/config/load-config.ts` (version-gated parse, unknown-field rejection, repository match, address/decimals/amount/cap/label/recipient/check validation, big-int decimal comparison); `src/payment/canonical-request.ts`, `src/payment/payment-hash.ts`, `src/payment/payment-key.ts` (stable field-order serialization, SHA-256 hash, `mergepay:<hash>` key). Tests: `tests/config/load-config.test.ts`, `tests/config/validation.test.ts`, `tests/payment/payment-identity.test.ts`.
- Files or assets changed: the files above plus `PROJECT_STATE.md`.
- Commands or checks run: `npx vitest run tests/config tests/payment`, `npm run typecheck`, `npm run lint`, `npm run format`/`format:check`, `npm test`, `npm run build`, `npm run bundle:check`, `npm run audit`.
- Test results: 24 tests pass (config parse 5, validation 10, payment identity 8, action smoke 1). Typecheck clean; lint clean (`--max-warnings 0`); format clean; bundle builds and loads; audit 0 vulnerabilities.
- Acceptance criteria verified: Malformed YAML, unsupported version, wrong repository, invalid addresses/decimals, negative amounts, over-cap amounts, duplicate labels, empty mappings, and unknown fields all fail deterministically with safe messages. Canonical request hashes identical requests identically and differs on any material field change; payment key is stable and provider-safe.
- Security checks: Amounts compared with big-int decimal arithmetic (no floats); addresses validated and normalized once; unknown config fields rejected (deny-by-default); duplicate YAML keys rejected by the parser as a safe failure; no secrets in code or tests.
- Decisions: Duplicate YAML keys are rejected by the YAML parser natively (a safe deterministic failure); the semantic duplicate guard remains as defense-in-depth. Canonical serialization sorts fields by key for stable hashing. Payment key is `mergepay:<sha256>`, provider-safe as an Idempotency-Key value.
- Deviations: None beyond the recorded CP-006 split.
- Amendments: None.
- Risks introduced: None.
- Known issues: None blocking. Policy evaluator and reason-code constants are the next contract piece (CP-008).
- Blockers: None.
- Next exact action: CP-008 — define stable policy reason codes (`src/policy/reason-codes.ts`) and the pure policy evaluator (`src/policy/evaluate-policy.ts`) test-first, with deterministic allow/block outcomes and explicit no-broadcast classification.

### CP-008: Policy reason codes and pure policy evaluator

- Status: Complete
- Date: 2026-08-03 (Africa/Lagos)
- Agent: Implementation lead
- Phase: Phase 1 - Foundation and contract freeze
- Objective: Define stable policy reason codes with severity, safe message, and no-broadcast classification, and implement the pure policy evaluator test-first (plan Tasks 31-36 contract portion).
- Requirements covered: `FR-004`, `FR-005`, `NFR-003`, `BR-001`, `BR-003`, plan Tasks 31-36.
- Work completed: Created `src/policy/reason-codes.ts` (registry of all 20 reason codes: 9 allow paths, 11 block paths, each with code, severity, safe message, and `broadcastEligible` classification) and `src/policy/evaluate-policy.ts` (pure `evaluatePolicy(input): PolicyDecision` plus exported resolution helpers `resolveRecipient`, `resolvePayoutAmount`, `isChainTokenAllowed`). Moved decimal comparison into `src/domain/decimal.ts` (`exceedsDecimalString` re-exported from `load-config.ts` to preserve its public contract; added `isZeroAmount`). Added `message: string` to `PolicyReason` in `src/domain/types.ts`. Added example policy/config fixture `tests/fixtures/policy.ts` (synthetic, visibly labeled, mirrors frozen v0.1 integration target) and tests `tests/policy/reason-codes.test.ts`, `tests/policy/evaluate-policy.test.ts`, `tests/domain/decimal.test.ts`.
- Files or assets changed: `src/domain/types.ts`, `src/domain/decimal.ts` (new), `src/config/load-config.ts`, `src/policy/reason-codes.ts` (new), `src/policy/evaluate-policy.ts` (new), `tests/fixtures/policy.ts` (new), `tests/policy/reason-codes.test.ts` (new), `tests/policy/evaluate-policy.test.ts` (new), `tests/domain/decimal.test.ts` (new), `PROJECT_STATE.md`.
- Commands or checks run: `npx vitest run tests/policy tests/domain` (red first: 3 files failed with missing modules, then green after implementation), `npm run typecheck`, `npm run lint`, `npm run format`/`format:check`, `npm test`, `npm run build`, `npm run bundle:check`, `npm run audit`, grep secret scan of `src` and `tests`.
- Test results: 62 tests pass (was 24): config parse 5, config validation 10, payment identity 8, reason codes 8, policy evaluation 25, decimal helpers 5, action smoke 1. Typecheck clean; lint clean (`--max-warnings 0`); format clean; ncc build succeeds and bundle loads; audit 0 vulnerabilities; no secret patterns found.
- Acceptance criteria verified: Every allow/block path has a stable code, severity, safe message, and no-broadcast classification; approved decisions carry deterministic ordered info reasons and `broadcastEligible: true`; every blocked decision carries one block reason and `broadcastEligible: false`; resolution helpers block unmapped recipients, ambiguous/missing amounts, zero amounts, over-cap amounts, and disallowed chain/token; checks are enforced only when configured as required.
- Decisions: Kept the frozen `PolicyDecision` shape (added `message` to `PolicyReason` only); the evaluator returns the decision and Phase 2 reuses the exported resolution helpers so canonical-request construction cannot diverge from the evaluated candidate. Moved `exceedsDecimalString` to `src/domain/decimal.ts` and re-exported it from `load-config.ts` (public contract unchanged) so pure policy does not depend on the YAML loader. `blocked-unknown-reason` is defined for completeness/fallback but is never emitted by v0.1 evaluation, which fails closed with explicit reasons.
- Deviations: Minor — plan Tasks 32-35 (recipient, amount, cap, chain/token checks) are implemented inside the CP-008 evaluator as exported pure helpers instead of separate CPs, matching the state-file objective to complete the remaining Phase 1 pure contracts together.
- Amendments: None.
- Risks introduced: None beyond plan RISK-003/RISK-004; the parity and no-rebroadcast controls remain Phase 2 responsibility.
- Known issues: None blocking. The policy module is pure and not yet referenced from `src/action.ts`, so the ncc bundle stays 1kB until Phase 2 wiring.
- Blockers: None.
- Next exact action: Pass the Phase 1 exit gate — request an independent contract review of the full Phase 1 diff (toolchain, config, payment identity, policy) before any Phase 2 provider/action implementation.

## Decisions Made During Execution

| ID | Date | Decision | Reason | Plan impact |
|---|---|---|---|---|
| DEC-001 | 2026-08-03 | Keep v0.1 to one verified testnet stablecoin flow | Maximizes proof quality and limits payment risk | Multi-chain/multi-token deferred |
| DEC-002 | 2026-08-03 | Exclude custom daily accounting and database from v0.1 | Stateless Action cannot enforce cumulative budgets reliably without new operational complexity | Per-payment cap and provider organization limits only |
| DEC-003 | 2026-08-03 | Require exact simulation/broadcast parity and no automatic rebroadcast | Prevents mutation and duplicate payment under uncertain state | Canonical request hash and manual-review state required |
| DEC-004 | 2026-08-03 | Use KeeperHub Direct Execution API (org `kh_` key) as the headless contract; MCP is discovery/smoke surface | Official docs confirm Direct Execution is API-key headless while MCP requires interactive OAuth and is session-oriented | Confirms ADR-002; provider client targets `/api/execute/transfer` and `/api/execute/{id}/status` |
| DEC-005 | 2026-08-03 | Defer chain/token/wallet freeze until authenticated capability discovery | Docs list supported aliases but not the funded organization wallet's actual balances/limits | Phase 0 completion still requires a live `GET /api/chains` + wallet check |
| DEC-006 | 2026-08-03 | Frozen v0.1 integration target: Ethereum Sepolia (11155111), USDC `0x1c7d4b196cb0c7b01d743fbc6116a902379c7238`, 6 decimals, org wallet `0x05619d1a133623B322a8f366ea9594e4e586f26D` | Authenticated live discovery confirmed chain stable/testnet/enabled, contract verified, and simulation-only payout passed | Provider config hardcodes this contract as the only allowed default |
| DEC-007 | 2026-08-03 | Scoped Prettier to source/test/config files; kept pre-existing planning markdown unformatted | Do not reformat files the planner authored | format/format:check cover code only |

## Plan Deviations

| ID | Date | Original plan | Change | Reason | Approval status |
|---|---|---|---|---|---|
| None | 2026-08-03 | Existing project documents described a 113-task implementation roadmap | This artifact package consolidates that roadmap without modifying existing documents | User requested planning-only artifacts | Recorded |

## Verification Evidence

| Checkpoint | Command or check | Result | Evidence |
|---|---|---|---|
| CP-000 | Read existing MergePay planning documents | Complete | Existing `docs/`, `memory.md`, and `last stop.md` were used as constraints |
| CP-000 | Confirm planning-only intent | Complete | No production code, scaffold, dependency install, delegation, or implementation test run |
| CP-000 | Required artifact policy | Complete | Only `PROJECT_PLAN.md` and `PROJECT_STATE.md` were created by this operation |
| CP-001 | Repository baseline | Pass | Planning-only files; `master` tracks `origin/master`; private remote configured |
| CP-001 | KeeperHub MCP readiness | Blocked | Server configured at `https://app.keeperhub.com/mcp` but reports not ready |
| CP-001 | KeeperHub credential availability | Blocked | No `KEEPERHUB_*` environment variable is present in the agent environment |
| CP-001 | Official hackathon verification | Blocked | Authoritative source inaccessible from the agent network environment |
| CP-002 | Hackathon facts | Pass | DoraHacks Agents Onchain page verified: USD 5,000 pool; deadline 2026-08-13 10:00; submission opens 2026-07-27 05:01; requires repo link + demo video; tags KeeperHub/MCP/x402/MPP/Ethereum (dorahacks.io/hackathon/agents-onchain) |
| CP-002 | KeeperHub auth contract | Pass | Org `kh_` API key via `Authorization: Bearer` for headless; MCP/keys/session split confirmed (docs.keeperhub.com/api/authentication) |
| CP-002 | KeeperHub chains schema | Pass | `GET /api/chains` fields incl. `chainId`, `isTestnet`, `isEnabled`, `explorerUrl`, `explorerAddressPath`; aliases incl. `sepolia`=11155111, `base-sepolia`=84532 |
| CP-002 | KeeperHub Direct Execution contract | Pass | `/api/execute/transfer`, `simulate`, `Idempotency-Key`, `GET /api/execute/{id}/status`, `X-Poll-Interval-Hint`, statuses, rate limits, spending caps documented |
| CP-002 | KeeperHub MCP reachability | Pass | HTTP 200 at app.keeperhub.com/mcp; self-describes keeperhub v1.2.0; OAuth required |
| CP-002 | KeeperHub OAuth metadata | Pass | Resource scopes `mcp:read`, `mcp:write`, `mcp:admin` at app.keeperhub.com |
| CP-002 | Authenticated capability discovery | Blocked | Requires interactive OAuth MCP handshake after opencode restart; not available in current session |
| CP-003 | Live `GET /api/chains` | Pass | Endpoint is public (no auth, HTTP 200); 22 chains total, 11 enabled testnets (Sepolia 11155111, Base Sepolia 84532, BNB Testnet 97, Polygon Amoy 80002, Arbitrum Sepolia 421614, Optimism Sepolia 11155420, Avalanche Fuji 43113, Tempo 42431, Solana Devnet 103, Plasma 9746, 0G Galileo 16602) |
| CP-003 | Wallet balance / stablecoin contract discovery | Blocked | Requires authenticated MCP/OAuth or a `kh_` org API key; not available in session |
| CP-004 | KeeperHub MCP authenticated access | Pass | MCP tools loaded and authenticated via OAuth after opencode restart |
| CP-004 | Org wallet discovery | Pass | Integration `wtxclqja588qp0o9g8m8i`, type `web3`, owner mide27145, address `0x05619d1a133623B322a8f366ea9594e4e586f26D` |
| CP-004 | Native gas check (simulated transfer) | Fail | Simulated 0.001 native transfer reverts with missing-revert-data CALL_EXCEPTION on both Sepolia (11155111) and Base Sepolia (84532) — consistent with zero native balance |
| CP-004 | Native balance via explorer | Fail | Both `sepolia.etherscan.io` and `sepolia.basescan.org` report `0 ETH` for the org wallet |
| CP-004 | Sepolia USDC contract | Pass | `0x1c7d4b196cb0c7b01d743fbc6116a902379c7238` symbol=`USDC`, decimals=`6`, org wallet balance=`0` |
| CP-004 | Base Sepolia USDC contract | Pass | `0x036CbD53842c5426634e7929541eC2318f3dCF7e` symbol=`USDC`, decimals=`6` |
| CP-004 | Chain status stability | Pass | Sepolia (11155111), Base Sepolia (84532) both `status: stable`, `isTestnet: true`, `isEnabled: true` |
| CP-005 | Wallet funding re-check (native) | Pass | Simulated 0.001 ETH transfer on Sepolia now succeeds: `wouldRevert: false`, gasEstimate 21000 |
| CP-005 | Wallet funding re-check (USDC) | Pass | Sepolia USDC balanceOf org wallet = 40000000 raw = 40 USDC (6 decimals) |
| CP-005 | Simulation-only USDC payout smoke test | Pass | Simulated 2.5 USDC transfer on Sepolia: `success: true`, `wouldRevert: false`, `simulatedReturnValue: true`, gasEstimate 40705, value 0 (no native sent). No broadcast, no execution row created |
| CP-008 | Policy reason-code registry | Pass | 20 codes (9 allow, 11 block); each has code, severity, safe message, `broadcastEligible`; info codes broadcast-eligible, block codes no-broadcast |
| CP-008 | Pure policy evaluator | Pass | `evaluatePolicy` returns deterministic decision; approved path has 9 ordered info reasons and `broadcastEligible: true`; 12 block paths each return one block reason and `broadcastEligible: false` |
| CP-008 | Resolution helpers | Pass | `resolveRecipient`, `resolvePayoutAmount`, `isChainTokenAllowed` block unmapped recipient, missing/ambiguous amount, zero amount, over-cap amount, disallowed chain/token |
| CP-008 | Decimal helpers | Pass | `exceedsDecimalString` and `isZeroAmount` compare big-int decimals without floating point |
| CP-008 | Verification suite | Pass | `npm test` 62/62; typecheck clean; lint clean (`--max-warnings 0`); format clean; ncc build + bundle loads; `npm audit` 0 vulnerabilities; grep secret scan clean |

## Known Issues

| ID | Severity | Description | Workaround | Required fix |
|---|---|---|---|---|
| KI-001 | Resolved | Org wallet funded: 40 USDC + sufficient Sepolia ETH after user claimed faucets | Verified via authenticated reads + simulated transfers | None |
| KI-002 | Resolved | Hackathon facts now authoritative from DoraHacks page (2026-08-03) | None | None — superseded by CP-002 evidence |
| KI-003 | Medium | GitHub CLI authentication differs between the user's interactive shell and the agent sandbox | Treat remote repository state as observable but do not perform network GitHub operations | Restore consistent credential/network access if GitHub operations are later required |

## Blockers

| ID | Description | Impact | Required resolution |
|---|---|---|---|---|
| ID | Description | Impact | Required resolution |
|---|---|---|---|
| None | Phase 0 prerequisites fully verified | None | None |
| BLK-002 | RESOLVED — authoritative DoraHacks page verified from the agent environment | None | None |

## Next Exact Action

Pass the Phase 1 exit gate: request an independent contract review of the full Phase 1 diff (toolchain, config schema and validation, canonical payment identity, policy reason codes, pure policy evaluator, and their tests) from the final diff without implementation reasoning. Phase 2 (GitHub event + KeeperHub execution) may begin only after the review approves.

## Checkpoint and Amendment Contract

The future executor must append a `CP-[number]` entry after setup, each phase, schema/migration change, major architecture decision, external integration, security-sensitive change, failed attempt, review, test run, blocker, deployment preparation, and every work session. Each entry must include status, date, agent, phase, objective, work completed, changed files/assets, checks, tests, acceptance criteria, decisions, deviations, risks, known issues, blockers, and one next exact action.

After execution begins, plan changes require an `AMD-[number]` amendment stating the original plan, proposed change, evidence, reason, affected requirements/phases/tests/cost/risks, approval status, and the corresponding state entry. Minor implementation details belong only in this state file.
