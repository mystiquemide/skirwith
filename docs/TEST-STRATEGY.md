# Test Strategy

## Test Layers

1. Pure unit tests: config, event normalization, policy, decimal amounts, atomic conversion, canonical serialization, payment keys, reason codes, redaction, transfer-parameter parity, receipt marker encoding, and duplicate/conflict resolution.
2. Contract tests: GitHub API adapters, KeeperHub transport decoders, simulation, broadcast, execution lookup, polling hints, error mapping, and a deterministic fake provider.
3. State-machine tests: duplicate resolution, uncertain submission, terminal states, receipt integrity, and orchestrator outcome mapping (blocked, failed, confirmed, duplicate, manual-review).
4. Action integration tests: saved GitHub event fixtures through the action entrypoint with fake APIs/provider, covering summary/receipt rendering, action outputs, and comment create-or-update.
5. Security fixtures: fork event, altered config, spoofed wallet, contributor amount, secret leakage, changed idempotency body.
6. Live acceptance: one real success, one replay, one refusal, plus an independent backup success.

## Required Invariants

- Blocked policy means zero provider broadcast calls.
- Simulation and broadcast request hashes are identical.
- A confirmed payment key never creates a second execution.
- Changed request content under an existing key never broadcasts; it becomes a conflict.
- The payment key is stable across material content changes for the same payment identity.
- Amounts and maximums convert to atomic integer units with fractional precision bounded by token decimals; over-cap values never pass.
- Canonical request construction rejects malformed values (addresses, merge SHA, atomic amount, identifiers).
- Receipt markers are HMAC-signed with a dedicated versioned key; forged, tampered, unknown-key, or differently-signed markers are ignored and never suppress a payout, and the write path never updates a forged squatter.
- Post-broadcast receipt-persistence failure preserves the execution id as manual review and never rebroadcasts.
- Secrets never appear in public output.
- Receipt, evidence, execution ID, and transaction proof agree.

## Quality Gates

`npm run format`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, dependency audit, secret scan, and generated-bundle verification must pass before merge.

