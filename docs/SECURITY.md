# Security Model

## Trust Model

Trusted: repository maintainers, protected default branch, GitHub API state fetched after the event, configured wallet mappings, configured labels and limits, KeeperHub credential, and KeeperHub responses.

Untrusted: fork branches, contributor code, PR title/body/comments, changed files, head-branch configuration, user-supplied addresses/amounts, and arbitrary provider error text.

## Required Controls

- Use a trusted workflow with minimum permissions.
- Do not checkout or execute PR code in the settlement job.
- Fetch config from the default branch and current PR/check state through GitHub APIs.
- Resolve recipients and amounts only through maintainer mappings.
- Require policy approval and simulation success before broadcast.
- Hash the canonical request and require simulation/broadcast parity.
- Use a stable payment key and compare request hashes on replay.
- Resolve existing executions before any new broadcast.
- Make blocked/no-broadcast a first-class result.
- Redact secrets recursively in logs, errors, summaries, comments, fixtures, and evidence.
- Pin third-party workflow actions by commit SHA.

## Threat Cases

| Threat | Expected control |
|---|---|
| Contributor changes amount | Amount comes from trusted label mapping |
| Contributor changes wallet | Wallet comes from trusted maintainer mapping |
| Fork reaches secret-bearing job | Workflow/job boundary prevents secret access |
| Replayed merge event | Payment key and provider idempotency return original execution |
| Same key, changed request | Canonical hash conflict; manual review |
| Simulation passes, body mutates | Parity hash mismatch aborts broadcast |
| Provider 401/429/5xx | Typed safe failure; no secret leak or blind retry |
| Network loss after submission | Lookup original execution; no rebroadcast |
| Fake receipt comment | Structured marker and provider lookup must agree |

## Residual Risks

GitHub and KeeperHub availability, provider-side semantics, maintainer credential compromise, and lack of durable cumulative accounting remain operational risks. The MVP must disclose them rather than imply production treasury guarantees.

