export interface RuntimeSecrets {
  githubToken: string;
  keeperhubApiKey: string;
}

export function parseRuntimeSecrets(env: Record<string, string | undefined>): RuntimeSecrets {
  return {
    githubToken: env.GITHUB_TOKEN ?? "",
    keeperhubApiKey: env.KEEPERHUB_API_KEY ?? "",
  };
}
