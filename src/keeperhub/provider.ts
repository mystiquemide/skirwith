import type {
  ExecutionStatusResponse,
  KeeperHubChain,
  TransferBroadcast,
  TransferParameters,
  TransferSimulation,
} from "./types.js";

export interface KeeperHubProvider {
  simulateTransfer(parameters: TransferParameters): Promise<TransferSimulation>;
  broadcastTransfer(parameters: TransferParameters, paymentKey: string): Promise<TransferBroadcast>;
  getExecution(executionId: string): Promise<ExecutionStatusResponse>;
  waitForTerminal(executionId: string): Promise<ExecutionStatusResponse>;
  discoverChains(): Promise<KeeperHubChain[]>;
}
