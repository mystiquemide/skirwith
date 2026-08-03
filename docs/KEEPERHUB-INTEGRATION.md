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

The client must hide HTTP details behind typed methods:

- `discoverCapabilities()`
- `simulateTransfer(request)`
- `broadcastTransfer(request, paymentKey)`
- `getExecution(executionId)`
- `waitForTerminal(executionId)`

Transport errors are mapped to stable codes and redacted safe messages. Raw responses are never emitted to logs.

## Smoke-Test Order

Simulation-only first; then minimal native-token transfer if needed; then minimal stablecoin transfer; then final MergePay payout. Preserve at least two confirmed transactions as backup evidence.

## Claims Boundary

Do not claim MCP execution, gas sponsorship, private routing, x402, MPP, mainnet readiness, or token support until the exact MergePay path visibly demonstrates it.

