import { describe, expect, it } from "vitest";
import { redact } from "../../src/security/redaction.js";

const SECRETS = ["kh_test_secret_key", "ghp_synthetic_token"];

describe("redact", () => {
  it("redacts values that equal a secret", () => {
    expect(redact("kh_test_secret_key", SECRETS)).toBe("***");
  });

  it("redacts values that contain a secret", () => {
    expect(redact("Bearer kh_test_secret_key", SECRETS)).toBe("***");
  });

  it("redacts secret-named keys recursively", () => {
    const input = {
      apiKey: "kh_test_secret_key",
      authorization: "Bearer kh_test_secret_key",
      nested: { token: "abc", x_api_key: "def", fine: "value" },
    };
    const output = redact(input, SECRETS) as Record<string, unknown>;
    expect(output.apiKey).toBe("***");
    expect(output.authorization).toBe("***");
    const nested = output.nested as Record<string, unknown>;
    expect(nested.token).toBe("***");
    expect(nested.x_api_key).toBe("***");
    expect(nested.fine).toBe("value");
  });

  it("redacts array elements recursively", () => {
    const output = redact(["kh_test_secret_key", { password: "pw" }], SECRETS) as unknown[];
    expect(output[0]).toBe("***");
    expect((output[1] as Record<string, unknown>).password).toBe("***");
  });

  it("does not mutate the input object", () => {
    const input = { apiKey: "kh_test_secret_key", ok: 1 };
    redact(input, SECRETS);
    expect(input.apiKey).toBe("kh_test_secret_key");
    expect(input.ok).toBe(1);
  });

  it("leaves non-secret data intact", () => {
    const input = { amount: "2.5", recipient: "0xabc", list: [1, true, null] };
    expect(redact(input, SECRETS)).toEqual(input);
  });

  it("passes through primitives unchanged when they are not secrets", () => {
    expect(redact(42, SECRETS)).toBe(42);
    expect(redact(true, SECRETS)).toBe(true);
    expect(redact(null, SECRETS)).toBeNull();
    expect(redact(undefined, SECRETS)).toBeUndefined();
    expect(redact("plain string", SECRETS)).toBe("plain string");
  });

  it("ignores empty-string secrets instead of redacting everything", () => {
    expect(redact("", [""])).toBe("");
    expect(redact({ a: "" }, [""])).toEqual({ a: "" });
  });
});
