# Test Strategy

## Test Layers

1. Pure unit tests: config, event normalization, policy, decimal amounts, canonical serialization, payment keys, reason codes, redaction.
2. Contract tests: GitHub API adapters, KeeperHub transport decoders, polling hints, error mapping.
3. State-machine tests: duplicate resolution, uncertain submission, terminal states, receipt integrity.
4. Action integration tests: saved GitHub event fixtures through the action entrypoint with fake APIs/provider.
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
- Secrets never appear in public output.
- Receipt, evidence, execution ID, and transaction proof agree.

## Quality Gates

`npm run format`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, dependency audit, secret scan, and generated-bundle verification must pass before merge.

