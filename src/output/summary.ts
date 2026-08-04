import type { EvidenceRecord } from "../domain/types.js";

export interface SettlementDisplay {
  repository: string;
  pullRequestNumber: number;
  recipient?: string;
  amount?: string;
  chainId?: number;
  tokenSymbol?: string;
  tokenAddress?: string;
}

export function renderActionSummary(evidence: EvidenceRecord, display: SettlementDisplay): string {
  const lines = [
    "## Skirwith settlement",
    `- Status: \`${evidence.status}\``,
    `- Policy: ${evidence.policy.result}`,
    `- Broadcast made: ${evidence.broadcastMade ? "yes" : "no"}`,
    `- Repository: ${display.repository}`,
    `- Pull request: #${display.pullRequestNumber}`,
  ];
  if (evidence.policy.reasons.length > 0) {
    lines.push(`- Reasons: ${evidence.policy.reasons.map((reason) => reason.code).join(", ")}`);
  }
  if (display.recipient !== undefined) {
    lines.push(`- Recipient: \`${display.recipient}\``);
  }
  if (display.amount !== undefined) {
    lines.push(`- Amount: ${display.amount} ${display.tokenSymbol ?? ""}`.trim());
  }
  if (display.chainId !== undefined) {
    lines.push(`- Chain: ${display.chainId}`);
  }
  if (display.tokenAddress !== undefined) {
    lines.push(`- Token: \`${display.tokenAddress}\``);
  }
  if (evidence.paymentKey !== "") {
    lines.push(`- Payment key: \`${evidence.paymentKey}\``);
  }
  if (evidence.executionId !== undefined) {
    lines.push(`- Execution ID: \`${evidence.executionId}\``);
  }
  if (evidence.transactionHash !== undefined) {
    const transaction =
      evidence.transactionLink !== undefined
        ? `[${evidence.transactionHash}](${evidence.transactionLink})`
        : `\`${evidence.transactionHash}\``;
    lines.push(`- Transaction: ${transaction}`);
  }
  if (evidence.error !== undefined) {
    lines.push(`- Error: \`${evidence.error.code}\` ${evidence.error.message}`);
  }
  return lines.join("\n");
}
