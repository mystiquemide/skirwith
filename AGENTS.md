# Skirwith Developer Instructions

## Mission

Build a safe, deterministic GitHub Action whose strongest proof is success, replay suppression, and refusal before broadcast.

## Stack

- Node.js 20/current supported GitHub LTS
- strict TypeScript ESM
- npm lockfile
- Vitest, ESLint, Prettier, NCC
- GitHub REST API and KeeperHub Direct Execution API

## Nonnegotiable Rules

- Use test-driven development for production behavior.
- Keep domain logic pure and provider/GitHub calls behind injected interfaces.
- Never accept recipient, amount, token, chain, or policy from PR-controlled text or files.
- Load configuration from the trusted default branch through GitHub API.
- Never check out or execute PR code in the secret-bearing job.
- Never broadcast before policy and exact-request simulation pass.
- Never automatically rebroadcast an uncertain execution.
- Never log secrets or raw provider errors; apply recursive redaction.
- Never claim a live feature without real evidence.
- Do not add a database, daily limit, dashboard, LLM, custom contract, multi-chain, or multi-token scope without an explicit architecture change.

## Source Conventions

- Files use kebab-case; exported types and classes use PascalCase; functions and values use camelCase.
- Prefer discriminated unions over booleans for states.
- Amounts are decimal strings at config boundaries and integer atomic-unit strings internally.
- Addresses are validated and normalized once.
- Errors have stable machine codes and safe public messages.
- Entrypoints compose dependencies; they do not contain policy logic.
- Comments explain security rationale or provider quirks, not obvious syntax.

## Required Verification

Run format, lint, typecheck, focused tests, full tests, build, bundle-diff, dependency audit, and secret scan. Live execution additionally requires testnet allowlisting, explicit confirmation, funded known wallets, and evidence capture.

## Protected Evidence

Never overwrite or fabricate transaction hashes, execution IDs, action run links, timestamps, or acceptance screenshots. Mock fixtures must be visibly labeled and use synthetic credentials.

## Documentation Discipline

When implementation changes a contract, update architecture, security, configuration, integration, tests, tasks, and memory in the same change.

