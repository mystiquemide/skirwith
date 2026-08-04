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
    // SKIRWITH_RECEIPT_SECRET is canonical; the pre-rebrand name is accepted
    // for verification during the migration window.
    receiptSecret: env.SKIRWITH_RECEIPT_SECRET ?? env.MERGE_PAY_RECEIPT_SECRET ?? "",
    previousReceiptSecret:
      env.SKIRWITH_RECEIPT_SECRET_PREVIOUS ?? env.MERGE_PAY_RECEIPT_SECRET_PREVIOUS ?? "",
  };
}
