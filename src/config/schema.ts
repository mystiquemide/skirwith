import type { HexAddress } from "../domain/types.js";

export const CONFIG_SCHEMA_VERSION = 1;

export interface ChainConfig {
  id: number;
  explorer: string;
  token: {
    address: HexAddress;
    symbol: string;
    decimals: number;
  };
}

export interface PayoutConfig {
  requiredLabel: string;
  maximum: string;
  amounts: Record<string, string>;
}

export interface ChecksConfig {
  required: boolean;
  names: readonly string[];
}

export interface SkirwithConfig {
  version: 1;
  repository: string;
  chain: ChainConfig;
  payout: PayoutConfig;
  recipients: Record<string, HexAddress>;
  checks: ChecksConfig;
}
