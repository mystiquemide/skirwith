# Skirwith

**One verified merge. One policy-controlled KeeperHub payment. Signed proof.**

Skirwith is a GitHub Action on Ethereum Sepolia testnet. It turns an eligible
merged pull request into one policy-controlled USDC transfer through
KeeperHub. It refuses invalid payouts before broadcast and resolves replays
without sending a second transaction.

## Watch and verify

The public proof path is ready now. The demo recording will be published after
it is recorded against the final evaluated release. Until then, use the
[verification guide](docs/VERIFY.md) or start with:

- Confirmed PR: https://github.com/mystiquemide/skirwith-acceptance/pull/1
- Action run: https://github.com/mystiquemide/skirwith-acceptance/actions/runs/30886636409
- KeeperHub execution ID: `mn7vnwz2rednekykkww8d`
- Sepolia transaction:
  https://sepolia.etherscan.io/tx/0x4c2e25779a1bccd11db69dd68ba5aa25a5a164d3010e1a34001a55750c7dddb0
- Replay and refusal evidence: [the acceptance repository](https://github.com/mystiquemide/skirwith-acceptance)
- Live site: https://mystiquemide.github.io/skirwith/
- Existing recording plan: [docs/DEMO_VIDEO_PLAN.md](docs/DEMO_VIDEO_PLAN.md)

## Three-state proof

| State | Trigger | Observable result | Proof |
|---|---|---|---|
| Confirmed | Eligible merged PR | One 5 USDC Sepolia transfer | Run `30886636409`, execution `mn7vnwz2rednekykkww8d`, transaction `0x4c2e…dddb0` |
| Replay | Same event again | Existing receipt; zero new transactions | Same execution and hash, transaction count unchanged |
| Blocked | Required label absent | `broadcastMade: false`; no execution ID | Blocked run in the acceptance repository |

The acceptance repository
([mystiquemide/skirwith-acceptance](https://github.com/mystiquemide/skirwith-acceptance))
holds 7 on-chain-confirmed transactions, a replay with no second transaction,
and two refusal types. The historical transactions were controlled Sepolia
self-payments to the organization wallet. They prove the KeeperHub settlement
and safety path, not production contributor payroll.

## Why this is an agent

Skirwith is a deterministic policy settlement agent delivered as a GitHub
Action. It observes a merged pull request, reads trusted policy, decides
`approved`, `blocked`, `duplicate`, or `manual-review`, executes through
KeeperHub when allowed, and publishes signed proof. The decision layer is
rules-first by design. No model is claimed or required to authorize a payment.

## Why KeeperHub is essential

KeeperHub is the settlement layer, not a wrapper. Skirwith calls
`/api/execute/transfer` with `simulate: true` first, then broadcasts the same
parameters with an `Idempotency-Key`. It polls `/api/execute/{id}/status`.
When a broadcast confirms on-chain but the response is lost, the same
idempotency key recovers the original execution and never creates a second
transaction. A direct RPC substitute would not reproduce this exact
simulate-broadcast-recover path.

## How it works

1. Merged PR closes on GitHub.
2. The action reads fresh GitHub state and the trusted config from the default
   branch.
3. Policy picks the recipient and the amount from the config.
4. The action writes a signed reservation before any broadcast.
5. KeeperHub simulates the exact transfer.
6. The action broadcasts once.
7. The action posts a receipt comment with the transaction link.

## Security invariants

- PR code is never checked out in the secret-bearing job.
- Recipient and amount come only from protected default-branch configuration.
- A signed reservation must persist before any broadcast.
- Simulation and broadcast parameters must match exactly.
- Existing or uncertain execution state prevents a new broadcast.
- Receipt comments must authenticate before becoming authoritative.
- Legacy MergePay receipts remain authoritative (amendment
  [docs/AMD-001.md](docs/AMD-001.md)).
- Provider errors map to safe public messages.

See [docs/SECURITY.md](docs/SECURITY.md).

## Quickstart

Run the first test only with a funded testnet wallet and a controlled
recipient mapping.

Prerequisites:

- A repository that you control.
- A KeeperHub organization API key. Create it at app.keeperhub.com.
- A receipt signing secret stored as `SKIRWITH_RECEIPT_SECRET`.

Steps:

1. Add `.github/skirwith.yml` to the default branch.
2. Add `.github/workflows/settle.yml` (below), pinned to the release SHA.
3. Set the repository secrets `KEEPERHUB_API_KEY` and `SKIRWITH_RECEIPT_SECRET`.
4. Open a PR, add the labels the config requires, then merge it.

```yaml
# .github/skirwith.yml (default branch, trusted)
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
      - uses: mystiquemide/skirwith@dc705c96e5ff098edbaa9e42c19437cd2d2c8fc6
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          KEEPERHUB_API_KEY: ${{ secrets.KEEPERHUB_API_KEY }}
          SKIRWITH_RECEIPT_SECRET: ${{ secrets.SKIRWITH_RECEIPT_SECRET }}
```

You do not need a personal access token (PAT). GitHub Actions provides the
`GITHUB_TOKEN` automatically. The workflow never checks out or runs PR code.
Config rules live in [docs/CONFIGURATION.md](docs/CONFIGURATION.md).

## Outcome guide

| Outcome | Meaning | Broadcast state | Next step |
|---|---|---|---|
| Confirmed | Transfer completed | Sent once | Verify explorer link |
| Existing payment found | Matching receipt already exists | Not repeated | Use original proof |
| Stopped before broadcast | Policy failed | Not attempted | Correct trusted config or labels |
| Waiting for confirmation | Existing execution remains active | Not repeated | Check execution status |
| Manual review required | Outcome is uncertain or conflicting | Never automatically repeated | Review receipt and execution |
| Failed safely | No safe settlement completed | See evidence | Correct the cause before a controlled rerun |

Skirwith never rebroadcasts an uncertain outcome. Review the action summary
and existing receipt before taking another action.

## Evidence and limitations

Skirwith runs on Ethereum Sepolia testnet with one supported token, USDC
(`0x1c7d4b196cb0c7b01d743fbc6116a902379c7238`). Recipient and amount mappings
are maintainer-controlled. There is no daily-limit accounting and no automatic
recovery. All live transactions are testnet self-payments to the organization
wallet during testing; the workflow still validates the complete recipient
mapping and transfer path. Skirwith makes no mainnet claim.
KeeperHub availability, GitHub API state, wallet funding, and gas must hold
for settlement to complete.

## Reproduce locally

Requirements: Node 24, npm.

```bash
npm ci
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
npm run bundle:check
npm run verify:packaged
npm run test:coverage
```

Latest verification: 242 tests passed across 26 files, coverage reached 87.51%,
and the dependency audit reported zero high-severity vulnerabilities. GitHub CI
runs the same checks under the declared Node 24 runtime.

Behavior is test-driven. Domain logic stays pure. Provider and GitHub calls
sit behind injected interfaces.

## Repository map

- `src/policy`: pure decision logic and reason codes.
- `src/payment`: canonical request, hash, and payment key.
- `src/keeperhub`: typed KeeperHub provider client.
- `src/github`: GitHub API adapter, state, and receipt store.
- `src/execution`: settlement orchestrator.
- `src/evidence`: signed receipt markers and verification.
- `src/output`: action summary, receipt comment, and outcome copy.
- `docs/`: architecture, security, configuration, test strategy, and proof
  verification guides.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## License and release

MIT (see [LICENSE](LICENSE)). Release tag `v0.1.2` points to commit
`dc705c96e5ff098edbaa9e42c19437cd2d2c8fc6`. The final submission release will
be created after the recorded demo is checked against the evaluated revision.
