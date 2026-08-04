# Verify Skirwith in Five Minutes

Every core claim maps to a public artifact. Follow the steps in order. No
credentials are required.

## 1. Verify a confirmed payment

- Acceptance PR: https://github.com/mystiquemide/skirwith-acceptance/pull/1
- GitHub Actions run: visible on the PR's checks tab
- KeeperHub execution ID: `mn7vnwz2rednekykkww8d`
- Sepolia transaction: https://sepolia.etherscan.io/tx/0x4c2e25779a1bccd11db69dd68ba5aa25a5a164d3010e1a34001a55750c7dddb0

Expected: the transaction exists on-chain, transfers USDC, and the amount
matches the PR's configured payout.

## 2. Verify replay suppression

- Replay evidence: https://github.com/mystiquemide/skirwith-acceptance
- Replay the same merged event against the same PR.

Expected: the action resolves the existing receipt, reports
`Existing payment found`, and makes zero broadcasts. The wallet balance and
transfer count do not change.

## 3. Verify refusal before broadcast

- Refusal evidence: the blocked workflow outcomes in the acceptance repository.

Expected: policy failures (for example a missing required label) stop the run
with `broadcastMade: false` and no provider call.

## 4. Verify uncertain-response handling

- PRs #4, #6, and #7 in `mystiquemide/skirwith-acceptance` show a broadcast
  that confirmed on-chain when the provider response was lost.

Expected: the action recovered each execution ID via KeeperHub idempotent
replay, created no new transaction, and never rebroadcast.

## 5. Verify the tagged source and bundle

- Release tag: `v0.1.1` → commit `0f821cf4bade597f23cd594be222b4d59a3b33f7`
- Repository: https://github.com/mystiquemide/skirwith

Expected: the tag points to the commit the docs pin; `dist/index.js` at that
commit matches a clean rebuild; 235 tests pass under Node 24.

## 6. Limitations

- The README lists testnet-only status, one-chain/one-token scope,
  maintainer-controlled mappings, and self-payment disclosure.

## Recovery

If a run does not settle, check the action summary and existing receipt before
re-running.
