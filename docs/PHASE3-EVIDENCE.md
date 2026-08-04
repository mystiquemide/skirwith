# Phase 3 Evidence — Live Three-State Acceptance

Date: 2026-08-04 (Africa/Lagos)
Network: Ethereum Sepolia (testnet), chain `11155111`, USDC `0x1c7d4b196cb0c7b01d743fbc6116a902379c7238` (6 decimals).
Execution wallet / configured recipient: `0x05619d1a133623b322a8f366ea9594e4e586f26d` (org wallet; acceptance config maps the contributor to the org wallet, so payouts are self-payments — net-zero USDC, allowance consumed; fully provable on-chain).
Action reference: `mystiquemide/mergepay@94fcb1ba69c624ea98f9f28eca8c7db4d73511d8`.
Acceptance repository: `mystiquemide/mergepay-acceptance` (private at time of run).

All transactions are real KeeperHub executions verified via the Sepolia RPC (`eth_getTransactionReceipt` + USDC `Transfer` logs). No mocks.

## 1. Confirmed payout (SC-001)

- PR: [mystiquemide/mergepay-acceptance#1](https://github.com/mystiquemide/mergepay-acceptance/pull/1) (labels `skirwith-approved`, `skirwith-5`)
- Action run: [30886636409](https://github.com/mystiquemide/mergepay-acceptance/actions/runs/30886636409) — success
- KeeperHub execution id: `mn7vnwz2rednekykkww8d`
- Transaction: [`0x4c2e25779a1bccd11db69dd68ba5aa25a5a164d3010e1a34001a55750c7dddb0`](https://sepolia.etherscan.io/tx/0x4c2e25779a1bccd11db69dd68ba5aa25a5a164d3010e1a34001a55750c7dddb0)
- On-chain: status `0x1`; USDC `Transfer` event of `5000000` (5 USDC) at the USDC contract; value `0x4c4b40` in the relayer input
- Receipt comment: `Status: confirmed` with payment key `mergepay:1892a75931959e8f7895aaff1fdca962392e82c5274cb5d289b6fdd16ebd2ef3`

## 2. Replay — no second transaction (SC-002)

- Re-ran the same action run (`30886636409`); the run completed success again
- Result: no new transaction; org wallet USDC balance unchanged at `40.0`; the single receipt comment still references the original execution `mn7vnwz2rednekykkww8d` and hash `0x4c2e...dddb0`
- Confirms duplicate suppression and no automatic rebroadcast

## 3. Blocked refusal before broadcast (SC-003)

- PR: [mystiquemide/mergepay-acceptance#2](https://github.com/mystiquemide/mergepay-acceptance/pull/2) (no `skirwith-approved` label)
- Action run: [30886951542](https://github.com/mystiquemide/mergepay-acceptance/actions/runs/30886951542) — success (blocked outcome)
- Result: zero receipt comments on PR #2, no execution id, `broadcastMade: false`; org wallet USDC unchanged at `40.0`
- Confirms policy refusal blocks before any provider call

## 4. Backup confirmed transaction

- PR: [mystiquemide/mergepay-acceptance#3](https://github.com/mystiquemide/mergepay-acceptance/pull/3) (labels `skirwith-approved`, `skirwith-10`)
- Action run: [30887061343](https://github.com/mystiquemide/mergepay-acceptance/actions/runs/30887061343) — success
- KeeperHub execution id: `qyq992ip9zdrg24nfxj9u`
- Transaction: [`0xdfdb1cf0b77894560f78a77bb11f1b19a53caaa73154db2de1704f91b9fd03c9`](https://sepolia.etherscan.io/tx/0xdfdb1cf0b77894560f78a77bb11f1b19a53caaa73154db2de1704f91b9fd03c9)
- On-chain: status `0x1`; USDC `Transfer` event of `10000000` (10 USDC)
- Receipt comment: `Status: confirmed`

## Extended live evidence

Additional confirmed transactions (all verified on-chain via the USDC `Transfer` logs, status `0x1`; all self-payments to the org wallet, so the 40 USDC balance is unchanged):

| PR | Payout | Transaction | Execution id | Receipt |
|---|---|---|---|---|
| [#4](https://github.com/mystiquemide/mergepay-acceptance/pull/4) | 5 USDC | [`0x263243b9176efa2bd78257a58431d3b82650643c2c93ff45dd3a012d37e23be8`](https://sepolia.etherscan.io/tx/0x263243b9176efa2bd78257a58431d3b82650643c2c93ff45dd3a012d37e23be8) | `qkj8rpvjvyy2pol3t1ijp` (recovered) | pending* |
| [#6](https://github.com/mystiquemide/mergepay-acceptance/pull/6) | 5 USDC | [`0xea6465927ce9e7ba250bdeb69ac7ec1213855f6a0cfbf176df97a83a2f1c5bbe`](https://sepolia.etherscan.io/tx/0xea6465927ce9e7ba250bdeb69ac7ec1213855f6a0cfbf176df97a83a2f1c5bbe) | `4v4izi4r6mnemj22k8mo0` (recovered) | pending* |
| [#7](https://github.com/mystiquemide/mergepay-acceptance/pull/7) | 5 USDC | [`0x1ff7aaa5b12c0a85a0630b4d761641acbe0a820b89ffe2af9309151940394f3d`](https://sepolia.etherscan.io/tx/0x1ff7aaa5b12c0a85a0630b4d761641acbe0a820b89ffe2af9309151940394f3d) | `x8qkxpq83p72ee7ixsub1` (recovered) | pending* |
| [#8](https://github.com/mystiquemide/mergepay-acceptance/pull/8) | 5 USDC | [`0x9870e65d9f82697ec010d56b4e006d87870c33b8998935b4a0574eb020cb021f`](https://sepolia.etherscan.io/tx/0x9870e65d9f82697ec010d56b4e006d87870c33b8998935b4a0574eb020cb021f) | `do4e7jj9ypabbnvxcljir` | confirmed |
| [#9](https://github.com/mystiquemide/mergepay-acceptance/pull/9) | 5 USDC | [`0x3513e7c91987c6d9db4a1b87048392a956143c9879620486c75721a74e2a5027`](https://sepolia.etherscan.io/tx/0x3513e7c91987c6d9db4a1b87048392a956143c9879620486c75721a74e2a5027) | `bhzf8rrfkps5f7v8147ik` | confirmed |

Second refusal type (ambiguous payout labels `skirwith-5` + `skirwith-10`):
- PR: [#5](https://github.com/mystiquemide/mergepay-acceptance/pull/5), run `30888126456` — success, zero receipt comments, no broadcast (blocked-ambiguous-payout).

Uncertain-response note: for PRs #4, #6, and #7 the KeeperHub broadcast confirmed on-chain but the provider response to the action was not recorded, so the action resolved to manual review with the durable pending reservation intact (broadcast already made). Re-running each resolved to manual review with no second broadcast and no simulation — a live demonstration of the cross-run no-rebroadcast safety invariant. The execution ids were recovered authoritatively via KeeperHub idempotent replay (`POST /api/execute/transfer` with the same Idempotency-Key and body returned `status: completed` with `idempotentReplay: true` and the matching transaction hash; no new transaction was created — verified by an unchanged on-chain transfer count). A maintainer reconciliation note referencing each execution id and transaction was posted on the PRs. The GitHub receipt comments remain `pending` by design because the action never received the execution id.

## Cross-checks

- Receipt comments (GitHub) agree with the action outputs and the on-chain transactions for status, amount, chain, token, recipient, and identifiers on the fully-confirmed runs (PRs #1, #3, #8); PRs #4/#6/#7 are verified on-chain with receipts that remain `pending` because the broadcast response was not delivered (documented above).
- Seven confirmed KeeperHub transactions preserved as evidence (5+10+5+5+5+5+5 USDC, all self-payments; org wallet balance unchanged at 40 USDC).
- Testnet only; no production/mainnet claim is made.
