import type { ReceiptRecord } from "../evidence/receipt.js";

export interface ReceiptStore {
  findByPaymentKey(paymentKey: string): Promise<ReceiptRecord | undefined>;
  save(record: ReceiptRecord): Promise<void>;
}
