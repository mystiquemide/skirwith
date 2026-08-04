# Skirwith Demo Video Plan

Hackathon: KeeperHub Agents Onchain.
Requirement: the video must show the agent executing onchain through KeeperHub.

## Specs

- Duration: 2:45 to 3:00.
- Style: voiceover plus real screen recording plus burned-in captions.
- Tone: dark, serious, operator-focused. Facts over hype.
- Visual direction: the live site, the live GitHub Actions runs, the real
  Sepolia explorer. No mock screens.
- Requirement: one scene shows the action execute a real onchain transfer
  through KeeperHub. KeeperHub is named and shown. Its execution id is on
  screen.

## Scenes

### Scene 1: The problem (0:00 to 0:18)

- Visual: the live site hero (mystiquemide.github.io/skirwith). Then a cut
  to a merged pull request in the acceptance repository.
- Voiceover: "Every merged pull request proves the work happened. Settling
  the payment is a separate manual job. People get paid late, paid twice, or
  not paid at all. I built Skirwith to close that gap."
- Caption: "Merge to payment. Automated."

### Scene 2: The setup (0:18 to 0:35)

- Visual: the trusted config file `.github/skirwith.yml` and the workflow
  file from the repository, shown in the GitHub UI.
- Voiceover: "The maintainer owns everything. Recipients and amounts come
  from this config file on the default branch. The workflow triggers on a
  closed pull request. It never checks out the contributor's code."
- Caption: "Maintainer-controlled policy. Contributor code is untrusted."

### Scene 3: The merged pull request (0:35 to 0:55)

- Visual: the acceptance repository pull request page, then the GitHub
  Actions run for that PR (run 30886636409). Pause on the job.
- Voiceover: "When the pull request merges, the action wakes up. It reads
  fresh state from GitHub. Policy picks the wallet and the amount. It writes
  a signed reservation before anything happens onchain."
- Caption: "Merged PR. Action starts."

### Scene 4: Onchain execution through KeeperHub (0:55 to 1:30)

This is the required scene.

- Visual: the KeeperHub execution result. Show the execution id
  `mn7vnwz2rednekykkww8d`. Then the real Sepolia transaction
  [0x4c2e…dddb0](https://sepolia.etherscan.io/tx/0x4c2e25779a1bccd11db69dd68ba5aa25a5a164d3010e1a34001a55750c7dddb0)
  on the explorer. Pause on the USDC Transfer event: from the org wallet,
  to the recipient, value 5 USDC.
- Voiceover: "The action sends the exact request to KeeperHub. KeeperHub
  simulates it first, then broadcasts it once. Here is the transaction on
  Sepolia. The USDC Transfer event is real, confirmed onchain. KeeperHub is
  the execution rail. Without it, there is no settlement."
- Caption: "KeeperHub executes. Onchain, confirmed."

### Scene 5: Replay, no second transaction (1:30 to 1:52)

- Visual: re-running the same workflow run. Then the receipt comment,
  unchanged, still showing the same transaction hash. The wallet balance
  stays at 40 USDC.
- Voiceover: "What if the same event fires again? Skirwith resolves the
  existing receipt. It does not broadcast a second time. No duplicate
  payment. The wallet balance does not move."
- Caption: "Replay. Zero second transactions."

### Scene 6: Refusal before broadcast (1:52 to 2:15)

- Visual: a second pull request with no required label, run 30886951542.
  Then the blocked result. Zero receipt comments. Then the third pull
  request with two amount labels, run 30888126456, also blocked.
- Voiceover: "Policy blocks bad payouts before they reach KeeperHub. A
  missing label is refused. Two conflicting amounts are refused. Both report
  broadcastMade false. Nothing was sent."
- Caption: "Blocked. No broadcast."

### Scene 7: Evidence and safety (2:15 to 2:40)

- Visual: the receipt comments on the acceptance repository, then the live
  site's proof section listing 7 confirmed transactions with execution ids
  and explorer links.
- Voiceover: "Seven real transactions are confirmed onchain. Every receipt
  is signed. The system never auto-rebroadcasts an uncertain execution. It
  fails safe to manual review instead."
- Caption: "Seven confirmed. Signed receipts. Manual review on uncertainty."

### Scene 8: End card (2:40 to 3:00)

- Visual: the repo page, github.com/mystiquemide/skirwith, and the live
  site, mystiquemide.github.io/skirwith.
- Voiceover: "Skirwith turns a merged pull request into a settled payment,
  once, with proof. Built for the KeeperHub Agents Onchain hackathon."
- Caption: "github.com/mystiquemide/skirwith"

## Recording checklist

Before recording:

- Use a clean browser profile. Log in to GitHub as mystiquemide.
- Open the acceptance repository, the workflow run, and the Sepolia explorer
  in separate tabs.
- Record at 1920x1080. Set the site to dark mode.
- Mute notifications. Check the microphone in a quiet room.

During recording:

- Move the cursor slowly. Pause on the execution id and the Transfer event.
- Do not type. Pre-open every page.
- Keep each scene to one idea. Stop between scenes.

After recording:

- Trim dead air and failed takes.
- Add captions in CapCut.
- Normalize audio. Export 1080p, H.264, under 60 MB.

## Production notes

- Tools: Recordly for screen capture, CapCut for voiceover and captions.
- Transitions: hard cuts. No effects for a security product.
- Captions: white text on a dark band, bottom of frame.
- Audio: no background music, or a low dark ambient bed under the voiceover.
- The KeeperHub scene is the core. It must show the execution id and the
  Transfer event. Do not shorten it.
- End card: repo URL, live URL, hackathon attribution.

## Assets used (all real)

- Site: mystiquemide.github.io/skirwith
- Repo: github.com/mystiquemide/skirwith
- Acceptance repo: github.com/mystiquemide/skirwith-acceptance
- Confirmed run: 30886636409, execution mn7vnwz2rednekykkww8d
- Transaction: 0x4c2e…dddb0 on sepolia.etherscan.io
- Refusal run (missing label): 30886951542
- Refusal run (ambiguous): 30888126456
