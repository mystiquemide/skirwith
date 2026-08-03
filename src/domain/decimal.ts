export function exceedsDecimalString(a: string, b: string): boolean {
  const [ai, af] = a.split(".");
  const [bi, bf] = b.split(".");
  const aInt = ai ?? "0";
  const bInt = bi ?? "0";
  const aFrac = (af ?? "").padEnd(18, "0");
  const bFrac = (bf ?? "").padEnd(18, "0");
  const aWhole = BigInt(aInt);
  const bWhole = BigInt(bInt);
  if (aWhole !== bWhole) {
    return aWhole > bWhole;
  }
  return BigInt(aFrac) > BigInt(bFrac);
}

export function isZeroAmount(decimal: string): boolean {
  const [integer, fraction] = decimal.split(".");
  const intPart = integer ?? "";
  const fracPart = fraction ?? "";
  return /^0*$/.test(intPart) && /^0*$/.test(fracPart);
}
