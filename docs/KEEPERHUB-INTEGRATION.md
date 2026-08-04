# KeeperHub Integration Plan

This document remains provisional until live KeeperHub access is restored. Observed provider behavior must override placeholders.

## Discovery

Record the supported chains, execution wallet, balances, organization limits, token contracts, transfer operation, simulation response, execution response, status states, explorer-link format, rate limits, and polling hints.

## Headless Flow

1. Authenticate using `KEEPERHUB_API_KEY` in the trusted job.
2. Select the single verified testnet and token.
3. Build the canonical transfer request.
4. Simulate the exact body.
5. Require a successful simulation with no revert indication.
6. Broadcast the unchanged body with `Idempotency-Key: <paymentKey>`.
7. Poll the returned execution ID, honoring bounded provider interval hints.
8. Capture terminal status, transaction hash, transaction link, and provider evidence.

## Provider Boundary

The client hides HTTP details behind typed methods:

- `discoverChains()`
- `simulateTransfer(parameters)`
- `broadcastTransfer(parameters, paymentKey)`
- `getExecution(executionId)`
- `waitForTerminal(executionId)`

Transport errors are mapped to stable codes and redacted safe messages. Raw responses are never emitted to logs.

## Implemented Contract (CP-012)

The provider layer is implemented against the Phase 0 observed contract with an injectable transport, validated JSON decoding, and typed error mapping:

- POST `/api/execute/transfer` with `simulate: true` returns `{ wouldRevert, ... }`; simulation is a business outcome, not an exception.
- Broadcast adds `Idempotency-Key: <paymentKey>` and omits the `simulate` flag; `409` responses are classified as `idempotency_conflict` or `idempotency_in_progress`.
- `401` maps to `PROVIDER_AUTH_FAILED`, `403` to `PROVIDER_FORBIDDEN`, `429` to `PROVIDER_RATE_LIMITED` (with `retry-after` in milliseconds), other failures to method-specific codes.
- GET `/api/execute/{id}/status` reads the `X-Poll-Interval-Hint` header; polling honors the hint clamped to configured bounds and stops at a terminal status or zero hint, failing with `PROVIDER_POLL_TIMEOUT` after a deadline.
- Simulation-to-broadcast parity is enforced by comparing the exact serialized transfer parameters; any mismatch aborts with `EXECUTION_PARITY_MISMATCH`.

Assumptions pending live confirmation: the poll hint is treated as seconds, the recipient is sent as the normalized lowercase address (no EIP-55 mixed-case conversion), and simulation success is any 2xx. Adjust these only with live evidence.

## Smoke-Test Order

Simulation-only first; then minimal native-token transfer if needed; then minimal stablecoin transfer; then final Skirwith payout. Preserve at least two confirmed transactions as backup evidence.

## Claims Boundary

Do not claim MCP execution, gas sponsorship, private routing, x402, MPP, mainnet readiness, or token support until the exact Skirwith path visibly demonstrates it.

