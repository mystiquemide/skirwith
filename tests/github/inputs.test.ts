import { describe, expect, it } from "vitest";
import { parseRuntimeSecrets } from "../../src/action-inputs.js";

describe("parseRuntimeSecrets", () => {
  it("reads all runtime secrets from the environment", () => {
    expect(
      parseRuntimeSecrets({
        GITHUB_TOKEN: "ghp_test",
        KEEPERHUB_API_KEY: "kh_test",
        SKIRWITH_RECEIPT_SECRET: "receipt-secret-a",
        SKIRWITH_RECEIPT_SECRET_PREVIOUS: "receipt-secret-b",
      }),
    ).toEqual({
      githubToken: "ghp_test",
      keeperhubApiKey: "kh_test",
      receiptSecret: "receipt-secret-a",
      previousReceiptSecret: "receipt-secret-b",
    });
  });

  it("returns empty strings for missing secrets", () => {
    expect(parseRuntimeSecrets({})).toEqual({
      githubToken: "",
      keeperhubApiKey: "",
      receiptSecret: "",
      previousReceiptSecret: "",
    });
  });

  it("prefers the canonical name over the legacy receipt secret name", () => {
    expect(
      parseRuntimeSecrets({
        SKIRWITH_RECEIPT_SECRET: "canonical",
        MERGE_PAY_RECEIPT_SECRET: "legacy",
      }).receiptSecret,
    ).toBe("canonical");
  });

  it("falls back to the legacy receipt secret names during the migration window", () => {
    expect(
      parseRuntimeSecrets({
        MERGE_PAY_RECEIPT_SECRET: "legacy",
        MERGE_PAY_RECEIPT_SECRET_PREVIOUS: "legacy-prev",
      }),
    ).toEqual({
      githubToken: "",
      keeperhubApiKey: "",
      receiptSecret: "legacy",
      previousReceiptSecret: "legacy-prev",
    });
  });
});
