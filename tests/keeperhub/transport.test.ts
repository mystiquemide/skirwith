import { describe, expect, it } from "vitest";
import { FetchHttpTransport } from "../../src/keeperhub/transport.js";
import type { HttpRequest, HttpResponse } from "../../src/keeperhub/transport.js";
import { SkirwithError } from "../../src/domain/errors.js";

type FetchInput = string | URL | Request;

function fakeFetch(body: string, status: number, headers: Record<string, string> = {}) {
  return async (): Promise<Response> => {
    return new Response(body, { status, headers });
  };
}

function captureInit() {
  let captured: RequestInit | undefined;
  const fetchFn = async (_input: FetchInput, init?: RequestInit): Promise<Response> => {
    captured = init;
    return new Response("{}", { status: 200 });
  };
  return { fetchFn, getInit: () => captured };
}

describe("FetchHttpTransport", () => {
  it("sends method, url, headers, and body to the injected fetch", async () => {
    let sentUrl = "";
    let sentInit: RequestInit | undefined;
    const fetchFn = async (input: FetchInput, init?: RequestInit): Promise<Response> => {
      sentUrl = String(input);
      sentInit = init;
      return new Response("{}", { status: 200 });
    };
    const transport = new FetchHttpTransport({ fetchFn });
    await transport.request({
      method: "POST",
      url: "https://app.keeperhub.com/api/execute/transfer",
      headers: { authorization: "Bearer kh_test_key", "content-type": "application/json" },
      body: JSON.stringify({ simulate: true }),
      timeoutMs: 5000,
    });
    expect(sentUrl).toBe("https://app.keeperhub.com/api/execute/transfer");
    expect(sentInit?.method).toBe("POST");
    expect((sentInit?.headers as Record<string, string>).authorization).toBe("Bearer kh_test_key");
    expect(sentInit?.body).toBe(JSON.stringify({ simulate: true }));
    expect(typeof sentInit?.signal?.aborted).toBe("boolean");
  });

  it("returns status, normalized headers, and body text without throwing on HTTP status", async () => {
    const transport = new FetchHttpTransport({
      fetchFn: fakeFetch('{"status":"running"}', 202, {
        "X-Poll-Interval-Hint": "2",
        "Content-Type": "application/json",
      }),
    });
    const response = await transport.request({
      method: "GET",
      url: "https://app.keeperhub.com/api/execute/abc/status",
      headers: {},
      timeoutMs: 5000,
    });
    expect(response.status).toBe(202);
    expect(response.headers["x-poll-interval-hint"]).toBe("2");
    expect(response.headers["content-type"]).toBe("application/json");
    expect(response.body).toBe('{"status":"running"}');
  });

  it("maps a network failure to a safe provider error", async () => {
    const transport = new FetchHttpTransport({
      fetchFn: async () => {
        throw new TypeError("fetch failed");
      },
    });
    await expect(
      transport.request({
        method: "GET",
        url: "https://x.test/status",
        headers: {},
        timeoutMs: 5000,
      }),
    ).rejects.toMatchObject({ code: "PROVIDER_TRANSPORT_FAILED", category: "provider" });
  });

  it("maps an abort (timeout) to a safe provider error", async () => {
    const fetchFn = async (_input: FetchInput, init?: RequestInit): Promise<Response> => {
      return new Promise((_resolve, reject) => {
        init?.signal?.addEventListener("abort", () => {
          reject(new DOMException("The operation was aborted.", "AbortError"));
        });
      });
    };
    const transport = new FetchHttpTransport({ fetchFn });
    await expect(
      transport.request({
        method: "GET",
        url: "https://x.test/status",
        headers: {},
        timeoutMs: 20,
      }),
    ).rejects.toBeInstanceOf(SkirwithError);
    await expect(
      transport.request({
        method: "GET",
        url: "https://x.test/status",
        headers: {},
        timeoutMs: 20,
      }),
    ).rejects.toMatchObject({ code: "PROVIDER_TRANSPORT_FAILED" });
  });

  it("uses the request-level timeout signal", () => {
    const { fetchFn, getInit } = captureInit();
    const transport = new FetchHttpTransport({ fetchFn });
    void transport.request({
      method: "GET",
      url: "https://x.test/status",
      headers: {},
      timeoutMs: 1234,
    });
    expect(getInit()?.signal).toBeDefined();
  });
});

describe("HttpRequest/HttpResponse types", () => {
  it("exposes the transport shapes for injection", () => {
    const request: HttpRequest = {
      method: "POST",
      url: "https://x.test",
      headers: { authorization: "Bearer k" },
      body: "{}",
      timeoutMs: 1000,
    };
    const response: HttpResponse = { status: 200, headers: {}, body: "{}" };
    expect(request.method).toBe("POST");
    expect(response.status).toBe(200);
  });
});
