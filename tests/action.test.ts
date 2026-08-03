import { describe, expect, it } from "vitest";
import { run } from "../src/action.js";

describe("action entrypoint", () => {
  it("exposes a run function that resolves", async () => {
    await expect(run()).resolves.toBeUndefined();
  });
});
