# Hackathon Master (The General)

This is the top-level skill for winning online hackathons. Load this first. The General chains every other skill in the right order and handles all gates, checks, and polish.

## When to Use

Any hackathon. Load this skill. It decides what happens next.

## The Golden Rule: Task Numbering

Every single step is numbered. The user must see exactly what is happening and what is next:

```
Step 1: Checking GitHub access...
Step 2: Loading The Scout for hackathon research...
```

Mark each step `[x]` when complete. The user tracks progress visually, like a checklist.

## The Golden Rule: Never Batch Steps

One step, one message. The user must see exactly where they are at all times. Never group multiple steps into one response. Wait for user acknowledgment before the next step.

## Phase 0: Authentication Gates

### Step 1: GitHub Access Gate

```
gh auth status
```

- If authenticated → proceed to Step 2.
- If NOT authenticated → STOP. Ask the user:

> "I need access to your GitHub to clone the boilerplate repos.
> Option A: Paste a personal access token (repo scope)
> Option B: Run `gh auth login` and I'll wait"

Do not proceed until access is confirmed. Nothing works without this.

### Step 2: Load The Scout

Load skill `hackathon-strategy`. Feed it:
- The hackathon URL or brief
- Any preferences the user has stated

The Scout will research, ideate, and output:
- Judge analysis
- Pain points
- 3-5 project ideas with full evaluation
- ONE final recommendation
- Which boilerplate repo to use (e.g. `boilerplate-ai-saas`)

The Scout's decision tree:

| Idea Type | Boilerplate Repo |
|-----------|-----------------|
| AI/SaaS, needs auth + database + real backend | `boilerplate-ai-saas` |
| Web3/dApp, needs wallet + contracts + RPC | `boilerplate-web3` |
| Landing page, demo-only, no backend needed | `boilerplate-general` |
| Any of the above but working on a team | Team variant of the matching repo |

Wait for user approval on the idea before moving to Step 2.

### Step 3: Load The Look

Load skill `hackathon-brand-design`. Feed it the approved idea from Step 1.

The Look will produce:
- Brand name (using `project-naming` skill internally)
- Logo direction, colors, typography
- Mascot concept
- UX flow and key screens
- Pitch deck visual direction

When the landing page needs to be built, The Look loads `sr71-method` (The Landing Page) for section-by-section execution.

Wait for user approval on the brand direction before moving to Step 3.

### Step 4: API Key Check

Before cloning or building anything, check required environment variables:

```
Check .env or environment for:
- OPENAI_API_KEY
- ANTHROPIC_API_KEY
- Any sponsor-required API keys from The Scout's research
```

- All present → proceed.
- Missing keys → tell the user what is missing and pause. Do not clone the repo yet.

### Step 5: Clone the Boilerplate

Clone the boilerplate repo assigned by The Scout in Step 1:

```
gh repo clone MystiqueMide/[boilerplate-name]
```

The repo contains a `BOILERPLATE.md`. Read it immediately. It tells you:
- What is inside
- What to strip (auth, database, AI if not needed)
- What to customize (brand colors, logo, landing page)
- How to use demo mode

Strip unused parts based on the project needs. Keep what you need. Delete what you don't.

### Step 6: Pre-Flight Tool Check

Before building, verify the tools The Reel will need:

```
- Is Recordly installed?
- Is CapCut installed?
```

If missing, tell the user what to install. Do not wait until recording time.

### Step 7: Build the MVP

Execute the MVP plan from The Scout's research:
- Build the core feature first
- Integrate sponsor tools
- Polish UI
- Connect to live data or sample fixtures

**Master Forge Option**: If this is a complex multi-agent project, ask the user: "Load Master Forge to spawn specialized agents for this build?" If yes, load the `master-forge` skill. If no, build solo.

### Step 8: Commit Hygiene

Prove the project was built during the hackathon:
```
□ Timestamped commits across the build period
□ Progressive screenshots in the repo
□ Clean, descriptive commit messages
□ No single massive commit at the end
```
Judges check. If your demo looks too polished, this is your proof it was built live.

### Step 9: QA Checkpoint

Before anything else, run these checks:

```
□ Click every button — does it work?
□ Every link resolves — no 404s
□ README renders correctly on GitHub
□ Architecture diagram is present and readable
□ Sponsor tools visibly integrated in UI and README
□ Live URL works, no broken images
□ All env vars set for production
□ Demo mode toggle works (if applicable)
```

If any fail, fix before moving to Step 10. Never ship blind.

### Step 10: Load The Voice

Load skill `hackathon-live-pitch`. Feed it:
- The built product
- Judge research from The Scout
- The brand positioning from The Look

The Voice will prepare:
- 6-slide pitch narrative
- Timing and delivery notes
- Q&A prep for anticipated questions
- Backup demo strategy

Run at least one full rehearsal.

### Step 11: Load The Reel

Load skill `hackathon-demo-video`. Feed it:
- The built product
- The brand direction from The Look
- The pitch structure from The Voice

The Reel will produce:
- Scene-by-scene demo script
- Recording checklist
- Production notes

Record the demo video. Verify it plays correctly.

### Step 12: Submission Polish

Every surface a judge touches must be better than every other submission:

```
□ Devpost/project page: clear description, compelling screenshots, working links
□ README: story-driven, not just setup instructions
□ Architecture diagram: professional, readable
□ Video thumbnail: clean, branded, not auto-generated
□ GitHub repo: clean commit history, no junk files, clear structure
□ Live URL: works, fast, no console errors
```

### Step 13: Deadline Enforcement

The Scout captured the deadline. Track it:

```
□ T-24h: alert user
□ T-6h: submit README + Devpost draft
□ T-2h: video uploaded, all links verified
□ T-30min: FINAL CHECK, HIT SUBMIT
```

Never lose a hackathon because you missed the deadline.

### Step 14: Submit

Verify once more:

```
□ Demo video plays and audio is clear
□ Live URL is working
□ GitHub repo is public and README renders
□ All submission fields filled
□ Hit submit
```

### Step 15: Post-Mortem

After the hackathon ends (win or lose), run the debrief:

Ask the user:
1. What went well?
2. What broke?
3. What would you do differently?

Based on answers, patch the RIGHT skill:

```
Issue was research → patch hackathon-strategy (The Scout)
Issue was branding → patch hackathon-brand-design (The Look)
Issue was pitch → patch hackathon-live-pitch (The Voice)
Issue was demo video → patch hackathon-demo-video (The Reel)
Issue was process → patch hackathon-master (The General)
```

Every hackathon makes the entire system smarter.

## Skill Chain Reference

| Easy Name | File Name | What It Does |
|-----------|-----------|--------------|
| The Scout | `hackathon-strategy` | Research, ideation, judge analysis, pain points, boilerplate assignment |
| The Look | `hackathon-brand-design` | Brand identity, UX, pitch deck visuals, loads The Landing Page |
| The Landing Page | `sr71-method` | Section-by-section landing page build protocol |
| The Voice | `hackathon-live-pitch` | Zoom pitch delivery, Q&A prep, judge-specific angles |
| The Reel | `hackathon-demo-video` | Demo scripts, recording, captions, production |
| The General | `hackathon-master` | Chains everything, gates, QA, deadline, post-mortem |

## Pitfalls

- Never skip the GitHub auth gate. Nothing works without it.
- Never skip the API key check. Stalling mid-build is worse than never starting.
- Never skip QA. One broken button kills a submission.
- Never skip the deadline tracker. Missing a deadline is losing for free.
- Never skip post-mortem. The system must learn from every hackathon.
- The Scout picks the boilerplate, not The General. The General just clones what The Scout says.
- Each skill must be loaded with `skill_view()` before executing its workflow.


Base directory for this skill: /home/mide/.config/opencode/skills/hackathon-master
Relative paths in this skill (e.g., scripts/, references/) are relative to this base directory.
Step 1: Loading The General and checking GitHub access...
→Skill "hackathon-master"
Step 1: Checking GitHub access...
$ gh auth status
github.com
  ✓ Logged in to github.com account mystiquemide (/home/mide/.config/gh/hosts.yml)
  - Active account: true
  - Git operations protocol: https
  - Token: gho_************************************
  - Token scopes: 'gist', 'read:org', 'repo', 'workflow'
Step 1 x: GitHub access confirmed for mystiquemide with required repo and workflow scopes.
Acknowledge when ready for Step 2: Load The Scout. Please include the hackathon URL or brief and any project preferences.
▣  Build · gpt-5.6-sol · 28.1s
https://dorahacks.io/hackathon/agents-onchain/detail
Step 2: Loading The Scout to research Agents on Chain, analyze judging criteria and sponsor tracks, develop 3-5 project ideas, and recommend one build direction with the correct boilerplate.
→Skill "hackathon-strategy"
Step 2 x: The Scout (hackathon-strategy) is loaded with the Agents on Chain hackathon URL.
Acknowledge when ready for Scout Step 1: Parse the hackathon page.
▣  Build · gpt-5.6-sol · 17.7s
go
Scout Step 1: Parsing the Agents on Chain hackathon page for tracks, prizes, sponsors, rules, deadlines, and submission requirements...
%WebFetch https://dorahacks.io/hackathon/agents-onchain/detail
Scout Step 1 x: Hackathon page parsed.
- Deadline: August 13, 2026 at 12:00 UTC+2
- Time remaining: About 9 days
- Prize pool: $5,000
- Mandatory integration: KeeperHub must execute a real onchain transaction
- Required submission: Public GitHub repository, demo video, and transaction link
- Highest-weight criterion: Successful onchain execution through KeeperHub
- Valuable surfaces: MCP/CLI, x402 or MPP, smart gas handling, private routing, retries, and audit trail
- Stackable bounty: Two $500 awards for improving KeeperHub onboarding through a merged PR, starter template, tutorial, or documented UX teardown
- Finalist stage: Ten projects receive live pitch invitations between August 17 and 19
Acknowledge when ready for Scout Step 2: Analyze judge incentives and likely submission patterns.
▣  Build · gpt-5.6-sol · 26.6s
go
Scout Step 2: Translating the rules into judge incentives and identifying the strongest ways to demonstrate KeeperHub beyond a superficial transaction wrapper...Scout Step 2 x: Judge incentives analyzed.
What judges will reward
- A real agent decision that triggers a real transaction, not a scripted button click
- A clear transaction link proving KeeperHub executed the action
- Visible use of KeeperHub’s execution surfaces, preferably MCP plus audit trail
- Reliability under failure: gas changes, retries, simulation failures, and recovery
- A useful workflow with a believable reason to run autonomously
- A concise live demo with an obvious before-and-after outcome
- Clean onboarding that gets a new user from setup to first transaction quickly
Likely crowded submissions
- Generic trading or swap agents
- Natural-language wallet assistants
- “AI decides, then calls one contract” demos
- Basic yield or portfolio rebalancing bots
- Chatbots with a KeeperHub transaction button
- Dashboards that display audit logs without owning a meaningful workflow
Strategic opportunity
The winning layer is not “an AI that can transact.” KeeperHub already solves execution. The differentiated product should own a high-stakes workflow where execution reliability and evidence matter:
- Detect a condition
- Explain the recommended action
- Simulate it
- Execute through KeeperHub
- Recover from failure or gas changes
- Produce a verifiable audit record
Best sponsor integration story
Use KeeperHub MCP as the agent’s native execution interface, then expose:
- The agent’s decision and rationale
- Simulation result
- Retry or gas-adjustment behavior
- Transaction hash and explorer link
- KeeperHub audit trail
- Optional x402/MPP payment for paid execution
Bounty opportunity
A polished “first transaction” onboarding flow plus a reusable starter template could compete separately for the $1,000 onboarding bounty while also strengthening the main submission.
Acknowledge when ready for Scout Step 3: Research the project landscape and current submission patterns.
▣  Build · gpt-5.6-sol · 22.5s
go
▣  Build · gpt-5.6-sol · interrupted
go
continue
Scout Step 3: Checking current submissions and the competitive landscape...
Type validation failed: Value: null.
Error message: [
  {
    "code": "invalid_union",
    "errors": [
      [
        {
          "expected": "object",
          "code": "invalid_type",
          "path": [],
          "message": "Invalid input: expected object, received null"
        }
      ],
      [
        {
          "expected": "object",
          "code": "invalid_type",
          "path": [],
          "message": "Invalid input: expected object, received null"
        }
      ]
    ],
    "path": [],
    "message": "Invalid input"
  }
]
continue
Scout Step 3: Researching the visible project landscape and sponsor ecosystem to identify crowded concepts and open differentiation.
%WebFetch https://dorahacks.io/hackathon/agents-onchain/buidl
%WebFetch https://github.com/search?q=KeeperHub+agent+onchain&type=repositories
%WebFetch https://docs.keeperhub.com/ai-tools/mcp-server
%WebFetch https://keeperhub.com/links
Scout Step 3 x: Project landscape researched.
Current visible patterns
GitHub already shows projects in these categories:
- P2P agent jobs with x402 payments and KeeperHub settlement
- Generic observe-decide-policy guardians
- Wallet guardian agents
- DeFi risk guardians for Aave
- Autonomous earning and yield agents
- DCA agents
- Policy firewalls and independent execution proofs
- Starter kits focused on KeeperHub onboarding
DoraHacks currently reports no visible BUIDLs, but GitHub activity indicates submissions are already forming. The most crowded directions are therefore:
- Wallet security guardians
- Generic DeFi risk protection
- DCA and yield automation
- Agentic payments
- Abstract “proof of execution” layers without a compelling end-user workflow
Important technical opportunity
KeeperHub’s MCP exposes more than direct transaction execution:
- execute_check_and_execute
- execute_protocol_action
- execute_workflow
- get_execution
- get_direct_execution_status
- search_protocol_actions
- Workflow validation and testing
- Marketplace workflows with typed per-workflow MCP servers
- x402 payment challenges for paid workflows
A project that combines a meaningful operational workflow with typed MCP, conditional execution, and visible recovery evidence can stand apart from a one-shot transaction demo.
Landscape conclusion
We should avoid building another wallet guardian, DCA bot, generic yield optimizer, or payment agent. The strongest opening is a narrow, high-stakes workflow where “did the action actually execute safely?” is the product itself, while still producing a real transaction through KeeperHub.
Acknowledge when ready for Scout Step 4: Research real pain points and underserved workflows.
▣  Build · gpt-5.6-sol · 1m 22s
go
Scout Step 4: Researching real operational pain points around autonomous onchain execution, failures, approvals, and auditability.
%WebFetch https://docs.keeperhub.com/keeper-runs/troubleshooting
%WebFetch https://docs.keeperhub.com/practices/security
%WebFetch https://github.com/KeeperHub/keeperhub/issues
%WebFetch https://www.reddit.com/search/?q=onchain%20automation%20failed%20transactions%20gas%20agents&restrict_sr=on
→Skill "project-naming"
Scout Step 4 x: Pain points researched.
Evidence-backed pain points
- First-time agent onboarding is difficult. KeeperHub has an open issue specifically describing “7 DX gaps blocking first-time agent integrations,” plus a separate issue about MCP authentication and API-key step-up flow.
- Execution failures are operationally complex. KeeperHub documents insufficient gas, contract reverts, gas-estimation failures, nonce conflicts, invalid inputs, and network latency as common failure modes.
- Retries can be unsafe or ineffective. An open issue reports that reusing an idempotency key can replay a cached failure, preventing a
Scout Step 4 x: Pain-point research completed.
Evidence-backed pain points
- First-transaction onboarding is fragmented. An open KeeperHub issue explicitly identifies seven DX gaps blocking first-time agent integrations, and another reports friction around MCP authentication and the transition to kh_ API keys with 2FA.
- Retries can be unsafe or ineffective. KeeperHub issue #1840 reports that reusing an idempotency_key can replay a cached failure, preventing recovery. This is a strong opening for transaction lifecycle intelligence rather than blind retry loops.
- Contract execution configuration is easy to get wrong. Issue #1841 reports schema confusion around chain_id, function_args, and gas_limit_multiplier. The docs also identify ABI mismatches, invalid parameters, insufficient balance, gas estimation failures, nonce conflicts, and contract reverts as common failure modes.
- Operators lack a unified failure explanation. KeeperHub provides run logs, but users still need to inspect inputs, outputs, node-level errors, balances, conditions, and external integrations manually.
- Autonomous agents need bounded authority. KeeperHub’s own security guidance emphasizes spending limits, address verification, condition testing, Sepolia-first deployment, monitoring, and emergency disablement.
- Onboarding itself is a prize opportunity. The hackathon offers two stackable $500 bounties for a merged onboarding improvement, starter template, tutorial, or detailed teardown with proposed fixes.
Underserved product openings
- A transaction reliability agent that diagnoses failed executions and chooses a safe recovery path
- An execution-control plane that turns agent intent into policy-checked, auditable transactions
- A developer onboarding layer that validates KeeperHub payloads before they reach production
- A “replayable incident” workflow that demonstrates failure, diagnosis, recovery, and proof
Strongest strategic direction
Build around the failure lifecycle, not just the transaction:
An agent detects a failed or risky onchain action, explains the failure, applies policy, chooses a recovery strategy, executes the corrected action through KeeperHub, and produces a complete evidence trail.
This directly maps to the judging criteria, uses KeeperHub’s reliability surfaces, addresses documented DX pain, and creates a dramatic demo: failure → diagnosis → safe recovery → verified transaction.
Acknowledge when ready for Scout Step 5: Generate and name the candidate concepts.
▣  Build · gpt-5.6-sol · 1m 52s
# Idea Validation & Market Research Prompt

Load this skill when the user wants to validate a startup idea with competitive analysis, market research, and a VC-style investment verdict.

## Trigger

User says "validate this idea", "idea check", "market research", "should I build this", "startup idea validation", or provides an idea wanting rigorous analysis.

## Usage

1. Ask the user for the idea to validate
2. Load this skill via `skill_view(name='idea-validation')`
3. The prompt produces 6 sections:
   - Competitive Landscape (direct/indirect/infra competitors with matrix)
   - Differentiation Check (moat analysis, gap analysis)
   - Market Signal Analysis (demand evidence, TAM/SAM/SOM, timing)
   - Idea Expansion & Generation (200+ adjacent ideas, top 5 highlighted)
   - Red Flags & Failure Modes (fatal flaws, must-be-true assumptions)
   - Final Verdict (GREEN/YELLOW/RED + MVP plan if viable)

## Key Directives

- Evaluated as if for seed investment by a top-tier VC firm
- Includes MVP plan, tech stack suggestions, and 2-week build strategy if viable
- Brutal honesty over encouragement — dismantle weak ideas clearly

## Pitfalls

- Requires web research for competitive landscape and market signals
- The 200+ idea generation is expansive — expect significant output
- "Brutal honesty" means the prompt will not sugarcoat bad ideas


Base directory for this skill: /home/mide/.config/opencode/skills/idea-validation
Relative paths in this skill (e.g., scripts/, references/) are relative to this base directory.

on your ideas and these ideas : Here are 5 scoped builds that ship working transactions, not slide decks.

| # | Idea | What it does | Why it wins |
|---|------|--------------|-------------|
| **1** | **Panic Button** — MEV-protected stop-loss agent | Agent monitors a token price via an MCP feed. When it hits your floor, it executes a swap through KeeperHub using **private routing + smart gas + gas sponsorship**. You sleep; it exits without getting sandwiched. | Solves a real pain (MEV losses). Uses 4 KeeperHub surfaces in one flow. Demo is visceral: show price dropping → agent firing → safe landing on Etherscan. |
| **2** | **KeeperHub Starter Kit** — Zero-to-tx onboarding CLI | One command scaffolds a minimal agent, auto-configures the KeeperHub MCP server, and executes a first **gas-sponsored** mainnet transaction. Spits out the audit-trail URL and x402scan link. Submit the repo as a PR/template. | Directly targets the **$1K Onboarding UX bounty**. Feasibility is maxed; you can build this in a weekend. It is literally the funnel KeeperHub wants. |
| **3** | **Penny Gate** — x402 paywall for static sites | Drop-in script for any static site (GitHub Pages, etc.). A visitor hits content; the agent validates an **x402/MPP** micropayment through KeeperHub, then unlocks the page. Settlement visible on x402scan. | Immediately consumable by any blogger/dev. Directly promotes KeeperHub's payment protocols. Demo is two-screen: locked → pay → unlocked → tx link. |
| **4** | **KeeperBooks** — Natural-language payroll + accounting | You DM the agent: *"Pay alice.eth 0.1 ETH for design work."* It executes via KeeperHub, then auto-logs the amount, recipient, memo, and **audit-trail** link to a Google Sheet/Notion. | Freelancers and DAOs use this today. Not siloed; it plugs into their existing accounting. Demo shows chat → Etherscan → spreadsheet row in 30 seconds. |
| **5** | **Retry Guy** — Failed-transaction rescuer | Agent monitors a wallet for reverted txs. On failure, it reads the revert reason, re-calculates with KeeperHub **smart gas estimation**, and resubmits via **private routing**. Logs every attempt to the audit trail. | Directly answers the hackathon brief ("Failed transactions, gas spikes, no guarantees"). High reliability narrative; judges love failure-mode awareness. |

---

### Ratings

| Idea | Originality | Feasibility | Sponsor Fit | Demo Strength |
|------|:-----------:|:-----------:|:-----------:|:-------------:|
| 1. Panic Button | 6 | 9 | 9 | 9 |
| 2. Starter Kit | 7 | 10 | 10 | 8 |
| 3. Penny Gate | 8 | 8 | 9 | 8 |
| 4. KeeperBooks | 6 | 9 | 7 | 7 |
| 5. Retry Guy | 7 | 8 | 9 | 8 |

**My pick:** Build **#2 (Starter Kit)** first to lock the onboarding bounty, then layer **#1 (Panic Button)** on top of it as your "real agent" submission. You walk away with two shots at the pool in ~9 days. kimi idea , 1. Autonomous Gasless Sub-Agent RefuelerThe Pitch: An MCP-connected agent worker that monitors operational wallets for low gas/micro-balances across chains and automatically executes an x402/MPP micro-swap to refill them via KeeperHub's gas-sponsored route before pending actions fail.Why It Works: Immediately usable for any builder/agent cluster today, solves a non-hypothetical problem, and natively highlights execution reliability.Ratings:Originality: 6/10 (Utility-first, zero fluff)Feasibility: 9/10 (Extremely straightforward with existing MCP + KeeperHub stack)Sponsor Fit: 10/10 (Flexes gas sponsorship, MCP, and x402/MPP routing)Demo Strength: 8/10 (Clean screen-recording: wallet drops below threshold $\rightarrow$ agent triggers refill $\rightarrow$ onchain transaction succeeds)2. Dead-Man's-Switch Liquidity Unwind AgentThe Pitch: A minimalist terminal CLI agent that monitors external heartbeats or specific onchain trigger events (e.g., protocol pause/exploit signal). When triggered, it uses KeeperHub’s private routing to dump or shift assets out of vulnerable pools without getting frontrun by MEV searchers.Why It Works: Zero UI needed. Plugs directly into existing workflows via CLI/MCP and relies explicitly on KeeperHub’s private transaction submission path.Ratings:Originality: 8/10 (Security/defense angle for autonomous agents)Feasibility: 8/10 (Can be scripted cleanly in a couple of days)Sponsor Fit: 9/10 (Directly validates KeeperHub’s MEV private routing feature)Demo Strength: 9/10 (High tension: simulate exploit event $\rightarrow$ agent privately routes funds off-chain in real time)3. Pay-per-Call API Agent Guard (x402 Sandbox)The Pitch: A lightweight middleware agent that accepts incoming pay-per-execution requests over HTTP via x402/MPP, simulates the execution payload via KeeperHub, and only broadcasts the transaction if the simulation passes the audit parameters.Why It Works: Plugs into any agent framework without siloing, directly monetizes execution, and leverages built-in simulation/audit trails.Ratings:Originality: 7/10 (Solid infrastructure primitive)Feasibility: 9/10 (Minimal surface area to code)Sponsor Fit: 10/10 (Direct implementation of x402/MPP + audit logs)Demo Strength: 8/10 (Clear flow: HTTP payment received $\rightarrow$ simulation checks out $\rightarrow$ onchain execution confirmed)4. Emergency Slippage & Congestion Auto-RelayerThe Pitch: A background daemon that intercepts failed or stuck agent transactions (due to sudden gas spikes) and auto-resubmits them through KeeperHub’s Smart Gas Estimation and exponential backoff engine until settlement.Why It Works: Addresses the core hackathon theme directly ("stuck transactions"). Acts as a plug-and-play dropped-tx recovery wrapper for existing agent scripts.Ratings:Originality: 7/10 (Focuses purely on the transaction survival rate)Feasibility: 8/10 (Simple loop mechanics with smart gas integration)Sponsor Fit: 10/10 (Directly proves the core value proposition of KeeperHub's adaptive gas module)Demo Strength: 8/10 (Simulate network congestion $\rightarrow$ standard RPC fails $\rightarrow$ KeeperHub relayer successfully lands the transaction)5. Multi-Signer "Keep-Alive" Treasury AgentThe Pitch: An autonomous daemon that periodically pings onchain multisig/timelock contracts to execute routine maintenance actions (e.g., compounding rewards, nudging health factors) via KeeperHub x402 execution tokens, providing a publicly verifiable audit log of every execution attempt.Why It Works: Scoped tight, eliminates manual operations for small crypto teams, and leaves behind an immutable execution audit trail.Ratings:Originality: 6/10 (Practical, everyday DevOps tool for Web3)Feasibility: 10/10 (Can be fully built and tested quickly)Sponsor Fit: 9/10 (Leverages audit trails and x402 settlement)Demo Strength: 7/10 (Functional and reliable: scheduled task fires $\rightarrow$ KeeperHub logs execution $\rightarrow$ onchain state updates) geminin idea , Straight from what you already know how to build, since KeeperHub is basically the missing execution layer under Airlock and Otheon. Quick note before the ideas: this is a separate hackathon from the Monad one, deadline August 13 not August 8, so don't mix up your calendar.

**1. Policy Gate for KeeperHub**
Take the Airlock YAML policy engine and put it in front of KeeperHub's execution calls. Agent proposes a transaction, the gate checks it against spend limits or CVI-verified counterparties, then only approved actions get routed to KeeperHub, with the audit trail logging every step. This is close to the agent spend mandate concept you're already scoping for Monad, just running on different rails.
Originality 6, feasibility 9, sponsor fit 10, demo strength 8

**2. Failure Mode Dashboard**
A live observability layer that watches KeeperHub's audit trail and gas estimation and surfaces retries, stuck transactions, and gas spikes as they happen. Telegram alerts for anomalies, same pattern you used for SENTINEL. Judges specifically call out reliability and observability as scoring criteria, so this hits the rubric directly.
Originality 7, feasibility 8, sponsor fit 9, demo strength 7

**3. x402 Pay-Per-Call Agent**
An agent that discovers and pays for data or API access per call through x402, settling onchain via KeeperHub. Demo could be an agent buying threat intel or price data one query at a time instead of a subscription. Shows off the payment protocol cleanly and is easy to record as a demo video.
Originality 8, feasibility 7, sponsor fit 8, demo strength 8

**4. Onboarding Starter Kit**
Build the cleanest possible zero to first transaction template plus a short teardown of where builders get stuck, aimed straight at the Best Onboarding UX bounty. Stackable with a Grand Prize entry, so you could pair it with idea 1 and submit both.
Originality 5, feasibility 9, sponsor fit 10, demo strength 6

**5. Cross Framework Adapter**
One wrapper that lets ElizaOS, LangChain, or CrewAI agents call KeeperHub without custom integration work each time. Demo shows the same wrapper executing a swap from two different frameworks. Good technical story but more plumbing work than the others, and less flashy on video.
Originality 7, feasibility 6, sponsor fit 8, demo strength 5

If you're picking one, idea 1 is the strongest overall since it reuses infrastructure you've already built and hits every judging criterion they listed. Idea 4 is the safe stackable add if you want the bounty too without much extra build time. claude idea , Here are 5 minimal, immediately usable ideas that prioritize real onchain execution through KeeperHub (MCP tools like execute_transfer, execute_contract_call, execute_protocol_action, execute_check_and_execute, workflows, audit trail, smart gas, private routing).  

They are deliberately small in scope so you can ship a working agent + live tx + demo video in the remaining time. Each is plug-and-play (MCP into any framework: LangChain, ElizaOS, CrewAI, etc., or pure webhook/CLI), not a closed silo, and focused on actual value movement that someone would run tomorrow.

1. Webhook Policy-Guarded Transfer Agent
Any external system (Zapier, Make, Discord bot, GitHub Action, email parser, invoice tool) POSTs {to, amount, token, reason}. Agent applies simple hard rules + light LLM check (daily budget, allowlist, max size), then calls KeeperHub execute_transfer (or workflow). Full audit trail + optional Telegram/Discord confirmation with tx hash.

Ratings  
Originality: 6  
Feasibility: 9  
Sponsor fit: 9  
Demo strength: 9  

2. Dust Sweeper + Consolidator
Scheduled (or on-demand) agent scans a wallet for low-value ERC-20s, filters by USD threshold or gas cost, optionally swaps via Uniswap/CoW protocol action if profitable, then consolidates to ETH/USDC. Uses balance reads + execute_protocol_action / execute_transfer. Runs on any EVM chain KeeperHub supports.

Ratings  
Originality: 5  
Feasibility: 9  
Sponsor fit: 8  
Demo strength: 8  

3. Lending Health-Factor Guardian
Monitors one or more Aave V3 / Morpho / Compound positions. When health factor drops below a user threshold, it executes the minimal safe action (supply more collateral from a reserve wallet or partial repay) via execute_check_and_execute or a short workflow. Optional notification with the exact tx.

Ratings  
Originality: 6  
Feasibility: 8  
Sponsor fit: 9  
Demo strength: 9  

4. Scheduled Multi-Recipient Stipend / Payroll Agent
User maintains a simple list (JSON, CSV, or even an onchain mapping). On a cron schedule the agent pays the list (USDC or native) with per-recipient caps and a global daily limit. Every payment goes through KeeperHub so you get gas handling, private routing, and a complete audit trail. Ideal for small teams, DAOs, or creator payouts.

Ratings  
Originality: 5  
Feasibility: 9  
Sponsor fit: 8  
Demo strength: 8  

5. Reward Claim + Auto-Compound Agent
Targets common protocols (Aave, Lido, Morpho, Yearn, etc.). Agent checks claimable rewards on a schedule or threshold, claims them, then compounds (supply/stake) in one KeeperHub workflow or sequential protocol actions. Optional x402 payment if it needs an external price or decision service first.

Ratings  
Originality: 6  
Feasibility: 8  
Sponsor fit: 9  
Demo strength: 8  

Quick recommendation for winning
Pick #1 or #3. Both are extremely demoable (trigger → decision → live tx hash + audit log in under 60 seconds), use multiple KeeperHub surfaces, solve an obvious real pain, and stay tiny so reliability stays high. Ship the agent, link the GitHub + one real mainnet/Base tx, and record a 90-second video that shows the full loop. That combination matches the judging emphasis better than anything flashy.  grok idea , KeeperHub already gives you webhook and onchain-event triggers, conditions, contract writes, token transfers, simulation, retries and detailed run logs. MCP handles agent access, while x402 and MPP can handle paid workflow calls. That means your product should be a thin, useful workflow around execution, not another agent platform. ([docs.keeperhub.com][1])

## 1. Skirwith

A GitHub Action that automatically pays a contributor when their pull request is merged.

Flow:

`PR merged → verify reviewer + label + CI → KeeperHub simulation → USDC transfer → transaction receipt posted on PR`

The repo owner installs it with one YAML file:

```yaml
wallet: 0x...
token: USDC
payment_label: bounty-$50
required_checks: true
```

Why it wins:

* Immediately useful for open-source teams, DAOs and hackathons.
* The entire demo is one clean action.
* It can double as a KeeperHub onboarding starter template, making it eligible for the separate onboarding bounty.
* No dashboard is required. GitHub is the interface.

| Originality | Feasibility | Sponsor fit | Demo strength |
| ----------: | ----------: | ----------: | ------------: |
|        8/10 |        9/10 |       10/10 |         10/10 |

**Total: 37/40**

## 2. SafeExit

An emergency recovery agent for Safe wallets and project treasuries.

The user creates a fixed recovery policy in advance. If an unauthorized owner is added, the signing threshold changes, or a protected contract approval appears, the agent executes the predefined recovery transaction through KeeperHub.

Flow:

`Safe event detected → compare against policy → simulate recovery → move specified assets → produce audit receipt`

Keep it constrained:

* Only approved assets.
* Only one recovery wallet.
* Maximum transfer amount.
* No agent-generated destination addresses.

The demo would be dramatic: add an unauthorized Safe owner on testnet, then show SafeExit detect it and execute the recovery transaction.

| Originality | Feasibility | Sponsor fit | Demo strength |
| ----------: | ----------: | ----------: | ------------: |
|        9/10 |        7/10 |       10/10 |         10/10 |

**Total: 36/40**

## 3. RefundRail

A stablecoin refund agent for small online businesses.

A merchant connects Shopify, a support tool or a simple webhook. When a refund is approved, the agent validates the order, checks the refund policy and executes the USDC refund through KeeperHub.

Flow:

`Refund approved → verify order + amount + wallet → KeeperHub execution → customer receives USDC → receipt returned to support ticket`

Rules prevent abuse:

* Refund cannot exceed the original payment.
* Wallet must match the order.
* Large refunds require manual approval.
* Duplicate order refunds are blocked.

The demo can start from a fake storefront order, but the refund transaction and KeeperHub execution must be real.

| Originality | Feasibility | Sponsor fit | Demo strength |
| ----------: | ----------: | ----------: | ------------: |
|        8/10 |        8/10 |        9/10 |         10/10 |

**Total: 35/40**

## 4. Runway Router

A plug-and-play treasury router for freelancers and small teams paid in USDC.

Whenever USDC enters a wallet, the agent applies a simple allocation policy:

`Payment received → 60% operating wallet → 20% tax wallet → 20% Aave savings`

The user installs it, chooses percentages and connects wallets. No portfolio dashboard, strategy marketplace or AI financial adviser.

The strongest demo is visual and understandable:

1. Send 100 USDC to the payment wallet.
2. Agent detects the transfer.
3. KeeperHub executes the splits.
4. One portion is supplied to Aave.
5. Show every transaction and run log.

KeeperHub already supports blockchain-event triggers, transfers and Aave write actions, so the implementation is tightly aligned with its native surfaces. ([docs.keeperhub.com][2])

| Originality | Feasibility | Sponsor fit | Demo strength |
| ----------: | ----------: | ----------: | ------------: |
|        7/10 |        9/10 |       10/10 |          9/10 |

**Total: 35/40**

## 5. Approval Janitor

An agent that regularly scans a wallet for dangerous or unnecessary token approvals and executes approved revocations.

Flow:

`Scan approvals → identify unlimited or stale approvals → apply user policy → simulate revoke → KeeperHub executes → send receipt`

Example policies:

* Revoke unlimited approvals older than 30 days.
* Block unknown spender contracts.
* Never touch allowlisted protocols.
* Ask before revoking approvals above a defined value.

The useful product is the automated cleanup, not an allowance dashboard. The agent should explain what it found in one sentence, then act according to an existing policy.

| Originality | Feasibility | Sponsor fit | Demo strength |
| ----------: | ----------: | ----------: | ------------: |
|        7/10 |        8/10 |        9/10 |          9/10 |

**Total: 33/40**

## My pick

Build **Skirwith**.

It has the cleanest path to a working submission:

* GitHub is already the frontend.
* One obvious trigger.
* One obvious transaction.
* Easy testnet demonstration.
* Strong developer adoption story.
* Can compete for both the main prize and onboarding bounty.
* Easy to package as a GitHub Action, reusable workflow template and five-minute tutorial.

The earlier KeeperHub hackathon rewarded production seriousness, reproducibility and real x402 or MCP execution. The winning project had live execution, extensive tests and documented integration issues. Skirwith lets you show those same qualities without building a massive protocol. ([KeeperHub][3])

Your scope should stop at:

`Install action → merge bounty PR → contributor gets paid → transaction receipt appears`

No token. No DAO platform. No freelance marketplace. No custom chat agent. No analytics suite.

[1]: https://docs.keeperhub.com/workflows?utm_source=chatgpt.com "Workflows - KeeperHub Docs"
[2]: https://docs.keeperhub.com/plugins/aave-v3?utm_source=chatgpt.com "Aave V3 - KeeperHub Docs"
[3]: https://keeperhub.com/blog/010-openagents-hackathon-wrap?utm_source=chatgpt.com "That's a Wrap on our First Hackathon. Here Is What 180 Builders Taught Us. | KeeperHub" chat gpt idea , Based on your constraints—**minimal**, **immediately consumable**, **not a soundbox**, **plug-and-play (not siloed)**, **scoped to win**—here are 5 ideas optimized for the KeeperHub hackathon. They are designed to showcase KeeperHub's core value (reliable execution) within a weekend of work.

### 1. The "Gas Tank" Top-up Agent
- **Concept:** A minimalist background agent that monitors a wallet's native token balance (ETH, MATIC, etc.). When the balance drops below a user-defined threshold, it autonomously executes a swap (e.g., USDC -> ETH) via KeeperHub to refill the "gas tank."
- **Why it fits:** It solves a real pain point (running out of gas mid-session). It relies entirely on KeeperHub's Smart Gas Estimation and execution to succeed.
- **Minimalism:** You don't need an LLM or complex reasoning. Just a cron job + a balance check.
- **Scope:** 1 transaction type, 1 threshold, 1 swap.
- **Ratings:**
    - **Originality:** 6/10 (Classic keeper bot, but solid).
    - **Feasibility:** 9/10 (Trivial to code using KeeperHub SDK).
    - **Sponsor Fit:** 10/10 (Directly showcases Gas Sponsorship and Gas Estimation).
    - **Demo Strength:** 8/10 (Easy to show a balance "tipping" and recovering via KeeperHub tx hash).

---

### 2. The "Receipt Saver" (Transaction Attestor)
- **Concept:** An agent that listens for a specific event (e.g., you tweet a specific string, or a Webhook hits your endpoint). It immediately "stamps" that event by writing a small piece of data to a cheap chain (or Base) via KeeperHub.
- **Why it fits:** "Immediately consumable." This gives users a permanent, onchain receipt that an event occurred (e.g., "I submitted my report on Aug 3").
- **Minimalism:** No need for complex DeFi. Just take input, call `eth_sendTransaction` with a data payload.
- **Scoped to win:** **High Originality** because everyone builds DeFi bots. This is a Web3 "IFTTT" that normal people understand instantly.
- **Ratings:**
    - **Originality:** 8/10.
    - **Feasibility:** 10/10 (Just use the MCP server to send a raw tx).
    - **Sponsor Fit:** 7/10 (Shows Audit Trail/Logging, but less emphasis on gas economics).
    - **Demo Strength:** 9/10 (Takes 3 seconds to demonstrate).

---

### 3. The "Universal Allowance" Approver
- **Concept:** KeeperHub requires users to approve token spending before swaps. This agent acts as a "Lazy Approver." When a transaction fails due to insufficient allowance, the agent automatically intercepts the failure, executes the approval transaction via KeeperHub, and re-submits the original transaction.
- **Why it fits:** **Plug-and-play.** This is a middleware layer that any existing DeFi protocol could plug into to fix the #1 user friction point (approval errors).
- **Minimalism:** Standard on-chain monitoring + `approve` call.
- **Scoped to win:** Solves a specific "Last Mile" failure mode that KeeperHub specifically mentions.
- **Ratings:**
    - **Originality:** 7/10.
    - **Feasibility:** 8/10 (Tricky logic to catch the revert and retry, but very doable).
    - **Sponsor Fit:** 9/10 (Showcases `retries` and reliability).
    - **Demo Strength:** 10/10 (Force a failed tx, watch the agent fix it automatically).

---

### 4. The "Daily DCA" Micro-Bot
- **Concept:** A cron-based agent that executes a fixed $5 DCA (Dollar Cost Average) buy of ETH or USDC every 24 hours. It uses KeeperHub's x402/MPP to pay the execution fee separately from the gas.
- **Why it fits:** **Not a soundbox.** This is a functional investment tool. "Immediately consumable" means I can set this up in 2 minutes and forget it.
- **Minimalism:** No Machine Learning. Just a timer + a swap.
- **Scoped to win:** Simple to code, easy to debug, and directly uses the **Gas Sponsorship** (since KeeperHub is paying the gas, the user only pays the DCA amount).
- **Ratings:**
    - **Originality:** 4/10 (Very common).
    - **Feasibility:** 10/10 (Standard KeeperHub example).
    - **Sponsor Fit:** 10/10 (Sustained usage of the KeeperHub stack).
    - **Demo Strength:** 8/10 (Show the tx hash and the balance increasing over time).

---

### 5. The "Liquidity Alarm" (Flash Crash Hedger)
- **Concept:** An agent that monitors the price spread between two DEXs (or a price oracle) for an asset you hold. If the price drops more than 5% in 10 minutes, the agent immediately executes a "Stop-Loss" swap to stablecoins via KeeperHub.
- **Why it fits:** **Immediately consumable (real life).** This is the most "real world" use case. It protects a portfolio while you sleep.
- **Minimalism:** Standard Price Feed (Pyth/Chainlink) + Swap.
- **Scoped to win:** High "Originality" because most agents just trade for profit; this trades for *loss prevention*. It heavily relies on KeeperHub's **Private Routing/MEV protection** so that the stop-loss isn't front-run.
- **Ratings:**
    - **Originality:** 8/10.
    - **Feasibility:** 7/10 (Requires price feed integration).
    - **Sponsor Fit:** 9/10 (Highlights Private Routing).
    - **Demo Strength:** 9/10 (Simulate a price drop in the UI and watch the agent execute).

---

### Recommendation for "Scoped to Win"
**Pick Idea #3 (Universal Allowance) or Idea #5 (Stop-Loss).**

- **Idea #3** is a "catch-all" fix for failed transactions, which directly addresses KeeperHub's core narrative ("reliability"). It shows you understand failure modes.
- **Idea #5** is sexy, easy to explain in a 3-minute pitch, and leverages KeeperHub's unique MEV protection (which other hackathons rarely touch). deepseek idea
→Skill "idea-validation"
Scout Step 5 x: Candidate concepts generated and consolidated from all submitted research.
The strongest concepts are not the ones with the most KeeperHub features. They are the ones with a single trigger, a bounded policy, one meaningful action, and an undeniable execution proof.
Rank	Concept	Core flow	Originality
1	Skirwith	GitHub PR merged → validate checks and bounty → pay contributor in USDC via KeeperHub → post receipt	8
2	Policy Gate	Agent proposes transfer → enforce policy and allowlist → execute approved action through KeeperHub → create evidence	6
3	Retry Guy	Failed transaction → diagnose error → alter execution parameters → retry safely via KeeperHub → show recovery trail	8
4	Gas Tank	Wallet falls below gas threshold → calculate refill → execute bounded top-up via KeeperHub → restore operational balance	6
5	Approval Janitor	Scan allowances → identify risky/stale approval → enforce policy → revoke through KeeperHub → produce receipt	7
Eliminated or deprioritized
- Generic Panic Button / stop-loss: Strong demo, but crowded with risk guardians and dependent on reliable price-feed and swap infrastructure.
- Dead-man’s-switch unwind: Dramatic but high security liability. A false positive can permanently damage user funds.
- x402 paywall / pay-per-call: Good protocol demonstration, but the payment mechanism risks becoming the entire product.
- Natural-language payroll / KeeperBooks: Useful, but generic agent payments and accounting integrations dilute the KeeperHub reliability story.
- DCA, yield, dust sweeping, reward compounding: Feasible but crowded, low originality, and weaker urgency.
- Cross-framework adapter: Valuable developer infrastructure, but low live-demo impact and larger integration surface.
- Receipt Saver: Easy to build but does not sufficiently showcase KeeperHub’s execution reliability.
- Multi-signer keep-alive: Practical but difficult to make visually compelling and potentially redundant with native workflows.
- Universal allowance auto-approver: Excellent failure demo, but automatically granting approvals creates a serious security objection. It should not be the default product behavior.
Top strategic insight
The best combined direction is:
Skirwith as the user-facing workflow, with Policy Gate and Retry Guy as the reliability layer.
This gives one focused product rather than three unrelated features:
1. A GitHub merge is the external trigger.
2. A deterministic policy checks recipient, bounty amount, labels, approvals, and daily limits.
3. KeeperHub validates or simulates the transfer.
4. KeeperHub executes the real USDC payment.
5. A retry path handles recoverable failures without replaying the same idempotency key.
6. The action posts the transaction and audit evidence back to GitHub.
That creates a much stronger story than “an agent sends money”:
Open-source work gets paid automatically, but only after the agent verifies the work and KeeperHub reliably settles the obligation.
Recommended MVP boundary
- GitHub Action trigger on merged pull requests
- One payment token: USDC
- One chain initially: Base or Sepolia, depending on KeeperHub wallet support and judging preference
- One repository-level configuration file
- Required status checks and optional bounty label
- Recipient mapping from contributor identity to wallet address
- Maximum payment and daily budget
- Duplicate-payment protection
- KeeperHub simulation or validation before execution
- KeeperHub execution through MCP or API
- Transaction receipt comment on the merged pull request
- Failure state with an actionable explanation
- README starter template and onboarding teardown for the bounty
No marketplace, DAO, payroll dashboard, LLM chat interface, custom token, multi-chain support, or generalized treasury automation in the first version.
The candidate is ready for ruthless comparative validation. Acknowledge for Scout Step 6: Validate the top concepts against competitors, market signals, and failure modes.
▣  Build · gpt-5.6-sol · 1m 6s
go
Scout Step 6: Validating the top five concepts against existing products, market signals, KeeperHub overlap, and the assumptions most likely to break in a live demo.
%WebFetch https://github.com/marketplace/actions/crypto-payments
%WebFetch https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#pull_request
%WebFetch https://github.com/opensource-observer/oso
%WebFetch https://docs.safe.global/home/overview
%WebFetch https://docs.openzeppelin.com/defender
%WebFetch https://www.coinbase.com/developer-platform/products/paymaster
Scout Step 6 x: Top concepts validated against market alternatives, technical constraints, and failure modes.
Competitive comparison
Concept	Direct alternatives	Differentiation
Skirwith	GitHub Actions, crypto payout scripts, bounty platforms, DAO payroll tools	Payment is triggered by a verified merge and leaves the receipt inside the developer workflow
Policy Gate	Safe policies, OpenZeppelin Defender, wallet guardians, custom spend controls	Agent intent is evaluated before KeeperHub execution with readable policy evidence
Retry Guy	KeeperHub native retries, relayers, Defender Relayers, RPC retry wrappers	Independent diagnosis and recovery layer
Gas Tank	Keeper bots, smart-account paymasters, wallet automation	Operational gas refueling for agent fleets
Approval Janitor	Revoke.cash, wallet security tools, Defender Monitor	Autonomous policy-controlled revocation through KeeperHub
Panic Button	Stop-loss bots, DeFi automation, risk guardians	Private emergency unwind through KeeperHub
Market and timing assessment
- GitHub Actions provides the exact merged-PR trigger needed for Skirwith, including a documented pull_request.closed plus merged == true flow.
- Existing blockchain automation products prove demand for monitored execution, relayers, transaction proposals, and action workflows.
- OpenZeppelin Defender is being phased out for new signups and scheduled for shutdown on July 1, 2026, which creates a migration and replacement window for execution tooling.
- KeeperHub’s own open issues show that onboarding, schema clarity, authentication, idempotency, and failure recovery are active problems rather than invented ones.
- Skirwith has a narrow initial user and distribution path: open-source maintainers, DAO contributors, hackathon organizers, and bounty programs.
- The initial market is not large enough to justify a standalone payroll company by itself. The credible startup expansion is broader: event-driven, policy-controlled payments for developer and agent workflows.
Differentiation verdict
Skirwith is differentiated if it remains:
- GitHub-native
- Triggered by verified repository events
- Policy-controlled
- Idempotent
- KeeperHub-executed
- Receipt-producing
It becomes weak if it expands into:
- Generic payroll
- A DAO treasury dashboard
- Natural-language payments
- A marketplace
- A speculative AI evaluator
- A custom wallet platform
Critical failure modes
- Fork or untrusted-code risk: Never expose the KeeperHub secret to arbitrary pull-request code. Use a trusted workflow pattern, pull_request_target only with strict safeguards, or a separate trusted dispatch job that does not check out untrusted code.
- Wrong contributor wallet: Require an explicit maintainer-controlled wallet mapping. Never infer a payment address from an arbitrary PR body or contributor-controlled file.
- Duplicate payout: Use a deterministic payment key based on repository, PR number, merge commit, and payout configuration. Persist or verify payment state before sending.
- Unapproved payment: Require an explicit bounty label or repository configuration and enforce a maximum amount.
- Token or chain mismatch: Start with one token and one chain. Validate the token contract and recipient before execution.
- KeeperHub schema/auth friction: Build a direct integration seam and a deterministic local provider so the product remains testable while credentials or platform setup are pending.
- Misrepresenting mock execution: The final demo must show a real KeeperHub transaction and the README must clearly separate local fixtures from live execution.
VC-style verdict
- Skirwith: GREEN for hackathon MVP; YELLOW for standalone startup
- Policy Gate: YELLOW
- Retry Guy: YELLOW
- Gas Tank: YELLOW
- Approval Janitor: YELLOW/RED until allowance discovery and safety controls are proven
- Panic Button: YELLOW/RED because of crowded competition and irreversible-fund risk
Recommended product
Build Skirwith, positioned as:
The GitHub Action that turns verified merged work into policy-controlled, auditable stablecoin payments through KeeperHub.
Pair it with a small reusable KeeperHub onboarding starter template, but submit Skirwith as the main BUIDL. This maximizes the probability of both a Grand Prize placement and the onboarding bounty without creating two unrelated products.
Acknowledge for Scout Step 7: Lock the final recommendation and MVP plan.
▣  Build · gpt-5.6-sol · 3m 12s
go
Scout Step 7 x: Final recommendation and MVP plan locked.
Final Recommendation
Project: Skirwith
Positioning:
Skirwith turns verified GitHub contributions into policy-controlled, auditable stablecoin payments. When an approved pull request merges, Skirwith validates the repository rules, simulates the payout, and executes it through KeeperHub.
Primary hackathon story:
Merged PR → policy check → KeeperHub simulation → real USDC transfer → GitHub receipt
Why this is the strongest choice
- It has a clear user and immediate use case.
- GitHub is already the interface, so no large dashboard is required.
- The trigger and outcome are easy for judges to understand.
- It demonstrates KeeperHub as an execution and reliability layer rather than merely mentioning it.
- It can use MCP, workflow validation, simulation, audit trail, smart gas handling, and transaction status.
- It qualifies naturally for the onboarding bounty through a reusable starter template and onboarding teardown.
- It avoids crowded DCA, yield, wallet guardian, and generic trading categories.
- The live demo can complete in under 90 seconds.
MVP Scope
Required
- GitHub Action triggered only when a pull request is merged
- Repository configuration file, for example .github/skirwith.yml
- Maintainer-controlled contributor-to-wallet mapping
- Explicit payout label such as skirwith-bounty: 25
- Maximum payout amount
- Daily payout limit
- One supported token: USDC
- One supported chain: Base or Sepolia, based on KeeperHub wallet availability
- Duplicate-payment protection
- KeeperHub simulation or workflow validation
- Real KeeperHub execution
- Transaction hash and explorer link
- GitHub pull request comment containing:
- recipient
- amount
- policy result
- KeeperHub execution status
- transaction link
- audit-trail reference
- Clear failure output without sending funds
Reliability layer
- Deterministic payment key:
repository + pull request number + merge commit + payout amount
- Preflight validation for recipient, token, chain, amount, and budget
- No automatic retry using the same idempotency key after a failed execution
- Bounded retry behavior only for explicitly recoverable failures
- Complete local event record for every decision and execution attempt
Explicitly out of scope
- Natural-language payment commands
- Multi-chain support
- DAO treasury management
- Contributor identity inference
- Arbitrary PR-body payment addresses
- Automatic approval granting
- LLM-based judgment of code quality
- Payroll, accounting, or marketplace features
Demo Script
 1. Show .github/skirwith.yml with a USDC bounty, wallet mapping, and policy limits.
 2. Open a pull request containing a small code change.
 3. Apply the approved bounty label.
 4. Merge the pull request.
 5. GitHub Actions starts Skirwith.
 6. Skirwith displays the policy decision and simulation result.
 7. KeeperHub executes the real stablecoin transfer.
 8. The workflow polls execution status.
 9. The pull request receives a comment with the transaction and audit links.
10. Show the confirmed transaction on the block explorer.
Failure branch for the pitch
Run a second PR with an amount above the configured maximum. Skirwith should block the payout, explain the violated policy, and prove that no transaction was submitted.
Bounty Strategy
Submit Skirwith for the main prize and include a separate onboarding package:
- Reusable GitHub Action
- Starter repository
- One-command configuration guide
- KeeperHub MCP setup instructions
- First-transaction troubleshooting guide
- Short teardown of authentication, schema, and idempotency friction encountered during integration
- Proposed documentation or template improvements for KeeperHub
Recommended Architecture
GitHub pull_request.closed
        |
        v
Skirwith GitHub Action
        |
        +--> Load trusted repository policy
        +--> Resolve maintainer-controlled wallet
        +--> Check amount, token, chain, and budget
        +--> Validate or simulate KeeperHub action
        |
        v
KeeperHub MCP / API
        |
        +--> Smart gas and execution
        +--> Audit trail
        +--> Transaction status
        |
        v
GitHub receipt comment + block explorer
Boilerplate Assignment
This is a Web3 application requiring KeeperHub, wallet configuration, RPC-compatible execution, and transaction status handling.
This project needs: boilerplate-web3
The next General step is Step 3: load The Look for brand identity and UX direction. Before that, approve or reject the Skirwith direction.
▣  Build · gpt-5.6-sol · 35.0s
we are not using boilerplate but a clean new private repo
▣  Plan · gpt-5.6-sol · interrupted
we are not using boilerplate but a clean new private repo
Scout Step 7 x: Repository strategy corrected.
We will not clone or use a boilerplate. We will create a clean new private GitHub repository for Skirwith and build only the required MVP surface.
Repository plan
- New private repository under mystiquemide
- Fresh project structure
- No inherited auth, database, UI, or unused dependencies
- GitHub Action as the primary interface
- KeeperHub MCP/API integration behind a small provider boundary
- Deterministic local test provider for development
- Real KeeperHub execution required before submission
- README, architecture diagram, onboarding guide, and demo artifacts included from the start
- Progressive commits throughout the build
The corrected assignment is:
This project needs: a clean new private Web3 repository, not boilerplate-web3.
The next step is Step 3: Load The Look for the brand direction. Before loading it, provide the preferred repository name if you already have one, or say choose a name and we will validate candidates using the naming process.
▣  Plan · gpt-5.6-sol · 52.6s
choose a name
▣  Plan · gpt-5.6-sol · interrupted
# Project Naming — Zero-Prior-Usage Validation

Use when MystiqueMide needs a name for a hackathon project, startup, or product. The bar is extremely high: ZERO prior usage by any company, product, brand, or project — not just "not used in AI" but no presence anywhere.

## User Preferences

- **Absolute uniqueness**: name must have zero existing usage by any company, product, brand, or project. Even light usage in completely different domains is a rejection.
- **Style**: Latin/Greek-rooted or made-up premium-sounding words. Two syllables preferred. Clean, clinical, credible.
- **Will iterate**: expect multiple rounds. The user will reject names with even minor collisions until a truly clean one is found.

## Workflow

### 1. Generate Candidates
Brainstorm 4-5 names that capture the project's core concept. Prefer:
- Real Latin/Greek words with relevant meanings (Sentio, Animus, Gnosis)
- Made-up words that sound like they could be real (Otheon, Zelaris, Vaelis)
- Two syllables, easy to say, premium enterprise feel

Avoid:
- Names already known to be taken in any domain
- Generic English words (Mosaic, Cortex, Synapse)
- Names that sound like existing major products

### 2. Batch Search
Search all candidates simultaneously using `web_search(query)`. Use queries like:
```
"CandidateName" software OR AI OR company OR product OR platform OR startup OR brand
```

Add an X/Twitter search with `x_search(query="CandidateName product OR startup OR company")` for additional coverage.

### 3. Classify Results
For each name, scan the search results:
- **CLEAN**: zero relevant results = candidate
- **TAKEN**: any company, product, brand, or project using the name = reject
- **LIGHT USE**: small company in unrelated domain = reject per user preference

The user rejects even "light use" in unrelated domains. A medical device startup in another country is still a rejection.

### 4. Present Verdict
Show a table with clear ✅/❌ per candidate. If none are clean, generate a fresh batch and repeat.

### 5. Final Validation
Once the user picks, do one more dedicated search on just that name to confirm zero hits before finalizing.

## Pitfalls

- Don't skip the X/Twitter search. Many small projects only exist on X.
- Don't assume a name is clean because it's obscure. Search every candidate.
- Don't skip re-searching the final pick. Names get missed in batch searches.
- Common words (Latin roots especially) are frequently used by small consultancies, medical devices, and legacy software. Expect high rejection rates.
- Made-up names (Otheon, Zelaris) have a higher hit rate than real Latin words (Sentio, Animus).

## Example Session

User: "Pick a name for my organizational immune system project. Must be fresh."

1. Generate: Sentio, Animus, Gnosis, Otheon, Vaelis
2. Batch search all 5
3. Results: Sentio (crypto startup), Animus (clean), Gnosis (crypto), Otheon (clean), Vaelis (clean)
4. Present: Animus, Otheon, Vaelis as clean options
5. User picks Otheon → final validation search → confirmed zero hits


Base directory for this skill: /home/mide/.config/opencode/skills/project-naming
Relative paths in this skill (e.g., scripts/, references/) are relative to this base directory.
Step 5.5: Generating a batch of distinctive names, then checking exact-name collisions across web, GitHub, and X before presenting any candidate.
%WebFetch https://www.google.com/search?q=%22Praxora%22+software+OR+AI+OR+company+OR+product+OR+platform+OR+startup+OR+brand
%WebFetch https://www.google.com/search?q=%22Clyvora%22+software+OR+AI+OR+company+OR+product+OR+platform+OR+startup+OR+brand
%WebFetch https://www.google.com/search?q=%22Bountara%22+software+OR+AI+OR+company+OR+product+OR+platform+OR+startup+OR+brand
%WebFetch https://www.google.com/search?q=%22Paylith%22+software+OR+AI+OR+company+OR+product+OR+platform+OR+startup+OR+brand
%WebFetch https://www.google.com/search?q=%22Zelvoro%22+software+OR+AI+OR+company+OR+product+OR+platform+OR+startup+OR+brand
%WebFetch https://x.com/search?q=%22Praxora%22%20OR%20%22Clyvora%22%20OR%20%22Bountara%22%20OR%20%22Paylith%22%20OR%20%22Zelvoro%22&src=typed_query
Step 5.5: Candidate names generated. I am validating them across public web, GitHub, and X-indexed results before presenting only names with no discovered company, product, brand, or project collision.
%WebFetch https://www.bing.com/search?q=%22Praxora%22+software+OR+AI+OR+company+OR+product+OR+platform+OR+startup+OR+brand
%WebFetch https://www.bing.com/search?q=%22Clyvora%22+software+OR+AI+OR+company+OR+product+OR+platform+OR+startup+OR+brand
%WebFetch https://www.bing.com/search?q=%22Bountara%22+software+OR+AI+OR+company+OR+product+OR+platform+OR+startup+OR+brand
%WebFetch https://www.bing.com/search?q=%22Paylith%22+software+OR+AI+OR+company+OR+product+OR+platform+OR+startup+OR+brand
%WebFetch https://www.bing.com/search?q=%22Zelvoro%22+software+OR+AI+OR+company+OR+product+OR+platform+OR+startup+OR+brand
%WebFetch https://github.com/search?q=%22Praxora%22+OR+%22Clyvora%22+OR+%22Bountara%22+OR+%22Paylith%22+OR+%22Zelvoro%22&type=repositories
%WebFetch https://github.com/search?q=%22Veylora%22&type=repositories
%WebFetch https://github.com/search?q=%22Kivora%22&type=repositories
%WebFetch https://github.com/search?q=%22Orvexa%22&type=repositories
%WebFetch https://github.com/search?q=%22Tavryn%22&type=repositories
%WebFetch https://github.com/search?q=%22Elyvex%22&type=repositories
%WebFetch https://github.com/search?q=%22Veylora%22+OR+%22Kivora%22+OR+%22Orvexa%22+OR+%22Tavryn%22+OR+%22Elyvex%22&type=users
Naming Step 1 x: Candidate generation and collision screening completed. The first batch was rejected because GitHub already contains collisions for Praxora, Paylith, Clyvora, and Zelvoro; I am screening a second, more distinctive batch before recommending a repository name.
$ gh api --method GET search/repositories -f q='"Veylora"' --jq '.total_count, (.items[] | [.full_name, .description] | @tsv)'
11
webdesigner202222-rgb/VeyloraWebsite	
arminmoradi-it/veylora	A Modular Enterprise Operations Platform for building secure, scalable and maintainable business systems.
Infiloo/Veylora	Veylora brings pure good vibes — hugs, pats, boops, chaos, and whatever else you come up with 💫 Delightful. Perfectly unnecessary. 100 % worth it. 💕
i4lt/veylora	simple project created for testing my info with ai help
webdesigner202222-rgb/VeyloraStudio	
K-RAMYA05/VeyLora	
developerssofficial/veylorae.shop	
Infiloo/Veylora-Slack	
Danir9922/Veylora-Shaders	Source files and development repository for Veylora Shaders, a cinematic Minecraft Java shader pack.
…
Click to expand
$ gh api --method GET search/repositories -f q='"Klyvra"' --jq '.total_count, (.items[] | [.full_name, .description] | @tsv)'
3
klyvra-org/klyvra	
klyvra-org/klyvra-website	
The-Klyvra-Project/klyvra-installer	A CLI installer, apart of The Klyvra Project
$ gh api --method GET search/repositories -f q='"Pactyra"' --jq '.total_count, (.items[] | [.full_name, .description] | @tsv)'
1
Dreamcoder08/pactyra
$ gh api --method GET search/repositories -f q='"Merqis"' --jq '.total_count, (.items[] | [.full_name, .description] | @tsv)'
1
SIO-Clients-Projects/merqisconsulting-react
$ gh api --method GET search/repositories -f q='"Kredyx"' --jq '.total_count, (.items[] | [.full_name, .description] | @tsv)'
0
$ gh api --method GET search/repositories -f q='"Vercora"' --jq '.total_count, (.items[] | [.full_name, .description] | @tsv)'
0
$ gh api --method GET search/users -f q='Klyvra OR Pactyra OR Merqis OR Kredyx OR Vercora' --jq '.total_count, (.items[] | .login)'
10
vercora
klyvra-org
klyvralabs
KlyvraHQ
The-Klyvra-Project
vercorarac
merqisdev
klyvraa
Klyvran
…
Click to expand
Scout Step 5.5 x: Name candidates generated and screened.
The strongest candidate is Kredyx.
Candidate	GitHub repository search	GitHub user search
Veylora	11 matches	Multiple users
Klyvra	3 matches	Multiple organizations/users
Pactyra	1 match	Existing project presence
Merqis	1 match	Existing project presence
Kredyx	0 matches	0 matches
Vercora	0 matches	Existing user presence
Recommended name: Kredyx
- Sounds credible for verified contributor payments
- Distinctive and short
- Suggests credit, trust, and settlement without being a generic payment term
- Available as a clean GitHub repository name based on the current checks
Working product identity
Kredyx  
Verified work. Policy-controlled payment. KeeperHub settlement.
The general web and X searches were blocked by search-provider verification, so the absolute zero-usage requirement cannot be proven from those sources in this environment. GitHub screening found no collision for Kredyx. Before finalizing, perform one dedicated search for "Kredyx" across web search, X, package registries, domains, and trademarks.
Approve Kredyx for final validation, or request another naming batch.
▣  Plan · gpt-5.6-sol · 2m 1s
let us use merge pay ,we will find a name later
Scout Step 5.5 x: Skirwith will remain the temporary working name. Final naming and collision validation are deferred until later.
No repository or files have been created. The next General step is Step 3: load The Look and develop Skirwith’s brand, UX flow, and visual direction.
▣  Plan · gpt-5.6-sol · 15.4s
go
→Skill "hackathon-brand-design"
▣  Plan · gpt-5.6-sol · interrupted
go
continue
▣  Plan · gpt-5.6-sol · interrupted
continue
Step 3 x: The Look has defined Skirwith’s brand and UX direction.
A. Brand Core
Product: Skirwith
Audience:
- Open-source maintainers
- DAO contributors
- Hackathon organizers
- Protocol teams
- Developer communities
- Companies paying software contributors
Core promise:
Verified work becomes verified payment.
Emotional hook:
Skirwith removes the awkward gap between “your contribution was accepted” and “you actually got paid.”
Brand personality:
- Trustworthy
- Precise
- Developer-native
- Calm under failure
- Transparent
- Operational rather than speculative
Positioning:
Skirwith is a GitHub-native payment rail for rewarding verified contributions with policy-controlled, auditable stablecoin settlement through KeeperHub.
B. Naming Direction
Keep Skirwith as the working name during the hackathon.
The name is immediately understandable and communicates the core trigger:
- Merge represents verified contribution completion
- Pay represents the resulting settlement
- It is easy to explain in one sentence
- It is easy for judges to remember after a short demo
Perform final name collision research after the MVP is stable. Do not delay implementation for naming.
C. Recommended Brand Direction
Use a proof-of-work settlement visual language.
The product should feel like a trusted release pipeline, not a crypto casino and not a generic AI dashboard.
Visual concept:
A contribution moves through a narrow verification line and exits as a confirmed payment receipt.
Use repository events, checkmarks, transaction states, and receipt stamps as the main visual vocabulary.
Avoid:
- Neon trading visuals
- Floating AI brains
- Generic gradients
- Cartoon coins
- Overbuilt dashboards
- Unexplained blockchain jargon
D. Logo Direction
Create a simple wordmark with a compact symbol.
Symbol concept:
- A merge junction formed from two angled lines
- The lines join into a small checked square
- The checked square represents both merged code and approved payment
- Use the symbol independently as the GitHub Action icon and favicon
Wordmark:
- Lowercase skirwith for approachability
- Medium-weight geometric sans-serif
- Tight spacing
- No italic treatment
- No decorative crypto motifs
E. Color and Typography System
Primary palette:
- Ink: #101820
- Paper: #F7F8F5
- GitHub green: #2DA44E
- Settlement blue: #2563EB
- Verified mint: #DDF7E6
- Warning amber: #B7791F
- Blocked red: #C53030
- Muted slate: #667085
- Border gray: #D8DEE4
Usage:
- Ink for primary text and action controls
- Paper for the application background
- GitHub green for contribution verification
- Settlement blue for KeeperHub execution
- Mint for completed payments
- Amber for manual review
- Red only for blocked payouts or failed execution
Typography:
- Primary: Inter or Geist Sans
- Technical details: Geist Mono or IBM Plex Mono
- Use monospace only for hashes, amounts, workflow IDs, and policy values
- Keep typography compact and information-dense without becoming cramped
F. Mascot Concept
A mascot is optional for the MVP and should not delay the build.
If used, create The Receipt Runner:
- Small rectangular courier form
- One side resembles a GitHub merge node
- The other side carries a stamped payment receipt
- Simple two-color silhouette
- No face-heavy cartoon styling
- Expressions limited to ready, reviewing, paid, and blocked
Use it only for:
- Empty states
- Onboarding documentation
- Social graphics
- Pitch deck transitions
Do not put it in the primary transaction interface.
G. Product UX Flow
1. Onboarding
Screen content:
- Connect KeeperHub
- Select chain and token
- Add maintainer-controlled wallet mapping
- Set maximum payout
- Set daily budget
- Generate starter workflow
- Run a test transaction
Primary CTA:
Create payment policy
Secondary CTA:
View onboarding guide
2. Policy configuration
Show a compact policy editor:
- Allowed repository
- Required label
- Token
- Chain
- Maximum payout
- Daily budget
- Wallet mappings
- Duplicate protection status
Use plain language:
Skirwith will only pay labeled pull requests that pass the configured policy.
3. Execution activity
Show a vertical execution timeline:
- Merge detected
- Policy evaluated
- Recipient verified
- Simulation passed
- KeeperHub execution started
- Transaction confirmed
- GitHub receipt posted
Each stage should expose a timestamp and status.
4. Blocked payout
Make blocked states useful rather than alarming.
Example:
Payment blocked. The requested amount exceeds the repository limit of 25 USDC. No transaction was submitted.
Actions:
- View policy
- Adjust limit
- Retry after approval
5. Completed payout
Show:
- Contributor identity
- Amount and token
- Repository and PR number
- KeeperHub execution status
- Transaction hash
- Explorer link
- Audit trail link
- Payment key
H. Landing Page Direction
Hero
Headline:
Pay contributors when the work is merged.
Supporting copy:
Skirwith connects verified GitHub contributions to policy-controlled stablecoin payments through KeeperHub.
Primary CTA:
View the workflow
Secondary CTA:
Read the starter guide
Hero visual:
A single horizontal execution rail:
Pull request merged → Policy passed → KeeperHub settled → Contributor paid
Problem section
Headline:
Accepted work should not need a second workflow to get paid.
Show three operational problems:
- Manual payout spreadsheets
- Unclear payment status
- Unsafe automation without policy limits
How it works
Use four large numbered stages:
1. Configure the repository policy
2. Merge an approved contribution
3. Let KeeperHub execute the payment
4. Post the proof back to GitHub
Reliability section
Show a blocked payment beside a successful payment.
This demonstrates that Skirwith is not blindly moving funds. It can refuse unsafe actions and prove why.
KeeperHub integration section
Make the integration explicit:
- KeeperHub MCP/API execution
- Smart gas handling
- Execution status
- Audit trail
- Transaction proof
Final CTA
Turn your merge queue into a payment queue.
I. Pitch Deck Visual Direction
Use a white or paper-colored background with dark ink typography and a single execution rail across the deck.
Slide 1: The problem
A merged pull request beside a pending payout spreadsheet.
Slide 2: The insight
The merge event already proves the work was accepted. The missing layer is safe settlement.
Slide 3: Skirwith
Show the four-stage execution rail.
Slide 4: KeeperHub integration
Show the policy, simulation, execution, status, and audit trail path.
Slide 5: Live demo
Show one successful payment and one blocked payment.
Slide 6: Why it matters
Show expansion from contributor bounties to agent jobs, DAO grants, bug bounties, and developer rewards.
Final wow moment:
The merged pull request receives a live comment containing the confirmed transaction and audit trail link. Then show a second payout blocked by policy with no transaction submitted.
J. Image Generation Prompts
Logo prompt
Minimal vector logo for Skirwith, a GitHub-native stablecoin payment rail for verified software contributions. Create a compact merge-junction symbol that resolves into a checked square, paired with a lowercase geometric sans-serif wordmark. Ink black, GitHub green, settlement blue, white background. Flat vector design, precise geometry, developer infrastructure feel, no coins, no gradients, no mascots, no 3D, no em dashes.
Mascot prompt
Simple editorial mascot for Skirwith, a small rectangular receipt courier carrying a verified payment receipt. The silhouette combines a GitHub merge junction with a stamped transaction receipt. Ink black, GitHub green, settlement blue, flat vector illustration, restrained enterprise developer-tool aesthetic, four reusable poses: reviewing, approved, paid, blocked. No floating coins, no gradients, no 3D, no em dashes.
Hero prompt
Editorial product illustration for Skirwith showing a single precise execution rail from merged pull request to policy approval to KeeperHub settlement to contributor payment receipt. Paper background, dark ink lines, GitHub green verification node, blue settlement node, compact technical labels, flat vector style, no gradients, no generic AI imagery, no crypto speculation imagery, no em dashes.
K. Final Creative Recommendation
Build the product interface around the execution timeline, not a traditional analytics dashboard.
Build first:
1. GitHub workflow configuration
2. Policy decision view
3. KeeperHub execution state
4. GitHub receipt comment
5. Blocked payout state
6. Successful transaction proof
Avoid building:
- A full web dashboard before the workflow works
- Chat-based payment commands
- A mascot-dependent interface
- Multi-chain support
- Decorative blockchain visualizations
- Broad payroll features
The fastest judge impression should be:
“I merged code, Skirwith verified the policy, KeeperHub settled the payment, and GitHub received the proof.”
▣  Plan · gpt-5.6-sol · 52.9s
make sense , what is next?
Step 3 x: The Look approved
The next step is:
Step 4: API and platform access check
Before creating the private repository or writing code, we verify the credentials and access required for a real submission:
- KEEPERHUB_API_KEY or KeeperHub MCP OAuth access
- KeeperHub organization and wallet integration
- KeeperHub-supported chain and token
- GitHub repository and Actions permissions
- Any optional model API key, only if we use an LLM
- Explorer access for the final transaction link
We will not require OpenAI or Anthropic unless the implementation genuinely needs an LLM. The core Skirwith policy engine can be deterministic, which is safer and easier to verify.
Reply go to begin Step 4.
▣  Plan · gpt-5.6-sol · 16.2s
go
Step 4: Checking the local environment and platform access required for a real KeeperHub execution. I will inspect credential presence without printing secret values, verify GitHub access, and confirm the workspace state before planning repository creation.
$ env | LC_ALL=C sort | awk -F= '/(KEEPERHUB|OPENAI|ANTHROPIC|GITHUB|RPC|BASE|SEPOLIA|ETHERSCAN)/ {print $1 "=" (length($2) ? "[present]" : "[empty]")}'
ANTHROPIC_AUTH_TOKEN=[present]
ANTHROPIC_BASE_URL=[present]
ANTHROPIC_MODEL=[present]
$ gh auth status
github.com
  ✓ Logged in to github.com account mystiquemide (/home/mide/.config/gh/hosts.yml)
  - Active account: true
  - Git operations protocol: https
  - Token: gho_************************************
  - Token scopes: 'gist', 'read:org', 'repo', 'workflow'
$ pwd && git status --short --branch
/home/mide
fatal: not a git repository (or any of the parent directories): .git
$ command -v keeperhub || command -v kh || true; command -v claude || true; command -v recordly || true; command -v capcut || true
/home/mide/.local/bin/claude
Step 4 x: Access and environment check completed.
Available
- GitHub CLI authenticated as mystiquemide
- Required GitHub scopes present: repo, workflow
- Anthropic environment configuration is present
- Claude CLI is installed
Missing or not detected
- KEEPERHUB_API_KEY
- KeeperHub MCP authentication or an existing KeeperHub session
- KeeperHub CLI (kh) was not detected
- A project repository does not exist yet
- Recordly and CapCut were not detected in the current PATH
Important
We do not need an LLM API key for the core Skirwith MVP. The payment policy engine should be deterministic. We do need KeeperHub access before creating or testing a real payout.
Configure one of these:
1. Create a KeeperHub organization API key beginning with kh_ and make it available as KEEPERHUB_API_KEY.
2. Use KeeperHub OAuth through the MCP server:
https://app.keeperhub.com/mcp
Also confirm that the KeeperHub organization has:
- A funded wallet integration
- A supported testnet or mainnet selected
- Permission to execute transfers
- A test recipient wallet address
No files or repositories were changed. Reply ready after KeeperHub access and wallet setup are available.
▣  Plan · gpt-5.6-sol · 34.0s
how do i get the key?
Step 4: Get the KeeperHub API key
1. Open app.keeperhub.com (https://app.keeperhub.com) and sign in.
2. Select or create your KeeperHub organization.
3. Open Settings → API Keys → Organisation.
4. Click Create API key.
5. Name it something recognizable, such as skirwith-development.
6. Copy the generated key. It should begin with kh_. It may only be displayed once.
7. Store it locally as KEEPERHUB_API_KEY. Do not paste the key into this chat, commit it, or place it in the future repository’s tracked files.
For your current Linux/WSL terminal session:
export KEEPERHUB_API_KEY='kh_your_key_here'
That command only lasts until the terminal closes. Later, we will place it in the private repository’s ignored .env.local and add the same secret to GitHub Actions as:
KEEPERHUB_API_KEY
GitHub location:
Repository → Settings → Secrets and variables → Actions → New repository secret
You will also need a KeeperHub wallet integration:
1. In KeeperHub, open Wallet Management or Integrations.
2. Connect or create the wallet used for payouts.
3. Start on a supported testnet, preferably Sepolia if available.
4. Fund it with the required test token and gas, unless KeeperHub sponsorship covers gas.
5. Keep the wallet narrowly funded during development.
If the API Keys page is unavailable, use KeeperHub MCP OAuth instead:
claude mcp add --transport http keeperhub https://app.keeperhub.com/mcp
Then run /mcp inside Claude Code and approve access in the browser. For our GitHub Action, however, a kh_ organization key is preferable because CI cannot complete an interactive browser login.
Once configured, reply ready. Do not send the actual key.
▣  Plan · gpt-5.6-sol · 18.4s
ready
$ if [ -n "${KEEPERHUB_API_KEY:-}" ]; then printf 'KEEPERHUB_API_KEY=[present]\n'; else printf 'KEEPERHUB_API_KEY=[missing]\n'; fi
KEEPERHUB_API_KEY=[missing]
Step 4: KeeperHub access is not detected in this terminal session.
KEEPERHUB_API_KEY is currently missing from the environment. Since the key must remain secret, do not paste it here.
Set it in the same terminal session where we will work:
export KEEPERHUB_API_KEY='kh_your_key_here'
Then verify only that it is present:
if [ -n "$KEEPERHUB_API_KEY" ]; then
  printf 'KEEPERHUB_API_KEY=[present]\n'
else
  printf 'KEEPERHUB_API_KEY=[missing]\n'
fi
If you stored it in a .env file, that does not automatically export it to the shell. Load it with:
set -a
source .env
set +a
Run the presence check and reply present.
▣  Plan · gpt-5.6-sol · 22.4s
present
Step 4 x: KeeperHub key presence confirmed by you. I will not inspect or expose its value.
The next step is repository setup, but Plan Mode is currently active, so I will only prepare the implementation plan and make no repository or file changes.
# Todos
[•] Confirm private repository name and GitHub organization
[ ] Create clean private Skirwith repository
[ ] Bootstrap minimal GitHub Action and deterministic policy engine
[ ] Integrate KeeperHub execution behind a provider boundary
[ ] Add tests, documentation, architecture diagram, and onboarding guide
[ ] Run local QA and verify a real KeeperHub transaction
Step 4 x: KeeperHub credential setup confirmed on your side. The key remains private and will not be requested here.
The next implementation sequence is:
1. Confirm repository target
- GitHub owner: mystiquemide
- Visibility: private
- Suggested repository: skirwith
- No boilerplate
2. Create the clean repository
- Initialize a minimal TypeScript project
- Add .gitignore, .env.example, and secret-handling rules
- Configure GitHub Actions permissions
- Keep the first commit limited to project foundation
3. Build the deterministic payment engine
- Parse .github/skirwith.yml
- Validate repository, label, recipient, token, chain, amount, and daily limit
- Generate a deterministic payment key
- Block unsafe payments without submitting a transaction
4. Add KeeperHub execution
- Implement a small provider interface
- Add a local deterministic provider for tests
- Add the real KeeperHub provider using KEEPERHUB_API_KEY
- Poll execution status and capture transaction and audit references
5. Add GitHub integration
- Trigger on merged pull requests
- Post success or blocked comments
- Never expose KeeperHub secrets to untrusted pull-request code
- Protect against duplicate payouts
6. Add proof and documentation
- Unit tests and fixture events
- Architecture diagram
- Starter workflow
- KeeperHub onboarding teardown
- Demo instructions
- Security model
7. Verify before submission
- Run local tests
- Run a safe KeeperHub testnet transaction
- Confirm the explorer link and audit trail
- Test both successful and blocked payout paths
- Add progressive commits
The only confirmation needed before repository creation is:
Create the private repository mystiquemide/mergepay?
▣  Plan · gpt-5.6-sol · 42.4s
let us plan everything first ...use master forge team 
→Skill "Codex-master-forge"
I’ll keep this read-only and turn the approved Skirwith direction into a complete Master Forge execution plan first. I’m checking the current workspace and the KeeperHub integration constraints, then I’ll present the phase gates, deliverables, and decisions that need approval before any repository or file is created.
→Read . [limit=2000, offset=1]
%WebFetch https://docs.keeperhub.com/getting-started/quickstart
%WebFetch https://docs.keeperhub.com/api/direct-execution
%WebFetch https://docs.keeperhub.com/ai-tools/agentic-wallet
Step 7 in progress: Master Forge is loaded. I am switching to its Phase 1 planning gate and will define the product, architecture boundaries, security model, delivery sequence, and verification criteria before any repository or file changes.Step 7 x: Master Forge Phase 1 planning complete
No repository, files, commits, or configuration have been changed.
Product Definition
Working name: Skirwith
One-line product:
Skirwith pays verified GitHub contributors automatically after an approved pull request is merged, using deterministic policy checks and KeeperHub execution.
Primary user:
- Open-source maintainer or DAO operator managing contributor rewards
Core user journey:
Configure policy
  -> Contributor opens pull request
  -> Maintainer reviews and labels bounty
  -> Pull request is merged
  -> Skirwith verifies the event
  -> Policy engine approves or blocks payment
  -> KeeperHub simulates the transfer
  -> KeeperHub executes the real transfer
  -> Skirwith posts proof back to GitHub
The product is not:
- A payroll dashboard
- A natural-language wallet
- An AI code reviewer
- A DAO treasury platform
- A generic crypto payment gateway
- A multi-chain automation marketplace
Master Forge Team Assignments
Researcher
- Verify KeeperHub API behavior against current documentation
- Confirm supported testnet, token transfer format, polling behavior, and transaction links
- Track known integration issues around authentication, idempotency, and payload schemas
- Avoid unsupported claims about gas sponsorship, private routing, or MCP inside GitHub Actions
Product Manager
- Define the PRD, acceptance criteria, success metrics, and scope boundaries
- Ensure the product demonstrates a complete user outcome rather than isolated KeeperHub calls
- Keep the MVP narrow enough to finish and verify before the deadline
Planner
- Create the dependency-ordered implementation sequence
- Mark tasks as small, medium, or large
- Separate the main prize path from the onboarding bounty path
- Reserve time for real transaction verification, video recording, and submission
Architect
- Define the GitHub Action runtime and provider boundary
- Design configuration, policy, idempotency, execution, and receipt contracts
- Document the trust boundary between GitHub, Skirwith, and KeeperHub
- Produce the architecture diagram and ADRs
Designer
- Keep GitHub as the primary interface
- Design policy results, execution timeline, success receipt, and blocked payment states
- Avoid building a dashboard unless the workflow proves a dashboard is necessary
- Define the visual language from the approved Skirwith brand direction
Frontend Specialist
- Only build a lightweight web surface if required for onboarding or live demo visibility
- Prefer GitHub comments and Actions summaries as the primary product UI
- If a dashboard is added, limit it to execution status and policy evidence
Backend Specialist
- Implement deterministic configuration parsing and policy evaluation
- Implement KeeperHub direct execution through a server-side API provider
- Implement simulation, broadcast, polling, and typed error handling
- Never expose KeeperHub credentials to pull-request code
Data Analyst
- Instrument workflow outcomes rather than collecting unnecessary personal data
- Track policy approvals, blocked payouts, simulation failures, execution failures, and confirmed payments
- Define metrics useful for the demo and future product validation
QA Tester
- Test successful, blocked, duplicate, malformed, and KeeperHub failure paths
- Test GitHub event parsing and fork-related behavior
- Verify no blocked path sends a transaction
- Verify successful paths produce a transaction hash and receipt comment
DevOps
- Create the private GitHub repository
- Configure GitHub Actions and repository secrets
- Add CI for linting, type checking, unit tests, and package security checks
- Keep secrets out of logs, artifacts, pull requests, and checked-out untrusted code
Security Guardian
- Review GitHub Actions privilege escalation risks
- Review wallet recipient mapping and payout limits
- Review token and chain validation
- Review duplicate-payment and retry behavior
- Block deployment if the payment workflow can be triggered by untrusted code or manipulated contributor input
Recommended Technical Decisions
Runtime
- TypeScript
- Node.js
- GitHub Action implemented as a JavaScript action or Docker-based action
- Deterministic policy engine with no LLM dependency
- Unit tests using Vitest or the repository-standard equivalent
KeeperHub integration
Use the KeeperHub Direct Execution API from the GitHub Action rather than depending on interactive MCP OAuth.
Reason:
- GitHub Actions are headless
- Organization API keys are suitable for CI
- Direct execution documents simulation, idempotency, status polling, transaction hash, and transaction link behavior
- MCP remains visible in the architecture and onboarding documentation, but the production CI path should use a stable server-to-server credential
API flow:
GET /api/chains
  -> choose configured enabled testnet
POST /api/execute/transfer with simulate: true
  -> require success and wouldRevert: false
POST /api/execute/transfer with unique Idempotency-Key
  -> capture executionId
GET /api/execute/{executionId}/status
  -> honor X-Poll-Interval-Hint
  -> capture transactionHash and transactionLink
Initial chain and token
Recommended default:
- Sepolia testnet
- One ERC-20 stablecoin supported by the configured KeeperHub wallet and chain
Do not hard-code a token contract until KeeperHub confirms the organization’s enabled token and the wallet has test funds.
Fallback for the first technical smoke test:
- Native ETH transfer on Sepolia
- Use the final stablecoin flow only after the token address, decimals, balance, and transfer behavior are confirmed
This avoids wasting the first integration attempt on an unverified token address.
Repository
- Owner: mystiquemide
- Visibility: private
- Suggested repository name: skirwith
- Clean repository, no boilerplate
- Main branch protected after initial setup
- Feature work performed on branches
- No commit or repository creation during the current planning phase
Proposed Repository Structure
skirwith/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml
│   │   └── skirwith-example.yml
│   └── ISSUE_TEMPLATE/
├── action.yml
├── src/
│   ├── action.ts
│   ├── config/
│   │   ├── schema.ts
│   │   └── load-config.ts
│   ├── policy/
│   │   ├── evaluate-policy.ts
│   │   └── payment-key.ts
│   ├── github/
│   │   ├── event.ts
│   │   └── comments.ts
│   ├── keeperhub/
│   │   ├── client.ts
│   │   ├── types.ts
│   │   └── provider.ts
│   └── output/
│       └── summary.ts
├── tests/
│   ├── policy/
│   ├── github/
│   ├── keeperhub/
│   └── fixtures/
├── examples/
│   └── skirwith.yml
├── docs/
│   ├── ARCHITECTURE.md
│   ├── SECURITY.md
│   ├── ONBOARDING.md
│   ├── DEMO.md
│   └── diagrams/
├── README.md
├── AGENTS.md
├── .env.example
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── memory.md
Configuration Contract
Proposed .github/skirwith.yml:
version: 1

chain:
  id: 11155111
  token:
    address: "0x..."
    symbol: USDC
    decimals: 6

payout:
  amount: "25"
  label: "skirwith-bounty"
  maxPerPayment: "50"
  dailyLimit: "250"

recipients:
  githubUser:
    address: "0x..."

policy:
  requiredApprovals: 1
  requirePassingChecks: true
  requireMaintainerLabel: true
Important rules:
- Wallet mappings must be maintainer-controlled
- Contributor-controlled files must not define their own payout address
- Amounts must be parsed as decimal strings and converted safely
- Token address must be validated against the configured chain
- The repository policy must be loaded from a trusted revision
- Configuration changes should require normal maintainer review
Policy Engine
The policy engine must return a structured result, not only a boolean.
PolicyResult
- decision: approved | blocked
- reasonCode
- humanMessage
- repository
- pullRequestNumber
- mergeCommit
- recipient
- amount
- token
- chainId
- paymentKey
- checks
Required checks:
- Event is a pull request close event
- Pull request was actually merged
- Repository matches configured policy
- Required label exists
- Required checks passed
- Contributor has a maintainer-controlled wallet mapping
- Recipient address is valid
- Amount is present and within the per-payment maximum
- Daily limit is not exceeded
- Token and chain match configuration
- Payment key has not already been settled
Idempotency and Duplicate Prevention
Payment key:
sha256(
  repositoryFullName
  + pullRequestNumber
  + mergeCommitSha
  + recipientAddress
  + tokenAddress
  + chainId
  + amount
)
Use this key for:
- Local event identity
- GitHub comment lookup
- KeeperHub Idempotency-Key
- Duplicate protection
Retry rules:
- Reuse the same key only when the request body is identical and the original execution state is unknown
- Do not reuse a key with altered transaction parameters
- Do not blindly retry a confirmed or failed execution
- Treat KeeperHub idempotency conflicts as a reviewable failure
- Report the original execution ID when available
GitHub Actions Security Model
This is the highest-risk part of the project.
Required protections
- Do not check out or execute untrusted pull-request code before the payment step
- Do not allow contributor-controlled YAML to define secrets, recipients, or arbitrary commands
- Do not use a broad pull_request_target workflow that executes fork code
- Restrict the action to merged pull requests in the trusted base repository
- Use minimal GITHUB_TOKEN permissions
- Store KEEPERHUB_API_KEY only as a repository or organization secret
- Mask API responses and credentials from logs
- Avoid printing full request bodies if they contain sensitive values
- Require maintainer-controlled wallet mapping
- Use fixed supported API endpoints
- Add an explicit dry-run mode for local and test runs
Event strategy to validate during implementation
GitHub’s merged pull-request event behavior has important edge cases, including empty payload behavior for merged or fork-originated pull requests. We will test the event contract before finalizing the production trigger.
Possible safe design:
Trusted merge event
  -> read only event metadata
  -> load policy from trusted default branch
  -> evaluate labels, checks, and merge identity
  -> execute payment
If the direct event payload is insufficient, use a trusted follow-up workflow that retrieves the pull request through the GitHub API using the event number, without checking out untrusted code.
Core Acceptance Criteria
Successful payout
- A maintainer merges a pull request with the required label
- Skirwith identifies the correct repository and PR
- Skirwith resolves the configured wallet address
- Policy evaluation returns approved
- KeeperHub simulation succeeds
- KeeperHub broadcast succeeds
- Status polling returns completed
- Transaction hash and explorer link are captured
- GitHub receives a receipt comment
- A duplicate workflow run does not send a second payment
Blocked payout
- An unlabelled PR, failed-check PR, unknown contributor, or oversized payout is processed
- Policy evaluation returns blocked
- A human-readable reason is written to the Actions summary
- GitHub receives a blocked-payment comment
- No KeeperHub broadcast request is made
- No transaction hash is generated
KeeperHub failure
- Simulation failure is shown as a preflight failure
- Broadcast failure is shown with a safe error message
- Pending execution respects the documented poll hint
- Terminal failure does not trigger unsafe parameter mutation
- Unknown status is reported for manual review
- The API key is never printed
Security
- Tests prove untrusted PR content cannot override wallet mapping
- Tests prove recipient and amount validation cannot be bypassed
- Tests prove duplicate payment keys are stable
- Tests prove a blocked policy never calls broadcast
- Secret scanning and dependency checks pass
Documentation and Submission Deliverables
Main README
- Problem
- Product story
- 90-second demo path
- Architecture diagram
- KeeperHub integration details
- Setup instructions
- Configuration reference
- Security model
- Real transaction proof placeholder
- Known limitations
Onboarding bounty package
- Starter workflow
- Copy-paste configuration
- KeeperHub key setup
- Wallet setup
- Testnet funding instructions
- First transaction checklist
- Troubleshooting guide
- Documented friction encountered during development
- Concrete proposed improvements for KeeperHub docs or starter templates
Demo artifacts
- One successful real transaction
- One blocked transaction with no broadcast
- GitHub Actions log or summary
- GitHub receipt comment
- KeeperHub execution status
- Explorer link
- Audit trail link if available through the API or dashboard
Delivery Phases
Phase 1: Research and PRD
Deliverables:
- Final PRD
- Scope and acceptance criteria
- Technical assumptions
- Open risks
- Decision on token and chain
Gate:
PRD ready. Approve, edit, or cancel?
Phase 2: Architecture and design
Deliverables:
- docs/ARCHITECTURE.md
- docs/DESIGN.md
- docs/ANALYTICS.md
- docs/TASKS.md
- AGENTS.md
- Updated memory.md
- Security boundary
- GitHub event strategy
- KeeperHub API contract
- Repository structure
Gate:
Architecture ready. Approve, edit, or cancel?
Phase 3: Foundation
- Create private repository
- Initialize TypeScript and test tooling
- Add CI
- Add secret handling
- Add action metadata
- Add configuration schema
- Add first tests
Phase 4: Policy engine
- Parse configuration
- Evaluate merge event
- Validate labels, checks, wallet, chain, token, amount, and limits
- Generate deterministic payment key
- Implement blocked outcomes
Phase 5: KeeperHub provider
- Implement chain discovery
- Implement simulation
- Implement broadcast
- Implement status polling
- Honor idempotency and poll headers
- Add deterministic provider for unit tests
- Run safe testnet smoke test
Phase 6: GitHub integration
- Implement merged PR event handling
- Load trusted policy
- Post summaries and comments
- Add duplicate comment detection
- Validate fork and permission behavior
Phase 7: Hardening
- Security review
- Dependency review
- Secret scanning
- Failure-path testing
- Action packaging
- README and onboarding guide
- Architecture diagram
- Progressive commits
Phase 8: Demo and submission QA
- Successful real transaction
- Blocked transaction
- Transaction link verification
- KeeperHub audit proof
- GitHub repository review
- Demo video
- Submission page
- Final deadline checklist
Analytics Plan
Keep analytics minimal and privacy-conscious.
Events:
- policy_evaluated
- payment_blocked
- payment_simulated
- payment_broadcast_requested
- payment_confirmed
- payment_failed
- duplicate_payment_detected
- github_receipt_posted
Metrics:
- Percentage of eligible merges paid successfully
- Percentage blocked by policy
- Simulation failure rate
- Broadcast failure rate
- Median confirmation time
- Duplicate prevention count
- Time from merge to receipt comment
- Time from setup to first successful transaction
Scope Priority
Must have
- Real KeeperHub transaction
- Deterministic policy checks
- GitHub merge trigger
- Wallet mapping
- Duplicate prevention
- Simulation before broadcast
- Receipt comment
- Blocked payout path
- Tests and security documentation
Should have
- Actions job summary timeline
- KeeperHub audit link
- Starter template
- Onboarding teardown
- Retry-safe status recovery
Could have
- Optional human approval mode
- Multiple bounty labels
- Native ETH payout
- A small public landing page
- Telegram notification
Will not have before submission
- Multi-chain support
- LLM reasoning
- DAO integrations
- Accounting integrations
- Dashboard-first product
- Custom smart contract
- Automatic wallet discovery
- Arbitrary payment addresses from PR content
Open Decisions
These need to be confirmed before architecture approval:
1. Repository name: Is the private repository mystiquemide/mergepay?
2. Initial payout asset: Should we use a confirmed KeeperHub-supported Sepolia ERC-20 stablecoin, or start with native Sepolia ETH and add stablecoin payout after the smoke test?
3. Demo recipient: Which test wallet address will receive the payout? Do not send it in chat if you prefer to keep it private. It can be configured locally later.
4. Repository policy format: Do you approve maintainer-controlled .github/skirwith.yml as the configuration source?
5. Web UI: Do you approve GitHub Actions and PR comments as the primary interface, with no dashboard in the MVP?
6. AI usage: Do you approve a deterministic engine with no LLM dependency?
Recommended answers: skirwith, confirmed Sepolia stablecoin after native smoke test, private test recipient, yes, yes, yes.
Master Forge Gate
This is the Phase 1 approval point.
Reply with one of:
- PRD approved
- PRD approved with changes: ...
- cancel
After explicit approval, Master Forge will prepare Phase 2 architecture and design.
▣  Plan · gpt-5.6-sol · 2m 25s
approve
Step 8: PRD approved. Master Forge is moving to Phase 2: Architecture and Design.
No files, repository, commits, or system configuration will be changed during this planning phase.
Phase 2 Architecture Plan
- Define the clean private repository structure for mystiquemide/mergepay
- Specify the GitHub Action entrypoint and trusted merged-PR event flow
- Define the .github/skirwith.yml configuration contract
- Define policy evaluation outputs and reason codes
- Define deterministic payment-key and duplicate-prevention behavior
- Define the KeeperHub Direct Execution API adapter
- Define simulation, broadcast, polling, and error-state contracts
- Define GitHub comment and Actions summary formats
- Document the GitHub Actions trust boundary and secret-handling model
- Define the test provider seam for deterministic local testing
- Define the minimal UX around policy results, execution timeline, blocked payouts, and confirmed receipts
- Define analytics events and success metrics
- Break the approved PRD into dependency-ordered implementation tasks
- Produce the following planned artifacts:
- docs/ARCHITECTURE.md
- docs/DESIGN.md
- docs/ANALYTICS.md
- docs/TASKS.md
- AGENTS.md
- Updated memory.md
Architecture decisions carried forward
- TypeScript and Node.js
- GitHub Actions and pull-request comments as the primary interface
- Deterministic policy engine with no LLM dependency
- KeeperHub Direct Execution API for headless CI
- Simulation before every broadcast
- Stable idempotency key per payout
- Maintainer-controlled wallet mapping
- Sepolia-first development
- Native ETH smoke test if stablecoin configuration is not yet confirmed
- No dashboard, multi-chain support, custom smart contract, or DAO features in the MVP
The next response will present the complete Phase 2 architecture, design system, analytics plan, and task breakdown for approval before implementation begins.
▣  Plan · gpt-5.6-sol · 22.1s
i create the folder already , you will be putting them inside after planning ..architecture approved
Architecture approval recorded. I will keep the current folder untouched during planning mode, locate the project directory, then provide the exact implementation sequence that will place the approved artifacts inside it once execution mode is enabled.
✱Glob "**/{package.json,README.md,AGENTS.md,docs}/" in . 
→Read Cline [limit=200, offset=1]
→Read /mnt/c/Users/Prince [limit=200, offset=1]
→Read .config [limit=200, offset=1]
✱Glob "**/skirwith*" in /mnt/c/Users/Prince 
the file is in wsl already
I will locate the existing WSL project folder without creating or changing anything, then align the approved architecture to its actual tree.
$ pwd; ls -la; ls -la /home; ls -la /workspace 2>/dev/null || true; ls -la /projects 2>/dev/null || true
/home/mide
total 112
drwxr-x--- 20 mide mide 4096 Aug  3 15:04 .
drwxr-xr-x  3 root root 4096 Aug  2 09:24 ..
drwxr-xr-x  3 mide mide 4096 Aug  3 13:48 .antigravity-ide-server
-rw-------  1 mide mide  442 Aug  3 14:45 .bash_history
-rw-r--r--  1 mide mide  220 Aug  2 09:24 .bash_logout
-rw-r--r--  1 mide mide 4125 Aug  2 18:43 .bashrc
drwxr-x---  9 mide mide 4096 Aug  3 14:35 .cache
drwxr-xr-x 11 mide mide 4096 Aug  3 14:44 .claude
…
Click to expand
Step 8 x: Architecture approved. The existing WSL project folder is confirmed at /home/mide/skirwith.
Planning mode remains active, so no files, repository metadata, packages, commits, or configuration will be created yet.
Final Execution Plan
1. Inspect project folder
- Confirm /home/mide/skirwith is empty or identify any existing contents.
- Preserve any files already present.
- Check whether it is already a Git repository.
2. Create planning artifacts
- docs/PRD.md
- docs/ARCHITECTURE.md
- docs/DESIGN.md
- docs/ANALYTICS.md
- docs/TASKS.md
- docs/SECURITY.md
- AGENTS.md
- memory.md
3. Initialize the project
- Clean TypeScript/Node.js package.
- GitHub JavaScript Action.
- Vitest, ESLint, Prettier, and strict TypeScript.
- .gitignore, .env.example, action.yml, and CI.
- No frontend framework or database.
4. Implement domain contracts
- Trusted .github/skirwith.yml schema.
- Merged pull-request event parser.
- Structured policy decision with reason codes.
- Stable payment key.
- Execution and receipt types.
5. Implement deterministic policy engine
- Verify merged state, repository, label, approvals, checks, contributor mapping, chain, token, payout maximum, and daily limit.
- Block invalid requests before any KeeperHub call.
- Produce human-readable and machine-readable evidence.
6. Implement KeeperHub provider
- Discover enabled testnet chains.
- Simulate the exact transfer request.
- Broadcast the same request with Idempotency-Key.
- Poll using X-Poll-Interval-Hint.
- Capture authoritative transaction hash and link.
- Add a deterministic fake provider for tests.
7. Implement GitHub integration
- Run only from a trusted merged-PR workflow.
- Never check out or execute contributor code with the KeeperHub secret.
- Load policy from the trusted default branch.
- Post blocked or confirmed receipt comments.
- Write a clear GitHub Actions job summary.
8. Implement duplicate protection
- Detect an existing Skirwith receipt for the payment key.
- Reuse the same KeeperHub key only for an identical request whose state is uncertain.
- Never retry a failed transaction with altered parameters under the same key.
- Surface idempotency conflicts for manual review.
9. Test security and behavior
- Approved payout.
- Missing label.
- Unknown contributor.
- Invalid recipient.
- Excessive amount.
- Failed checks.
- Duplicate event.
- Simulation revert.
- KeeperHub authentication, wallet, rate-limit, spending-cap, and terminal execution failures.
- Secret-redaction and untrusted-input tests.
10. Run integration smoke tests
- First use KeeperHub simulation only.
- Then execute a minimal native Sepolia ETH transfer if needed.
- Confirm the intended Sepolia stablecoin address and wallet balance.
- Execute the final stablecoin payout.
- Preserve the transaction and KeeperHub audit evidence.
11. Prepare onboarding bounty assets
- Reusable starter workflow.
- Five-minute setup guide.
- API key and wallet instructions.
- First-transaction troubleshooting.
- Evidence-based KeeperHub onboarding teardown.
- Proposed documentation or template improvements.
12. Prepare submission
- Architecture diagram.
- Story-driven README.
- Successful and blocked demo paths.
- Demo video script and recording checklist.
- Transaction link.
- Repository hygiene and secret scan.
- DoraHacks submission checklist.
Decisions Locked
- Project folder: /home/mide/skirwith
- Working name: Skirwith
- Clean repository with no boilerplate
- TypeScript and Node.js
- GitHub Actions and PR comments as the MVP interface
- KeeperHub Direct Execution API for headless execution
- Deterministic policy engine with no LLM
- Sepolia-first verification
- Simulation before broadcast
- No custom contract, database, dashboard, or multi-chain support
- Private GitHub repository when publishing begins
Remaining Build-Time Inputs
- The recipient wallet will be supplied locally, not in chat.
- The stablecoin contract will be selected only after querying KeeperHub-enabled chains and confirming wallet funding.
- KEEPERHUB_API_KEY will remain in the local environment and later become a masked GitHub Actions secret.
The plan is complete and ready for implementation when planning mode is turned off.
▣  Plan · gpt-5.6-sol · 40.6s
You are an elite hackathon win strategist, product judge, technical reviewer, and adversarial attacker.

Your objective is not to be encouraging.
Your objective is to maximize this project's probability of winning.

Assume:
- Judges are tired.
- Many submissions are similar.
- They have limited time.
- They will aggressively look for contradictions, vaporware, weak demos, fake claims, poor UX, sponsor misalignment, and unclear positioning.

Your job is to eliminate every possible reason to reject this submission.

---

## INPUT

Hackathon
- Name: [HACKATHON_NAME]
- Deadline: [DEADLINE]
- Sponsor/Ecosystem: [SPONSOR]
- Official judging criteria: [JUDGING_CRITERIA]
- Submission requirements: [SUBMISSION_REQUIREMENTS]

Project
- Name: [PROJECT_NAME]
- One-line pitch: [ONE_LINER]

Current material

Paste any of:
- README
- PRD
- Architecture
- Smart contracts
- Demo script
- Landing page copy
- Screenshots
- Pitch deck
- Repository structure
- Technical notes

Below.

[PASTE EVERYTHING]

---

## REVIEW MODE

Assume you are simultaneously:

- a hackathon judge
- a sponsor engineer
- an auditor
- a skeptical founder
- a UX reviewer
- a technical reviewer
- an automated judging agent

Never assume missing information.

Whenever something is missing, list it explicitly.

Whenever something sounds like marketing instead of proof, flag it.

Whenever something cannot be demonstrated in under three minutes, question whether it should exist.

Whenever a feature exists but never appears during the demo, recommend cutting or deprioritizing it.

Whenever a claim cannot be independently verified, recommend replacing it with demonstrable evidence.

Whenever sponsor tooling is optional instead of essential, explain how to make it load-bearing.

---

# TASKS

## 1. Scoring Surface Map

Extract every judging surface from the official judging criteria.

Create a table with:

| Judging Surface | Evidence Currently Present | Missing Evidence | Risk (HIGH / MEDIUM / LOW) | Fix |

Score each surface from 0–10.

Calculate an estimated overall judging score.

---

## 2. Positioning Rewrite

Rewrite the project's framing so it directly optimizes for the judging criteria instead of sounding like a startup pitch.

If personal motivation matters:

Rewrite the introduction into a concrete first-person founder story including:

- date
- situation
- transaction amount
- token
- chain
- consequence

Avoid generic "people struggle with..."

Instead explain exactly what happened.

If simplicity is rewarded:

Explain what the project intentionally does NOT include and why removing complexity improves the solution.

---

## 3. README Review

Rewrite the README structure.

Specify the exact section order.

For every section explain:

- purpose
- maximum length
- required assets
- screenshots
- diagrams
- links

Then create two lists:

### Must Include

### Remove Immediately

Examples:

- buzzwords
- unnecessary roadmap
- future plans
- market size
- tokenomics
- AI-generated filler
- duplicated architecture
- unverifiable claims

Finally define repository hygiene:

- commit naming
- branching
- tags
- releases
- file organization
- licensing
- reproducibility

---

## 4. Architecture & Contract Locks

List every architectural decision that must be frozen before submission.

Examples:

- escrow model
- trust assumptions
- wallet flow
- authorization
- payment lifecycle
- state transitions
- indexing
- replay protection
- ownership
- upgradeability
- signature scheme
- storage model

For each include:

- decision
- why judges care
- consequences if changed later

---

## 5. Attack & Escape Review

Act like an adversarial judge.

List every obvious bypass that can be mentally tested in under 30 seconds.

Include:

- replay attacks
- duplicate execution
- spoofing
- race conditions
- fake proofs
- UI deception
- API abuse
- wallet edge cases
- failed transactions
- stale state
- missing authorization
- hidden assumptions

For every attack provide:

- attack description
- expected result
- mitigation
- automated test
- README proof
- demo proof

---

## 6. Demo Optimization

Maximum demo length:

3 minutes.

Create a second-by-second storyboard.

For every scene include:

- timestamp
- screen shown
- narration
- action
- proof created
- sponsor technology demonstrated
- judging objective satisfied

Then perform a "Judge Double-Click Review."

Assume the judge pauses the video at any frame.

List every frame that would create doubt.

Fix them.

---

## 7. Frontend Identity

Review the UI.

Answer:

Does it look like:

- another hackathon template?
- another dashboard?
- another AI landing page?

If yes:

Redesign the visual identity.

Specify:

- visual metaphor
- interaction style
- typography
- spacing
- color logic
- motion
- empty states
- loading
- success moments

The UI should become memorable after one screenshot.

---

## 8. Social Proof Plan

Create a posting schedule from today until submission.

Each post must contain:

- concrete hook
- one proof
- one screenshot/video
- one lesson
- one CTA

Avoid generic "building in public."

Each post must create credibility.

---

## 9. Daily Execution Plan

Create a day-by-day schedule ending at submission.

Table columns:

| Day | Objective | Deliverable | Exit Criterion | Risk | Backup Plan |

Every task must end with a measurable exit criterion.

Examples:

NOT:
"Improve contracts"

Instead:

"Replay protection passes all integration tests."

---

## 10. Submission Preflight

Create a comprehensive submission checklist.

Include:

Repository

README

Demo

Video

Thumbnail

Submission form

Contract addresses

Explorer links

Deployed URLs

Environment variables

Licenses

Sponsors

Wallet compatibility

Proof links

Screenshots

Open-source compliance

Eligibility

Required disclosures

Team information

Everything must be phrased as checkboxes.

---

# REVIEW PRINCIPLES

Always prefer:

- demonstrated proof over claims
- founder story over market research
- simple architecture over unnecessary complexity
- sponsor-native features over generic integrations
- screenshots over paragraphs
- measured evidence over adjectives
- reproducible demos over promises

Never recommend:

- fake metrics
- unverifiable statistics
- speculative roadmap claims
- unnecessary AI buzzwords
- investor language
- startup jargon
- "world's first" unless provable

Whenever something weakens the chance of winning, say so directly.

Do not soften criticism.

---

# OUTPUT FORMAT

Produce a single Markdown document titled:

# [PROJECT_NAME] — Win Plan

Use exactly these sections:

1. Executive Verdict
2. Estimated Judge Score
3. Scoring Surface Map
4. Positioning Rewrite
5. README Blueprint
6. Architecture Locks
7. Attack & Escape Review
8. Demo Storyboard
9. Frontend Identity
10. Social Strategy
11. Day-by-Day Execution Plan
12. Submission Preflight Checklist
13. Immediate Kill List (things to remove)
14. Immediate Build List (highest ROI additions)
15. The Card No One Else Holds

The final section must identify the single strongest piece of proof this project can produce that competitors would struggle to fake.
2. OPTIONAL VARIATIONS
Variation A — Brutal Judge Mode

Optimize the review for ruthless elimination.

Focus on:

Why this project would lose.
Every reason a judge would stop watching the demo.
Every contradiction in the README.
Every unnecessary feature.
The fastest path from "good" to "winner."
Variation B — Sponsor Engineer Mode

Review only through the sponsor's perspective.

Prioritize:

Native ecosystem integration.
Correct API/SDK usage.
Technical depth.
Real production patterns.
Ecosystem value.
Why the sponsor should feature this project after the hackathon.

Ignore business and marketing unless they affect judging.

Variation C — Finals Preparation Mode

Assume the project has already reached the finals.

Review only what separates first place from second place.

Focus on:

Unfakeable proof.
Demo polish.
Live reliability.
Memorable UX.
Narrative clarity.
Technical differentiation.
Post-submission assets (case study, open-source quality, ecosystem adoption). You are an elite hackathon win strategist, product judge, and adversarial reviewer.

You have judged hundreds of hackathons across crypto, AI, Web3, developer tooling, infrastructure, and consumer products.

Your objective is NOT to validate my idea.

Your objective is to maximize the probability that this project finishes in the prize-winning positions.

Assume:
- judges have limited attention
- they review dozens or hundreds of submissions
- they forget details quickly
- they reward clarity, proof, execution quality, and sponsor alignment over feature count

Be brutally honest. Challenge every assumption. If something weakens the project's chances, identify it immediately.

---

# CONTEXT

Hackathon: [HACKATHON_NAME]

Deadline:
[DEADLINE]

Sponsor / Ecosystem:
[SPONSOR]

Tracks:
[TRACKS]

Judging Criteria:
[JUDGING_CRITERIA]

Project Name:
[PROJECT_NAME]

One-line Pitch:
[ONE_LINER]

Current Stage:
[IDEA / PRD / README / WIREFRAMES / HALF BUILT / MVP / SUBMITTED]

Available Time Before Deadline:
[TIME]

Team Size:
[TEAM_SIZE]

Repository / Documentation:
[PASTE BELOW]

---

# REVIEW OBJECTIVES

Evaluate the project as if you were trying to prevent a weak submission from reaching the finals.

Review it using these dimensions.

## 1. Problem Quality

- Is this solving a real pain?
- Does it feel like founder conviction or generic market research?
- Would someone actually care enough to use it?
- Is the value obvious within seconds?

Score:
0–10

Explain why.

---

## 2. Sponsor Integration

Determine whether the sponsor technology is:

- essential
- partially integrated
- replaceable
- completely cosmetic

If the sponsor can be swapped out in less than a day, explain why this weakens the submission.

Recommend deeper integrations that directly improve judging scores.

---

## 3. Originality

Compare this against typical hackathon submissions.

Identify:

- generic ideas
- cloned concepts
- overused patterns
- hidden differentiators

Then recommend one strategic angle that makes the project memorable.

---

## 4. Judge Experience

Assume a judge has exactly three minutes.

Can they understand:

- the problem
- the solution
- why this sponsor matters
- why this is technically difficult
- why this deserves to win

List every place where attention is likely to be lost.

---

## 5. Demo Review

Review the demo from a judge's perspective.

Identify:

- confusing flows
- unnecessary screens
- weak introductions
- boring moments
- slow setup
- trust-breaking interactions

Recommend a faster and stronger sequence.

For every scene answer:

"What emotion should the judge feel?"

---

## 6. README Review

Evaluate:

- opening hook
- architecture
- screenshots
- diagrams
- quick start
- technical depth
- proof
- sponsor integration
- deployment
- testing
- roadmap

Identify sections to:

- delete
- merge
- rewrite
- expand
- move into the demo instead

Rewrite weak academic language into concise founder language where appropriate.

---

## 7. Technical Review

Act like a senior engineer reviewing before launch.

Find:

- architectural risks
- unclear APIs
- unnecessary complexity
- contract risks
- security concerns
- missing validation
- trust assumptions
- race conditions
- replay risks
- state inconsistencies
- edge cases

For each issue:

Severity:
Critical / High / Medium / Low

Fix:
Concrete implementation guidance.

---

## 8. Contract & Specification Review

Before more code is written, identify decisions that must be finalized.

Examples:

- state model
- permissions
- settlement logic
- failure modes
- verification
- upgradeability
- replay protection
- invariants
- authorization
- event schema

Explain why locking each decision now prevents costly rewrites later.

---

## 9. Proof Review

Hackathons reward evidence.

Identify every important claim.

For each claim specify:

Required Proof

Possible Proof Formats:

- live demo
- on-chain transaction
- benchmark
- signed attestations
- reproducible script
- screenshots
- logs
- dashboards
- automated tests
- GitHub Actions
- videos
- independent verification

Then answer:

"Which proof would competitors struggle to fake before the deadline?"

---

## 10. Automated Judge Review

Assume an AI agent reviews the submission before a human.

List everything an automated evaluator could penalize:

- vague language
- missing docs
- broken links
- unsupported claims
- missing screenshots
- no tests
- weak sponsor usage
- incomplete setup
- poor organization
- unclear architecture

Recommend fixes.

---

## 11. Feature Audit

Review every feature.

For each one classify:

KEEP
SIMPLIFY
CUT
DEFER

If a feature does not materially increase hackathon scoring, recommend removing it.

Prioritize clarity over completeness.

---

## 12. Deliverables Review

Specify exactly what should appear in:

### README

### Demo Video

### Submission Form

### GitHub Repository

### Landing Page

### Social Announcement

List required screenshots, diagrams, metrics, and evidence for each.

---

## 13. Execution Plan

Create a realistic day-by-day execution schedule until the deadline.

For each day include:

- engineering
- documentation
- demo preparation
- testing
- screenshots
- social proof
- backup tasks
- submission checklist

Highlight critical path items that cannot slip.

---

## OUTPUT FORMAT

# Executive Verdict

Choose exactly one:

- BUILD
- BUILD BUT CUT SCOPE
- PIVOT
- KILL

Explain why.

---

# What Already Works

List strengths that should remain unchanged.

---

# Highest Priority Problems

Rank from highest to lowest.

Include:

- issue
- why it hurts judging
- exact fix
- expected impact

---

# Decisions That Must Be Locked Before More Code

Bullet list.

---

# Demo Plan

Scene-by-scene timeline with timestamps.

---

# README Blueprint

Section-by-section outline.

---

# Submission Checklist

Everything that must exist before submission.

---

# Competitor Advantage Analysis

Identify where typical teams will likely outperform this project.

Explain exactly how to surpass them.

---

# Final Strategic Edge

Provide one high-leverage recommendation that most teams will overlook but could significantly increase the chances of becoming a finalist or winning.

---

# REVIEW RULES

- Prioritize hackathon win probability over startup potential.
- Challenge assumptions rather than validate them.
- Every criticism must include a practical fix.
- If evidence is missing, specify exactly how to generate it.
- Remove anything that does not improve judging.
- Rewrite academic or marketing-heavy language into concise founder language when appropriate.
- Avoid generic startup advice.
- Optimize specifically for hackathon judging psychology, technical credibility, and demo impact.
2. OPTIONAL VARIATIONS
Variation A — Ruthless Judge Mode

Focus entirely on why the submission would lose.

Reject weak assumptions.
Score every category from 0–10.
Explain what would prevent the project from reaching the finals.
Recommend only the highest-ROI improvements.
Variation B — Finalist Optimization Mode

Assume the project is already good enough to submit.

Focus only on changes that increase the probability of finishing in the top 10%.

Prioritize:

stronger sponsor integration
memorable demos
proof generation
README quality
technical polish
judging psychology
Variation C — Adversarial Competitor Mode

Act as another hackathon team trying to beat this project.

Identify:

every weakness to exploit
where judges may become unconvinced
features competitors can copy
missing proof
weak differentiation

Then explain how to eliminate those weaknesses before submission. 
Skirwith — Win Plan
1. Executive Verdict
BUILD BUT CUT SCOPE
Skirwith has a strong hackathon shape: one trigger, one policy decision, one real payment, one verifiable result. It is easier to understand than a generic DeFi agent and naturally demonstrates KeeperHub as an execution layer.
However, the project currently has zero implementation proof. It is only PRD-approved, the repository has not been initialized, no KeeperHub transaction has been executed, and the GitHub event/security model is not yet proven.
The biggest risk is not engineering difficulty. It is credibility.
A judge may ask:
- Did KeeperHub actually execute the transaction?
- Is the payment triggered by a real merged pull request?
- Can a contributor manipulate the recipient or amount?
- Does the same merge pay twice?
- Is the KeeperHub API integration real or mocked?
- Can the team explain why KeeperHub is necessary?
- Does the demo prove the blocked path, or only describe it?
If any answer is unclear, the project becomes another polished automation concept instead of a finalist submission.
Critical strategic correction:
Do not pitch Skirwith as “AI-powered.” The core product should be deterministic. Use the phrase:
Verified GitHub work becomes policy-controlled payment, settled through KeeperHub.
Do not build:
- A dashboard-first product
- An LLM agent
- A custom smart contract
- Multi-chain support
- General payroll
- A contributor marketplace
- Automatic wallet discovery
- Complex retry logic
- An elaborate landing page before the real workflow works
The winning submission must prove this exact loop:
Merged pull request
→ trusted policy evaluation
→ KeeperHub simulation
→ KeeperHub broadcast
→ confirmed onchain transaction
→ GitHub receipt comment
2. Estimated Judge Score
Current score
Category	Score	Reason
Real-world usefulness	7/10	Contributor payments are understandable and useful, but the initial market is narrow
Originality	6/10	GitHub-triggered crypto payouts are differentiated, but easy to imitate
KeeperHub integration	2/10	No real transaction or integration proof exists yet
Reliability and observability	2/10	The design mentions simulation and idempotency, but no evidence exists
Technical quality	3/10	Architecture is promising but unimplemented
User experience	4/10	The workflow is simple, but onboarding and GitHub security are unresolved
Demo strength	3/10	The intended demo is strong; the current demo does not exist
Documentation	2/10	Documentation is planned, not present
Submission completeness	1/10	No repository, video, transaction link, or final submission assets
Security credibility	3/10	Risks have been identified but not tested
Estimated current score: 33/100
Target score before submission
Category
Real-world usefulness
Originality
KeeperHub integration
Reliability and observability
Technical quality
User experience
Demo strength
Documentation
Submission completeness
Security credibility
Target submission score: 88/100 or higher
The project cannot reach that score through copywriting. It needs transaction evidence, a reliable live demo, and security proof.
3. Scoring Surface Map
The official hackathon surfaces are:
- Real onchain execution through KeeperHub
- KeeperHub surface usage
- Reliability and observability
- Originality and real-world usefulness
- Integration quality and developer experience
- Required GitHub repository
- Required demo video
- Required executed transaction link
- Optional onboarding bounty
Judging Surface	Evidence Currently Present	Missing Evidence
Real KeeperHub transaction	API flow planned	Confirmed transaction hash and explorer link
KeeperHub as execution layer	Direct API selected in architecture	Request logs, simulation result, execution ID, status response
MCP usage	MCP documented	No actual MCP workflow or reason it is used
Simulation before broadcast	Planned	Successful and failed simulation evidence
Idempotency	Payment-key design exists	Replay test and KeeperHub idempotency behavior
Reliability	Failure modes listed	Actual failure logs and recovery behavior
Observability	Receipt and timeline designed	Actions summary, comment, execution status, audit evidence
Originality	GitHub-native verified work-to-payment flow	Clear contrast against generic payout bots
User usefulness	Contributor payment use case	Reproducible maintainer setup and realistic example
Developer experience	Clean configuration planned	Installation under five minutes
Security	Threats identified	Automated security tests and safe GitHub trigger
Demo video	Required by hackathon	Finished video with proof
GitHub repository	Private folder exists locally	Public submission repository and readable history
Transaction submission link	None	Direct explorer link
Onboarding bounty	Strong conceptual fit	Starter template, teardown, or merged PR
Main judging risk
The current plan contains many intended features, but judges score what they can verify. Until the real transaction exists, Skirwith has almost no score on the most important criterion.
4. Positioning Rewrite
Judge-facing positioning
Skirwith is a GitHub Action that pays a maintainer-approved contributor after a pull request is merged. It verifies the merge, enforces repository payout policy, simulates the exact transfer, and sends the payment through KeeperHub. The result is a confirmed onchain transaction and a receipt posted back to the pull request.
Fifteen-second explanation
A merged pull request proves the work was accepted. Skirwith turns that event into a bounded stablecoin payout. KeeperHub handles the actual transaction, while Skirwith handles policy, duplicate prevention, and proof back to GitHub.
Problem framing
Do not say:
Teams struggle with contributor payments.
Say:
A maintainer can merge a pull request in seconds, but paying the contributor still requires a separate spreadsheet, wallet operation, or treasury workflow. Skirwith connects the acceptance event to a controlled settlement path.
This is specific without inventing a personal story.
Founder story
No concrete founder incident has been provided. Do not fabricate one.
Until a real incident is supplied, use an honest product-origin story:
On August 3, 2026, while building for the KeeperHub Agents Onchain Hackathon, we noticed that the hackathon’s core problem was not deciding what an agent should do. It was proving that the resulting transaction was safe, executed, and observable. We chose a contributor payout because GitHub already provides a verifiable acceptance event: a merged pull request. Skirwith tests whether that event can trigger a bounded, simulated, and KeeperHub-settled payment without relying on a second manual workflow.
If a real prior incident exists, replace this with the exact date, amount, token, chain, and consequence. Do not invent a loss story.
What Skirwith intentionally does not include
- No AI code review, because GitHub review and checks already establish the acceptance signal.
- No natural-language wallet control, because payout authorization must be deterministic.
- No multi-chain support, because one verified chain is stronger than four unverified chains.
- No custom contract, because KeeperHub direct execution is the point of the submission.
- No dashboard, because GitHub Actions and pull-request comments are already the user interface.
- No automatic wallet discovery, because inferred payment destinations are unsafe.
- No generic payroll system, because the demo needs one narrow, provable workflow.
This simplicity is a feature. It reduces the attack surface and makes the three-minute demo understandable.
5. README Blueprint
Exact section order
1. Hero and proof
Purpose: Explain the project in one screen.
Maximum length: 100 words.
Required assets:
- One-line pitch
- Status badge
- Short workflow diagram
- Confirmed transaction link
- Demo video link
Required wording:
Skirwith pays a maintainer-approved contributor after a pull request is merged. It evaluates policy, simulates the exact transfer, executes through KeeperHub, and posts the transaction proof back to GitHub.
Do not put a long marketing paragraph first.
2. Live proof
Purpose: Immediately prove that this is not vaporware.
Maximum length: 100 words.
Include:
- Explorer transaction link
- KeeperHub execution ID
- Chain
- Token
- Amount
- Recipient redacted if necessary
- Timestamp
- Screenshot of the GitHub receipt comment
3. Three-minute demo
Purpose: Give judges the fastest path to understanding.
Maximum length: 150 words.
Include:
- Video link
- Successful payout timestamp
- Blocked payout timestamp
- Duplicate prevention timestamp
4. How it works
Purpose: Explain the single workflow.
Include one diagram:
GitHub merge event
  → trusted policy
  → simulation
  → KeeperHub execution
  → status polling
  → GitHub receipt
Maximum length: 250 words.
5. KeeperHub integration
Purpose: Prove sponsor alignment.
Include:
- Exact endpoint or MCP tool used
- Simulation request
- Broadcast request
- Idempotency-Key
- Status polling
- transactionHash
- transactionLink
- Poll interval handling
- Error handling
- Why KeeperHub is load-bearing
Maximum length: 400 words.
Do not claim private routing, gas sponsorship, x402, or MPP unless the actual Skirwith flow visibly uses and proves them.
6. Security model
Purpose: Address the obvious attack questions.
Include:
- Trusted workflow boundary
- Secret handling
- Wallet mapping
- Recipient validation
- Amount limits
- Token and chain allowlisting
- Replay protection
- Fork and untrusted-code handling
- Blocked-payment behavior
Maximum length: 500 words.
7. Quick start
Purpose: Let a reviewer reproduce the project.
Include:
- Prerequisites
- KeeperHub setup
- Wallet setup
- GitHub secret setup
- Configuration file
- Testnet funding
- Test command
- Expected output
Maximum length: 500 words.
8. Configuration reference
Purpose: Define every setting.
Include a complete .github/skirwith.yml example and field table.
9. Test evidence
Purpose: Prove engineering quality.
Include:
- Test command
- Number of tests
- Policy cases
- Duplicate test
- Simulation failure test
- GitHub fixture test
- Last CI status link
Do not publish fake counts. Generate the counts from CI.
10. Architecture
Purpose: Support technical review.
Include:
- Architecture diagram
- Trust boundaries
- Module map
- Data flow
- No database explanation
11. Onboarding bounty
Purpose: Make the separate bounty explicit.
Include:
- Starter template link
- Onboarding guide
- Friction found
- Concrete KeeperHub documentation improvements
- PR or issue link if submitted
12. Limitations
Purpose: Build trust by stating what is not solved.
Include:
- One chain
- One token
- Maintainer-controlled wallet map
- No arbitrary contributor address
- No automatic funds recovery
- No production treasury guarantee
- Testnet status if applicable
13. License and disclosures
Include:
- License
- Testnet disclosure
- No financial advice statement
- KeeperHub credential handling
- Known third-party dependency limitations
Must Include
- Real KeeperHub transaction link
- Exact chain and token
- Successful payout screenshot
- Blocked payout screenshot
- Duplicate prevention proof
- Architecture diagram
- Security boundary
- Configuration example
- Tests and CI link
- KeeperHub API evidence
- Video link
- Starter template
- Limitations
- License
Remove Immediately
- Market size
- Tokenomics
- Generic AI claims
- “Revolutionary”
- “World’s first”
- Unverified gas savings
- Unverified MEV protection
- Broad roadmap
- Investor language
- Competitor attacks
- Repeated architecture descriptions
- Fake metrics
- “Production-ready” unless independently demonstrated
- Claims that MCP is used if the deployed path only uses the REST API
- Any sample transaction presented as a real transaction
Repository hygiene
- Use branches such as feat/policy-engine, feat/keeperhub-client, and fix/github-trust-boundary.
- Use commit names such as feat: add deterministic payout policy.
- Avoid vague commits such as updates, final, or misc fixes.
- Tag the final verified build, for example v0.1.0-hackathon.
- Keep generated bundles clearly separated from source.
- Do not commit .env, API keys, wallet files, transaction secrets, or local logs.
- Add a license before submission.
- Keep test fixtures free of real secrets and unnecessary personal data.
- Make the repository public only when the submission requires it and after a secret scan.
- Verify the README from a clean browser session while logged out.
6. Architecture Locks
These decisions must be frozen before substantial implementation.
Decision	Why judges care
KeeperHub REST API or MCP path	Determines whether the sponsor integration is real and reproducible
One chain	Prevents unsupported or inconsistent execution claims
One token	Makes the payout proof clear
Direct transfer versus contract call	Defines the actual security and API surface
Trusted GitHub trigger	Prevents secret exfiltration and payout spoofing
Policy source	Determines who controls payout rules
Wallet mapping ownership	Prevents recipient substitution
Payment state model	Prevents duplicate execution
Payment key format	Supports replay protection and auditing
Simulation request body	Must match broadcast body
Retry behavior	Defines whether failures are recoverable
Daily budget authority	Defines how cumulative spending is enforced
GitHub receipt identity	Defines how duplicate payouts are detected
API key scope	Limits blast radius
Testnet/mainnet status	Determines how the submission must be disclosed
No custom smart contract	Keeps KeeperHub central
No LLM	Keeps decisions auditable
Critical unresolved architecture issue: daily limits
A GitHub Action is stateless between runs. A configured dailyLimit cannot be enforced reliably by simply inspecting the current event.
Choose one of these now:
1. Remove daily limits from the MVP.
- Safest and simplest.
- Use per-payment limits plus KeeperHub organization spending caps.
- Recommended for the hackathon.
2. Use GitHub artifacts or issue comments as state.
- Easy to demo.
- Weak as a production accounting mechanism.
- Must be clearly labeled as demo-grade.
3. Add a small persistent state store.
- More reliable.
- Adds credentials, deployment, and operational complexity.
- Not recommended before the first real transaction.
Recommendation: Remove Skirwith’s custom daily limit from the first version and rely on:
- Per-payment cap
- Fixed repository policy
- KeeperHub organization spending cap
- Duplicate payment key
- Maintainer-controlled wallet mapping
Do not claim daily-limit enforcement unless it is actually implemented and tested.
7. Attack & Escape Review
Attack	Expected result	Mitigation
Contributor edits payout amount in a PR	Amount is ignored or workflow blocks	Load policy only from trusted default branch
Contributor edits recipient wallet	Address is ignored	Wallet mapping must be maintainer-controlled
Contributor adds bounty label	Payment remains blocked if label authority is insufficient	Require maintainer-applied label and trusted event context
Fork PR triggers secret-bearing job	No KeeperHub secret is available to fork code	Do not execute payment logic from untrusted code
Same merge event runs twice	One payment only	Stable payment key and receipt lookup
Same idempotency key with altered amount	Request is rejected	Compare canonical request body
Workflow retries after confirmed execution	No second payment	Poll original execution and inspect receipt
KeeperHub API returns 401	No payment and no secret leak	Typed auth error, masked logs
KeeperHub wallet is unconfigured	No broadcast	Stop before broadcast and explain setup
Simulation reverts	No broadcast	Require success === true and wouldRevert === false
Broadcast fails	No unsafe parameter mutation	Preserve request and report status
Polling ignores poll hint	API abuse or rate limiting	Honor X-Poll-Interval-Hint
Recipient has invalid checksum	No execution	Validate EIP-55 or lowercase address
Token address is wrong	Simulation fails before payment	Allowlist chain/token and simulate
Amount is negative or malformed	No execution	Parse decimal strings strictly
Amount exceeds cap	No broadcast	Enforce per-payment maximum
Merge is closed but not merged	No payment	Require merged === true
Checks are failing	No payment if required	Read trusted check result
PR number is reused or state is stale	No incorrect payout	Include merge SHA in key
GitHub API response is stale	Payment is based on incorrect data	Fetch current trusted PR state before execution
GitHub comment is deleted	Payment is mistaken as unpaid	Store state in artifact or external execution identity
API response is fake in UI	Judge cannot verify	Link directly to explorer and KeeperHub evidence
Sponsor feature is merely named	Judge sees cosmetic integration	Show exact KeeperHub call and proof
API key appears in logs	Credential compromise	Mask all secret values and redact errors
GitHub token has excess permissions	Supply-chain risk	Minimal contents and pull-requests permissions
Malicious dependency is introduced	Compromised action	Lockfile, audit, pinned action versions
Payment recipient is a contract with unexpected behavior	Transfer may fail or have different semantics	Initially restrict to EOA test recipient
Sponsor API is unavailable	Demo fails	Pre-recorded evidence only as backup, never as live proof
Testnet asset has no value	Judges may question utility	Explain testnet and show exact execution proof
Critical attack conclusion
The GitHub Actions trust boundary is more dangerous than the payment code. If the workflow can be influenced by untrusted pull-request content while holding KEEPERHUB_API_KEY, the project should not ship.
8. Demo Storyboard
Maximum length: 2 minutes 30 seconds, leaving 30 seconds of tolerance.
The demo must show one successful payment and one blocked payment. Do not spend time on a landing page.
Time	Screen	Narration
0:00–0:08	Final GitHub receipt comment	“Skirwith turns an accepted pull request into a bounded onchain payment.”
0:08–0:18	Repository config	“The maintainer controls the token, recipient mapping, required label, and payout cap.”
0:18–0:32	Pull request	“This pull request has passed checks and carries the maintainer’s bounty label.”
0:32–0:40	Merge action	“When the maintainer merges, the action starts.”
0:40–0:55	Actions summary	“Skirwith verifies the merge, recipient, amount, and policy before touching KeeperHub.”
0:55–1:08	Simulation output	“The exact transfer is simulated first. This catches a bad recipient, balance, or contract failure before broadcast.”
1:08–1:22	KeeperHub execution status	“Skirwith submits the same request with a unique idempotency key and polls KeeperHub until terminal.”
1:22–1:36	Explorer	“This is the authoritative transaction proof.”
1:36–1:48	GitHub receipt comment	“The contributor receives proof where the work was accepted.”
1:48–2:02	Oversized payout PR	“Now the amount exceeds policy.”
2:02–2:12	Blocked Actions summary	“Skirwith blocks it before simulation or broadcast. No transaction exists.”
2:12–2:24	Duplicate rerun	“Running the successful event again resolves to the same payment key and does not pay twice.”
2:24–2:30	Final split screen	“Verified work in. Policy-controlled settlement out.”
Judge emotion by scene
- 0:00: Curiosity
- 0:18: Recognition
- 0:55: Confidence
- 1:22: Proof
- 2:02: Trust
- 2:12: Technical respect
- 2:24: Recall
Judge Double-Click Review
A skeptical judge may pause on:
- The recipient wallet: Is it configured by the maintainer or the contributor?
- The amount: Is it from trusted config or PR content?
- The chain: Is this testnet or mainnet?
- The KeeperHub screen: Is it real or a mocked dashboard?
- The transaction link: Does it resolve and show the expected transfer?
- The timestamp: Did it happen during the build?
- The status: Is the transaction actually confirmed?
- The GitHub Action permissions: Can fork code access the secret?
- The duplicate run: Did it actually avoid a second transaction?
- The failure scene: Was it a real blocked run or merely a UI state?
Fixes
- Keep the chain name visible on every proof screen.
- Show the explorer URL, not only a shortened button.
- Show transactionHash, executionId, and payment key.
- Show “simulation only” before the simulation result.
- Show “broadcast” only after the real request.
- Include a visible “No broadcast request made” line on blocked runs.
- Use a test recipient clearly labeled as a test wallet.
- Record two successful transactions in case one provider run fails during judging.
- Never use a fake transaction hash in the final demo.
9. Frontend Identity
Verdict
The current proposed visual direction is better than a generic dashboard, but it still risks becoming a standard developer-tool timeline with green checks.
Skirwith should not look like:
- A template SaaS dashboard
- A crypto trading terminal
- An AI agent chat interface
- A generic observability product
Stronger visual metaphor
Use a release receipt identity.
The interface should look like a pull request moving through a narrow settlement corridor:
ACCEPTED WORK
→ POLICY RECEIPT
→ KEEPERHUB SETTLEMENT
→ PAYMENT PROOF
The memorable element is not a mascot. It is the receipt itself.
Visual system
- Background: warm paper #F7F8F5
- Text: ink #101820
- Verification: GitHub green #2DA44E
- Settlement: blue #2563EB
- Blocked: red #C53030
- Review: amber #B7791F
- Borders: #D8DEE4
- Typeface: Inter or Geist Sans
- Technical values: Geist Mono
Interaction style
- Use an execution rail rather than a grid of cards.
- Every state should have a verb:
- Detected
- Verified
- Simulated
- Settled
- Posted
- Blocked
- Show evidence inline, not behind abstract analytics tabs.
- Make “no transaction submitted” a first-class success state for blocked payments.
Spacing
- 8px base grid
- 24px section spacing
- 16px timeline row spacing
- Maximum content width: 960px
- Avoid dense three-column dashboards
Motion
Use only meaningful transitions:
- Merge event enters the rail
- Policy node resolves
- Simulation changes from pending to passed
- Transaction hash appears after confirmation
- Blocked path stops visibly at policy
No decorative particle effects, gradients, floating blobs, or fake terminal animations.
Empty states
Use factual copy:
No payments yet. Merge a labeled pull request after configuring a trusted wallet mapping.
Loading state
Waiting for KeeperHub execution status. The request has not been confirmed yet.
Success state
Payment confirmed. KeeperHub returned transaction 0x....
Blocked state
Payment blocked. Amount 50 USDC exceeds the repository cap of 25 USDC. No transaction was submitted.
10. Social Strategy
Do not post generic “building in public” updates. Every post should contain proof.
Post 1: Problem and scope
- Hook: “A merged pull request proves the work was accepted. Why is payment still a separate manual workflow?”
- Proof: Screenshot of the configuration contract
- Media: Configuration plus execution rail
- Lesson: One trusted event can drive a bounded payout
- CTA: Follow the first KeeperHub transaction test
Post 2: First KeeperHub simulation
- Hook: “Before Skirwith sends funds, KeeperHub simulates the exact transfer.”
- Proof: Redacted simulation response showing wouldRevert: false
- Media: Terminal or Actions summary
- Lesson: Simulation is part of the payment lifecycle, not an afterthought
- CTA: Review the integration or starter template
Post 3: First real transaction
- Hook: “Skirwith just paid a contributor from a merged pull request.”
- Proof: Explorer transaction link
- Media: GitHub receipt comment plus explorer confirmation
- Lesson: The complete path is real
- CTA: Try the reproducible testnet workflow
Post 4: Blocked payout
- Hook: “The most important payment Skirwith makes is sometimes no payment.”
- Proof: Oversized bounty blocked before broadcast
- Media: Blocked Actions summary
- Lesson: A bounded agent should prove refusal, not only success
- CTA: Inspect the policy tests
Post 5: Duplicate prevention
- Hook: “We reran the same merge event. It did not pay twice.”
- Proof: Same payment key, one transaction, duplicate run output
- Media: Side-by-side workflow summaries
- Lesson: Event-driven payments need replay protection
- CTA: Review the idempotency implementation
Post 6: Submission
- Hook: “Skirwith: verified GitHub work to KeeperHub-settled payment.”
- Proof: Video, repository, transaction, and architecture links
- Media: 20-second final clip
- Lesson: The system is intentionally narrow so every step is verifiable
- CTA: Watch the full demo and test the starter workflow
Do not publish wallet secrets, full API responses containing credentials, private repository links before public submission, or claims of mainnet readiness.
11. Day-by-Day Execution Plan
There are approximately ten days from August 3 to the August 13 deadline. The critical path is the real transaction, not visual polish.
Day	Objective	Deliverable	Exit Criterion
Day 1	Freeze architecture and initialize repository	Clean TypeScript project, CI, action metadata	npm test, typecheck, and lint pass in a clean checkout
Day 2	Implement policy schema and event parser	Config loader, merge-event parser, reason codes	20+ policy tests pass, including blocked cases
Day 3	Implement payment key and duplicate model	Canonical request serialization and key generation	Same event produces identical key; changed amount produces different key
Day 4	Implement KeeperHub client	Chain discovery, simulation, broadcast, polling	Mock provider tests pass and a live simulation succeeds
Day 5	Execute first real testnet transaction	Native or stablecoin transaction link	Explorer confirms a real KeeperHub transaction
Day 6	Integrate trusted GitHub workflow	Merged PR trigger, policy evaluation, receipt comment	A test repository produces a successful receipt comment
Day 7	Implement blocked and duplicate demonstrations	Oversized payout block, duplicate rerun	Blocked run proves no broadcast; duplicate proves one payment
Day 8	Security and reliability hardening	Threat tests, secret scan, dependency audit	Fork, spoofing, replay, and secret-redaction tests pass
Day 9	Documentation and demo production	README, architecture diagram, onboarding guide, video draft	Clean external reviewer can reproduce setup from README
Day 10	Final QA and submission	Public repository, video, transaction link, submission form	All links resolve and final demo completes under 3 minutes
Critical path items that cannot slip
1. KeeperHub authentication and wallet configuration
2. First simulation
3. First real transaction
4. Trusted GitHub execution
5. Duplicate prevention
6. Blocked payout proof
7. Video recording
8. Public repository and submission link
If the first real transaction does not work by Day 5, cut all UI work and focus entirely on the sponsor integration.
12. Submission Preflight Checklist
Repository
- Repository is public if required by the submission rules
- Repository URL resolves while logged out
- Repository contains source code, not only screenshots
- No .env files are committed
- No API keys are committed
- No wallet secrets are committed
- Secret scan passes
- Dependency audit passes
- License is present
- .gitignore is present
- Git history contains descriptive progressive commits
- Final tag points to the tested build
- No junk files or editor settings are committed
- CI passes on the submission commit
README
- One-line pitch is visible above the fold
- Real transaction link is visible above the fold
- Demo video link is visible above the fold
- KeeperHub integration is described with exact proof
- Chain and token are stated
- Testnet/mainnet status is stated
- Architecture diagram renders
- Security model is documented
- Configuration example works
- Quick start has been tested from a clean environment
- Blocked payout behavior is documented
- Duplicate behavior is documented
- Limitations are honest
- No unverifiable claims remain
- No fake metrics remain
- No roadmap distracts from the shipped MVP
Demo
- Demo is under three minutes
- Successful path is shown
- Blocked path is shown
- Duplicate path is shown
- GitHub merge event is real or clearly identified as a reproducible fixture
- KeeperHub simulation is visible
- KeeperHub execution ID is visible
- Transaction hash is visible
- Explorer link resolves
- GitHub receipt comment is visible
- No secrets appear in terminal or Actions logs
- Chain name is visible
- Token and amount are visible
- Narration does not claim unsupported KeeperHub features
- Video audio is clear
- Video plays from beginning to end
Video
- Final video file has been tested
- Video link is accessible to judges
- Thumbnail is branded and readable
- Thumbnail does not use an autogenerated frame
- First eight seconds show the product outcome
- No long installation sequence
- No waiting for transactions without narration
- No fake data presented as live data
- Successful transaction link is shown directly
Submission form
- Project name is consistent everywhere
- One-line pitch matches README and video
- GitHub link is correct
- Demo video link is correct
- Transaction link is correct
- KeeperHub is explicitly named as the execution layer
- Sponsor technology usage is accurately described
- No unsupported integrations are claimed
- Team information is complete
- Eligibility requirements are satisfied
- Required disclosures are complete
- Submission is saved before the deadline
- Final submission confirmation is captured
Technical proof
- Transaction is confirmed on the intended chain
- Recipient received the intended amount
- Token contract is correct
- Transaction originated through KeeperHub
- Simulation ran before broadcast
- Idempotency key was used
- Status polling reached a terminal state
- Blocked path made no broadcast request
- Duplicate run created no second payment
- KeeperHub audit evidence is available
- Explorer link is authoritative
Sponsor and onboarding bounty
- KeeperHub integration is load-bearing
- Direct API or MCP path is accurately documented
- Starter template is included
- First-transaction setup is documented
- Wallet setup is documented
- API key setup is documented
- Troubleshooting includes actual integration friction
- Proposed onboarding improvements are concrete
- Bounty submission link or PR is included if applicable
13. Immediate Kill List
Remove or defer these immediately:
1. LLM integration
- It adds no judging value and weakens determinism.
2. Dashboard-first frontend
- The GitHub Action and receipt comment are the product.
3. Custom daily-limit database
- It is not implemented and creates unnecessary state complexity.
4. Multi-chain support
- One confirmed chain beats several speculative integrations.
5. Private routing claims
- Do not claim this unless Skirwith can demonstrate that the execution path uses it.
6. Gas sponsorship claims
- Do not claim sponsorship unless the actual transaction and KeeperHub response prove it.
7. x402 and MPP claims
- These are not necessary for Skirwith’s core payment transaction. Use them only if they are genuinely integrated and visible.
8. Mascot-heavy UX
- It will consume time without improving the critical judging score.
9. Natural-language payment commands
- They conflict with the deterministic policy story.
10. Generic analytics dashboard
- Replace it with execution evidence.
11. Broad startup roadmap
- It makes the submission look unfinished.
12. Unverified personal founder story
- Never fabricate an incident.
13. “Agent” language without autonomous decision evidence
- Skirwith is currently an event-driven policy automation. Either demonstrate meaningful agent behavior or describe it accurately.
14. Daily budget enforcement
- Remove unless persistent state is implemented and tested.
15. Automatic retries
- Do not add retries until terminal status and idempotency behavior are proven.
14. Immediate Build List
Build these in this order:
1. KeeperHub live smoke test
- Before full product implementation.
- Prove authentication, wallet, chain, token, simulation, broadcast, and status.
2. Trusted GitHub event path
- Prove a merge event can be processed without exposing the API key to untrusted code.
3. Policy engine
- Build deterministic reason codes and blocked outcomes.
4. Exact simulation-to-broadcast parity
- Hash or log a canonical request representation and prove the body is unchanged.
5. Payment key and duplicate prevention
- Test event reruns and idempotency conflicts.
6. Receipt comment
- Include execution ID, transaction hash, explorer link, policy result, and timestamp.
7. Blocked payout path
- This is the highest-value differentiator after the successful transaction.
8. Actions summary
- Make the entire execution lifecycle visible without requiring a custom dashboard.
 9. Security fixture suite
- Include contributor-controlled config, fork PR, altered wallet, altered amount, failed checks, and repeated event.
10. Proof-first README
- Do not write a long README before the proof exists.
11. Starter template
- Package the minimum reusable workflow for the onboarding bounty.
12. Three-minute video
- Record only after the live transaction and blocked run are repeatable.
15. The Card No One Else Holds
The strongest proof Skirwith can produce is not merely a transaction hash.
It is a three-state, independently verifiable execution record for the same GitHub workflow:
1. A real merged pull request produces one confirmed KeeperHub transaction.
2. A second run of the same event produces no second payment because the payment key is already settled.
3. A policy-violating pull request is blocked before any KeeperHub broadcast, with logs proving no transaction was submitted.
Presented together, these prove:
- The trigger is real.
- KeeperHub is actually executing the transaction.
- The payout is bounded.
- The system can refuse unsafe work.
- The workflow is replay-resistant.
- The evidence exists across GitHub, KeeperHub, and the blockchain.
- The demo is not a scripted button or a mocked dashboard.
Competitors can copy a payout transaction. They will have more difficulty producing a coherent, repeatable success, duplicate, and refusal evidence set tied to the same workflow and explained through the repository’s tests.
That is the strongest winning card.
Strategic conclusion: build the smallest system that can produce this evidence set. Everything that does not help produce it should be cut.
▣  Plan · gpt-5.6-sol · 3m 9s
good let us keep going
Step 9: Converting the adversarial review into a final build specification. I will inspect the existing WSL folder read-only, resolve the remaining architecture contradictions, and define the exact implementation sequence without creating or modifying files.
→Read skirwith [limit=500, offset=1]
%WebFetch https://docs.keeperhub.com/api/chains
%WebFetch https://docs.keeperhub.com/api/authentication
%WebFetch https://docs.keeperhub.com/api/errors