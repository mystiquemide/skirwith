const HEX_ADDRESS_RE = /^0x[0-9a-fA-F]{40}$/;

export function isHexAddress(value: string): boolean {
  return HEX_ADDRESS_RE.test(value);
}

export function normalizeHexAddress(value: string): `0x${string}` {
  return value.toLowerCase() as `0x${string}`;
}
