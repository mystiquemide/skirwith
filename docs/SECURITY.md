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
- Derive the payment key from the stable payment identity (repository, PR, merge SHA, purpose), independent of material content, and compare the canonical request hash on replay: same key plus same hash is a duplicate; same key plus changed hash is a conflict for manual review.
- Resolve existing executions before any new broadcast.
- Make blocked/no-broadcast a first-class result.
- Write a durable pending reservation before any broadcast and never broadcast unless it persists; on any uncertain post-submission outcome, preserve the execution id as manual review so a later run resolves the existing record and never rebroadcasts across invocations.
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
| Forged receipt comment | Receipt markers are HMAC-signed with a dedicated secret unavailable to commenters; forged or unsigned markers fail closed and never suppress a payout, and the write path only updates markers the action can authenticate as its own |
| Receipt key rotation | Receipt signing uses a dedicated versioned secret independent of the KeeperHub broadcast key; rotating the provider key does not invalidate receipts, and the previous signing key is accepted for verification during rotation |
| Simulation passes, body mutates | Parity hash mismatch aborts broadcast |
| Provider 401/429/5xx | Typed safe failure; no secret leak or blind retry |
| Network loss after submission | Lookup original execution; no rebroadcast |
| Fake receipt comment | Structured marker and provider lookup must agree |

## Trusted Workflow

The example consumer workflow (`docs/examples/mergepay-workflow.yml`) runs on `pull_request` closed events, never `pull_request_target`, so PR head code is never checked out or executed. It pins the action reference to a release commit SHA, uses minimum permissions (contents read, checks read, pull-requests write), and serializes runs per PR with `concurrency` and `cancel-in-progress: false`. The trusted `.github/mergepay.yml` config is fetched through the GitHub API at the default-branch ref; contributor-controlled content cannot alter policy, recipient, amount, chain, or token.

## Residual Risks

GitHub and KeeperHub availability, provider-side semantics, maintainer credential compromise, and lack of durable cumulative accounting remain operational risks. The MVP must disclose them rather than imply production treasury guarantees.

