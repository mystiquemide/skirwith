import type { KeeperHubProvider } from "../../src/keeperhub/provider.js";
import type {
  ExecutionStatusResponse,
  KeeperHubChain,
  TransferBroadcast,
  TransferParameters,
  TransferSimulation,
} from "../../src/keeperhub/types.js";
import type { ReceiptRecord } from "../../src/evidence/receipt.js";
import type { ReceiptStore } from "../../src/github/receipt-store.js";

export class FakeKeeperHubProvider implements KeeperHubProvider {
  simulateResult: TransferSimulation = { wouldRevert: false };
  simulateError?: unknown;
  broadcastResult: TransferBroadcast = { executionId: "ex_fake", status: "running" };
  broadcastError?: unknown;
  terminalResult: ExecutionStatusResponse = {
    executionId: "ex_fake",
    status: "completed",
    pollIntervalHint: 0,
  };
  terminalError?: unknown;
  lastBroadcastKey?: string;
  calls = {
    simulate: 0,
    broadcast: 0,
    getExecution: 0,
    waitForTerminal: 0,
    chains: 0,
  };

  async simulateTransfer(): Promise<TransferSimulation> {
    this.calls.simulate += 1;
    if (this.simulateError !== undefined) {
      throw this.simulateError;
    }
    return this.simulateResult;
  }

  async broadcastTransfer(
    parameters: TransferParameters,
    paymentKey: string,
  ): Promise<TransferBroadcast> {
    void parameters;
    this.calls.broadcast += 1;
    this.lastBroadcastKey = paymentKey;
    if (this.broadcastError !== undefined) {
      throw this.broadcastError;
    }
    return this.broadcastResult;
  }

  async getExecution(): Promise<ExecutionStatusResponse> {
    this.calls.getExecution += 1;
    return this.terminalResult;
  }

  async waitForTerminal(): Promise<ExecutionStatusResponse> {
    this.calls.waitForTerminal += 1;
    if (this.terminalError !== undefined) {
      throw this.terminalError;
    }
    return this.terminalResult;
  }

  async discoverChains(): Promise<KeeperHubChain[]> {
    this.calls.chains += 1;
    return [];
  }
}

export class FakeReceiptStore implements ReceiptStore {
  records = new Map<string, ReceiptRecord>();
  saves: ReceiptRecord[] = [];

  async findByPaymentKey(paymentKey: string): Promise<ReceiptRecord | undefined> {
    return this.records.get(paymentKey);
  }

  async save(record: ReceiptRecord): Promise<void> {
    this.records.set(record.paymentKey, record);
    this.saves.push(record);
  }
}
