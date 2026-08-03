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

export function atomicToHumanUnits(amountAtomic: string, decimals: number): string {
  const amount = BigInt(amountAtomic);
  const scale = 10n ** BigInt(decimals);
  const whole = amount / scale;
  const fraction = amount % scale;
  if (fraction === 0n) {
    return whole.toString();
  }
  const frac = fraction.toString().padStart(decimals, "0").replace(/0+$/, "");
  if (frac.length === 0) {
    return whole.toString();
  }
  return `${whole}.${frac}`;
}

export function isZeroAmount(decimal: string): boolean {
  const [integer, fraction] = decimal.split(".");
  const intPart = integer ?? "";
  const fracPart = fraction ?? "";
  return /^0*$/.test(intPart) && /^0*$/.test(fracPart);
}
