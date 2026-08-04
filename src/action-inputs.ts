export interface RuntimeSecrets {
  githubToken: string;
  keeperhubApiKey: string;
  receiptSecret: string;
  previousReceiptSecret: string;
}

export function parseRuntimeSecrets(env: Record<string, string | undefined>): RuntimeSecrets {
  return {
    githubToken: env.GITHUB_TOKEN ?? "",
    keeperhubApiKey: env.KEEPERHUB_API_KEY ?? "",
    receiptSecret: env.MERGE_PAY_RECEIPT_SECRET ?? "",
    previousReceiptSecret: env.MERGE_PAY_RECEIPT_SECRET_PREVIOUS ?? "",
  };
}
