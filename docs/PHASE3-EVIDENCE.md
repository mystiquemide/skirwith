# Phase 3 Evidence — Live Three-State Acceptance

Date: 2026-08-04 (Africa/Lagos)
Network: Ethereum Sepolia (testnet), chain `11155111`, USDC `0x1c7d4b196cb0c7b01d743fbc6116a902379c7238` (6 decimals).
Execution wallet / configured recipient: `0x05619d1a133623b322a8f366ea9594e4e586f26d` (org wallet; acceptance config maps the contributor to the org wallet, so payouts are self-payments — net-zero USDC, allowance consumed; fully provable on-chain).
Action reference: `mystiquemide/mergepay@94fcb1ba69c624ea98f9f28eca8c7db4d73511d8`.
Acceptance repository: `mystiquemide/mergepay-acceptance` (private at time of run).

All transactions are real KeeperHub executions verified via the Sepolia RPC (`eth_getTransactionReceipt` + USDC `Transfer` logs). No mocks.

## 1. Confirmed payout (SC-001)

- PR: [mystiquemide/mergepay-acceptance#1](https://github.com/mystiquemide/mergepay-acceptance/pull/1) (labels `mergepay-approved`, `mergepay-5`)
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

- PR: [mystiquemide/mergepay-acceptance#2](https://github.com/mystiquemide/mergepay-acceptance/pull/2) (no `mergepay-approved` label)
- Action run: [30886951542](https://github.com/mystiquemide/mergepay-acceptance/actions/runs/30886951542) — success (blocked outcome)
- Result: zero receipt comments on PR #2, no execution id, `broadcastMade: false`; org wallet USDC unchanged at `40.0`
- Confirms policy refusal blocks before any provider call

## 4. Backup confirmed transaction

- PR: [mystiquemide/mergepay-acceptance#3](https://github.com/mystiquemide/mergepay-acceptance/pull/3) (labels `mergepay-approved`, `mergepay-10`)
- Action run: [30887061343](https://github.com/mystiquemide/mergepay-acceptance/actions/runs/30887061343) — success
- KeeperHub execution id: `qyq992ip9zdrg24nfxj9u`
- Transaction: [`0xdfdb1cf0b77894560f78a77bb11f1b19a53caaa73154db2de1704f91b9fd03c9`](https://sepolia.etherscan.io/tx/0xdfdb1cf0b77894560f78a77bb11f1b19a53caaa73154db2de1704f91b9fd03c9)
- On-chain: status `0x1`; USDC `Transfer` event of `10000000` (10 USDC)
- Receipt comment: `Status: confirmed`

## Cross-checks

- Receipt comments (GitHub) agree with the action outputs and the on-chain transactions for status, amount, chain, token, recipient, and identifiers.
- Two confirmed KeeperHub transactions preserved as evidence.
- Testnet only; no production/mainnet claim is made.
