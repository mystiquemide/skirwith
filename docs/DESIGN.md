# Skirwith Landing Page — Design System (SR-71 Handoff)

Reference: jcsuzanne.com editorial-index aesthetic.
Target: static GitHub Pages landing page for Skirwith (a GitHub Action that pays approved contributors after a merged PR, via KeeperHub on Sepolia).
Build method: one section at a time. One prompt per section. Review gate between sections. Never modify an approved section.

## What to Steal from the Reference

1. White canvas, near-black text, one accent.
2. Giant display wordmark hero.
3. A full-page editorial index as the proof surface (the transaction list).
4. Row pattern: loud name, quiet metadata.
5. Thin rules and whitespace, no cards.
6. One grotesque type family, tight display tracking, muted small meta.
7. Left-aligned everything.
8. Text-link buttons with color transition.
9. A short signature footer line.
10. Quiet stagger reveals.

## What to Reject

- Dense 35-row index (Skirwith has 7 transactions).
- Licensed Suisse Intl (use Inter, free).
- Personal-portfolio framing (Skirwith is a product).
- No explicit CTA in the reference (Skirwith must have a clear setup CTA).

## Palette (exact hex)

| Token | Hex | Use |
| --- | --- | --- |
| Canvas | `#ffffff` | page background |
| Ink | `#111827` | headlines, body |
| Muted | `#6b7280` | metadata, labels |
| Faint | `#9ca3af` | years, secondary meta |
| Rule | `#e5e7eb` | hairlines between rows |
| Accent | `#2563eb` | links, interactive |
| Accent soft | `#dbeafe` | selected row tint |
| Status ok | `#059669` | confirmed |
| Status warn | `#b45309` | pending / manual review |
| Status bad | `#dc2626` | blocked |

Only these colors. No gradients, no shadows.

## Typography

| Use | Font | Weight | Size | Notes |
| --- | --- | --- | --- | --- |
| Wordmark / hero | Inter | 700 | clamp(3rem, 8vw, 6rem) | tight tracking `-0.04em` |
| Section label | Inter | 500 | 0.72rem | uppercase, `letter-spacing:0.14em` |
| Row name | Inter | 500 | 1.1rem | left aligned |
| Row meta | Inter | 400 | 0.85rem | muted `#6b7280` |
| Data (tx hash, keys) | ui-monospace | 400 | 0.8rem | monospace only for data |
| Body | Inter | 400 | 1rem | line-height 1.6 |

Inter is the free Swiss-style grotesque. It stands in for Suisse Intl. Monospace is reserved for hashes, keys, and config values. It is never used for headlines.

## Global Rules (restated in every section prompt)

- No em dashes anywhere, in copy, comments, or code. Use commas or periods.
- No cards, no panels, no boxes with borders around content blocks.
- No gradients, no shadows, no glassmorphism, no rounded-full.
- No centered body text. Everything left aligned.
- No bold on body text. Medium weight is the strongest weight.
- Do not touch sections already approved.
- Only the palette hex values above. No invented colors.
- Inter for text, ui-monospace for data only.

## Section Wireframe

1. **Nav** — fixed top bar. Left: wordmark `Skirwith`. Right: Proof, Setup, Safety, Docs (text links). No hamburger; links fit at 375px or wrap.
2. **Hero** — white canvas. Big wordmark `Skirwith`. One line: `Pay approved contributors after a merged pull request.` Sub-line: `Skirwith is a GitHub Action. It uses KeeperHub on Ethereum Sepolia. Replays never pay twice. Refusals happen before any broadcast.` Two text-link CTAs: `Set it up` and `View the acceptance repo`.
3. **How it works** — small section label `How it works`. A short vertical sequence of steps as plain lines, thin rules between: Merged PR, Fresh GitHub state, Policy decision, Signed reservation, KeeperHub simulation, One broadcast, Receipt comment. One muted line under it.
4. **Live proof** — section label `Live proof`. A one-line summary: `7 confirmed transactions, verified on-chain on Sepolia.` Then the transaction index as rows: PR, Amount, Execution id (mono), Transaction hash (mono, link), Status. Statuses: confirmed (green), pending (amber). A muted note under the table for the pending rows. Link to PHASE3-EVIDENCE.md.
5. **Proof numbers** — three small stat lines (7 confirmed, 1 replay with no second transaction, 2 refusal types, 0 double payments). Rendered as plain rows, not cards.
6. **Safety** — section label `Safety design`. A plain list of six rules as rows.
7. **Setup** — section label `Set it up`. Prerequisites as a short list. Steps 1-5 as numbered plain rows. The config YAML and workflow YAML in `pre` blocks, monospace. One muted line: `You do not need a personal access token. GitHub Actions provides GITHUB_TOKEN automatically.`
8. **Documentation** — text links to the repo docs: Architecture, Security, Configuration, KeeperHub integration, Test strategy, Phase 3 evidence.
9. **Footer** — thin rule. One muted line: `Skirwith is a testnet proof of concept for the KeeperHub Agents Onchain hackathon. It makes no production or mainnet claim.` Link to the repo.

## Build Order

Nav → Hero → How it works → Live proof → Proof numbers → Safety → Setup → Documentation → Footer.

Each section is a separate prompt with STRUCTURE, exact copy, exact hex, GLOBAL RULES, DO NOT TOUCH, and `No em dashes`. Review each section before the next.
