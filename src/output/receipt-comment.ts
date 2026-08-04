import { encodeReceiptMarker } from "../evidence/receipt.js";
import type { ReceiptRecord } from "../evidence/receipt.js";
import { describeOutcome } from "./status-copy.js";

export function renderReceiptComment(record: ReceiptRecord, mac: string, keyId: string): string {
  const copy = describeOutcome({
    status: record.status,
    broadcastMade: false,
  });
  const lines = [
    "## Skirwith receipt",
    `- Status: ${copy.outcome} (\`${record.status}\`)`,
    `- Next step: ${copy.nextStep}`,
    `- Payment key: \`${record.paymentKey}\``,
    `- Request hash: \`${record.requestHash}\``,
    `- Repository: ${record.repository}`,
    `- Pull request: #${record.pullRequestNumber}`,
  ];
  if (record.executionId !== undefined) {
    lines.push(`- Execution ID: \`${record.executionId}\``);
  }
  if (record.transactionHash !== undefined) {
    const transaction =
      record.transactionLink !== undefined
        ? `[${record.transactionHash}](${record.transactionLink})`
        : `\`${record.transactionHash}\``;
    lines.push(`- Transaction: ${transaction}`);
  }
  const marker = encodeReceiptMarker({
    version: 1,
    product: "skirwith",
    paymentKey: record.paymentKey,
    requestHash: record.requestHash,
    status: record.status,
    executionId: record.executionId,
    transactionHash: record.transactionHash,
    transactionLink: record.transactionLink,
    repository: record.repository,
    pullRequestNumber: record.pullRequestNumber,
    mergeSha: record.mergeSha,
    keyId,
    mac,
  });
  return `${lines.join("\n")}\n\n${marker}`;
}
