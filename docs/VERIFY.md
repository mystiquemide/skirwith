# Verify Skirwith in Five Minutes

Every core claim maps to a public artifact. Follow the steps in order. No
credentials are required.

## 1. Verify a confirmed KeeperHub payment

- Acceptance PR: https://github.com/mystiquemide/skirwith-acceptance/pull/1
- Action run: https://github.com/mystiquemide/skirwith-acceptance/actions/runs/30886636409
- KeeperHub execution ID: `mn7vnwz2rednekykkww8d`
- Sepolia transaction: https://sepolia.etherscan.io/tx/0x4c2e25779a1bccd11db69dd68ba5aa25a5a164d3010e1a34001a55750c7dddb0

Expected: the transaction exists on-chain, transfers USDC, and the amount
matches the trusted payout configuration.

## 2. Verify replay suppression

- Acceptance repository: https://github.com/mystiquemide/skirwith-acceptance
- Historical replay evidence is preserved in the acceptance PR and receipt
  artifacts.

Expected: the action resolves the existing receipt, reports `Existing payment
found`, and makes zero broadcasts. The wallet balance and transfer count do not
change.

## 3. Verify refusal before broadcast

- Missing-label fixture: https://github.com/mystiquemide/skirwith-acceptance/blob/main/refusal-demo.txt
- Ambiguous-policy fixture: https://github.com/mystiquemide/skirwith-acceptance/blob/main/ambiguous-demo.txt

Expected: policy failures stop the run with `broadcastMade: false` and no
KeeperHub broadcast.

## 4. Verify uncertain-response handling

- PR #4: https://github.com/mystiquemide/skirwith-acceptance/pull/4
- PR #6: https://github.com/mystiquemide/skirwith-acceptance/pull/6
- PR #7: https://github.com/mystiquemide/skirwith-acceptance/pull/7

Expected: a broadcast that confirmed on-chain while the provider response was
lost is recovered through KeeperHub idempotency. No new transaction is created
and the action never rebroadcasts.

## 5. Verify the tagged source and bundle

- Release tag: `v0.1.2` → commit `dc705c96e5ff098edbaa9e42c19437cd2d2c8fc6`
- Repository: https://github.com/mystiquemide/skirwith
- Latest CI: https://github.com/mystiquemide/skirwith/actions/runs/30911609627

Expected: the pinned release contains the committed action bundle. The latest
CI verifies the current source under the declared Node 24 runtime.

## 6. Demo status

The existing recording plan is in
[`docs/DEMO_VIDEO_PLAN.md`](DEMO_VIDEO_PLAN.md). Publish the final recording
against the final evaluated release before submitting the BUIDL.

## 7. Limitations

- Ethereum Sepolia testnet only.
- One token: USDC.
- Recipient and amount mappings are maintainer-controlled.
- Live transactions are controlled testnet self-payments to the organization
  wallet during testing.
- KeeperHub availability, GitHub API state, wallet funding, and gas must hold
  for settlement to complete.

## Recovery

If a run does not settle, check the action summary and existing receipt before
re-running. An uncertain outcome is manual review, never an automatic
rebroadcast.
