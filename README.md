# Skirwith

Skirwith is a GitHub Action. It pays an approved contributor after a merged
pull request. It uses KeeperHub on Ethereum Sepolia. Policy controls the
payout. Replays never pay twice. Refusals happen before any broadcast.

## What it does

- A merged pull request (PR) triggers the action.
- The action reads fresh state from GitHub and the trusted config from the
  default branch.
- Policy picks the recipient and the amount from the config.
- The action writes a signed reservation before any broadcast.
- KeeperHub simulates the transfer, then broadcasts it once.
- The action posts a receipt comment with the transaction link.

Recipient and amount come only from the config. Contributor text, code, and
head-branch config are never trusted.

## Who it is for

- Maintainers who want to pay approved contributors automatically.
- Reviewers and judges who want to verify the three states: one confirmed
  payout, replay with no second transaction, and refusal before broadcast.

## Live proof

The acceptance repository holds 7 confirmed on-chain transactions, one
replay with no second transaction, and two refusal types. Each transaction
is verified by the USDC Transfer event on Sepolia. See
[docs/PHASE3-EVIDENCE.md](docs/PHASE3-EVIDENCE.md) and the
[live site](https://mystiquemide.github.io/skirwith/).

## Quickstart

Prerequisites:

- A repository that you control.
- A KeeperHub organization API key. Create it at app.keeperhub.com.
- A receipt signing secret. Use any long random string.

Steps:

1. Add the config file `.github/skirwith.yml` to the default branch.
2. Add the workflow file `.github/workflows/settle.yml`.
3. Set the repository secrets `KEEPERHUB_API_KEY` and
   `MERGE_PAY_RECEIPT_SECRET`.
4. Open a PR and add the labels that the config requires.
5. Merge the PR.

Expected result:

The action runs after the merge. It posts a receipt comment on the PR. The
comment shows the transaction hash and the explorer link. The transaction
appears on Sepolia.

You do not need a personal access token (PAT). GitHub Actions provides the
`GITHUB_TOKEN` automatically.

## Installation

Add the workflow to your repository. Pin the action to a release SHA.

```yaml
# .github/workflows/settle.yml
on:
  pull_request:
    types: [closed]
permissions:
  contents: read
  checks: read
  pull-requests: write
concurrency:
  group: skirwith-${{ github.event.pull_request.number }}
  cancel-in-progress: false
jobs:
  settle:
    if: github.event.pull_request.merged == true
    runs-on: ubuntu-latest
    steps:
      - uses: mystiquemide/skirwith@<release-sha>
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          KEEPERHUB_API_KEY: ${{ secrets.KEEPERHUB_API_KEY }}
          MERGE_PAY_RECEIPT_SECRET: ${{ secrets.MERGE_PAY_RECEIPT_SECRET }}
```

The workflow never checks out or runs PR code.

## Configuration

Add `.github/skirwith.yml` to the default branch.

```yaml
version: 1
repository: owner/name
chain:
  id: 11155111
  explorer: https://sepolia.etherscan.io
  token:
    address: "0x1c7d4b196cb0c7b01d743fbc6116a902379c7238"
    symbol: USDC
    decimals: 6
payout:
  requiredLabel: skirwith-approved
  maximum: "25"
  amounts:
    skirwith-5: "5"
recipients:
  contributor-login: "0x…"
checks:
  required: false
  names: []
```

Rules:

- `repository` must match the repository that runs the workflow.
- `chain` values are the allowlist from live KeeperHub verification.
- `requiredLabel` must be on the merged PR.
- Only configured labels select an amount.
- Amounts and `maximum` are decimal strings. Their fractional digits must
  not exceed the token decimals.
- `recipients` maps GitHub logins to payout wallets.

See [docs/CONFIGURATION.md](docs/CONFIGURATION.md).

## Usage

Open a PR, add the `skirwith-approved` label and one amount label, then merge
it. The action pays the amount to the mapped wallet.

The action supports these outcomes:

- confirmed: one transaction exists for the payment key.
- duplicate: a replay resolved an existing confirmed transaction.
- blocked: policy refused before any broadcast.
- manual-review: the outcome was uncertain. The action never rebroadcasts.

## Examples

The three states are proven with real transactions. See the
[acceptance repository](https://github.com/mystiquemide/skirwith-acceptance).

## Architecture

- `src/policy`: pure decision logic and reason codes.
- `src/payment`: canonical request, hash, and payment key.
- `src/keeperhub`: typed provider client.
- `src/github`: GitHub API adapter, state, and receipt store.
- `src/execution`: settlement orchestrator.
- `src/evidence`: signed receipt markers.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Safety design

- Recipient and amount come only from the config.
- A signed reservation is written before any broadcast. No broadcast without
  a reservation.
- Simulation and broadcast use the same transfer parameters.
- Replays resolve the existing receipt. They never broadcast twice.
- Uncertain outcomes become manual review. The action never rebroadcasts.
- Receipt markers use an HMAC signature with a dedicated key. A forged
  comment cannot suppress a payout.

See [docs/SECURITY.md](docs/SECURITY.md).

## Troubleshooting

- The receipt stays pending and the broadcast confirmed on-chain. The
  KeeperHub response did not reach the action. Re-run the action. It resolves
  to manual review and does not rebroadcast. Recover the execution id with
  KeeperHub idempotent replay.
- The run reports a blocked outcome. Check the labels and the required label
  in the config.
- The run reports a config error. Check the config against
  [docs/CONFIGURATION.md](docs/CONFIGURATION.md).

## Development

Requirements: Node 20 or 22, npm.

```bash
npm install
npm run typecheck
npm run lint
npm test
npm run build
npm run verify:packaged
```

Behavior is test-driven. Domain logic stays pure. Provider and GitHub calls
sit behind injected interfaces.

## License

MIT.
