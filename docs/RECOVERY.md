# Skirwith Recovery Guide

Skirwith never retries an uncertain payment automatically. This guide maps each
possible run outcome to what happened, whether a broadcast occurred, and the
safe next step. The action summary and the PR receipt comment use the same
status language.

## Outcome states

### Stopped before broadcast (blocked)

- What happened: Policy stopped the run before KeeperHub was asked to transfer
  anything.
- Broadcast: Not attempted.
- What to verify: The run reasons list. Common causes are a missing required
  label, a repository outside the trusted config, or a failed required check.
- What not to do: Do not add the label and re-run the same closed event without
  checking the reason; the merged event is already consumed.
- Safe next step: Fix the config or the event, then merge a new PR (or trigger
  a fresh closed event).

### Waiting for confirmation (pending)

- What happened: A transfer was submitted but its terminal state is not
  confirmed yet.
- Broadcast: Outcome uncertain.
- What to verify: The execution ID in KeeperHub and the receipt comment.
- What not to do: Do not re-run the workflow. A second run would resolve the
  existing execution, not send another payment.
- Safe next step: Check the execution status. If it completed, the receipt is
  updated to confirmed on the next run.

### Manual review required (manual-review)

- What happened: A prior execution has an uncertain or conflicting outcome, or
  a submitted transfer could not be confirmed.
- Broadcast: Outcome uncertain.
- What to verify: The recorded execution ID, the receipt, and the on-chain
  transaction if one exists.
- What not to do: Do not broadcast again automatically. Skirwith never does.
- Safe next step: Review the evidence, reconcile the outcome manually, and only
  then decide whether any action is needed.

### Existing payment found (duplicate)

- What happened: A prior execution already covers this payment.
- Broadcast: Not repeated.
- What to verify: The original receipt and transaction link.
- What not to do: Do not send another transfer.
- Safe next step: No action needed.

### Failed safely (failed)

- What happened: The run failed before any transfer was submitted, or a
  submitted transfer reached a failed terminal state.
- Broadcast: Not attempted (or the failed transfer was sent once).
- What to verify: The error code. Common causes are a reverting simulation,
  failed authentication, a rate limit, or an invalid provider response.
- What not to do: Do not re-run blindly; check whether a receipt already exists
  for the payment key first.
- Safe next step: Fix the reported cause, confirm no prior receipt exists, then
  merge a new PR.

## Configuration and environment problems

### Missing configuration or secret

- What happened: The default-branch config is invalid or a required secret is
  not set.
- Broadcast: Not attempted.
- What to verify: `.github/skirwith.yml` on the default branch and the repo
  secrets `KEEPERHUB_API_KEY` and `SKIRWITH_RECEIPT_SECRET`.
- Safe next step: Fix the config against `docs/CONFIGURATION.md`, set the
  secrets, then trigger a fresh event.

### Provider unavailable or funding shortfall

- What happened: KeeperHub is unavailable, the organization wallet lacks testnet
  USDC or gas, or a spending cap was hit.
- Broadcast: Not attempted.
- What to verify: The error code and the wallet balance on Sepolia.
- Safe next step: Fund the wallet, wait out any rate limit, then merge a new PR.

## Live uncertain-response examples

PRs #4, #6, and #7 in `mystiquemide/skirwith-acceptance` are real cases where
the broadcast confirmed on-chain but the KeeperHub response did not reach the
action. Each was recovered by idempotent replay and posted a reconciliation
note, with no second transaction. See `docs/PHASE3-EVIDENCE.md`.

## Where to look

- Action summary: run page, `Skirwith settlement` job.
- Receipt comment: the PR comment containing the signed marker.
- Transaction: Sepolia explorer link in the receipt or summary.
- Execution: KeeperHub dashboard using the recorded execution ID.
