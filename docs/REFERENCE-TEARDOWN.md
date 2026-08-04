# Reference Teardown — jcsuzanne.com

Reference for the MergePay landing page rebuild.

## 1. Platform and Technical Facts

Observed from source. These are facts, not interpretation.

| Item | Value |
| --- | --- |
| Platform | WordPress, custom theme `blueprint` |
| SEO | Yoast SEO v25.8 |
| Hosting | WP Engine (assets at `jcs23.wpengine.com`) |
| Page transitions | swup (JSView transition + progress wrappers) |
| Analytics | Google Analytics `G-2GXPDFYJEK` |
| Caching | Rocket preload/cache |
| Base font size | `62.5%` (10px rem base, Tailwind-style) |
| Font | Suisse Intl (Book, Regular, Medium), self-hosted woff2/otf |
| Font fallback | `ui-sans-serif, system-ui, ...` |
| No Google Fonts | fonts are self-hosted |

## 2. Color System

Exact values found in `styles.css` and theme metadata.

| Token | Hex | Role |
| --- | --- | --- |
| Canvas | `#ffffff` | page background |
| Section tint | `#f5f5f5` | alternate section background |
| Primary text | `#111827` | headlines, body |
| Text tiers | `#1f2937 #374151 #4b5563` | secondary text |
| Muted text | `#6b7280 #9ca3af` | years, categories, metadata |
| Border/skin | `#d1d5db #e5e7eb #f3f4f6` | rules, hairlines |
| Pure black | `#000000` | monogram / strong marks |
| Accent | `#2563eb` | interactive accent (blue-600) |
| Accent soft | `rgba(59,130,246,.5)` | hover/selected tint (blue-500) |
| Chrome (meta) | `#192240` | mobile browser chrome only, not page |

Pattern: near-monochrome. The page is one gray scale plus one blue accent. No gradients in the system.

## 3. Typography System

One family: Suisse Intl. Three weights (Book, Regular, Medium). No separate display font.

| Use | Weight | Character |
| --- | --- | --- |
| Hero monogram | Heavy/display scale | giant initials, tight tracking |
| Section titles | Medium | large, editorial |
| Project names | Book/Regular | mid size, high contrast |
| Years + categories | Book | small, muted gray |
| Body copy | Book | normal size, generous line height |

Letter spacing is tight on display type. Metadata reads small and quiet next to large titles. This is the core editorial device: loud title, quiet meta, nothing else.

## 4. Layout and Spacing

Observed breakpoints (Tailwind-style).

| Breakpoint | Purpose |
| --- | --- |
| `max-width: 1023px` | tablet/mobile |
| `min-width: 1024px` | desktop |
| `min-width: 1400px` | wide desktop |
| `min-width: 1680px` | very wide desktop |

Layout rules from inspection:
- One column, edge-to-edge, no sidebars.
- The main content is a full-page vertical index (a list of rows).
- Rows are separated by thin rules or whitespace, not cards.
- Spacing is generous. Sections breathe.
- Everything is left-aligned. No centered body text.
- Reveal motion: rows fade/slide in on scroll (`ui-ready`, `translate-y`, `ease-in-out-quint`, staggered delays).

## 5. Component Library

The site is almost component-free by design.

| Component | Form |
| --- | --- |
| Logo | Text monogram `JC` + `S` (no image mark) |
| Nav | Fixed bar, minimal: monogram + 3 text links (Discover, Bio, Contact) |
| Hero | Giant monogram `JC S` + display title + one role line |
| Work index | One list of rows: Year, Project name, Category; each row is a link to the live project |
| Footer statement | Short poetic line, e.g. "JCS ® is the showcase of Jean-Christophe Suzanne..." |
| Bio | Plain paragraphs + a Stack list |
| Buttons | Text links with underline/color transitions, not filled boxes |

No cards, no gradient panels, no shadow boxes, no rounded-pill buttons.

## 6. Visual Hierarchy and User Flow

- First view: monogram + role. Instant identity.
- Second view: the work index. The index is the proof. It is a long, scannable list of names and categories that establishes authority by volume and client quality.
- The page is a portfolio proof machine: show the work, keep it silent, let the client names do the selling.
- The hero is small relative to the index. The index is the real content.

## 7. Conversion Psychology

- Authority by client list: Decathlon, La Tour d'Argent, Pichon Comtesse, Gunboat, Big Mamma. Recognizable names create instant trust.
- Category tags (`Ecommerce`, `Editorial`, `Showcase`) signal range and specialty.
- A 2008–2026 year span signals longevity.
- No social proof badges or testimonials. The work is the proof.
- The single CTA is Contact. Everything routes to contact.

## 8. Section-by-Section

| Section | Content | Function |
| --- | --- | --- |
| Nav | JCS monogram, Discover / Bio / Contact | wayfinding |
| Hero | JC S monogram, Creative Developer, role line | identity |
| Work | Selected Works 2008–2026, ~35 project rows | proof |
| Footer statement | "JCS ® is the showcase of..." | signature close |
| Bio | Welcome paragraph, role, location | human trust |
| Stack | Tool list (WordPress, VueJS, Tailwind, etc.) | capability |

## 9. What to Steal for MergePay

1. Giant text monogram/wordmark hero on white.
2. A full-page editorial index as the proof surface (the transaction list becomes MergePay's "Selected Works").
3. Row pattern: loud name + quiet metadata. For MergePay: PR + amount + tx hash + status.
4. Near-monochrome palette with one accent.
5. One grotesque type family, tight display tracking, muted small meta.
6. Thin rules and whitespace instead of cards.
7. Left-aligned everything, no centered body text.
8. Text-link buttons with color transition, not filled boxes.
9. A short signature footer statement.
10. Quiet stagger reveals on scroll.

## 10. What to Reject

- WordPress/PHP stack (MergePay is a static GitHub Pages page).
- The dense 35-row index for MergePay (7 transactions; keep it readable).
- Suisse Intl is a licensed font. Use a free Swiss-style grotesque instead (Inter or Space Grotesk).
- Client-name authority does not apply. Replace it with on-chain evidence authority.
- Do not copy the personal-portfolio framing. MergePay is a product, not a person.

## 11. Critical Review

Strengths: typographic confidence, instant identity, proof-by-volume, zero decoration, fast and calm.
Weaknesses: no clear single CTA; contact is implicit; mobile navigation is a minimal three-link bar; no visible social proof beyond names; relies on the viewer already knowing the clients.
For MergePay: the editorial index pattern is the right transplant, but MergePay must add an explicit setup CTA and use transactions (not names) as the proof.
