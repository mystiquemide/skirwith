const NONNEGATIVE_DECIMAL_RE = /^(0|[1-9]\d*)(\.\d+)?$/;

export function toAtomicUnits(decimal: string, decimals: number): string | undefined {
  if (!NONNEGATIVE_DECIMAL_RE.test(decimal)) {
    return undefined;
  }
  const [intPart, fracPart] = decimal.split(".");
  const frac = fracPart ?? "";
  if (frac.length > decimals) {
    return undefined;
  }
  const int = BigInt(intPart ?? "0");
  const fracValue = frac.length === 0 ? 0n : BigInt(frac.padEnd(decimals, "0"));
  return (int * 10n ** BigInt(decimals) + fracValue).toString();
}

export function isZeroAmount(decimal: string): boolean {
  const [integer, fraction] = decimal.split(".");
  const intPart = integer ?? "";
  const fracPart = fraction ?? "";
  return /^0*$/.test(intPart) && /^0*$/.test(fracPart);
}
