export interface TransferParameters {
  chainId: number;
  recipientAddress: string;
  amount: string;
  tokenAddress?: string;
  tokenConfig?: unknown;
  gasLimitMultiplier?: number;
}

export interface TransferSimulation {
  wouldRevert: boolean;
  simulatedReturnValue?: boolean;
  gasEstimate?: number;
  value?: number;
  revertReason?: string;
}

export type KeeperHubExecutionStatus = "pending" | "running" | "completed" | "failed";

export interface TransferBroadcast {
  executionId: string;
  status: KeeperHubExecutionStatus;
  transactionHash?: string;
  transactionLink?: string;
}

export interface ExecutionStatusResponse {
  executionId: string;
  status: KeeperHubExecutionStatus;
  transactionHash?: string;
  transactionLink?: string;
  pollIntervalHint: number;
}

export interface KeeperHubChain {
  id: string;
  chainId: number;
  isTestnet: boolean;
  isEnabled: boolean;
  explorerUrl: string;
  explorerAddressPath: string;
}
