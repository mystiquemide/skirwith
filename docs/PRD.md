# Skirwith Product Requirements

## Product

Skirwith is a GitHub JavaScript Action that pays a maintainer-approved contributor after a pull request is merged. It verifies trusted GitHub state, evaluates deterministic repository policy, simulates the exact transfer, executes it through KeeperHub, polls to a terminal state, and posts evidence back to GitHub.

## Problem

A maintainer can accept work by merging a pull request, but settlement remains a separate manual wallet or treasury operation. That separation creates delay, duplicated work, recipient mistakes, replay risk, and weak audit evidence.

## Goal

Connect a trustworthy GitHub acceptance event to a bounded onchain payment while making approval, refusal, execution, and replay behavior independently verifiable.

## Users

- Repository maintainer: owns policy, labels, wallet mappings, secrets, and merge authority.
- Contributor: receives the configured payment after accepted work.
- Reviewer or judge: verifies policy, KeeperHub execution, transaction proof, duplicate suppression, and refusal evidence.

## Core User Story

As a maintainer, when I merge an eligible pull request, I want Skirwith to pay the configured contributor exactly once and leave a clear receipt, without allowing contributor-controlled code or text to choose the recipient, amount, asset, or chain.

## Functional Requirements

### Trigger and trust

- Accept only a `pull_request.closed` event whose PR is genuinely merged.
- Re-fetch current PR, labels, checks, repository, base branch, and merge SHA through GitHub APIs.
- Load payment configuration from the trusted default branch.
- Never check out or execute PR code in the secret-bearing job.

### Configuration

- Versioned YAML schema.
- One repository, chain, and token per configuration.
- Maintainer-controlled contributor wallet mapping.
- Maintainer-controlled label-to-fixed-amount mapping.
- Per-payment maximum.
- Optional required status checks.
- No daily limit in v0.1.

### Policy

- Deterministic pass/block result with stable reason codes.
- Validate repository, branch, merged state, checks, label, contributor, address, amount, maximum, chain, and token.
- Every blocked result explicitly states that no broadcast occurred.

### Payment identity

- Create a canonical request from repository, PR, merge SHA, recipient, atomic amount, token, chain, and purpose.
- Hash the canonical request.
- Derive a stable provider-safe payment key.
- Reject the same key if request content differs.

### KeeperHub

- Discover and verify the live supported chain, wallet, asset, and response contract before freezing configuration.
- Simulate before broadcast.
- Broadcast the exact simulated request with the payment key as idempotency identity.
- Poll using bounded intervals and provider hints.
- Capture execution ID, terminal status, transaction hash, and explorer link.
- Never automatically rebroadcast an uncertain execution.

### Duplicate handling

- Locate an existing structured Skirwith receipt.
- Validate its payment key and request hash.
- Resume polling pending executions.
- Return the original confirmed execution for a replay.
- Send no second payment.
- Route conflicts or unprovable uncertain states to manual review.

### Output

- GitHub job summary for every outcome.
- One create-or-update PR receipt owned by Skirwith.
- Machine-readable action outputs.
- Versioned secret-free evidence record.

## Nonfunctional Requirements

- Security: no secret or authorization header in logs, errors, fixtures, summaries, or comments.
- Reliability: bounded network calls and polling; no blind retries.
- Auditability: every decision and execution transition has stable identifiers and timestamps.
- Reproducibility: clean install from lockfile; CI runs format, lint, typecheck, tests, build, audit, secret scan, and bundle check.
- Maintainability: pure domain logic, injected provider/GitHub boundaries, strict TypeScript, test-first implementation.
- Accessibility: documentation and optional site meet readable contrast, keyboard, semantic markup, and responsive-layout expectations.

## Success Criteria

1. A real merged PR produces one confirmed KeeperHub stablecoin transfer.
2. Replaying it produces the original result and no second transfer.
3. An over-limit or invalid payout is blocked before broadcast.
4. GitHub receipt, action run, KeeperHub execution, and explorer evidence agree.
5. Fork or contributor-controlled content cannot access the KeeperHub credential or alter policy inputs.
6. A clean checkout passes all quality gates.

## Out of Scope

- LLM decisions, natural-language payments, arbitrary PR-supplied wallets or amounts.
- Custom smart contract, multisig orchestration, DAO treasury, payroll, accounting, or tax reporting.
- Multi-chain or multi-token execution.
- Automatic token approvals or retry mutation.
- Dashboard-first product.
- Production-grade cumulative daily budgets without durable state.
- Claims of gas sponsorship, private routing, x402, MPP, or mainnet readiness without live proof.

## Evidence Required for Submission

- Public source repository and verified release tag.
- Demo video under three minutes.
- Real transaction link and KeeperHub execution ID.
- Successful receipt, duplicate proof, and refusal/no-broadcast proof.
- CI, tests, security model, architecture, configuration, onboarding, and limitations.

