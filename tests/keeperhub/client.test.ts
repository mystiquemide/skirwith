import { describe, expect, it } from "vitest";
import { KeeperHubClient } from "../../src/keeperhub/client.js";
import type { HttpRequest, HttpResponse, HttpTransport } from "../../src/keeperhub/transport.js";
import type { TransferParameters } from "../../src/keeperhub/types.js";

const PARAMS: TransferParameters = {
  chainId: 11155111,
  recipientAddress: "0x05619d1a133623b322a8f366ea9594e4e586f26d",
  amount: "2.5",
  tokenAddress: "0x1c7d4b196cb0c7b01d743fbc6116a902379c7238",
};

function jsonResponse(
  status: number,
  body: unknown,
  headers: Record<string, string> = {},
): HttpResponse {
  return { status, headers, body: JSON.stringify(body) };
}

class FakeTransport implements HttpTransport {
  calls: HttpRequest[] = [];
  responses: HttpResponse[] = [];
  responder?: (request: HttpRequest) => HttpResponse;
  requestErrors: unknown[] = [];

  enqueue(response: HttpResponse): void {
    this.responses.push(response);
  }

  failWith(error: unknown): void {
    this.requestErrors.push(error);
  }

  async request(request: HttpRequest): Promise<HttpResponse> {
    this.calls.push(request);
    if (this.requestErrors.length > 0) {
      const error = this.requestErrors.shift();
      throw error;
    }
    if (this.responder) {
      return this.responder(request);
    }
    const next = this.responses.shift();
    if (next === undefined) {
      throw new Error("no queued fake response");
    }
    return next;
  }
}

function makeClient(
  transport: HttpTransport,
  overrides: Partial<ConstructorParameters<typeof KeeperHubClient>[0]> = {},
) {
  return new KeeperHubClient({
    apiKey: "kh_test_synthetic_key",
    transport,
    baseUrl: "https://app.keeperhub.com",
    timeoutMs: 5000,
    pollMinIntervalMs: 1,
    pollMaxIntervalMs: 1000,
    pollDeadlineMs: 5000,
    ...overrides,
  });
}

const BASE_URL = "https://app.keeperhub.com";

describe("KeeperHubClient.simulateTransfer", () => {
  it("posts the parameters with simulate: true and parses the simulation", async () => {
    const transport = new FakeTransport();
    transport.enqueue(
      jsonResponse(200, {
        wouldRevert: false,
        simulatedReturnValue: true,
        gasEstimate: 40705,
        value: 0,
      }),
    );
    const client = makeClient(transport);

    const simulation = await client.simulateTransfer(PARAMS);

    expect(simulation).toEqual({
      wouldRevert: false,
      simulatedReturnValue: true,
      gasEstimate: 40705,
      value: 0,
    });
    const call = transport.calls[0];
    expect(call?.method).toBe("POST");
    expect(call?.url).toBe(`${BASE_URL}/api/execute/transfer`);
    expect(call?.headers?.authorization).toBe("Bearer kh_test_synthetic_key");
    const body = JSON.parse(call?.body ?? "{}") as Record<string, unknown>;
    expect(body.simulate).toBe(true);
    expect(body.chainId).toBe(11155111);
    expect(body.recipientAddress).toBe(PARAMS.recipientAddress);
    expect(body.amount).toBe("2.5");
    expect(body.tokenAddress).toBe(PARAMS.tokenAddress);
  });

  it("returns a wouldRevert simulation without throwing", async () => {
    const transport = new FakeTransport();
    transport.enqueue(jsonResponse(200, { wouldRevert: true, simulatedReturnValue: false }));
    const client = makeClient(transport);
    const simulation = await client.simulateTransfer(PARAMS);
    expect(simulation.wouldRevert).toBe(true);
  });

  it("maps an authentication failure to a safe provider error", async () => {
    const transport = new FakeTransport();
    transport.enqueue(jsonResponse(401, { error: "unauthorized" }));
    const client = makeClient(transport);
    await expect(client.simulateTransfer(PARAMS)).rejects.toMatchObject({
      code: "PROVIDER_AUTH_FAILED",
      category: "provider",
    });
  });

  it("maps a non-2xx simulation response to a simulation failure", async () => {
    const transport = new FakeTransport();
    transport.enqueue(jsonResponse(500, { error: "boom" }));
    const client = makeClient(transport);
    await expect(client.simulateTransfer(PARAMS)).rejects.toMatchObject({
      code: "PROVIDER_SIMULATION_FAILED",
    });
  });
});

describe("KeeperHubClient.broadcastTransfer", () => {
  it("broadcasts the parameters without the simulate flag and with the payment key", async () => {
    const transport = new FakeTransport();
    transport.enqueue(
      jsonResponse(202, {
        executionId: "ex_1",
        status: "running",
        transactionHash: "0xabc",
        transactionLink: "https://explorer/tx/0xabc",
      }),
    );
    const client = makeClient(transport);

    const broadcast = await client.broadcastTransfer(PARAMS, "skirwith:abc");

    expect(broadcast.executionId).toBe("ex_1");
    expect(broadcast.status).toBe("running");
    const call = transport.calls[0];
    expect(call?.headers?.authorization).toBe("Bearer kh_test_synthetic_key");
    expect(call?.headers?.["idempotency-key"]).toBe("skirwith:abc");
    const body = JSON.parse(call?.body ?? "{}") as Record<string, unknown>;
    expect(body).not.toHaveProperty("simulate");
    expect(body.amount).toBe("2.5");
  });

  it("maps an idempotency conflict to a typed provider error", async () => {
    const transport = new FakeTransport();
    transport.enqueue(jsonResponse(409, { error: "idempotency_conflict" }));
    const client = makeClient(transport);
    const error = await client.broadcastTransfer(PARAMS, "skirwith:abc").catch((e: unknown) => e);
    expect(error).toMatchObject({
      code: "PROVIDER_BROADCAST_FAILED",
      category: "provider",
      kind: "idempotency_conflict",
    });
  });

  it("maps an in-progress idempotency response to a typed provider error", async () => {
    const transport = new FakeTransport();
    transport.enqueue(jsonResponse(409, { error: "idempotency_in_progress" }));
    const client = makeClient(transport);
    const error = await client.broadcastTransfer(PARAMS, "skirwith:abc").catch((e: unknown) => e);
    expect((error as { code?: string }).code).toBe("PROVIDER_BROADCAST_FAILED");
    expect((error as { kind?: string }).kind).toBe("idempotency_in_progress");
  });

  it("maps a rate limit response with retry-after", async () => {
    const transport = new FakeTransport();
    transport.enqueue(jsonResponse(429, { error: "rate_limited" }, { "retry-after": "30" }));
    const client = makeClient(transport);
    const error = await client.broadcastTransfer(PARAMS, "skirwith:abc").catch((e: unknown) => e);
    expect((error as { code?: string }).code).toBe("PROVIDER_RATE_LIMITED");
    expect((error as { retryAfterMs?: number }).retryAfterMs).toBe(30_000);
  });

  it("maps a daily spending cap rejection to a forbidden error", async () => {
    const transport = new FakeTransport();
    transport.enqueue(jsonResponse(403, { error: "Daily spending cap exceeded" }));
    const client = makeClient(transport);
    await expect(client.broadcastTransfer(PARAMS, "skirwith:abc")).rejects.toMatchObject({
      code: "PROVIDER_FORBIDDEN",
    });
  });
});

describe("KeeperHubClient.getExecution", () => {
  it("parses the execution status and the poll interval hint header", async () => {
    const transport = new FakeTransport();
    transport.enqueue(
      jsonResponse(
        200,
        { executionId: "ex_1", status: "running" },
        { "x-poll-interval-hint": "2" },
      ),
    );
    const client = makeClient(transport);

    const status = await client.getExecution("ex_1");

    expect(status.executionId).toBe("ex_1");
    expect(status.status).toBe("running");
    expect(status.pollIntervalHint).toBe(2);
    expect(transport.calls[0]?.url).toBe(`${BASE_URL}/api/execute/ex_1/status`);
  });

  it("rejects an unknown execution status as an invalid response", async () => {
    const transport = new FakeTransport();
    transport.enqueue(jsonResponse(200, { executionId: "ex_1", status: "mysterious" }));
    const client = makeClient(transport);
    await expect(client.getExecution("ex_1")).rejects.toMatchObject({
      code: "PROVIDER_RESPONSE_INVALID",
    });
  });

  it("rejects malformed JSON as an invalid response", async () => {
    const transport = new FakeTransport();
    transport.enqueue({ status: 200, headers: {}, body: "not-json" });
    const client = makeClient(transport);
    await expect(client.getExecution("ex_1")).rejects.toMatchObject({
      code: "PROVIDER_RESPONSE_INVALID",
    });
  });
});

describe("KeeperHubClient.waitForTerminal", () => {
  it("polls until a terminal status and returns the final state", async () => {
    const transport = new FakeTransport();
    transport.enqueue(
      jsonResponse(
        200,
        { executionId: "ex_1", status: "running" },
        { "x-poll-interval-hint": "5" },
      ),
    );
    transport.enqueue(
      jsonResponse(
        200,
        { executionId: "ex_1", status: "running" },
        { "x-poll-interval-hint": "5" },
      ),
    );
    transport.enqueue(
      jsonResponse(
        200,
        { executionId: "ex_1", status: "completed", transactionHash: "0xdef" },
        { "x-poll-interval-hint": "0" },
      ),
    );

    let now = 0;
    const client = makeClient(transport, {
      nowMs: () => now,
      sleepMs: async (ms: number) => {
        now += ms;
      },
    });

    const result = await client.waitForTerminal("ex_1");

    expect(result.status).toBe("completed");
    expect(result.transactionHash).toBe("0xdef");
    expect(result.pollIntervalHint).toBe(0);
    expect(transport.calls.length).toBe(3);
  });

  it("stops polling once the provider signals terminal via a zero hint", async () => {
    const transport = new FakeTransport();
    transport.enqueue(
      jsonResponse(
        200,
        { executionId: "ex_1", status: "running" },
        { "x-poll-interval-hint": "0" },
      ),
    );

    let now = 0;
    const client = makeClient(transport, {
      nowMs: () => now,
      sleepMs: async (ms: number) => {
        now += ms;
      },
    });

    const result = await client.waitForTerminal("ex_1");
    expect(result.pollIntervalHint).toBe(0);
    expect(transport.calls.length).toBe(1);
  });

  it("throws a poll timeout once the deadline is reached", async () => {
    const transport = new FakeTransport();
    transport.responder = () =>
      jsonResponse(
        200,
        { executionId: "ex_1", status: "running" },
        { "x-poll-interval-hint": "10" },
      );

    let now = 0;
    const client = makeClient(transport, {
      nowMs: () => now,
      sleepMs: async (ms: number) => {
        now += ms;
      },
      pollDeadlineMs: 100,
    });

    await expect(client.waitForTerminal("ex_1")).rejects.toMatchObject({
      code: "PROVIDER_POLL_TIMEOUT",
      category: "provider",
    });
  });
});

describe("KeeperHubClient.discoverChains", () => {
  it("parses the public chain list", async () => {
    const transport = new FakeTransport();
    transport.enqueue(
      jsonResponse(200, [
        {
          id: "sepolia",
          chainId: 11155111,
          isTestnet: true,
          isEnabled: true,
          explorerUrl: "https://sepolia.etherscan.io",
          explorerAddressPath: "/address/",
        },
      ]),
    );
    const client = makeClient(transport);

    const chains = await client.discoverChains();

    expect(chains).toHaveLength(1);
    expect(chains[0]).toMatchObject({
      id: "sepolia",
      chainId: 11155111,
      isTestnet: true,
      isEnabled: true,
    });
    expect(transport.calls[0]?.url).toBe(`${BASE_URL}/api/chains`);
  });
});
