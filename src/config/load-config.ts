import { parse } from "yaml";
import { toAtomicUnits } from "../domain/decimal.js";
import { MergePayError } from "../domain/errors.js";
import { isHexAddress } from "../security/validate.js";
import { CONFIG_SCHEMA_VERSION } from "./schema.js";
import type { MergePayConfig } from "./schema.js";

interface LoadConfigOptions {
  expectedRepository: string;
}

const ALLOWED_TOP_LEVEL = new Set([
  "version",
  "repository",
  "chain",
  "payout",
  "recipients",
  "checks",
]);

function asRecord(value: unknown, context: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new MergePayError({
      code: "CONFIG_SCHEMA_INVALID",
      category: "configuration",
      message: `Configuration field '${context}' must be a mapping.`,
    });
  }
  return value as Record<string, unknown>;
}

function requireString(record: Record<string, unknown>, key: string, context: string): string {
  const value = record[key];
  if (typeof value !== "string" || value.length === 0) {
    throw new MergePayError({
      code: "CONFIG_SCHEMA_INVALID",
      category: "configuration",
      message: `Configuration field '${context}.${key}' must be a non-empty string.`,
    });
  }
  return value;
}

function requireNumber(record: Record<string, unknown>, key: string, context: string): number {
  const value = record[key];
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new MergePayError({
      code: "CONFIG_SCHEMA_INVALID",
      category: "configuration",
      message: `Configuration field '${context}.${key}' must be a finite number.`,
    });
  }
  return value;
}

function rejectUnknownFields(
  record: Record<string, unknown>,
  allowed: ReadonlySet<string>,
  context: string,
): void {
  for (const key of Object.keys(record)) {
    if (!allowed.has(key)) {
      throw new MergePayError({
        code: "CONFIG_SCHEMA_INVALID",
        category: "configuration",
        message: `Configuration field '${context}.${key}' is not supported.`,
      });
    }
  }
}

function isNonnegativeDecimalString(value: string): boolean {
  return /^(0|[1-9]\d*)(\.\d+)?$/.test(value);
}

function assertFractionalPrecision(decimal: string, decimals: number, context: string): void {
  const frac = decimal.split(".")[1] ?? "";
  if (frac.length > decimals) {
    throw new MergePayError({
      code: "CONFIG_SEMANTIC_INVALID",
      category: "configuration",
      message: `Value '${decimal}' in '${context}' has more than ${decimals} fractional digits for the configured token decimals.`,
    });
  }
}

function parseAmounts(
  record: Record<string, unknown>,
  context: string,
  maximum: string,
  decimals: number,
): Record<string, string> {
  const amounts: Record<string, string> = {};
  const allowed = new Set<string>();
  const maximumAtomic = BigInt(toAtomicUnits(maximum, decimals) ?? "0");
  for (const key of Object.keys(record)) {
    if (allowed.has(key)) {
      throw new MergePayError({
        code: "CONFIG_SEMANTIC_INVALID",
        category: "configuration",
        message: `Duplicate payout label '${key}' in '${context}'.`,
      });
    }
    allowed.add(key);
    const raw = record[key];
    if (typeof raw !== "string" || !isNonnegativeDecimalString(raw)) {
      throw new MergePayError({
        code: "CONFIG_SEMANTIC_INVALID",
        category: "configuration",
        message: `Amount for label '${key}' in '${context}' must be a nonnegative decimal string.`,
      });
    }
    assertFractionalPrecision(raw, decimals, context);
    const atomic = toAtomicUnits(raw, decimals);
    if (atomic === undefined) {
      throw new MergePayError({
        code: "CONFIG_SEMANTIC_INVALID",
        category: "configuration",
        message: `Amount for label '${key}' in '${context}' exceeds the configured token precision.`,
      });
    }
    if (BigInt(atomic) > maximumAtomic) {
      throw new MergePayError({
        code: "CONFIG_SEMANTIC_INVALID",
        category: "configuration",
        message: `Amount for label '${key}' exceeds the configured maximum '${maximum}'.`,
      });
    }
    amounts[key] = raw;
  }
  return amounts;
}

function parseRecipients(record: Record<string, unknown>): Record<string, `0x${string}`> {
  const recipients: Record<string, `0x${string}`> = {};
  for (const login of Object.keys(record)) {
    const raw = record[login];
    if (typeof raw !== "string" || !isHexAddress(raw)) {
      throw new MergePayError({
        code: "CONFIG_SEMANTIC_INVALID",
        category: "configuration",
        message: `Recipient wallet for '${login}' is not a valid address.`,
      });
    }
    recipients[login] = raw.toLowerCase() as `0x${string}`;
  }
  if (Object.keys(recipients).length === 0) {
    throw new MergePayError({
      code: "CONFIG_SEMANTIC_INVALID",
      category: "configuration",
      message: "At least one recipient must be configured.",
    });
  }
  return recipients;
}

export function loadConfig(yamlText: string, options: LoadConfigOptions): MergePayConfig {
  let parsed: unknown;
  try {
    parsed = parse(yamlText);
  } catch (error) {
    throw new MergePayError({
      code: "CONFIG_MALFORMED_YAML",
      category: "configuration",
      message: "Configuration file could not be parsed as YAML.",
      cause: error,
    });
  }
  const raw = asRecord(parsed, "");

  rejectUnknownFields(raw, ALLOWED_TOP_LEVEL, "");

  if (raw.version !== CONFIG_SCHEMA_VERSION) {
    throw new MergePayError({
      code: "CONFIG_UNSUPPORTED_VERSION",
      category: "configuration",
      message: `Unsupported configuration version. Expected ${CONFIG_SCHEMA_VERSION}.`,
    });
  }

  const repository = requireString(raw, "repository", "");
  if (repository !== options.expectedRepository) {
    throw new MergePayError({
      code: "CONFIG_SEMANTIC_INVALID",
      category: "configuration",
      message: `Configuration repository '${repository}' does not match the event repository '${options.expectedRepository}'.`,
    });
  }

  const chain = asRecord(raw.chain, "chain");
  rejectUnknownFields(chain, new Set(["id", "explorer", "token"]), "chain");
  const chainId = requireNumber(chain, "id", "chain");
  const explorer = requireString(chain, "explorer", "chain");
  const token = asRecord(chain.token, "chain.token");
  rejectUnknownFields(token, new Set(["address", "symbol", "decimals"]), "chain.token");
  const tokenAddressRaw = requireString(token, "address", "chain.token");
  if (!isHexAddress(tokenAddressRaw)) {
    throw new MergePayError({
      code: "CONFIG_SEMANTIC_INVALID",
      category: "configuration",
      message: "Configuration field 'chain.token.address' is not a valid address.",
    });
  }
  const tokenAddress = tokenAddressRaw.toLowerCase() as `0x${string}`;
  const symbol = requireString(token, "symbol", "chain.token");
  const decimals = requireNumber(token, "decimals", "chain.token");
  if (!Number.isInteger(decimals) || decimals < 0 || decimals > 77) {
    throw new MergePayError({
      code: "CONFIG_SEMANTIC_INVALID",
      category: "configuration",
      message: "Configuration field 'chain.token.decimals' must be an integer between 0 and 77.",
    });
  }

  const payout = asRecord(raw.payout, "payout");
  rejectUnknownFields(payout, new Set(["requiredLabel", "maximum", "amounts"]), "payout");
  const requiredLabel = requireString(payout, "requiredLabel", "payout");
  const maximum = requireString(payout, "maximum", "payout");
  if (!isNonnegativeDecimalString(maximum)) {
    throw new MergePayError({
      code: "CONFIG_SEMANTIC_INVALID",
      category: "configuration",
      message: "Configuration field 'payout.maximum' must be a nonnegative decimal string.",
    });
  }
  assertFractionalPrecision(maximum, decimals, "payout.maximum");
  const amountsRaw = asRecord(payout.amounts, "payout.amounts");
  const amounts = parseAmounts(amountsRaw, "payout.amounts", maximum, decimals);
  if (Object.keys(amounts).length === 0) {
    throw new MergePayError({
      code: "CONFIG_SEMANTIC_INVALID",
      category: "configuration",
      message: "At least one payout amount must be configured.",
    });
  }

  const recipientsRaw = asRecord(raw.recipients, "recipients");
  const recipients = parseRecipients(recipientsRaw);

  const checks = asRecord(raw.checks, "checks");
  rejectUnknownFields(checks, new Set(["required", "names"]), "checks");
  const checksRequired = checks.required;
  if (typeof checksRequired !== "boolean") {
    throw new MergePayError({
      code: "CONFIG_SCHEMA_INVALID",
      category: "configuration",
      message: "Configuration field 'checks.required' must be a boolean.",
    });
  }
  const namesRaw = checks.names;
  if (!Array.isArray(namesRaw)) {
    throw new MergePayError({
      code: "CONFIG_SCHEMA_INVALID",
      category: "configuration",
      message: "Configuration field 'checks.names' must be a list.",
    });
  }
  const names: string[] = [];
  for (const name of namesRaw) {
    if (typeof name !== "string" || name.length === 0) {
      throw new MergePayError({
        code: "CONFIG_SCHEMA_INVALID",
        category: "configuration",
        message: "Configuration field 'checks.names' entries must be non-empty strings.",
      });
    }
    names.push(name);
  }
  if (checksRequired && names.length === 0) {
    throw new MergePayError({
      code: "CONFIG_SEMANTIC_INVALID",
      category: "configuration",
      message: "Required checks must include at least one check name.",
    });
  }

  return {
    version: 1,
    repository,
    chain: {
      id: chainId,
      explorer,
      token: { address: tokenAddress, symbol, decimals },
    },
    payout: { requiredLabel, maximum, amounts },
    recipients,
    checks: { required: checksRequired, names },
  };
}
