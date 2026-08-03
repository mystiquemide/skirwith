# Configuration Contract

The trusted file is `.github/mergepay.yml` on the default branch. It is never loaded from the pull-request head.

```yaml
version: 1
repository: owner/name
chain:
  id: 11155111
  explorer: https://sepolia.etherscan.io
  token:
    address: "0x0000000000000000000000000000000000000000"
    symbol: USDC
    decimals: 6
payout:
  requiredLabel: mergepay-approved
  maximum: "25"
  amounts:
    mergepay-5: "5"
    mergepay-10: "10"
recipients:
  contributor-login: "0x0000000000000000000000000000000000000000"
checks:
  required: true
  names:
    - CI / test
```

## Rules

- `version` must be supported.
- `repository` must match the event repository.
- `chain.id`, token address, symbol, and decimals are allowlisted values selected from live KeeperHub verification.
- `requiredLabel` must be present on the current merged PR.
- Only configured labels select a fixed amount.
- `maximum` and every amount are nonnegative decimal strings with bounded precision.
- `recipients` is maintainer-controlled; wallet addresses from PR text are ignored.
- Required checks, when enabled, must pass for the exact merge SHA.
- Daily cumulative limits are intentionally absent in v0.1.

## Secrets

`KEEPERHUB_API_KEY` exists only as a masked repository or organization secret on the trusted settlement workflow. It must never be written to this file, fixtures, logs, comments, screenshots, or documentation.

