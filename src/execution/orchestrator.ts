import type { MergePayConfig } from "../config/schema.js";
import { toAtomicUnits } from "../domain/decimal.js";
import { MergePayError } from "../domain/errors.js";
import type {
  ChainTokenConfig,
  EvidenceRecord,
  ExecutionStatus,
  PolicyDecision,
} from "../domain/types.js";
import { PAYMENT_PURPOSE } from "../domain/constants.js";
import {
  evaluatePolicy,
  resolvePayoutAmount,
  resolveRecipient,
} from "../policy/evaluate-policy.js";
import { buildCanonicalRequest } from "../payment/canonical-request.js";
import { hashCanonicalRequest } from "../payment/payment-hash.js";
import { derivePaymentKey } from "../payment/payment-key.js";
import type { NormalizedPullRequestEvent } from "../github/event.js";
import type { ReceiptStore } from "../github/receipt-store.js";
import type { ReceiptRecord } from "../evidence/receipt.js";
import type { BuildEvidenceInput } from "../evidence/evidence.js";
import { buildEvidence } from "../evidence/evidence.js";
import { buildTransferParameters } from "../keeperhub/transfer-parameters.js";
import type { ProviderError } from "../keeperhub/errors.js";
import type { KeeperHubProvider } from "../keeperhub/provider.js";
import { resolveExistingReceipt } from "./duplicate-resolver.js";

export interface SettlementInput {
  event: NormalizedPullRequestEvent;
  config: MergePayConfig;
  expectedBaseBranch: string;
  passedChecks: readonly string[];
  chainToken: ChainTokenConfig;
}

export interface SettlementServices {
  provider: KeeperHubProvider;
  receipts: ReceiptStore;
  nowIso?: () => string;
  sleepMs?: (ms: number) => Promise<void>;
}

const RECEIPT_SAVE_ATTEMPTS = 3;

export class SettlementOrchestrator {
  private readonly provider: KeeperHubProvider;
  private readonly receipts: ReceiptStore;
  private readonly nowIso: () => string;
  private readonly sleepMs: (ms: number) => Promise<void>;

  constructor(services: SettlementServices) {
    this.provider = services.provider;
    this.receipts = services.receipts;
    this.nowIso = services.nowIso ?? (() => new Date().toISOString());
    this.sleepMs =
      services.sleepMs ?? ((ms: number) => new Promise((resolve) => setTimeout(resolve, ms)));
  }

  // Retries a receipt persistence operation so a transient GitHub/network
  // failure cannot drop a post-broadcast execution identity. Broadcast is
  // never retried here; only idempotent receipt create-or-update is.
  private async saveWithRetry(record: ReceiptRecord): Promise<void> {
    let lastError: unknown;
    for (let attempt = 0; attempt < RECEIPT_SAVE_ATTEMPTS; attempt += 1) {
      try {
        await this.receipts.save(record);
        return;
      } catch (error) {
        lastError = error;
        if (attempt < RECEIPT_SAVE_ATTEMPTS - 1) {
          await this.sleepMs(500 * (attempt + 1));
        }
      }
    }
    throw lastError;
  }

  async settle(input: SettlementInput): Promise<EvidenceRecord> {
    const policy = evaluatePolicy({
      repository: input.event.repository.fullName,
      authorLogin: input.event.authorLogin,
      baseBranch: input.event.baseBranch,
      labels: input.event.labels,
      merged: input.event.merged,
      passedChecks: input.passedChecks,
      expectedBaseBranch: input.expectedBaseBranch,
      chainToken: input.chainToken,
      config: input.config,
    });

    if (policy.result === "blocked") {
      return this.evidence({
        policy,
        paymentKey: "",
        requestHash: "",
        simulation: "not-run",
        broadcastMade: false,
        status: "blocked",
      });
    }

    const candidate = this.resolveCandidate(input);
    if (candidate === undefined) {
      return this.evidence({
        policy,
        paymentKey: "",
        requestHash: "",
        simulation: "not-run",
        broadcastMade: false,
        status: "blocked",
        error: {
          code: "INTERNAL_ERROR",
          message: "Approved policy did not resolve a payout candidate.",
        },
      });
    }

    const canonical = buildCanonicalRequest({ ...candidate, purpose: PAYMENT_PURPOSE });
    const paymentKey = derivePaymentKey(canonical);
    const requestHash = hashCanonicalRequest(canonical);

    const existing = await this.receipts.findByPaymentKey(paymentKey);
    if (existing !== undefined) {
      return this.resolveExisting(input, policy, paymentKey, requestHash, existing);
    }
    return this.executeNew(input, canonical, paymentKey, requestHash, policy);
  }

  private resolveCandidate(input: SettlementInput) {
    const recipient = resolveRecipient(input.config, input.event.authorLogin);
    const resolvedAmount = resolvePayoutAmount(input.config, input.event.labels);
    if (recipient === undefined || resolvedAmount === undefined) {
      return undefined;
    }
    const amountAtomic = toAtomicUnits(resolvedAmount.amount, input.config.chain.token.decimals);
    if (amountAtomic === undefined) {
      return undefined;
    }
    return {
      repository: input.event.repository.fullName,
      pullRequestNumber: input.event.pullRequestNumber,
      mergeSha: input.event.mergeSha,
      recipient,
      amountAtomic,
      chainId: input.chainToken.chainId,
      tokenAddress: input.chainToken.tokenAddress,
    };
  }

  private evidence(input: Omit<BuildEvidenceInput, "nowIso">): EvidenceRecord {
    return buildEvidence({ ...input, nowIso: this.nowIso });
  }

  private safeError(error: unknown): { code: string; message: string } {
    if (error instanceof MergePayError) {
      return error.toPublic();
    }
    return { code: "INTERNAL_ERROR", message: "An unexpected error occurred." };
  }

  private async resolveExisting(
    input: SettlementInput,
    policy: PolicyDecision,
    paymentKey: string,
    requestHash: string,
    existing: ReceiptRecord,
  ): Promise<EvidenceRecord> {
    const resolution = resolveExistingReceipt(existing, {
      paymentKey,
      requestHash,
      repository: input.event.repository.fullName,
      pullRequestNumber: input.event.pullRequestNumber,
      mergeSha: input.event.mergeSha,
    });

    if (resolution.kind === "duplicate") {
      return this.evidence({
        policy,
        paymentKey,
        requestHash,
        simulation: "not-run",
        broadcastMade: false,
        status: "duplicate",
        executionId: existing.executionId,
        transactionHash: existing.transactionHash,
        transactionLink: existing.transactionLink,
      });
    }

    if (resolution.kind === "resume-poll") {
      return this.resumeExisting(policy, paymentKey, requestHash, existing);
    }

    return this.evidence({
      policy,
      paymentKey,
      requestHash,
      simulation: "not-run",
      broadcastMade: false,
      status: "manual-review",
      executionId: existing.executionId,
      error:
        resolution.kind === "conflict"
          ? {
              code: "EXECUTION_CONFLICT",
              message: "An existing execution has different content under this payment key.",
            }
          : {
              code: "EXECUTION_MANUAL_REVIEW",
              message: "A prior execution for this payment requires manual review.",
            },
    });
  }

  private async resumeExisting(
    policy: PolicyDecision,
    paymentKey: string,
    requestHash: string,
    existing: ReceiptRecord,
  ): Promise<EvidenceRecord> {
    const executionId = existing.executionId as string;
    try {
      const terminal = await this.provider.waitForTerminal(executionId);
      const status: ExecutionStatus = terminal.status === "completed" ? "confirmed" : "failed";
      const updated: ReceiptRecord = {
        ...existing,
        status,
        transactionHash: terminal.transactionHash ?? existing.transactionHash,
        transactionLink: terminal.transactionLink ?? existing.transactionLink,
        updatedAt: this.nowIso(),
      };
      await this.saveWithRetry(updated);
      return this.evidence({
        policy,
        paymentKey,
        requestHash,
        simulation: "not-run",
        broadcastMade: false,
        status,
        executionId,
        transactionHash: updated.transactionHash,
        transactionLink: updated.transactionLink,
      });
    } catch {
      return this.evidence({
        policy,
        paymentKey,
        requestHash,
        simulation: "not-run",
        broadcastMade: false,
        status: "manual-review",
        executionId,
        error: {
          code: "EXECUTION_MANUAL_REVIEW",
          message: "Could not determine the terminal state of the existing execution.",
        },
      });
    }
  }

  private async executeNew(
    input: SettlementInput,
    canonical: ReturnType<typeof buildCanonicalRequest>,
    paymentKey: string,
    requestHash: string,
    policy: PolicyDecision,
  ): Promise<EvidenceRecord> {
    const parameters = buildTransferParameters(canonical, input.config.chain.token.decimals);

    let simulation;
    try {
      simulation = await this.provider.simulateTransfer(parameters);
    } catch (error) {
      return this.evidence({
        policy,
        paymentKey,
        requestHash,
        simulation: "failed",
        broadcastMade: false,
        status: "failed",
        error: this.safeError(error),
      });
    }
    if (simulation.wouldRevert) {
      return this.evidence({
        policy,
        paymentKey,
        requestHash,
        simulation: "failed",
        broadcastMade: false,
        status: "failed",
        error: {
          code: "PROVIDER_SIMULATION_FAILED",
          message: "KeeperHub simulation reverted; no broadcast.",
        },
      });
    }

    // Write a durable reservation BEFORE any broadcast. A broadcast may only
    // happen once a pending record exists, so a later run can always see that
    // an execution may have been submitted and must never rebroadcast.
    const reservation: ReceiptRecord = {
      version: 1,
      product: "mergepay",
      paymentKey,
      requestHash,
      status: "pending",
      repository: input.event.repository.fullName,
      pullRequestNumber: input.event.pullRequestNumber,
      mergeSha: input.event.mergeSha,
      createdAt: this.nowIso(),
      updatedAt: this.nowIso(),
    };
    try {
      await this.saveWithRetry(reservation);
    } catch {
      return this.evidence({
        policy,
        paymentKey,
        requestHash,
        simulation: "passed",
        broadcastMade: false,
        status: "failed",
        error: {
          code: "EXECUTION_MANUAL_REVIEW",
          message: "Could not reserve the payment before broadcast; no broadcast was made.",
        },
      });
    }

    let broadcast;
    try {
      broadcast = await this.provider.broadcastTransfer(parameters, paymentKey);
    } catch (error) {
      return this.handleBroadcastError(policy, paymentKey, requestHash, error);
    }

    const submitted: ReceiptRecord = {
      ...reservation,
      executionId: broadcast.executionId,
    };
    try {
      await this.saveWithRetry(submitted);
    } catch {
      // The reservation (pending, no execution id) remains durable, so a
      // later run resolves to manual review and never rebroadcasts.
      return this.evidence({
        policy,
        paymentKey,
        requestHash,
        simulation: "passed",
        broadcastMade: true,
        status: "manual-review",
        executionId: broadcast.executionId,
        error: {
          code: "EXECUTION_MANUAL_REVIEW",
          message:
            "Execution was submitted but its receipt could not be updated; manual review required. No automatic rebroadcast.",
        },
      });
    }

    try {
      const terminal = await this.provider.waitForTerminal(broadcast.executionId);
      const status: ExecutionStatus = terminal.status === "completed" ? "confirmed" : "failed";
      const updated: ReceiptRecord = {
        ...submitted,
        status,
        transactionHash: terminal.transactionHash,
        transactionLink: terminal.transactionLink,
        updatedAt: this.nowIso(),
      };
      await this.saveWithRetry(updated);
      return this.evidence({
        policy,
        paymentKey,
        requestHash,
        simulation: "passed",
        broadcastMade: true,
        status,
        executionId: broadcast.executionId,
        transactionHash: terminal.transactionHash,
        transactionLink: terminal.transactionLink,
      });
    } catch {
      return this.evidence({
        policy,
        paymentKey,
        requestHash,
        simulation: "passed",
        broadcastMade: true,
        status: "manual-review",
        executionId: broadcast.executionId,
        error: {
          code: "EXECUTION_MANUAL_REVIEW",
          message:
            "Execution was submitted but its terminal state is unknown; no automatic rebroadcast.",
        },
      });
    }
  }

  private handleBroadcastError(
    policy: PolicyDecision,
    paymentKey: string,
    requestHash: string,
    error: unknown,
  ): EvidenceRecord {
    const providerError = error as ProviderError | undefined;
    if (providerError?.kind === "idempotency_conflict") {
      return this.evidence({
        policy,
        paymentKey,
        requestHash,
        simulation: "passed",
        broadcastMade: false,
        status: "manual-review",
        error: {
          code: "EXECUTION_CONFLICT",
          message: "An execution with different content already exists for this payment key.",
        },
      });
    }
    if (
      providerError?.kind === "idempotency_in_progress" ||
      providerError?.code === "PROVIDER_TRANSPORT_FAILED"
    ) {
      return this.evidence({
        policy,
        paymentKey,
        requestHash,
        simulation: "passed",
        broadcastMade: false,
        status: "manual-review",
        error: {
          code: "EXECUTION_MANUAL_REVIEW",
          message: "Broadcast outcome is uncertain; no automatic rebroadcast.",
        },
      });
    }
    return this.evidence({
      policy,
      paymentKey,
      requestHash,
      simulation: "passed",
      broadcastMade: false,
      status: "failed",
      error: this.safeError(error),
    });
  }
}
