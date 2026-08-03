import { ProviderError } from "../keeperhub/errors.js";

export interface HttpRequest {
  method: "GET" | "POST" | "PATCH";
  url: string;
  headers?: Record<string, string>;
  body?: string;
  timeoutMs: number;
}

export interface HttpResponse {
  status: number;
  headers: Record<string, string>;
  body: string;
}

export interface HttpTransport {
  request(request: HttpRequest): Promise<HttpResponse>;
}

export interface FetchHttpTransportOptions {
  fetchFn?: typeof globalThis.fetch;
}

export class FetchHttpTransport implements HttpTransport {
  private readonly fetchFn: typeof globalThis.fetch;

  constructor(options: FetchHttpTransportOptions = {}) {
    if (options.fetchFn !== undefined) {
      this.fetchFn = options.fetchFn;
    } else if (typeof globalThis.fetch === "function") {
      this.fetchFn = globalThis.fetch;
    } else {
      throw new ProviderError({
        code: "PROVIDER_TRANSPORT_FAILED",
        message: "No fetch implementation is available in this runtime.",
      });
    }
  }

  async request(request: HttpRequest): Promise<HttpResponse> {
    let response: Response;
    try {
      response = await this.fetchFn(request.url, {
        method: request.method,
        headers: request.headers,
        body: request.body,
        signal: AbortSignal.timeout(request.timeoutMs),
      });
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new ProviderError({
          code: "PROVIDER_TRANSPORT_FAILED",
          message: "HTTP request timed out.",
          cause: error,
        });
      }
      throw new ProviderError({
        code: "PROVIDER_TRANSPORT_FAILED",
        message: "HTTP request could not be completed.",
        cause: error,
      });
    }

    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key.toLowerCase()] = value;
    });
    const body = await response.text();
    return { status: response.status, headers, body };
  }
}
