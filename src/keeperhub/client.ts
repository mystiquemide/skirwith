import { redact } from "../security/redaction.js";
import { ProviderError } from "./errors.js";
import type { KeeperHubProvider } from "./provider.js";
import type { HttpTransport } from "./transport.js";
import type {
  ExecutionStatusResponse,
  KeeperHubChain,
  KeeperHubExecutionStatus,
  TransferBroadcast,
  TransferParameters,
  TransferSimulation,
} from "./types.js";

const DEFAULT_BASE_URL = "https://app.keeperhub.com";
const DEFAULT_TIMEOUT_MS = 15_000;
const DEFAULT_POLL_MIN_MS = 1_000;
const DEFAULT_POLL_MAX_MS = 15_000;
const DEFAULT_POLL_DEADLINE_MS = 300_000;

export interface KeeperHubClientOptions {
  apiKey: string;
  transport: HttpTransport;
  baseUrl?: string;
  timeoutMs?: number;
  pollMinIntervalMs?: number;
  pollMaxIntervalMs?: number;
  pollDeadlineMs?: number;
  nowMs?: () => number;
  sleepMs?: (ms: number) => Promise<void>;
}

const TERMINAL_STATUSES: ReadonlySet<KeeperHubExecutionStatus> = new Set(["completed", "failed"]);

function isExecutionStatus(value: unknown): value is KeeperHubExecutionStatus {
  return value === "pending" || value === "running" || value === "completed" || value === "failed";
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function parseObject(body: string): Record<string, unknown> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(body);
  } catch (error) {
    throw new ProviderError({
      code: "PROVIDER_RESPONSE_INVALID",
      message: "KeeperHub returned a malformed JSON response.",
      cause: error,
    });
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new ProviderError({
      code: "PROVIDER_RESPONSE_INVALID",
      message: "KeeperHub returned an unexpected JSON shape.",
    });
  }
  return parsed as Record<string, unknown>;
}

function parseRetryAfterMs(headers: Record<string, string>): number | undefined {
  const raw = headers["retry-after"];
  if (raw === undefined) {
    return undefined;
  }
  const seconds = Number.parseInt(raw, 10);
  if (!Number.isFinite(seconds) || seconds < 0) {
    return undefined;
  }
  return seconds * 1000;
}

function parseSimulation(body: string): TransferSimulation {
  const parsed = parseObject(body);
  if (typeof parsed.wouldRevert !== "boolean") {
    throw new ProviderError({
      code: "PROVIDER_RESPONSE_INVALID",
      message: "KeeperHub simulation response is missing 'wouldRevert'.",
    });
  }
  const simulation: TransferSimulation = { wouldRevert: parsed.wouldRevert };
  if (typeof parsed.simulatedReturnValue === "boolean") {
    simulation.simulatedReturnValue = parsed.simulatedReturnValue;
  }
  if (typeof parsed.gasEstimate === "number") {
    simulation.gasEstimate = parsed.gasEstimate;
  }
  if (typeof parsed.value === "number") {
    simulation.value = parsed.value;
  }
  if (typeof parsed.revertReason === "string") {
    simulation.revertReason = parsed.revertReason;
  }
  return simulation;
}

function parseBroadcast(body: string): TransferBroadcast {
  const parsed = parseObject(body);
  const executionId = parsed.executionId;
  if (typeof executionId !== "string" || executionId.length === 0) {
    throw new ProviderError({
      code: "PROVIDER_RESPONSE_INVALID",
      message: "KeeperHub broadcast response is missing 'executionId'.",
    });
  }
  if (!isExecutionStatus(parsed.status)) {
    throw new ProviderError({
      code: "PROVIDER_RESPONSE_INVALID",
      message: "KeeperHub broadcast response has an unknown status.",
    });
  }
  const broadcast: TransferBroadcast = { executionId, status: parsed.status };
  if (typeof parsed.transactionHash === "string") {
    broadcast.transactionHash = parsed.transactionHash;
  }
  if (typeof parsed.transactionLink === "string") {
    broadcast.transactionLink = parsed.transactionLink;
  }
  return broadcast;
}

function parseExecutionStatus(
  executionId: string,
  body: string,
  headers: Record<string, string>,
): ExecutionStatusResponse {
  const parsed = parseObject(body);
  if (!isExecutionStatus(parsed.status)) {
    throw new ProviderError({
      code: "PROVIDER_RESPONSE_INVALID",
      message: "KeeperHub execution status is unknown.",
    });
  }
  const result: ExecutionStatusResponse = {
    executionId: typeof parsed.executionId === "string" ? parsed.executionId : executionId,
    status: parsed.status,
    pollIntervalHint: 0,
  };
  if (typeof parsed.transactionHash === "string") {
    result.transactionHash = parsed.transactionHash;
  }
  if (typeof parsed.transactionLink === "string") {
    result.transactionLink = parsed.transactionLink;
  }
  const hint = headers["x-poll-interval-hint"];
  if (hint !== undefined) {
    const parsedHint = Number.parseInt(hint, 10);
    if (Number.isFinite(parsedHint) && parsedHint >= 0) {
      result.pollIntervalHint = parsedHint;
    }
  }
  return result;
}

function parseChains(body: string): KeeperHubChain[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(body);
  } catch (error) {
    throw new ProviderError({
      code: "PROVIDER_RESPONSE_INVALID",
      message: "KeeperHub returned a malformed chains response.",
      cause: error,
    });
  }
  if (!Array.isArray(parsed)) {
    throw new ProviderError({
      code: "PROVIDER_RESPONSE_INVALID",
      message: "KeeperHub chains response is not a list.",
    });
  }
  return parsed.map((entry) => {
    if (typeof entry !== "object" || entry === null) {
      throw new ProviderError({
        code: "PROVIDER_RESPONSE_INVALID",
        message: "KeeperHub chains response contains a malformed entry.",
      });
    }
    const chain = entry as Record<string, unknown>;
    if (
      typeof chain.id !== "string" ||
      typeof chain.chainId !== "number" ||
      typeof chain.isTestnet !== "boolean" ||
      typeof chain.isEnabled !== "boolean" ||
      typeof chain.explorerUrl !== "string" ||
      typeof chain.explorerAddressPath !== "string"
    ) {
      throw new ProviderError({
        code: "PROVIDER_RESPONSE_INVALID",
        message: "KeeperHub chains response contains an invalid entry.",
      });
    }
    return {
      id: chain.id,
      chainId: chain.chainId,
      isTestnet: chain.isTestnet,
      isEnabled: chain.isEnabled,
      explorerUrl: chain.explorerUrl,
      explorerAddressPath: chain.explorerAddressPath,
    };
  });
}

export class KeeperHubClient implements KeeperHubProvider {
  private readonly apiKey: string;
  private readonly transport: HttpTransport;
  private readonly baseUrl: string;
  private readonly timeoutMs: number;
  private readonly pollMinIntervalMs: number;
  private readonly pollMaxIntervalMs: number;
  private readonly pollDeadlineMs: number;
  private readonly nowMs: () => number;
  private readonly sleepMs: (ms: number) => Promise<void>;

  constructor(options: KeeperHubClientOptions) {
    this.apiKey = options.apiKey;
    this.transport = options.transport;
    this.baseUrl = (options.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, "");
    this.timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    this.pollMinIntervalMs = options.pollMinIntervalMs ?? DEFAULT_POLL_MIN_MS;
    this.pollMaxIntervalMs = options.pollMaxIntervalMs ?? DEFAULT_POLL_MAX_MS;
    this.pollDeadlineMs = options.pollDeadlineMs ?? DEFAULT_POLL_DEADLINE_MS;
    this.nowMs = options.nowMs ?? (() => Date.now());
    this.sleepMs =
      options.sleepMs ?? ((ms: number) => new Promise((resolve) => setTimeout(resolve, ms)));
  }

  private url(path: string): string {
    return `${this.baseUrl}${path}`;
  }

  private authHeaders(extra: Record<string, string> = {}): Record<string, string> {
    return {
      authorization: `Bearer ${this.apiKey}`,
      "content-type": "application/json",
      accept: "application/json",
      ...extra,
    };
  }

  private buildTransferBody(
    parameters: TransferParameters,
    simulate: boolean,
  ): Record<string, unknown> {
    const body: Record<string, unknown> = {
      chainId: parameters.chainId,
      recipientAddress: parameters.recipientAddress,
      amount: parameters.amount,
    };
    if (parameters.tokenAddress !== undefined) {
      body.tokenAddress = parameters.tokenAddress;
    }
    if (parameters.tokenConfig !== undefined) {
      body.tokenConfig = parameters.tokenConfig;
    }
    if (parameters.gasLimitMultiplier !== undefined) {
      body.gasLimitMultiplier = parameters.gasLimitMultiplier;
    }
    if (simulate) {
      body.simulate = true;
    }
    return body;
  }

  private mapStatusError(
    status: number,
    fallbackCode:
      "PROVIDER_SIMULATION_FAILED" | "PROVIDER_BROADCAST_FAILED" | "PROVIDER_LOOKUP_FAILED",
    message: string,
    headers: Record<string, string>,
    body: string,
  ): ProviderError {
    const cause = redact(safeParse(body), [this.apiKey]);
    switch (status) {
      case 401:
        return new ProviderError({
          code: "PROVIDER_AUTH_FAILED",
          message: "KeeperHub authentication failed.",
          cause,
          statusCode: status,
        });
      case 403:
        return new ProviderError({
          code: "PROVIDER_FORBIDDEN",
          message: "KeeperHub rejected the request.",
          cause,
          statusCode: status,
        });
      case 429:
        return new ProviderError({
          code: "PROVIDER_RATE_LIMITED",
          message: "KeeperHub rate limit reached.",
          cause,
          statusCode: status,
          retryAfterMs: parseRetryAfterMs(headers),
        });
      default:
        return new ProviderError({
          code: fallbackCode,
          message,
          cause,
          statusCode: status,
        });
    }
  }

  async simulateTransfer(parameters: TransferParameters): Promise<TransferSimulation> {
    const response = await this.transport.request({
      method: "POST",
      url: this.url("/api/execute/transfer"),
      headers: this.authHeaders(),
      body: JSON.stringify(this.buildTransferBody(parameters, true)),
      timeoutMs: this.timeoutMs,
    });
    if (response.status < 200 || response.status >= 300) {
      throw this.mapStatusError(
        response.status,
        "PROVIDER_SIMULATION_FAILED",
        "KeeperHub simulation failed.",
        response.headers,
        response.body,
      );
    }
    return parseSimulation(response.body);
  }

  async broadcastTransfer(
    parameters: TransferParameters,
    paymentKey: string,
  ): Promise<TransferBroadcast> {
    const response = await this.transport.request({
      method: "POST",
      url: this.url("/api/execute/transfer"),
      headers: this.authHeaders({ "idempotency-key": paymentKey }),
      body: JSON.stringify(this.buildTransferBody(parameters, false)),
      timeoutMs: this.timeoutMs,
    });
    if (response.status < 200 || response.status >= 300) {
      if (response.status === 409) {
        const parsed = safeParse(response.body);
        const raw = typeof parsed === "string" ? parsed : JSON.stringify(parsed ?? {});
        const kind = raw.includes("idempotency_conflict")
          ? "idempotency_conflict"
          : raw.includes("idempotency_in_progress")
            ? "idempotency_in_progress"
            : undefined;
        throw new ProviderError({
          code: "PROVIDER_BROADCAST_FAILED",
          message: "KeeperHub broadcast idempotency conflict.",
          cause: redact(parsed, [this.apiKey]),
          statusCode: 409,
          kind,
        });
      }
      throw this.mapStatusError(
        response.status,
        "PROVIDER_BROADCAST_FAILED",
        "KeeperHub broadcast failed.",
        response.headers,
        response.body,
      );
    }
    return parseBroadcast(response.body);
  }

  async getExecution(executionId: string): Promise<ExecutionStatusResponse> {
    const response = await this.transport.request({
      method: "GET",
      url: this.url(`/api/execute/${encodeURIComponent(executionId)}/status`),
      headers: this.authHeaders(),
      timeoutMs: this.timeoutMs,
    });
    if (response.status < 200 || response.status >= 300) {
      throw this.mapStatusError(
        response.status,
        "PROVIDER_LOOKUP_FAILED",
        "KeeperHub execution lookup failed.",
        response.headers,
        response.body,
      );
    }
    return parseExecutionStatus(executionId, response.body, response.headers);
  }

  async waitForTerminal(executionId: string): Promise<ExecutionStatusResponse> {
    const deadline = this.nowMs() + this.pollDeadlineMs;
    for (;;) {
      if (this.nowMs() >= deadline) {
        throw new ProviderError({
          code: "PROVIDER_POLL_TIMEOUT",
          message: "KeeperHub execution did not reach a terminal state within the deadline.",
        });
      }
      const status = await this.getExecution(executionId);
      if (TERMINAL_STATUSES.has(status.status) || status.pollIntervalHint <= 0) {
        return status;
      }
      const hintMs = status.pollIntervalHint * 1000;
      const delayMs = clamp(hintMs, this.pollMinIntervalMs, this.pollMaxIntervalMs);
      await this.sleepMs(delayMs);
    }
  }

  async discoverChains(): Promise<KeeperHubChain[]> {
    const response = await this.transport.request({
      method: "GET",
      url: this.url("/api/chains"),
      headers: this.authHeaders(),
      timeoutMs: this.timeoutMs,
    });
    if (response.status < 200 || response.status >= 300) {
      throw this.mapStatusError(
        response.status,
        "PROVIDER_LOOKUP_FAILED",
        "KeeperHub chain discovery failed.",
        response.headers,
        response.body,
      );
    }
    return parseChains(response.body);
  }
}

function safeParse(body: string): unknown {
  try {
    return JSON.parse(body);
  } catch {
    return undefined;
  }
}
