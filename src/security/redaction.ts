const SECRET_KEY_RE = /(authorization|secret|token|api[_-]?key|password|private[_-]?key|bearer)/i;
const REDACTED = "***";

function isActiveSecret(value: string): boolean {
  return value.length > 0;
}

function redactValue(value: unknown, secrets: readonly string[]): unknown {
  if (typeof value === "string") {
    return secrets.some((secret) => value === secret || value.includes(secret)) ? REDACTED : value;
  }
  if (Array.isArray(value)) {
    return value.map((entry) => redactValue(entry, secrets));
  }
  if (typeof value === "object" && value !== null) {
    const output: Record<string, unknown> = {};
    for (const [key, entry] of Object.entries(value)) {
      if (SECRET_KEY_RE.test(key) && typeof entry === "string" && entry.length > 0) {
        output[key] = REDACTED;
      } else {
        output[key] = redactValue(entry, secrets);
      }
    }
    return output;
  }
  return value;
}

export function redact(value: unknown, secrets: readonly string[]): unknown {
  const activeSecrets = secrets.filter(isActiveSecret);
  return redactValue(value, activeSecrets);
}
