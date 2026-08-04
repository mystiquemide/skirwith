# Submission Preflight

## Required Links

- Public GitHub repository: https://github.com/mystiquemide/skirwith
- Final release tag: `v0.1.0` → commit `594bcb928ed0fb40df1845263e17ce62ead6c8bc`
- Demo video under three minutes: PENDING (see `docs/DEMO_VIDEO_PLAN.md`; URL recorded here once uploaded)
- Real KeeperHub transaction explorer link: https://sepolia.etherscan.io/tx/0x4c2e25779a1bccd11db69dd68ba5aa25a5a164d3010e1a34001a55750c7dddb0
- KeeperHub execution reference: `mn7vnwz2rednekykkww8d`
- Optional public documentation site: https://mystiquemide.github.io/skirwith/

## Pinned Action Reference

Docs and the example workflow pin the action to the `v0.1.0` release commit:

```yaml
uses: mystiquemide/skirwith@594bcb928ed0fb40df1845263e17ce62ead6c8bc
```

## Verification

- Open every link logged out: DONE 2026-08-04. All GitHub links, the Pages site,
  and the Google Fonts CSS returned HTTP 200. All 7 Sepolia transaction hashes
  resolve via `eth_getTransactionByHash` on a public Sepolia RPC. Etherscan
  returns HTTP 403 to plain curl (bot protection), not a broken link.
- Confirm transaction chain, token, amount, recipient, status, and timestamp:
  recorded in `docs/PHASE3-EVIDENCE.md`.
- Confirm the repository tag matches the recorded demo build: tag `v0.1.0`
  points to the commit the docs pin.
- Confirm README separates live proof from fixtures: README marks fixtures as
  synthetic and links `docs/PHASE3-EVIDENCE.md` for live proof.
- Confirm no secrets, private wallet material, fake hashes, or unsupported
  claims are present: tracked-file secret scan clean; the `kh_` org key and the
  receipt secret exist only in gitignored `.env` and private repo secrets.
- Confirm sponsor integration names the exact executed KeeperHub path:
  KeeperHub Direct Execution API (`/api/execute/transfer`,
  `/api/execute/{id}/status`) per `docs/KEEPERHUB-INTEGRATION.md`.
- Confirm blocked and duplicate evidence is present, not merely described:
  `docs/PHASE3-EVIDENCE.md` refusal and replay rows.

## Accessibility Checklist (docs site)

Recorded 2026-08-04 without browser automation; interactive and visual behavior
must be re-confirmed manually before submission.

- Language and metadata: `lang="en"`, viewport meta, description meta present.
- Structure: `<nav>`, `<main>`, `<section>` landmarks; single `h1`; labeled
  `<h2>` subsections; `<table>` with `<thead>`/`<th>`.
- Keyboard reachability: all interactive elements (nav links, CTA links,
  theme toggle) are native focusable anchors/buttons; no custom tabindex or
  click-only handlers.
- Theme toggle: dynamic `aria-label` ("Switch to light theme" / "Switch to dark
  theme") matches the current state; prefers `prefers-color-scheme` default of
  dark, stored per user in `localStorage`.
- Color contrast (WCAG 2.1, computed from the theme palette):
  - Body text `ink` on `canvas`: 15.75:1 dark, 17.74:1 light (AAA).
  - Muted/label text: 7.89:1 dark, 4.83:1 light (AA).
  - Accent, ok, warn, bad status colors: 6.93:1 to 11.49:1 dark, 3.77:1 to
    5.17:1 light. The light-theme `ok` (green) status color is 3.77:1, below AA
    for normal text; it is used only for large status words in a table and is a
    known minor limitation.
  - Faint step-number text was raised to 5.20:1 dark and 4.83:1 light (AA) on
    2026-08-04.
- Not yet verified in a real browser: full keyboard tab order, 200% zoom,
  mobile layout, reduced-motion behavior, and screen-reader output. No automated
  site test exists; a static-page accessibility smoke test is a post-hackathon
  follow-up.

## Honest Disclosures

State testnet/mainnet status, one-chain/one-token scope, maintainer-controlled
mappings, no daily-limit accounting, no automatic recovery, and all provider or
availability limitations.

Skirwith is a testnet proof of concept for the KeeperHub Agents Onchain
hackathon (deadline 2026-08-13 10:00). It targets Ethereum Sepolia only, USDC
`0x1c7d4b196cb0c7b01d743fbc6116a902379c7238`, one chain, one token. Recipient
and amount mappings are maintainer-controlled in the trusted config. There is
no daily-limit accounting and no automatic recovery or rebroadcast after an
uncertain outcome. All live transactions are testnet self-payments to the
organization wallet to avoid moving funds to an external person during testing;
the workflow still validates the complete recipient mapping and transfer path.
KeeperHub availability, GitHub API state, wallet funding, and gas/allowance
must hold for settlement to complete.
