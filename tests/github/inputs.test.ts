import { describe, expect, it } from "vitest";
import { parseRuntimeSecrets } from "../../src/action-inputs.js";

describe("parseRuntimeSecrets", () => {
  it("reads all runtime secrets from the environment", () => {
    expect(
      parseRuntimeSecrets({
        GITHUB_TOKEN: "ghp_test",
        KEEPERHUB_API_KEY: "kh_test",
        MERGE_PAY_RECEIPT_SECRET: "receipt-secret-a",
        MERGE_PAY_RECEIPT_SECRET_PREVIOUS: "receipt-secret-b",
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
});
