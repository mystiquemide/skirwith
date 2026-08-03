import { describe, expect, it } from "vitest";
import { parseRuntimeSecrets } from "../../src/action-inputs.js";

describe("parseRuntimeSecrets", () => {
  it("reads the GitHub token and KeeperHub API key from the environment", () => {
    expect(parseRuntimeSecrets({ GITHUB_TOKEN: "ghp_test", KEEPERHUB_API_KEY: "kh_test" })).toEqual(
      { githubToken: "ghp_test", keeperhubApiKey: "kh_test" },
    );
  });

  it("returns empty strings for missing secrets", () => {
    expect(parseRuntimeSecrets({})).toEqual({ githubToken: "", keeperhubApiKey: "" });
  });
});
