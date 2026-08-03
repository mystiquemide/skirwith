import type {
  EvidenceRecord,
  ExecutionStatus,
  PolicyDecision,
  SimulationState,
} from "../domain/types.js";

export interface BuildEvidenceInput {
  paymentKey: string;
  requestHash: string;
  policy: PolicyDecision;
  simulation: SimulationState;
  broadcastMade: boolean;
  status: ExecutionStatus;
  executionId?: string;
  transactionHash?: string;
  transactionLink?: string;
  error?: { code: string; message: string };
  nowIso: () => string;
}

export function buildEvidence(input: BuildEvidenceInput): EvidenceRecord {
  const now = input.nowIso();
  const record: EvidenceRecord = {
    version: 1,
    paymentKey: input.paymentKey,
    requestHash: input.requestHash,
    policy: input.policy,
    simulation: input.simulation,
    broadcastMade: input.broadcastMade,
    status: input.status,
    timestamps: { createdAt: now, updatedAt: now },
  };
  if (input.executionId !== undefined) {
    record.executionId = input.executionId;
  }
  if (input.transactionHash !== undefined) {
    record.transactionHash = input.transactionHash;
  }
  if (input.transactionLink !== undefined) {
    record.transactionLink = input.transactionLink;
  }
  if (input.error !== undefined) {
    record.error = input.error;
  }
  return record;
}

export function serializeEvidence(record: EvidenceRecord): string {
  return JSON.stringify(record, null, 2);
}
