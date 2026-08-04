# Skirwith Project State

## Project

- Plan file: `PROJECT_PLAN.md`
- Status: In progress
- Current phase: Phase 4 - Documentation, onboarding, and submission
- Current checkpoint: CP-031
- Last updated: 2026-08-04 (Africa/Lagos)
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

- Phase: Phase 4 - Documentation, onboarding, and submission
- Checkpoint: CP-028
- Goal: Finish the release-ready package: polished README and docs, a demo video showing the three states, release packaging (address the Node 20 deprecation warning before release), and the DoraHacks submission before the 2026-08-13 10:00 deadline.
- Expected files or assets: README, demo video, release tag/bundle, logged-out link checks, submission archive.
- Acceptance criteria: Every public claim maps to live evidence or is labeled a fixture/limitation; all links work logged out; the release tag matches the demo; the submission is archived.
- Required verification: Documentation review, secret scan, video timing, public-link check, release preflight.

## Current Status

### Completed

- Phase 0 (CP-000 through CP-005): planning, repository baseline, authoritative hackathon facts, KeeperHub API contract, live chain list, org wallet discovery, funding verification, and a successful simulation-only USDC payout smoke test. Phase 0 exit gate passed.
- Existing Skirwith documents were read and treated as constraints.
- Product, architecture, security, configuration, KeeperHub, test, demo, and submission intent were normalized into this plan.
- Planning mode, research depth, feasibility verdict, assumptions, risks, open decisions, phases, acceptance criteria, and definitions of ready/done were recorded.
- No implementation files were created by this planning operation.
- Phase 1 (CP-006 through CP-011): toolchain, domain/config contracts, canonical payment identity, policy reason codes, and pure policy evaluator implemented and independently reviewed; findings REV-001..REV-004 fixed (CP-010) and the re-review approved the Phase 1 exit gate (CP-011).

### In Progress

- Phase 4 (Documentation, onboarding, optional site, release, submission): acceptance repo and docs site are live (CP-027); audit-response hardening with legacy replay migration is complete (CP-028); release packaged and tagged `v0.1.0` with docs pinned to the release SHA (CP-029); combined-audit response complete (CP-030); win-plan packaging complete with re-tag to `v0.1.1` (CP-031). Remaining: demo video recording, final immutable submission tag (`v1.0.0`) after the video, and DoraHacks submission before 2026-08-13.

### Blocked (resolved / narrowed)

- `BLK-002`: RESOLVED — Authoritative DoraHacks facts retrieved from `dorahacks.io/hackathon/agents-onchain` (see Verification Evidence).
- `BLK-001`: RESOLVED — KeeperHub API contract, live chain list, org wallet, funding, and a successful simulation-only USDC payout smoke test verified through authenticated MCP access.

### Not Started

- Demo video recording and upload (owner-side; see `docs/DEMO_VIDEO_PLAN.md`).
- DoraHacks final submission form entry with the archived repo, tag, site, and video URL (`docs/SUBMISSION.md`).
- Post-hackathon follow-ups only: orchestrator decomposition, Node 20/22 compatibility matrix, and automated site accessibility smoke tests.

## Checkpoint Log

Historical note: the `CODE_REVIEW.md` references below describe the review
artifact that lived at the repository root during each checkpoint. That
artifact is preserved and archived at `docs/reviews/CODE_REVIEW.md`; the
references resolve to the archived location and are intentional historical
records, not current root files.

### CP-000: Planning completed

- Status: Complete
- Date: 2026-08-03 (Africa/Lagos)
- Agent: Planner
- Phase: Planning
- Objective: Produce the project plan and persistent execution state.
- Work completed: Created the two requested planning artifacts from existing Skirwith documents and constraints.
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
- Acceptance criteria verified: Repository is planning-only; Git is initialized on `master` tracking `origin/master`; remote is `https://github.com/mystiquemide/skirwith.git`; KeeperHub MCP URL is configured. Live KeeperHub authentication/capabilities and official hackathon facts were not verified.
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
- Work completed: Created `src/domain/types.ts` (repository identity, merged PR, payout candidate, chain/token, policy decision, canonical request, execution status, evidence record); `src/domain/errors.ts` (SkirwithError with category/code/cause and PolicyBlockError, both with safe `toPublic()`); `src/security/validate.ts` (hex-address check + normalization); `src/config/schema.ts` + `src/config/load-config.ts` (version-gated parse, unknown-field rejection, repository match, address/decimals/amount/cap/label/recipient/check validation, big-int decimal comparison); `src/payment/canonical-request.ts`, `src/payment/payment-hash.ts`, `src/payment/payment-key.ts` (stable field-order serialization, SHA-256 hash, `mergepay:<hash>` key). Tests: `tests/config/load-config.test.ts`, `tests/config/validation.test.ts`, `tests/payment/payment-identity.test.ts`.
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

### CP-009: Phase 1 exit-gate independent review

- Status: Findings returned
- Date: 2026-08-03 (Africa/Lagos)
- Agent: Independent reviewer (external)
- Phase: Phase 1 - Foundation and contract freeze
- Objective: Independently review the full Phase 1 diff (`20b6fa2..46b8825`) as the Phase 1 exit gate before Phase 2.
- Work completed: The reviewer added `docs/reviews/CODE_REVIEW.md` (212 lines) and pushed commit `b0a882e`. Verdict: Changes required. Reproduced 62 passing tests plus clean format/lint/typecheck/build/bundle, but flagged defects that block the contract freeze.
- Findings: `REV-001` High — payment key was the hash of the whole canonical request, so changed content always changed the key and the FR-007/BR-006 same-key/different-hash conflict was unrepresentable. `REV-002` High — decimal comparison padded to 18 fractional digits without normalizing longer scales, so an over-cap amount could pass (`0.000000000000000001` vs cap `0.0000000000000000001`). `REV-003` Medium — `buildCanonicalRequest` cast/normalized malformed values (bad addresses, fractional atomic amount, non-positive identifiers) instead of validating. `REV-004` Low — repository hygiene: untracked nested `skirwith/` copy; the review commit also introduced a stray self-referential `skirwith` gitlink with no `.gitmodules`.
- Files or assets changed: `docs/reviews/CODE_REVIEW.md` (new); `PROJECT_STATE.md` not touched by the reviewer.
- Commands or checks run: Independent reproduction of test/build/format/lint/typecheck and the flagged boundary cases.
- Test results: 62/62 tests reproduced; audit unavailable in the reviewer environment (`EAI_AGAIN`).
- Next exact action: Fix REV-001..REV-004 test-first, update contract docs, rerun full verification, and request a fresh re-review.

### CP-010: Review findings REV-001..REV-004 fixed

- Status: Complete
- Date: 2026-08-03 (Africa/Lagos)
- Agent: Implementation lead
- Phase: Phase 1 - Foundation and contract freeze
- Objective: Fix the Phase 1 exit-gate findings test-first so the contracts are fit to freeze.
- Requirements covered: `FR-006`, `FR-007`, `BR-005`, `BR-006`, `NFR-003`, Task 34, Task 37, Task 39; CP-009 findings REV-001..REV-004.
- Work completed: `REV-001` — added `PaymentIdentity` (version, repository, pullRequestNumber, mergeSha, purpose) in `src/domain/types.ts`; new `src/payment/payment-identity.ts` derives and serializes the identity; `src/payment/payment-hash.ts` now exposes `serializeStableRecord`/`hashStableRecord` and a separate `hashPaymentIdentity`; `src/payment/payment-key.ts` derives the key from the identity hash only, keeping the canonical request hash as a separate integrity value. `REV-002` — `src/domain/decimal.ts` now converts decimal strings to atomic integer units via `toAtomicUnits(decimal, decimals)` (rejects fractional precision beyond token decimals, no floating point, no fixed-width padding); removed the scale-buggy `exceedsDecimalString` and its `load-config.ts` re-export; `load-config.ts` validates `payout.maximum` and every amount precision against `chain.token.decimals` and compares caps in atomic units; `src/policy/evaluate-policy.ts` compares caps in atomic units and fails closed if conversion is undefined. `REV-003` — `src/payment/canonical-request.ts` is now a validating boundary that rejects malformed repository/PR/merge-SHA/recipient/atomic-amount/chain/token/purpose with stable `CANONICAL_REQUEST_INVALID` errors (new error code in `src/domain/errors.ts`) and normalizes lowercase. `REV-004` — removed the stray self-referential `skirwith` gitlink.
- Files or assets changed: `src/domain/types.ts`, `src/domain/errors.ts`, `src/domain/decimal.ts`, `src/config/load-config.ts`, `src/policy/evaluate-policy.ts`, `src/payment/payment-identity.ts` (new), `src/payment/payment-hash.ts`, `src/payment/payment-key.ts`, `src/payment/canonical-request.ts`, `tests/payment/payment-identity.test.ts`, `tests/payment/canonical-request.test.ts` (new), `tests/domain/decimal.test.ts`, `tests/config/validation.test.ts`, docs `ARCHITECTURE.md`, `SECURITY.md`, `CONFIGURATION.md`, `TASKS.md`, `TEST-STRATEGY.md`, gitlink removal, `PROJECT_STATE.md`.
- Commands or checks run: focused vitest runs (red first on the new boundary/precision/key tests), `npm test`, `npm run typecheck`, `npm run lint`, `npm run format`/`format:check`, `npm run build`, `npm run bundle:check`, `npm run audit`, grep secret scan.
- Test results: 90 tests pass (was 62): +21 canonical-request boundary, +10 payment identity/key, rewritten decimal helpers (7), config precision/cap additions (13 config validation). Typecheck clean; lint clean (`--max-warnings 0`); format clean; ncc build + bundle loads; audit 0 vulnerabilities; secret scan clean.
- Acceptance criteria verified: Same key is stable across material content changes while the canonical hash differs (conflict representable); key changes when identity changes. Over-cap and over-precision values fail at config load and policy, and `toAtomicUnits` is correct at any scale. Canonical construction rejects every malformed field with a stable safe error and canonicalizes equivalent inputs identically. Working tree clean of the stray gitlink.
- Decisions: `DEC-008` (below) payment identity field set chosen as version/repository/PR/merge SHA/purpose with material fields as content; `DEC-009` (below) atomic-unit conversion and token-precision bound replace generic string comparison.
- Deviations: None. Review scope changes are within approved Phase 1 scope.
- Amendments: None.
- Risks introduced: None beyond plan RISK-003/RISK-004; conflict detection now genuinely representable.
- Known issues: None blocking. Audit was verified locally (0 vulnerabilities) even though the reviewer environment could not reach the registry.
- Blockers: None.
- Next exact action: Push the fixes and request a fresh independent re-review (CP-011) of the corrected Phase 1 contracts.

### CP-011: Phase 1 exit gate approved

- Status: Complete
- Date: 2026-08-03 (Africa/Lagos)
- Agent: Independent reviewer (external)
- Phase: Phase 1 - Foundation and contract freeze
- Objective: Fresh independent re-review of the CP-010 corrections to close the Phase 1 exit gate (CP-011).
- Work completed: The reviewer updated `docs/reviews/CODE_REVIEW.md` (commit `65563d5`). Verdict: Approve with non-blocking findings. 0 blocker/critical/high/medium; 1 Low (`REV-005`); 4 positives. Phase 1 exit gate approved for revision `4554773` only. Prior findings REV-001 (payment identity), REV-002 (atomic conversion/precision), and REV-003 (canonical validation) confirmed materially corrected and covered by new tests.
- Files or assets changed: `docs/reviews/CODE_REVIEW.md` updated; `PROJECT_STATE.md` not touched by the reviewer.
- Commands or checks run: Independent reproduction of 90/90 tests, format, lint, typecheck, build, bundle load, and the payment-identity/decimal/canonical regression tests.
- Acceptance criteria verified: Phase 1 gate closed for `4554773`; Phase 2 not approved and requires its own review scope.
- Decisions: None required; approval applies to the reviewed Phase 1 revision only.
- Known issues: `REV-005` Low — untracked nested `skirwith/` copy in the reviewer workspace (not present in this repository's working tree, which is clean). Dependency audit and dedicated secret scan were not reproducible in the reviewer environment; both were verified locally (audit 0 vulnerabilities, secret scan clean).
- Blockers: None.
- Next exact action: Begin Phase 2 (CP-012) test-first, starting with the KeeperHub Direct Execution client, GitHub state normalization, simulation/broadcast parity, and duplicate/conflict resolution; Phase 2 broadcast behavior requires its own independent review.

### CP-012: KeeperHub provider layer

- Status: Complete
- Date: 2026-08-03 (Africa/Lagos)
- Agent: Implementation lead
- Phase: Phase 2 - Trusted GitHub and KeeperHub execution
- Objective: Implement the highest-risk Phase 2 seam test-first: the KeeperHub Direct Execution client (typed transport, simulation, broadcast, lookup, bounded polling, error mapping), recursive secret redaction, and simulation-to-broadcast parity (plan Tasks 49-57).
- Requirements covered: `FR-009`, `FR-010`, `FR-011`, `NFR-001`, `NFR-002`, `NFR-003`, `BR-004`.
- Work completed: Created `src/security/redaction.ts` (recursive redaction of secret values and secret-named keys, non-mutating); `src/keeperhub/types.ts` (TransferParameters, TransferSimulation, TransferBroadcast, ExecutionStatusResponse, KeeperHubChain, KeeperHubExecutionStatus); `src/keeperhub/errors.ts` (ProviderError extending SkirwithError with statusCode/kind/retryAfterMs); `src/keeperhub/transport.ts` (injectable HttpTransport + FetchHttpTransport with AbortSignal.timeout, header normalization, network/timeout -> PROVIDER_TRANSPORT_FAILED); `src/keeperhub/client.ts` (KeeperHubClient: simulateTransfer, broadcastTransfer with Idempotency-Key and 409 idempotency classification, getExecution with X-Poll-Interval-Hint, waitForTerminal with clamped bounded polling and injectable clock/sleeper, discoverChains; status mapping 401/403/429/method-specific; validated JSON decoding; redacted error causes); `src/keeperhub/parity.ts` (serializeTransferParameters, assertSameTransferParameters -> EXECUTION_PARITY_MISMATCH). Added `atomicToHumanUnits` to `src/domain/decimal.ts`. Added provider error codes to `src/domain/errors.ts`. Tests: `tests/security/redaction.test.ts`, `tests/keeperhub/transport.test.ts`, `tests/keeperhub/client.test.ts`, `tests/keeperhub/parity.test.ts`, decimal atomic conversion additions.
- Files or assets changed: the files above, docs `KEEPERHUB-INTEGRATION.md`, `ARCHITECTURE.md`, `TEST-STRATEGY.md`, and `PROJECT_STATE.md`.
- Commands or checks run: focused vitest runs (red first), `npm test`, `npm run typecheck`, `npm run lint`, `npm run format`/`format:check`, `npm run build`, `npm run bundle:check`, `npm run audit`, grep secret scan.
- Test results: 128 tests pass (was 90): redaction 7, transport 6, client 25, parity 7, decimal atomic-conversion 4, prior suites unchanged. Typecheck clean; lint clean (`--max-warnings 0`); format clean; ncc build + bundle loads; audit 0 vulnerabilities; secret scan clean (only labeled synthetic fixture values).
- Acceptance criteria verified: Simulation and broadcast use the same serialized transfer parameters (parity guard); broadcast sends the payment key as the idempotency key without the simulate flag; statuses map to typed errors with safe messages; polling honors clamped hints, stops at terminal/zero-hint, and times out; secrets are redacted recursively from errors; every HTTP call has a timeout.
- Decisions: Poll hint interpreted as seconds (clamped); recipient sent as normalized lowercase address pending live EIP-55 confirmation; simulation success is any 2xx; these assumptions are documented in `KEEPERHUB-INTEGRATION.md` pending Phase 3 live confirmation. Polling clock/sleeper are injectable for deterministic tests.
- Deviations: None.
- Amendments: None.
- Risks introduced: Provider contract field-name and status-unit assumptions (documented) must be reconciled with live evidence in Phase 3 before any broadcast.
- Known issues: None blocking. The client is not yet wired into `src/action.ts` (entrypoint stays a placeholder until the orchestrator exists).
- Blockers: None.
- Next exact action: CP-013 — implement test-first the GitHub event/state normalization, receipt discovery/integrity, settlement orchestrator with duplicate/conflict resolution, and audit serialization, using a deterministic fake provider.

### CP-013: Settlement core (event normalization, receipts, orchestrator)

- Status: Complete
- Date: 2026-08-03 (Africa/Lagos)
- Agent: Implementation lead
- Phase: Phase 2 - Trusted GitHub and KeeperHub execution
- Objective: Build the settlement core on the provider layer test-first: GitHub event normalization, receipt discovery/integrity, the settlement orchestrator with duplicate/conflict resolution, uncertain-state handling, and audit serialization (plan Tasks 58-64).
- Requirements covered: `FR-001`, `FR-009` to `FR-013`, `NFR-001`, `NFR-003`, `BR-003` to `BR-006`.
- Work completed: Created `src/keeperhub/provider.ts` (KeeperHubProvider interface; `KeeperHubClient` now implements it), `src/keeperhub/transfer-parameters.ts` (canonical -> provider parameters with human amount), `src/github/event.ts` (normalizePullRequestClosedEvent: validates action/pull_request/repository/merge SHA/PR number/labels, allows closed-unmerged with empty merge SHA), `src/evidence/evidence.ts` (buildEvidence + serializeEvidence), `src/evidence/receipt.ts` (versioned hidden receipt marker encode/decode + integrity validation), `src/github/receipt-store.ts` (ReceiptStore interface), `src/execution/duplicate-resolver.ts` (duplicate / resume-poll / manual-review / conflict classification), `src/execution/orchestrator.ts` (SettlementOrchestrator: blocked -> no provider call; approved -> canonical identity, receipt lookup, simulate, broadcast with idempotency key, bounded poll, receipt save; lost broadcast response or poll timeout -> manual review with no rebroadcast; changed content -> conflict). Added `PAYMENT_PURPOSE` constant in `src/domain/constants.ts`. Tests: `tests/keeperhub/transfer-parameters.test.ts`, `tests/github/event.test.ts`, `tests/evidence/evidence.test.ts`, `tests/evidence/receipt.test.ts`, `tests/execution/duplicate-resolver.test.ts`, `tests/execution/orchestrator.test.ts`, `tests/fakes/fakes.ts` (FakeKeeperHubProvider + FakeReceiptStore).
- Files or assets changed: the files above, docs `ARCHITECTURE.md`, `TEST-STRATEGY.md`, and `PROJECT_STATE.md`.
- Commands or checks run: focused vitest runs (red first), `npm test`, `npm run typecheck`, `npm run lint`, `npm run format`/`format:check`, `npm run build`, `npm run bundle:check`, `npm run audit`, grep secret scan.
- Test results: 168 tests pass (was 128): event normalization 8, evidence 3, receipt 8, duplicate resolver 6, orchestrator 14, transfer parameters 2, prior suites unchanged. Typecheck clean; lint clean (`--max-warnings 0`); format clean; ncc build + bundle loads; audit 0 vulnerabilities; src secret scan clean.
- Acceptance criteria verified: Blocked policy makes zero provider calls; simulation revert fails without broadcast; confirmed payouts save pending-then-confirmed receipts; confirmed same-hash receipts return duplicates; changed content returns conflicts; pending receipts resume polling the original execution without rebroadcast; lost broadcast responses and poll timeouts become manual review with exactly one broadcast call; evidence serializes secret-free.
- Decisions: Receipts are saved on actual executions (pending then terminal), not on policy blocks or reverted simulations, so refusals are re-derivable and only execution state drives replay control. Broadcast outcome mapping: idempotency conflicts and transport loss are manual review; clear pre-submission rejections (auth/forbidden/rate) are failed. Unmerged-close events normalize with empty merge SHA and are blocked by policy.
- Deviations: None.
- Amendments: None.
- Risks introduced: None beyond plan RISK-003/RISK-004; provider idempotency is the recovery control for a lost broadcast response.
- Known issues: None blocking. The GitHub API adapters and action entrypoint are not yet wired; `src/action.ts` remains a placeholder.
- Blockers: None.
- Next exact action: CP-014 — implement test-first the GitHub API adapters (fresh PR/check/config/comment state), the comment-backed receipt store, action input parsing, summary/receipt renderers, the action entrypoint, and action outputs.

### CP-014: GitHub Action surface

- Status: Complete
- Date: 2026-08-03 (Africa/Lagos)
- Agent: Implementation lead
- Phase: Phase 2 - Trusted GitHub and KeeperHub execution
- Objective: Wire the settlement core to the GitHub Action surface test-first: the GitHub REST adapter (fresh PR/check/config/comment state per FR-002), the comment-backed receipt store (FR-012), action input parsing, summary/receipt renderers, the action entrypoint, and action outputs (plan Tasks 65-69, 71).
- Requirements covered: `FR-001`, `FR-002`, `FR-012`, `FR-013`, `NFR-001`, `NFR-002`, `NFR-005`, `SC-004`.
- Work completed: Moved the typed HTTP layer to `src/transport/http.ts` (re-exported from `src/keeperhub/transport.ts` for compatibility; added PATCH support). Created `src/github/api.ts` (GitHubApi interface + GithubRestApi: default branch, pull request state, trusted config contents base64 fetch at the default-branch ref, check-runs mapping, issue comment list/create/update; non-2xx and malformed responses -> GITHUB_FETCH_FAILED), `src/github/state.ts` (GithubStateFetcher assembles the SettlementInput from fresh PR/config/checks state so event fields are never trusted), `src/github/receipts.ts` (CommentReceiptStore: finds markers in comments, creates one receipt comment and updates only its own matching comment), `src/output/summary.ts` (renderActionSummary with a SettlementDisplay context), `src/output/receipt-comment.ts` (renderReceiptComment with human text + hidden marker), `src/output/outputs.ts` (buildActionOutputs), `src/action-inputs.ts` (parseRuntimeSecrets from GITHUB_TOKEN/KEEPERHUB_API_KEY), and rewrote `src/action.ts` (run() composes normalization -> fresh state -> orchestrator -> outputs/summary with injected GitHubApi/KeeperHubProvider; main() reads GITHUB_EVENT_PATH, builds real adapters, writes outputs and the Actions summary). Tests: `tests/github/api.test.ts`, `tests/github/state.test.ts`, `tests/github/receipts.test.ts`, `tests/github/inputs.test.ts`, `tests/output/summary.test.ts`, `tests/output/receipt-comment.test.ts`, `tests/output/outputs.test.ts`, rewritten `tests/action.test.ts`; added FakeGitHubApi + FakeHttpTransport to `tests/fakes/fakes.ts`.
- Files or assets changed: the files above, docs `ARCHITECTURE.md`, `TEST-STRATEGY.md`, and `PROJECT_STATE.md`.
- Commands or checks run: focused vitest runs (red first), `npm test`, `npm run typecheck`, `npm run lint`, `npm run format`/`format:check`, `npm run build`, `npm run bundle:check`, `npm run audit`, grep secret scan.
- Test results: 199 tests pass (was 168): github api 8, state 5, receipts 5, inputs 2, summary 2, receipt-comment 2, outputs 2, action run 6, prior suites unchanged. Typecheck clean; lint clean (`--max-warnings 0`); format clean; ncc build succeeds (bundle ~2.7MB with @actions/core + yaml) and loads; audit 0 vulnerabilities; src secret scan clean.
- Acceptance criteria verified: A trusted merged event runs the full flow to confirmed and posts exactly one receipt comment (created then updated); unmerged closes and failed checks block with zero provider calls and no comment; non-closed events and wrong-repository config fail safe; missing secrets fail before any network call; outputs and summary reflect status, payment key, recipient, amount, chain/token, transaction proof, duplicate, and broadcast flags.
- Decisions: The action entrypoint composes injected GitHubApi/KeeperHubProvider interfaces while `main()` wires the real adapters from the transport and secrets, keeping `run()` fully testable. Config is fetched only from the default-branch ref (ADR-003). Receipt comments are posted only by orchestrator receipt saves; blocked/refused outcomes are reported via the Actions summary to avoid clobbering original receipts. `token <token>` authorization and the contents API base64 decode are used for the GitHub adapter.
- Deviations: None.
- Amendments: None.
- Risks introduced: The GitHub REST response field assumptions (default_branch, merge_commit_sha, check-runs, contents base64) must be validated with live GitHub access in Phase 3; the poll-hint unit and recipient casing assumptions from CP-012 remain pending live confirmation.
- Known issues: None blocking. `main()` (reading GITHUB_EVENT_PATH and writing outputs/summary via @actions/core) is wired but exercised only through `run()` tests; a fixture-based packaged-action check is Task 72 (CP-015).
- Blockers: None.
- Next exact action: CP-015 — add the trusted example workflow (Task 70), saved event fixtures and packaging verification (Task 72), then request the independent Phase 2 review gate before any live execution.

### CP-015: Trusted workflow, fixtures, and packaging verification

- Status: Complete
- Date: 2026-08-03 (Africa/Lagos)
- Agent: Implementation lead
- Phase: Phase 2 - Trusted GitHub and KeeperHub execution
- Objective: Close the Phase 2 implementation surface test-first with the trusted example workflow (Task 70), saved event fixtures, and packaged-action verification (Task 72), then stage the independent Phase 2 review gate.
- Requirements covered: `NFR-001`, `SC-005`, `SC-006`, plan Tasks 70 and 72.
- Work completed: Created `action.yml` (metadata with outputs matching `buildActionOutputs` and `runs.main: dist/index.js`), `.github/workflows/ci.yml` (format, lint, typecheck, test, audit, build, bundle, verify-packaged; checkout and setup-node pinned by commit SHA verified from the GitHub API), `docs/examples/skirwith-workflow.yml` (trusted consumer workflow: `pull_request` closed only, no `pull_request_target`, pinned action reference, no checkout of untrusted code, minimum permissions contents/checks read + pull-requests write, per-PR concurrency without cancellation), `docs/examples/skirwith.yml` (trusted config template), saved fixtures `tests/fixtures/events/merged-closed.json`, `unmerged-closed.json`, `opened.json`, `tests/fixtures/skirwith.example.yml`, and `scripts/verify-packaged.mjs` which imports the built `dist/index.js` and runs it against the fixtures with synthetic fakes, asserting confirmed / blocked / safe-failure outcomes. Added `verify:packaged` npm script. Added node globals to the ESLint flat config for the `.mjs` script.
- Files or assets changed: the files above, `package.json`, `eslint.config.mjs`, docs `SECURITY.md`, and `PROJECT_STATE.md`.
- Commands or checks run: `npm run build`, `npm run verify:packaged` (PASS merged -> confirmed, unmerged -> blocked, opened -> safe failure), `npm test`, `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm run bundle:check`, `npm run audit`, grep secret scan.
- Test results: 199 tests pass (unchanged; no source logic changed in CP-015). Packaged bundle verified against three fixtures. Typecheck clean; lint clean (`--max-warnings 0`); format clean; bundle loads; audit 0 vulnerabilities; secret scan clean (including action.yml, .github, scripts).
- Acceptance criteria verified: The workflow triggers only on `pull_request` closed, gates on `merged`, pins the action reference and external actions by SHA, exposes no secret to PR code, and checks out no untrusted code; the packaged `dist/index.js` runs against saved fixtures and matches source behavior; CI enforces SC-006 on a clean checkout.
- Decisions: Pinned `actions/checkout` (v4 `11d5960a326750d5838078e36cf38b85af677262`) and `actions/setup-node` (v4 `49933ea5288caeca8642d1e84afbd3f7d6820020`) by commit SHA verified from the GitHub API. `dist/` stays gitignored and is committed at release (CP-006 decision) so the `uses: mystiquemide/skirwith@<release-sha>` reference in the example workflow resolves to a bundle; `verify:packaged` requires `npm run build` first.
- Deviations: None.
- Amendments: None.
- Risks introduced: The `dist/index.js` referenced by `action.yml` does not exist in the repository until a release commit; this is scheduled for Phase 4 release packaging. GitHub REST field and poll-hint assumptions remain pending live confirmation (CP-012/CP-014 notes).
- Known issues: None blocking. `main()` in `src/action.ts` is wired but only exercised through `run()` tests and the packaged fixture script.
- Blockers: None.
- Next exact action: Request the independent Phase 2 review (CP-016) of the full execution path; after approval, proceed to Phase 3 live three-state acceptance.

### CP-016: Phase 2 exit-gate independent review

- Status: Findings returned
- Date: 2026-08-04 (Africa/Lagos)
- Agent: Independent reviewer (external)
- Phase: Phase 2 - Trusted GitHub and KeeperHub execution
- Objective: Independently review the Phase 2 execution path (`4554773..887cce2`) as the Phase 2 exit gate before live acceptance.
- Work completed: The reviewer updated `docs/reviews/CODE_REVIEW.md` (commit `ea33028`). Verdict: Changes required. Reproduced 199/199 tests, format, lint, typecheck, build, bundle load, and packaged fixtures; flagged one Medium finding blocking the gate.
- Findings: `REV-006` Medium — `CommentReceiptStore.findByPaymentKey()` treated any issue comment containing a syntactically valid receipt marker as authoritative execution state. Because payment keys and request hashes are deterministic from public data, a commenter could forge a `confirmed` marker and suppress a legitimate payout (duplicate/manual-review with no broadcast), violating RISK-009 and the replay-integrity control. Also noted: comment-list pagination is a secondary operational risk (not blocking).
- Files or assets changed: `docs/reviews/CODE_REVIEW.md` updated; `PROJECT_STATE.md` not touched by the reviewer.
- Commands or checks run: Independent reproduction of the full verification suite and the forged-marker scenario.
- Next exact action: Fix REV-006 test-first (bind markers to a secret via HMAC, fail closed on bad provenance, validate marker fields), update docs, rerun verification, and request a re-review.

### CP-017: Review finding REV-006 fixed

- Status: Complete
- Date: 2026-08-04 (Africa/Lagos)
- Agent: Implementation lead
- Phase: Phase 2 - Trusted GitHub and KeeperHub execution
- Objective: Fix REV-006 so untrusted GitHub comments cannot forge or suppress settlement state.
- Requirements covered: `FR-012`, `BR-005`, `BR-006`, `NFR-001`, `RISK-009`; CP-016 finding REV-006.
- Work completed: `src/evidence/receipt.ts` — receipt markers now carry an HMAC-SHA256 `mac` over the marker payload; added `signReceiptMarker`/`verifyReceiptMarker` with sorted-key stable serialization so field ordering is irrelevant; strengthened `isReceiptMarker` field validation (payment key `mergepay:<64 hex>`, 64-hex request hash, 40-hex merge SHA, positive safe-integer PR number, valid status, `0x`-hex transaction hash when present, valid MAC format). `src/github/receipts.ts` — `CommentReceiptStore` now takes a `receiptSecret`, signs markers on save, and verifies the MAC before treating any comment as authoritative; forged/tampered/differently-signed markers fail closed (ignored). `src/output/receipt-comment.ts` — `renderReceiptComment(record, mac)`. `src/action.ts` — passes the KeeperHub API key as the receipt secret. `receiptMatchesCurrent` widened to accept the shared identity fields (marker or record).
- Files or assets changed: `src/evidence/receipt.ts`, `src/github/receipts.ts`, `src/output/receipt-comment.ts`, `src/action.ts`, tests `tests/evidence/receipt.test.ts`, `tests/github/receipts.test.ts`, `tests/output/receipt-comment.test.ts`, `tests/action.test.ts`, docs `ARCHITECTURE.md`, `SECURITY.md`, `TEST-STRATEGY.md`, and `PROJECT_STATE.md`.
- Commands or checks run: Focused vitest runs (reproduction first: forged marker previously treated as authoritative), `npm test`, `npm run typecheck`, `npm run lint`, `npm run format`/`format:check`, `npm run build`, `npm run bundle:check`, `npm run verify:packaged`, `npm run audit`, grep secret scan.
- Test results: 208 tests pass (was 199): receipt signing/verification + adversarial marker validation, store fail-closed tests (forged MAC, wrong secret), action-level tests proving an attacker-forged confirmed marker still pays and a legitimately signed confirmed receipt returns duplicate with no broadcast, plus prior suites unchanged. Typecheck clean; lint clean (`--max-warnings 0`); format clean; ncc build + bundle loads; packaged fixtures pass; audit 0 vulnerabilities; secret scan clean.
- Acceptance criteria verified: A forged or unsigned comment marker is never treated as execution state and never suppresses provider calls; a legitimately signed confirmed receipt still returns a duplicate with no second broadcast; malformed identity/proof fields reject markers; the packaged bundle behaves identically.
- Decisions: The receipt MAC uses the KeeperHub API key as the secret (the only credential commenters cannot access); a dedicated receipt secret was not added to avoid expanding the secret surface, and key rotation invalidates old markers fail-closed while provider idempotency remains the ultimate replay guard. Comment-author binding was not required because only the secret holder can produce a valid MAC.
- Deviations: None.
- Amendments: None.
- Risks introduced: None beyond the documented residual that rotating the KeeperHub key invalidates previously saved receipt MACs (fail-closed; provider idempotency prevents double payment).
- Known issues: None blocking. Comment-list pagination remains a documented secondary operational item (REV-006 note) for later hardening.
- Blockers: None.
- Next exact action: Request a fresh independent re-review (CP-018) confirming REV-006 is corrected; after approval, close the Phase 2 exit gate and begin Phase 3 live three-state acceptance.

### CP-018: Phase 2 re-review after REV-006 fix

- Status: Findings returned
- Date: 2026-08-04 (Africa/Lagos)
- Agent: Independent reviewer (external)
- Phase: Phase 2 - Trusted GitHub and KeeperHub execution
- Objective: Re-review the REV-006 receipt-provenance fix (`bee4a94..aa73a92`) as the Phase 2 exit gate.
- Work completed: The reviewer updated `docs/reviews/CODE_REVIEW.md` (commit `89d461f`). Verdict: Changes required. Reproduced 208/208 tests, format/lint/typecheck, build, bundle, packaged fixtures.
- Findings: `REV-007` escalated to High — `save()` still selects any decoded marker with the matching payment key (no MAC/ownership check) and updates it after a successful broadcast; real GitHub rejects edits to comments the token does not own, so the run can report failure with no trusted pending receipt and, after the provider idempotency window, a replay could double-pay. The permissive `FakeGitHubApi.updateIssueComment()` masked this. `REV-008` Medium — reusing the KeeperHub API key as the receipt HMAC secret means provider-key rotation invalidates the only durable replay record (idempotency is 24h). `REV-009` Low — `last stop.md` is deleted in the reviewer workspace.
- Files or assets changed: `docs/reviews/CODE_REVIEW.md` updated; `PROJECT_STATE.md` not touched by the reviewer.
- Next exact action: Fix REV-007 and REV-008 test-first, restore `last stop.md` in the reviewer workspace, and request another re-review.

### CP-019: Review findings REV-007 and REV-008 fixed

- Status: Complete
- Date: 2026-08-04 (Africa/Lagos)
- Agent: Implementation lead
- Phase: Phase 2 - Trusted GitHub and KeeperHub execution
- Objective: Fix REV-007 (authenticated receipt writes + post-broadcast recovery) and REV-008 (receipt signing key independent of the broadcast credential).
- Requirements covered: `FR-012`, `BR-005`, `BR-006`, `NFR-001`, `RISK-003`, `RISK-009`; CP-018 findings REV-007 and REV-008.
- Work completed: `REV-008` — `src/evidence/receipt.ts` now uses a dedicated versioned receipt-signing key: `ReceiptSigningKey { id, secret }`, `keyIdFor()` derives a stable 16-hex key id, markers carry `keyId`, `signReceiptMarker`/`verifyReceiptMarker` take keys, and verification looks up the key by `keyId` over the active and optional previous key, so rotating the KeeperHub broadcast key no longer invalidates receipts and a previous signing key is accepted during rotation. `REV-007` — `src/github/receipts.ts` `save()` now updates only a comment whose marker verifies with a known receipt key; a forged/unverified squatter is never edited and a fresh action-owned receipt comment is created. `src/execution/orchestrator.ts` wraps the post-broadcast `save(pending)` in a catch that returns manual-review evidence preserving the execution id with no rebroadcast. Wired a dedicated `MERGE_PAY_RECEIPT_SECRET` (and optional `MERGE_PAY_RECEIPT_SECRET_PREVIOUS`) through `action-inputs.ts`, `run()`/`main()`, the example workflow, and `.env.example`. `FakeGitHubApi` now models comment ownership: updates to comments the action does not own are rejected (configurable), and `FakeReceiptStore` supports a save-error switch.
- Files or assets changed: `src/evidence/receipt.ts`, `src/github/receipts.ts`, `src/output/receipt-comment.ts`, `src/action.ts`, `src/action-inputs.ts`, `src/execution/orchestrator.ts`, tests (receipt, receipts, receipt-comment, action, orchestrator, inputs), `tests/fakes/fakes.ts`, `scripts/verify-packaged.mjs`, `.env.example`, `docs/examples/skirwith-workflow.yml`, docs `ARCHITECTURE.md`, `SECURITY.md`, `CONFIGURATION.md`, `TEST-STRATEGY.md`, and `PROJECT_STATE.md`.
- Commands or checks run: Focused vitest runs, `npm test`, `npm run typecheck`, `npm run lint`, `npm run format`/`format:check`, `npm run build`, `npm run bundle:check`, `npm run verify:packaged`, `npm run audit`, grep secret scan.
- Test results: 215 tests pass (was 208): key-id/rotation signing and verification, previous-key verification, unknown-key rejection, forged-squatter write-path tests, post-broadcast save-failure manual-review tests (orchestrator + action level), ownership-aware fake. Typecheck clean; lint clean (`--max-warnings 0`); format clean; ncc build + bundle loads; packaged fixtures pass; audit 0 vulnerabilities; secret scan clean.
- Acceptance criteria verified: A forged squatter is never updated by `save()` and never disrupts the write path; a legitimate receipt still suppresses exactly one replay; post-broadcast receipt-persistence failure returns manual-review with the execution id and no rebroadcast; rotating the provider key does not invalidate receipts, and previous receipt keys verify during rotation; the packaged bundle behaves identically.
- Decisions: `DEC-010` (below) — dedicated versioned receipt-signing secret with previous-key rotation, decoupled from the KeeperHub broadcast key. Comment-author binding was still not required because the MAC is the cryptographic proof of ownership.
- Deviations: None.
- Amendments: None.
- Risks introduced: None beyond the documented single-previous-key rotation window (a second consecutive rotation before retirement would fail closed on the older receipts, which is acceptable for the testnet MVP).
- Known issues: `REV-009` (Low) is a workspace-hygiene item on the reviewer machine: `last stop.md` is deleted in `/home/mide/skirwith`; this repository's working tree is clean and the file is intact here. Comment-list pagination remains a documented secondary item.
- Blockers: None.
- Next exact action: Request a fresh independent re-review (CP-020) confirming REV-007 and REV-008 are corrected; after approval, close the Phase 2 exit gate and begin Phase 3 live three-state acceptance.

### CP-020: Phase 2 re-review after REV-007/REV-008 fix

- Status: Findings returned
- Date: 2026-08-04 (Africa/Lagos)
- Agent: Independent reviewer (external)
- Phase: Phase 2 - Trusted GitHub and KeeperHub execution
- Objective: Re-review the REV-007/REV-008 fix (`aa73a92..ebefa9a`) as the Phase 2 exit gate.
- Work completed: The reviewer updated `docs/reviews/CODE_REVIEW.md` (commit `74ca268`). Verdict: Changes required. Confirmed REV-007 (forged-comment write) and REV-008 (key rotation) corrected; reproduced 215/215 tests, format/lint/typecheck, build, bundle, packaged fixtures.
- Findings: `REV-010` High — post-broadcast receipt-persistence failure returned manual-review evidence only for the current run; nothing durable was stored, so a later run found no receipt and could broadcast again, creating a duplicate after the provider idempotency window. `REV-011` Low — `last stop.md` deleted in the reviewer workspace (same item as REV-009).
- Files or assets changed: `docs/reviews/CODE_REVIEW.md` updated; `PROJECT_STATE.md` not touched by the reviewer.
- Next exact action: Fix REV-010 by making a durable pending reservation before broadcast so a later run resolves the existing record and never rebroadcasts.

### CP-021: Review finding REV-010 fixed

- Status: Complete
- Date: 2026-08-04 (Africa/Lagos)
- Agent: Implementation lead
- Phase: Phase 2 - Trusted GitHub and KeeperHub execution
- Objective: Fix REV-010 so a post-broadcast receipt failure cannot lead to an automatic rebroadcast in a later run.
- Requirements covered: `FR-012`, `BR-005`, `RISK-003`, the nonnegotiable rule to never automatically rebroadcast an uncertain execution across runs.
- Work completed: `src/execution/orchestrator.ts` `executeNew()` now writes a durable pending reservation (status `pending`, no execution id) BEFORE any broadcast and refuses to broadcast if the reservation cannot be saved (returns failed, `broadcastMade: false`). After a successful broadcast it records the submitted state (pending with the execution id); if that save fails, it returns manual-review preserving the execution id while the durable reservation remains, so a later run resolves to manual review. Terminal-save and poll failures already kept the pending-with-execution-id record so later runs resume-poll. The pre-broadcast reservation guarantees a broadcast can only happen after a durable record exists, closing the cross-run rebroadcast gap. `FakeReceiptStore` gained a `saveErrorAt` switch; `FakeGitHubApi` gained `updateIssueCommentError`. Added tests: pre-broadcast reservation failure -> no broadcast; submitted-save failure -> manual-review with execution id and durable reservation; a two-run action and orchestrator test proving a second invocation of the same event performs zero broadcasts after a post-broadcast receipt failure.
- Files or assets changed: `src/execution/orchestrator.ts`, tests (orchestrator, action), `tests/fakes/fakes.ts`, docs `ARCHITECTURE.md`, `SECURITY.md`, `TEST-STRATEGY.md`, and `PROJECT_STATE.md`.
- Commands or checks run: Focused vitest runs, `npm test`, `npm run typecheck`, `npm run lint`, `npm run format`/`format:check`, `npm run build`, `npm run bundle:check`, `npm run verify:packaged`, `npm run audit`, grep secret scan.
- Test results: 218 tests pass (was 215): reservation-first flow, pre-broadcast reservation failure, submitted-save failure manual-review, and two-run zero-rebroadcast tests. Typecheck clean; lint clean (`--max-warnings 0`); format clean; ncc build + bundle loads; packaged fixtures pass; audit 0 vulnerabilities; secret scan clean.
- Acceptance criteria verified: No broadcast occurs unless a durable reservation exists; a post-broadcast receipt failure leaves a durable pending record; a second invocation of the same event performs zero broadcasts (and zero simulations), resolving to manual review; the packaged bundle behaves identically.
- Decisions: Reservation-first ordering (write pending before broadcast) chosen as the durable recovery mechanism, since the provider contract has no read-only lookup by payment key and a database is excluded (DEC-002). A clean pre-broadcast rejection (e.g. auth) leaves a pending reservation that resolves to manual review on later runs; this is the conservative fail-safe tradeoff and is documented.
- Deviations: None.
- Amendments: None.
- Risks introduced: None beyond the documented conservative behavior that a pre-broadcast rejection leaves a pending reservation requiring operator action.
- Known issues: `REV-011` (Low) is a workspace-hygiene item on the reviewer machine (`last stop.md` deleted in `/home/mide/skirwith`); this repository's working tree is clean. Comment-list pagination remains a documented secondary item.
- Blockers: None.
- Next exact action: Request a fresh independent re-review (CP-022) confirming REV-010 is corrected; after approval, close the Phase 2 exit gate and begin Phase 3 live three-state acceptance.

### CP-022: Phase 2 exit gate approved

- Status: Complete
- Date: 2026-08-04 (Africa/Lagos)
- Agent: Independent reviewer (external)
- Phase: Phase 2 - Trusted GitHub and KeeperHub execution
- Objective: Re-review the REV-010 fix (`ebefa9a..f883b81`) to close the Phase 2 exit gate.
- Work completed: The reviewer updated `docs/reviews/CODE_REVIEW.md` (commit `ed98ef9`). Verdict: Approve with non-blocking findings. REV-010 corrected: a signed pending reservation persists before broadcast, broadcast is refused if reservation persistence fails, and a failed submitted-state update leaves the reservation durable so later runs resolve to manual review without simulation or rebroadcast. Phase 2 execution gate approved for revision `f883b81`. Reproduced 218/218 tests, format/lint/typecheck, build, bundle, packaged fixtures.
- Findings: `REV-012` Low — `last stop.md` deleted in the reviewer workspace (hygiene, not in this repository). `REV-013` Low — GitHub comment receipt discovery lacks pagination (reliability hardening for active public PRs; deferred).
- Files or assets changed: `docs/reviews/CODE_REVIEW.md` updated; `PROJECT_STATE.md` not touched by the reviewer.
- Acceptance criteria verified: No unresolved Blocker/Critical/High/Medium; Phase 2 gate closed for `f883b81`; no further Phase 2 re-review required unless reservation/receipt/identity/idempotency/workflow code changes.
- Decisions: None required.
- Known issues: REV-012 (workspace deletion on reviewer machine), REV-013 (pagination), audit/secret-scan must be reproduced in a network-enabled clean environment before publication.
- Blockers: None.
- Next exact action: Begin Phase 3 (CP-023) live three-state acceptance with real GitHub and KeeperHub evidence.

### CP-023: REV-013 comment pagination fixed and Phase 3 readiness verified

- Status: Complete
- Date: 2026-08-04 (Africa/Lagos)
- Agent: Implementation lead
- Phase: Phase 2 hardening / Phase 3 readiness
- Objective: Fix REV-013 (Low) so issue-comment receipt discovery is bounded and paginated, then re-verify local readiness for Phase 3.
- Requirements covered: `FR-012`, `NFR-002`, REV-013.
- Work completed: `src/github/api.ts` — replaced the single-page `listIssueComments` with `listIssueCommentsPage(owner, name, number, page)` returning `IssueCommentPage { comments, hasMore, nextPage }`, using `per_page=100` and parsing the `Link: rel="next"` header; malformed/non-list responses fail as `GITHUB_FETCH_FAILED`. `src/github/receipts.ts` — `CommentReceiptStore` now iterates comment pages with early-stop once the authenticated matching receipt is found (read) or updated (write), and fails closed (`GITHUB_FETCH_FAILED`) when pagination exceeds a configured page limit (default 10 pages); forged squatters are never updated. `FakeGitHubApi` gained `listIssueCommentsPage`, `commentPageSize`, and `seedOwnedComment` for multi-page tests.
- Files or assets changed: `src/github/api.ts`, `src/github/receipts.ts`, tests (`api`, `receipts`), `tests/fakes/fakes.ts`, `scripts/verify-packaged.mjs`, `docs/TEST-STRATEGY.md`, `PROJECT_STATE.md`.
- Commands or checks run: Focused vitest runs, `npm test`, `npm run typecheck`, `npm run lint`, `npm run format`/`format:check`, `npm run build`, `npm run bundle:check`, `npm run verify:packaged`, `npm run audit`, grep secret scan.
- Test results: 222 tests pass (was 218): page parsing and next-link handling, later-page receipt discovery and update, bounded pagination fail-closed. Typecheck clean; lint clean (`--max-warnings 0`); format clean; ncc build + bundle loads; packaged fixtures pass; audit 0 vulnerabilities; secret scan clean.
- Acceptance criteria verified: Receipts on later comment pages are found and updated; pagination beyond the configured limit fails closed; forged squatters are never edited; packaged bundle behaves identically.
- Decisions: Early-stop pagination (stop once the authenticated receipt is found) chosen over full fetch to bound API calls on active PRs; a configurable page limit (default 10) fails closed rather than silently missing a receipt.
- Deviations: None.
- Amendments: None.
- Risks introduced: None; pagination adds at most bounded extra GET requests on long threads.
- Known issues: `REV-012` remains a workspace-hygiene item on the reviewer machine only (`last stop.md` deleted in `/home/mide/skirwith`); this repository's copy is intact. Audit (0) and secret scan were reproduced in this environment.
- Blockers: None.
- Next exact action: Execute Phase 3 (CP-024) live three-state acceptance once the `kh_` key, acceptance repo, and explicit broadcast confirmation are available.

### CP-024: Phase 3 acceptance environment set up

- Status: Partial (ready for live runs; no broadcast yet)
- Date: 2026-08-04 (Africa/Lagos)
- Agent: Implementation lead
- Phase: Phase 3 - Live three-state acceptance
- Objective: Stand up the live acceptance environment: verify the KeeperHub key, commit the action bundle, create the private acceptance repository with trusted config, workflow, and secrets.
- Requirements covered: `FR-008`, `SC-001` to `SC-005`, Phase 3 exit-gate prerequisites, `AGENTS.md` live-execution preconditions.
- Work completed: Verified the KeeperHub org key authenticates via simulation-only Sepolia calls (`wouldRevert: false`, gasEstimate 40695, no broadcast) and re-confirmed org wallet funding (40 USDC via `balanceOf`, gas via simulated self-transfer). Wrote a gitignored `.env` (mode 600) with the key and a generated `MERGE_PAY_RECEIPT_SECRET`. Committed the generated action bundle to the action repo (`94fcb1b`) so `uses: mystiquemide/skirwith@<sha>` resolves; verified `action.yml` and `dist/index.js` exist at that SHA. Created the private acceptance repository `mystiquemide/skirwith-acceptance` with trusted `.github/skirwith.yml` (frozen Sepolia USDC config, `checks.required: false`), the settlement workflow pinned to `94fcb1b`, and a README. Set repo secrets `KEEPERHUB_API_KEY` and `MERGE_PAY_RECEIPT_SECRET`.
- Files or assets changed: `skirwith` repo (committed `dist/` at `94fcb1b`), new `skirwith-acceptance` repo, gitignored `.env` in the local workspace.
- Commands or checks run: curl simulation-only `POST /api/execute/transfer` (native + USDC), public RPC `balanceOf` read, `gh repo create`, `gh secret set`, contents-API checks of the pinned action SHA.
- Test results: Key authenticates; simulations succeed without broadcast; org wallet has 40 USDC + Sepolia gas; action bundle present at the pinned SHA; secrets set.
- Acceptance criteria verified: Live credential verified; acceptance repo, trusted config, workflow, and secrets are ready; the only remaining step is the explicit go-ahead before the first real broadcast.
- Decisions: `DEC-011` (below) — commit the generated bundle to the action repo before Phase 4 release packaging so the acceptance workflow can pin the action by SHA; `checks.required: false` in the acceptance config to avoid the merge-SHA check-run mismatch for the demo; recipient mapped to the org wallet (self-payment on testnet, provable).
- Deviations: Committing `dist/` ahead of the plan's Phase 4 release step is a recorded decision, not a scope change.
- Amendments: None.
- Risks introduced: Testnet-only, disclosed; the first live broadcast remains gated on explicit confirmation.
- Known issues: None blocking. `gh` CLI in this sandbox is authenticated and usable (differs from earlier notes).
- Blockers: Explicit confirmation for the first live broadcast.
- Next exact action: With the user's go-ahead, create and merge a `skirwith-approved`+`skirwith-5` PR to trigger the first confirmed payout, then re-run for replay (no second tx) and create a refusal PR (blocked, no broadcast), then capture evidence.

### CP-025: Phase 3 live three-state acceptance completed

- Status: Complete
- Date: 2026-08-04 (Africa/Lagos)
- Agent: Implementation lead
- Phase: Phase 3 - Live three-state acceptance
- Objective: Prove the product with real GitHub and KeeperHub evidence: one confirmed payout, replay with no second transaction, blocked no-broadcast refusal, plus a backup confirmed transaction.
- Requirements covered: `SC-001` to `SC-005`, Phase 3 exit-gate criteria.
- Work completed: With the user's explicit confirmation, ran the live acceptance on `mystiquemide/skirwith-acceptance` (private) against the frozen Sepolia USDC contract. First made the action repo public (required for `uses:` to resolve a private action; also needed for the hackathon) after a full tracked-file secret scan. Created labels, opened and merged PRs, and watched the `Skirwith settlement` workflow. Evidence archived in `docs/PHASE3-EVIDENCE.md`.
- Evidence (testnet, verified on-chain via Sepolia RPC): SC-001 confirmed payout — PR #1 (labels `skirwith-approved`+`skirwith-5`), run `30886636409`, execution `mn7vnwz2rednekykkww8d`, tx `0x4c2e25779a1bccd11db69dd68ba5aa25a5a164d3010e1a34001a55750c7dddb0` (5 USDC, status 0x1, Transfer event verified). SC-002 replay — re-ran run `30886636409`; no second transaction, org wallet USDC unchanged at 40, receipt comment unchanged. SC-003 refusal — PR #2 (no required label), run `30886951542`, zero receipt comments, no execution id, `broadcastMade: false`, no broadcast. Backup — PR #3 (`skirwith-10`), run `30887061343`, execution `qyq992ip9zdrg24nfxj9u`, tx `0xdfdb1cf0b77894560f78a77bb11f1b19a53caaa73154db2de1704f91b9fd03c9` (10 USDC, status 0x1, Transfer event verified).
- Files or assets changed: new `docs/PHASE3-EVIDENCE.md`, `PROJECT_STATE.md`; acceptance repo `mystiquemide/skirwith-acceptance` created and populated; action repo made public.
- Commands or checks run: `gh pr create/merge`, `gh run view/list/rerun`, Sepolia RPC `eth_getTransactionReceipt`/`eth_call`/`eth_getTransactionByHash`, `gh api` comment/repo checks.
- Test results: All three states + backup confirmed with real, on-chain-verified KeeperHub transactions and GitHub evidence; org wallet balance verified unchanged after replay and refusal.
- Acceptance criteria verified: SC-001 (exactly one confirmed transaction per eligible merged PR), SC-002 (replay -> no second transaction), SC-003 (blocked before broadcast, `broadcastMade: false`, no execution id), SC-004 (receipt, run, execution, and explorer agree), SC-005 (untrusted content cannot reach the secret; workflow never checks out PR code).
- Decisions: Made the action repo public (verified clean via tracked-file secret scan) because private action references cannot resolve via `uses:` with the default token and the hackathon requires a public repository. Acceptance payouts are self-payments to the org wallet (recipient mapping), which is documented and provable on-chain.
- Deviations: Action repo made public before the Phase 4 release step (recorded decision); acceptance recipient is the org wallet (self-payment) rather than a third-party wallet.
- Amendments: None.
- Risks introduced: None beyond disclosed testnet usage; the `kh_` key remains secret (only in the gitignored `.env` and as a repo secret).
- Known issues: Node 20 deprecation warning on the runner (the action targets node20; GitHub may require migration to node24 for release). The acceptance repo is private (public only when needed).
- Blockers: None.
- Next exact action: Begin Phase 4 (documentation, demo video, optional site, release packaging with node24 migration if required, and DoraHacks submission before 2026-08-13).

### CP-026: Receipt-save retry robustness and extended live evidence

- Status: Complete
- Date: 2026-08-04 (Africa/Lagos)
- Agent: Implementation lead
- Phase: Phase 3 - Live three-state acceptance
- Objective: Reduce the chance of a post-broadcast receipt save dropping the execution id (transient GitHub/network failures), and extend live evidence.
- Requirements covered: `FR-012`, `BR-005`, `NFR-002`, Phase 3 evidence.
- Work completed: Added bounded retry (up to 3 attempts with backoff) around the idempotent receipt create-or-update saves in the orchestrator (`saveWithRetry`); broadcast is never retried. Added safe outcome logging to the action entrypoint (`skirwith status=... broadcast=... executionId=... tx=... error=...`). Rebuilt and redeployed the bundle (`d75ca53`); acceptance workflow pinned to it. Ran PRs #4-#9: additional confirmed payouts (#4, #6, #7, #8, #9) and a second refusal type (#5, ambiguous labels). PRs #4/#6/#7 confirmed on-chain but the broadcast response was not delivered to the action, demonstrating the uncertain-state no-rebroadcast safety; PRs #8/#9 (and #1/#3) confirmed with complete receipts.
- Evidence: 7 confirmed on-chain transactions total (5+10+5+5+5+5+5 USDC, self-payments; org wallet unchanged at 40 USDC); 2 refusal types (missing label, ambiguous payout); re-run after uncertain state performed zero broadcasts. See `docs/PHASE3-EVIDENCE.md`.
- Files or assets changed: `src/execution/orchestrator.ts`, `src/action.ts`, tests, `docs/PHASE3-EVIDENCE.md`, `PROJECT_STATE.md`; acceptance repo workflow pinned to `d75ca53`.
- Commands or checks run: `npm test` (223), typecheck, lint, format, build; live runs watched via `gh run view` + on-chain RPC verification of each transaction.
- Test results: 223 tests pass; a retry test proves a transient save still confirms.
- Acceptance criteria verified: Retry prevents transient receipt-save drops; uncertain-state runs never rebroadcast; on-chain evidence verified for every transaction.
- Decisions: Retry only idempotent receipt saves, never the broadcast (no automatic rebroadcast). Pending receipts from an undelivered broadcast response are manual-review by design and are reconciled via the KeeperHub execution record (execution id) or documented as uncertain-state evidence.
- Deviations: None.
- Amendments: None.
- Risks introduced: None; bounded retries are idempotent (create-or-update by payment key).
- Known issues: PRs #4/#6/#7 receipts remain `pending` (undelivered broadcast response); the execution ids were not recorded by the action and must be pulled from the KeeperHub dashboard to reconcile authoritatively.
- Blockers: None.
- Next exact action: Provide execution-id pull steps and reconcile the three pending receipts or document them; then proceed to Phase 4.

### CP-027: Public acceptance evidence and Phase 4 docs site

- Status: Complete
- Date: 2026-08-04 (Africa/Lagos)
- Agent: Implementation lead
- Phase: Phase 4 - Documentation and site
- Objective: Make the live acceptance evidence publicly accessible and stand up the optional lightweight docs site.
- Requirements covered: Phase 4 optional-site scope, `SC-004` public evidence, hackathon public-repo requirement.
- Work completed: Made `mystiquemide/skirwith-acceptance` public (tracked-file secret scan clean; repo secrets remain private). Recovered the missing execution ids for the three uncertain-response receipts (PRs #4/#6/#7) via KeeperHub idempotent replay (`idempotentReplay: true`, no new transaction, transfer count verified unchanged) and posted maintainer reconciliation notes on each PR. Added `docs/index.html` — a self-contained Phase 4 landing/docs site with the three-state proof, the live transaction table, setup instructions, and the safety design. Enabled GitHub Pages from `/docs` on `master`; verified the site and evidence file are served.
- Files or assets changed: `docs/index.html` (new), `docs/PHASE3-EVIDENCE.md`, `PROJECT_STATE.md`; `skirwith-acceptance` made public; GitHub Pages enabled.
- Commands or checks run: idempotent-replay curl lookups, `eth_getLogs` transfer-count verification, `gh repo edit` public, `gh api .../pages`, curl of the Pages site (HTTP 200) and the evidence file (HTTP 200).
- Test results: Site live at `https://mystiquemide.github.io/skirwith/`; acceptance repo public; all 7 confirmed transactions documented with execution ids and explorer links.
- Acceptance criteria verified: Reviewers/judges can view the receipts and transactions without credentials; the site presents the proof and setup; the action repo and acceptance repo are public for the hackathon.
- Decisions: Hosted the site via GitHub Pages from `/docs` (no build step, no extra infra); kept the signed receipt markers untouched (reconciliation posted as plain-text maintainer notes).
- Deviations: None.
- Amendments: None.
- Risks introduced: The public acceptance repo's workflow can be triggered only by users with write access (labels + merge), and payouts are self-payments to the org wallet (net-zero USDC); acceptable for the demo.
- Known issues: The `kh_` key and receipt secret remain in the acceptance repo's private secrets only; `REV-012` workspace deletion on the reviewer machine remains a user-side item.
- Blockers: None.
- Next exact action: Finish Phase 4 — README polish, demo video, release packaging (node24 migration check), and DoraHacks submission before 2026-08-13.

### CP-028: Audit-response hardening and legacy replay migration

- Status: Complete
- Date: 2026-08-04 (Africa/Lagos)
- Agent: Implementation lead
- Phase: Phase 4 - Documentation and site
- Objective: Close the Elite Hackathon Audit findings before release: prove the rename did not break replay suppression, bound comment pagination, align the Node 24 runtime, and align naming and landing copy.
- Requirements covered: `SC-002` replay suppression across the rebrand, `SC-004` evidence integrity, audit P0/P1/P2 action items.
- Work completed: Dual-read legacy receipts. The marker parser now accepts both `mergepay` and `skirwith` products, envelopes, and payment-key prefixes (`src/evidence/receipt.ts`). Added `deriveLegacyPaymentKey` (`src/payment/payment-key.ts`) and `LEGACY_PAYMENT_PURPOSE` (`src/domain/constants.ts`). The orchestrator now looks up the current `skirwith:` key first, then the legacy `mergepay:` key, and resolves any found receipt against the matching identity so a pre-rebrand PR resolves to duplicate/resume/manual-review and never rebroadcasts (`src/execution/orchestrator.ts`). Bounded pagination with a request counter and visited-page cycle detection in `CommentReceiptStore.iterateComments` (`src/github/receipts.ts`). Aligned Node 24 across CI, `engines`, and `.nvmrc`. Canonicalized the receipt secret to `SKIRWITH_RECEIPT_SECRET` with legacy-name fallback for the migration window (`src/action-inputs.ts`). Rewrote landing-page proof copy (on-chain-confirmed vs receipt-confirmed), made the setup promise conditional, and added an "If the run does not settle" recovery section with doc links.
- Files or assets changed: `src/evidence/receipt.ts`, `src/payment/payment-key.ts`, `src/domain/constants.ts`, `src/execution/orchestrator.ts`, `src/github/receipts.ts`, `src/action-inputs.ts`, `tests/evidence/receipt.test.ts`, `tests/execution/orchestrator.test.ts`, `tests/github/receipts.test.ts`, `tests/github/inputs.test.ts`, `.github/workflows/ci.yml`, `package.json`, `.nvmrc`, `docs/index.html`, `docs/CONFIGURATION.md`, `docs/examples/skirwith-workflow.yml`, `README.md`, `PROJECT_STATE.md`.
- Commands or checks run: `npm run typecheck`, `npm test` (233 tests), focused suites for receipt/orchestrator/receipts-store/inputs.
- Test results: 233/233 tests pass; new legacy-compatibility tests cover confirmed duplicate, pending resume, changed-content conflict, no-broadcast-on-new-payment, and legacy marker parse/verify; new pagination-cycle test fails closed within the page cap.
- Acceptance criteria verified: A pre-rebrand `mergepay:` confirmed receipt resolves to `duplicate` with zero provider calls; a legacy pending receipt resumes polling without rebroadcast; a legacy conflicting receipt goes to manual review; new payments still broadcast under `skirwith:` keys.
- Decisions: Dual-read legacy identities instead of rewriting live receipts, so historical evidence stays authoritative and unmodified; accept both `SKIRWITH_RECEIPT_SECRET` and the legacy `MERGE_PAY_RECEIPT_SECRET` names during the migration window (canonical name wins); do not rename the live acceptance repo secrets since legacy names are accepted.
- Deviations: None.
- Amendments: Approved migration amendment for the rebrand: `AMD-001` (`docs/AMD-001.md`). Persisted payment identities and receipt markers written under the pre-rebrand `mergepay` purpose, key prefix, and product remain authoritative; new writes use `skirwith`. DEC-012 records the decision.
- Risks introduced: Legacy-compatibility lookups add one extra receipt-store query only when the current key misses (no extra network work for new payments).
- Known issues: `dist/` must be rebuilt and committed before release; the acceptance repo still uses the legacy secret name, which the action accepts; `REV-012` workspace deletion on the reviewer machine remains a user-side item.
- Blockers: None.
- Next exact action: Rebuild `dist/`, run the full release preflight, tag `v0.1.0`, point the example workflows and README at the tag SHA, record the demo video, and submit to DoraHacks before 2026-08-13.

### CP-029: Immutable release and submission archive

- Status: Complete
- Date: 2026-08-04 (Africa/Lagos)
- Agent: Implementation lead
- Phase: Phase 4 - Documentation and site
- Objective: Publish the immutable release, pin every action reference to it, archive the submission payload, and close the combined audit's governance and completeness findings.
- Requirements covered: Hackathon submission requirements (repo link, release tag, demo video, submission URL), `SC-004` public evidence, governance rules for amendments and checkpoints.
- Work completed: Created annotated tag `v0.1.0` pointing to the verified release commit `594bcb928ed0fb40df1845263e17ce62ead6c8bc`. Replaced every `<release-sha>` placeholder in README, the example workflow, and the landing page with that SHA. Archived the submission payload in `docs/SUBMISSION.md` (repo, tag, release SHA, explorer transaction, execution id, docs site, honest disclosures). Completed logged-out link checks: all GitHub links and the Pages site returned HTTP 200 and all 7 Sepolia transactions resolve via `eth_getTransactionByHash`.
- Files or assets changed: `docs/SUBMISSION.md`, `README.md`, `docs/examples/skirwith-workflow.yml`, `docs/index.html`, `PROJECT_STATE.md`; tag `v0.1.0` (annotated).
- Commands or checks run: `git tag -a v0.1.0`, `git push origin master`, `git push origin v0.1.0`, CI run `30900238901` (success), Pages build `30900237539` (success), curl of the Pages site (HTTP 200), curl checks of every landing link, `eth_getTransactionByHash` on a public Sepolia RPC for all 7 transactions.
- Test results: CI passed on the release commits under Node 24; Pages rebuilt; all 7 transactions resolve on-chain.
- Acceptance criteria verified: `v0.1.0` tag points to the exact commit the docs pin; the submission archive records the release SHA and demo URL slot; all public links verified logged out.
- Decisions: None beyond the existing release plan.
- Deviations: None.
- Amendments: Migration amendment recorded as `AMD-001` (see `docs/AMD-001.md`); DEC-012 references it.
- Risks introduced: Demo video URL remains a pending slot in the submission archive until the owner records and uploads it.
- Known issues: `REV-012` workspace deletion on the reviewer machine remains a user-side item.
- Blockers: None.
- Next exact action: Record the demo video against the `v0.1.0` release SHA, archive the video URL, and complete the DoraHacks submission form before 2026-08-13.

### CP-030: Combined-audit response (operational copy, coverage, recovery, and packaged legacy proof)

- Status: Complete
- Date: 2026-08-04 (Africa/Lagos)
- Agent: Implementation lead
- Phase: Phase 4 - Documentation and site
- Objective: Close the combined product/repo/UX audit findings that were not covered by CP-028/CP-029: repair the coverage command, redact bootstrap errors, add outcome-specific next-step copy, publish recovery and judge-verification guides, prove the legacy replay path in the packaged bundle, fix stale state, and record the formal AMD.
- Requirements covered: `SC-002` replay suppression, `SC-004` evidence integrity, governance rules for numbered amendments and checkpoints, audit M0/M1/M2 items.
- Work completed: Added `@vitest/coverage-v8` and verified `npm run test:coverage` runs. Routed bootstrap error paths through a safe error/redaction boundary (`src/action.ts`) so a secret-bearing action never logs raw unknown errors. Added a pure outcome-copy mapper (`src/output/status-copy.ts`) and rendered outcome, broadcast state, explanation, and safe next step in the action summary and the PR receipt comment. Fixed the stale "Not Started" section and added CP-029/CP-030 checkpoints. Created `docs/AMD-001.md` (formal migration amendment; DEC-012 references it), `docs/RECOVERY.md`, and `docs/VERIFY.md`; linked them from the landing page and README. Applied landing-page microcopy fixes and raised the faint step-number contrast to WCAG AA in both themes. Added a packaged legacy fixture to `scripts/verify-packaged.mjs` proving a legacy `mergepay` confirmed receipt resolves to duplicate with zero broadcasts. Narrowed `engines` to Node 24 to match the tested runtime.
- Files or assets changed: `package.json`, `package-lock.json`, `src/action.ts`, `src/output/status-copy.ts` (new), `src/output/summary.ts`, `src/output/receipt-comment.ts`, `tests/output/status-copy.test.ts` (new), `tests/output/summary.test.ts`, `tests/output/receipt-comment.test.ts`, `tests/action.test.ts`, `scripts/verify-packaged.mjs`, `docs/AMD-001.md` (new), `docs/RECOVERY.md` (new), `docs/VERIFY.md` (new), `docs/index.html`, `docs/SUBMISSION.md`, `README.md`, `PROJECT_STATE.md`, `dist/`.
- Commands or checks run: `npm run format:check`, `npm run lint`, `npm run typecheck`, `npm test` (242 tests), `npm run test:coverage`, `npm run build`, `npm run bundle:check`, `npm run verify:packaged`, `npm audit`.
- Test results: 242/242 tests pass; `test:coverage` runs; packaged verification adds `legacy mergepay confirmed receipt -> duplicate` and `legacy mergepay replay -> zero broadcasts`; 0 vulnerabilities.
- Acceptance criteria verified: Every status exposes a safe next step; the packaged bundle proves legacy replay suppression; coverage and audit commands are reproducible; AMD-001 contains the required governance fields.
- Decisions: Outcome copy is derived from `EvidenceRecord.status` plus broadcast state via a pure mapper; machine codes are retained. `engines` narrowed to `^24`; Node 20/22 matrix testing is a post-hackathon follow-up.
- Deviations: None.
- Amendments: `AMD-001` recorded; DEC-012 references it.
- Risks introduced: `dist/` must be rebuilt and committed before any re-tag; engines narrowing means npm on older Node majors warns.
- Known issues: `REV-012` workspace deletion on the reviewer machine remains a user-side item; automated site accessibility smoke test remains a post-hackathon follow-up.
- Blockers: None.
- Next exact action: Record the demo video against the `v0.1.0` release SHA, archive the video URL in `docs/SUBMISSION.md`, and complete the DoraHacks submission form before 2026-08-13.

### CP-031: Win-plan packaging and release re-tag

- Status: Complete
- Date: 2026-08-04 (Africa/Lagos)
- Agent: Implementation lead
- Phase: Phase 4 - Documentation and site
- Objective: Apply the win plan's packaging requirements: a judge-first README, a root MIT license, removal of internal review material from the primary repository path, and an unambiguous release identity that includes the judge-facing documentation.
- Requirements covered: Win-plan README blueprint, licensing, repository hygiene, and one-revision release identity.
- Work completed: Restructured the README around verification (hero pitch, watch-and-verify evidence path, three-state proof table, why KeeperHub, security invariants, quickstart pinned to the release SHA, outcome guide, evidence and limitations, reproduction, repository map) and removed the generic "Who it is for" section and the untested "replays never pay twice" claim. Added the root `LICENSE` (MIT). Moved internal review documents (`CODE_REVIEW.md`, `ELITE_HACKATHON_AUDIT.md`, `COMBINED_PRODUCT_REPO_UX_HACKATHON_AUDIT.md`, `SKIRWITH_WIN_PLAN.md`) into `docs/reviews/` via `git mv`. Created annotated tag `v0.1.1` at commit `0f821cf4bade597f23cd594be222b4d59a3b33f7` and re-pointed every README, example workflow, landing page, submission archive, and verify-guide reference from `v0.1.0`/`594bcb9` to `v0.1.1`/the new SHA. Fixed stale project-state references (`docs/reviews/CODE_REVIEW.md` paths, current checkpoint).
- Files or assets changed: `README.md`, `LICENSE` (new), `docs/reviews/` (moved CODE_REVIEW and the three audit/win-plan docs), `docs/SUBMISSION.md`, `docs/VERIFY.md`, `docs/examples/skirwith-workflow.yml`, `docs/index.html`, `PROJECT_STATE.md`; tag `v0.1.1` (annotated).
- Commands or checks run: `git mv` for the review archive, `git tag -a v0.1.1`, full verification from a fresh `npm ci` in a clean worktree at HEAD (`npm run format:check`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run test:coverage`, `npm run build`, `npm run bundle:check`, `npm run verify:packaged`, `npm run audit`), link existence checks across all referenced docs, `grep` for stale root-path references (none remaining).
- Test results: 242/242 tests pass; every command advertised in the README passes from a fresh `npm ci`, including `npm run test:coverage` (exit 0, `@vitest/coverage-v8` committed in `package.json` and `package-lock.json`); all README/doc links resolve; no stale references to the moved review documents remain.
- Acceptance criteria verified: The README leads with verification; the release tag includes the judge-first README; internal review material is out of the primary repository path; the submission archive pins the exact release commit and records the pending `v1.0.0` final tag after the demo video.
- Decisions: Re-tagged to `v0.1.1` at the current HEAD rather than rewriting `v0.1.0`; the final `v1.0.0` submission tag will be cut after the demo video and submission archive so the evaluated revision matches the release exactly. `docs/reviews/` contents are treated as preserved review evidence and are excluded from cleanup scope.
- Deviations: None.
- Amendments: `AMD-001` remains approved.
- Risks introduced: Two release tags exist (`v0.1.0`, `v0.1.1`); docs reference `v0.1.1`, and the final submission tag supersedes both after the video.
- Known issues: Demo video URL is still a pending slot in the submission archive; `REV-012` workspace deletion on the reviewer machine remains a user-side item.
- Blockers: Two submission blockers remain. (1) Demo video URL is missing; the submission is incomplete without it. (2) The final evaluation revision is not yet frozen: `v1.0.0` must be cut after the video and submission archive so the demo, README, bundle, and submission reference one SHA. The previously reported broken coverage command is not a blocker: it was re-verified passing from a fresh `npm ci` at this checkpoint.
- Next exact action: Record the demo video against `v0.1.1`, archive the URL in `docs/SUBMISSION.md`, cut the final `v1.0.0` submission tag so the evaluated SHA matches, and complete the DoraHacks submission form before 2026-08-13.

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
| DEC-008 | 2026-08-03 | Payment key derives from a stable `PaymentIdentity` (version, repository, PR, merge SHA, purpose); recipient/amount/chain/token are content, tracked by the separate canonical request hash | Same-key/different-hash conflicts must be representable for BR-006 replay safety | Confirms FR-007; key no longer changes on material content change |
| DEC-009 | 2026-08-03 | Convert human decimal amounts to atomic integer units via token decimals and reject fractional precision beyond token decimals; no generic fixed-width string comparison | Fixed-width decimal comparison accepted an over-cap amount (REV-002) | Cap and precision enforced at config load and policy; amounts stay decimal at config boundary |
| DEC-010 | 2026-08-04 | Use a dedicated versioned receipt-signing secret (`MERGE_PAY_RECEIPT_SECRET`) with a key id and an optional previous key for rotation, decoupled from the KeeperHub broadcast key | REV-008: reusing the provider key meant provider rotation invalidated the durable replay record | Receipts survive provider-key rotation; `MERGE_PAY_RECEIPT_SECRET_PREVIOUS` supports one rotation window |
| DEC-011 | 2026-08-04 | Commit the generated `dist/` bundle to the action repo (`94fcb1b`) before the Phase 4 release step so the acceptance workflow can pin the action by commit SHA | `uses:` requires `dist/index.js` to exist at the referenced SHA; Phase 3 live acceptance needs a usable action reference | Acceptance workflow pins `94fcb1b`; bundle matches the reviewed source at `2760aeb` |
| DEC-012 | 2026-08-04 | Dual-read legacy `mergepay` payment identities and receipt markers instead of rewriting live receipts, and accept both `SKIRWITH_RECEIPT_SECRET` and `MERGE_PAY_RECEIPT_SECRET` during the migration window | The rebrand changed the persisted payment identity, which threatened the never-pay-twice replay claim; live receipts must stay authoritative and unmodified | Replay compatibility is proven by test (CP-028); formalized as amendment `AMD-001` |

## Plan Deviations

| ID | Date | Original plan | Change | Reason | Approval status |
|---|---|---|---|---|---|
| None | 2026-08-03 | Existing project documents described a 113-task implementation roadmap | This artifact package consolidates that roadmap without modifying existing documents | User requested planning-only artifacts | Recorded |

## Verification Evidence

| Checkpoint | Command or check | Result | Evidence |
|---|---|---|---|
| CP-000 | Read existing Skirwith planning documents | Complete | Existing `docs/`, `memory.md`, and `last stop.md` were used as constraints |
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
| CP-009 | Independent Phase 1 review | Findings returned | `docs/reviews/CODE_REVIEW.md`: REV-001 High (payment key = content hash), REV-002 High (fixed-width decimal cap bypass), REV-003 Medium (canonical builder not validating), REV-004 Low (nested copy/gitlink) |
| CP-010 | Payment key / identity separation | Pass | Same key stable across material content changes while canonical hash differs; key changes on identity change (identity/payment tests) |
| CP-010 | Atomic-unit decimal conversion | Pass | `toAtomicUnits("0.000000000000000001", 19)` = `10` > cap `1`; excess fractional precision rejected; no floating point |
| CP-010 | Config precision and cap bounds | Pass | Over-precision amount and maximum rejected; amount equal to maximum accepted; over-cap blocked (config validation tests) |
| CP-010 | Canonical request validation boundary | Pass | 17 malformed-field cases rejected with `CANONICAL_REQUEST_INVALID`; equivalent inputs canonicalize identically |
| CP-010 | Verification suite | Pass | `npm test` 90/90; typecheck clean; lint clean (`--max-warnings 0`); format clean; ncc build + bundle loads; `npm audit` 0 vulnerabilities; grep secret scan clean; `git rm skirwith` removed stray gitlink |
| CP-011 | Independent Phase 1 re-review | Approve | `docs/reviews/CODE_REVIEW.md`: 0 blocker/critical/high/medium; REV-001..REV-003 confirmed corrected; 1 Low (`REV-005` nested copy in reviewer workspace); Phase 1 gate approved for `4554773` |
| CP-012 | Provider transport | Pass | `FetchHttpTransport` injectable fetch, per-request timeout, header normalization, network/timeout -> `PROVIDER_TRANSPORT_FAILED` |
| CP-012 | Provider client | Pass | Simulate/broadcast/lookup/poll/discover against fake transport; idempotency-key on broadcast, `simulate` only on simulation, 409 -> conflict/in-progress kind, 401/403/429 mapping, malformed JSON rejected |
| CP-012 | Bounded polling | Pass | Clamped hints, terminal at completed/failed/zero-hint, deterministic `PROVIDER_POLL_TIMEOUT` via injected clock/sleeper |
| CP-012 | Parity and redaction | Pass | `EXECUTION_PARITY_MISMATCH` on any parameter change; recursive secret redaction non-mutating |
| CP-012 | Verification suite | Pass | `npm test` 128/128; typecheck/lint/format clean; build + bundle load; `npm audit` 0; secret scan clean |
| CP-013 | Event normalization | Pass | Valid closed-merged normalized; non-closed action, missing pull_request, invalid merge SHA/PR number rejected; closed-unmerged accepted with empty merge SHA |
| CP-013 | Receipt marker + integrity | Pass | Encode/decode round trip through hidden comment block; malformed/invalid markers rejected; identity/hash mismatch rejected |
| CP-013 | Duplicate resolver | Pass | confirmed->duplicate, pending+id -> resume-poll, failed/pending-no-id -> manual-review, changed content -> conflict |
| CP-013 | Orchestrator outcomes | Pass | blocked=0 provider calls; simulation revert=failed no broadcast; confirmed saves pending+confirmed receipts; duplicate reuses proof; conflict=manual-review; pending resumes original execution; lost broadcast/poll timeout=manual-review with exactly 1 broadcast call |
| CP-013 | Verification suite | Pass | `npm test` 168/168; typecheck/lint/format clean; build + bundle load; `npm audit` 0; src secret scan clean |
| CP-014 | GitHub REST adapter | Pass | Default branch, PR state, config contents base64 at default-branch ref, check-runs, comment list/create/update; non-2xx and malformed JSON -> `GITHUB_FETCH_FAILED` |
| CP-014 | Fresh state fetch | Pass | SettlementInput assembled from fresh PR/config/checks; wrong-repository config rejected; fresh PR state used over event fields |
| CP-014 | Comment receipt store | Pass | Finds markers by payment key, ignores non-markers, creates one comment and updates only its own matching comment |
| CP-014 | Entrypoint + outputs | Pass | Confirmed run posts exactly one receipt comment; unmerged/failed-checks block with 0 provider calls; non-closed event and config mismatch fail safe; missing secrets fail before network; outputs/summary render all documented fields |
| CP-014 | Verification suite | Pass | `npm test` 199/199; typecheck/lint/format clean; ncc build + bundle load; `npm audit` 0; src secret scan clean |
| CP-015 | Trusted example workflow | Pass | `pull_request` closed only, no `pull_request_target`, minimum permissions, per-PR concurrency, no untrusted checkout |
| CP-015 | Pinned actions | Pass | checkout + setup-node pinned by commit SHA verified from GitHub API |
| CP-015 | Packaged action vs fixtures | Pass | `npm run verify:packaged` against `dist/index.js`: merged -> confirmed, unmerged -> blocked, opened -> safe failure |
| CP-015 | Verification suite | Pass | `npm test` 199/199; typecheck/lint/format clean; bundle loads; `npm audit` 0; secret scan clean incl. action.yml/.github/scripts |
| CP-016 | Independent Phase 2 review | Findings returned | `docs/reviews/CODE_REVIEW.md`: REV-006 Medium — forged comment markers treated as authoritative receipt state could suppress payouts |
| CP-017 | Receipt marker MAC | Pass | HMAC-SHA256 over marker payload with the receipt secret; sorted-key stable serialization; forged/tampered/different-secret markers fail closed |
| CP-017 | Marker field validation | Pass | Payment key, 64-hex request hash, 40-hex merge SHA, positive PR number, valid status, tx-hash format all validated before acceptance |
| CP-017 | Adversarial action tests | Pass | Attacker-forged confirmed marker still pays (broadcast 1); legitimately signed confirmed receipt returns duplicate (broadcast 0) |
| CP-017 | Verification suite | Pass | `npm test` 208/208; typecheck/lint/format clean; ncc build + bundle load; packaged fixtures pass; `npm audit` 0; secret scan clean |
| CP-018 | Independent Phase 2 re-review | Findings returned | `docs/reviews/CODE_REVIEW.md`: REV-007 escalated High (unauthenticated write path + post-broadcast save loss), REV-008 Medium (provider key reuse), REV-009 Low (workspace file deletion) |
| CP-019 | Versioned receipt signing key | Pass | Dedicated `MERGE_PAY_RECEIPT_SECRET` with key id; previous key verifies during rotation; provider-key rotation no longer invalidates receipts; unknown key ids rejected |
| CP-019 | Authenticated receipt writes | Pass | `save()` updates only MAC-verified matching receipts; forged squatter never edited and a fresh signed comment is created |
| CP-019 | Post-broadcast recovery | Pass | `save(pending)` failure returns manual-review evidence with execution id and no rebroadcast (orchestrator + action tests) |
| CP-019 | Ownership-aware fake | Pass | `FakeGitHubApi` rejects updates to comments the action does not own, matching real GitHub authorization |
| CP-019 | Verification suite | Pass | `npm test` 215/215; typecheck/lint/format clean; ncc build + bundle load; packaged fixtures pass; `npm audit` 0; secret scan clean |
| CP-020 | Independent Phase 2 re-review | Findings returned | `docs/reviews/CODE_REVIEW.md`: REV-007/REV-008 confirmed corrected; REV-010 High (no durable cross-run rebroadcast guard), REV-011 Low (workspace file deletion) |
| CP-021 | Pre-broadcast durable reservation | Pass | `executeNew` writes a pending reservation before broadcast; no broadcast without a durable reservation; submitted-save failure returns manual-review with the execution id |
| CP-021 | Cross-run no-rebroadcast | Pass | Two-run action and orchestrator tests prove a second invocation of the same event performs zero broadcasts and zero simulations after a post-broadcast receipt failure |
| CP-021 | Verification suite | Pass | `npm test` 218/218; typecheck/lint/format clean; ncc build + bundle load; packaged fixtures pass; `npm audit` 0; secret scan clean |
| CP-022 | Independent Phase 2 re-review | Approve | `docs/reviews/CODE_REVIEW.md`: REV-010 confirmed corrected; 0 blocker/critical/high/medium; 2 Low (REV-012 workspace deletion, REV-013 comment pagination); Phase 2 gate approved for `f883b81` |
| CP-023 | Comment pagination (REV-013) | Pass | Bounded early-stop pagination with `Link` next-page parsing; later-page receipts found/updated; fail-closed page limit; forged squatters never edited |
| CP-023 | Phase 3 local readiness | Pass | `npm test` 222/222; typecheck/lint/format clean; build + bundle load; packaged fixtures pass; `npm audit` 0; secret scan clean |
| CP-024 | Acceptance environment setup | Pass | Key verified simulation-only; bundle committed (`94fcb1b`); acceptance repo + config + workflow + secrets created |
| CP-025 | Confirmed payout (SC-001) | Pass | PR #1 merged -> tx `0x4c2e...dddb0` (5 USDC), execution `mn7vnwz2rednekykkww8d`, on-chain Transfer verified |
| CP-025 | Replay no-second-tx (SC-002) | Pass | Re-run produced no new tx; wallet 40 USDC; receipt unchanged |
| CP-025 | Blocked refusal (SC-003) | Pass | PR #2 (missing label) -> `broadcastMade: false`, no execution id, no comment, no broadcast |
| CP-025 | Backup transaction | Pass | PR #3 merged -> tx `0xdfdb...03c9` (10 USDC), execution `qyq992ip9zdrg24nfxj9u`, on-chain Transfer verified |

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

Begin Phase 4: public documentation and demo, release packaging (address the Node 20 deprecation warning before release — migrate the action `runs.using` if required), make the acceptance repository public or document it, prepare the demo video and DoraHacks submission (deadline 2026-08-13 10:00) with the Phase 3 evidence, and run the full release preflight (audit, secret scan, bundle-diff, logged-out link checks).

## Checkpoint and Amendment Contract

The future executor must append a `CP-[number]` entry after setup, each phase, schema/migration change, major architecture decision, external integration, security-sensitive change, failed attempt, review, test run, blocker, deployment preparation, and every work session. Each entry must include status, date, agent, phase, objective, work completed, changed files/assets, checks, tests, acceptance criteria, decisions, deviations, risks, known issues, blockers, and one next exact action.

After execution begins, plan changes require an `AMD-[number]` amendment stating the original plan, proposed change, evidence, reason, affected requirements/phases/tests/cost/risks, approval status, and the corresponding state entry. Minor implementation details belong only in this state file.
