import { describe, expect, it } from "vitest";
import {
  assertSameTransferParameters,
  serializeTransferParameters,
} from "../../src/keeperhub/parity.js";
import type { TransferParameters } from "../../src/keeperhub/types.js";

const PARAMS: TransferParameters = {
  chainId: 11155111,
  recipientAddress: "0x05619d1a133623b322a8f366ea9594e4e586f26d",
  amount: "2.5",
  tokenAddress: "0x1c7d4b196cb0c7b01d743fbc6116a902379c7238",
};

describe("serializeTransferParameters", () => {
  it("serializes identical parameters identically", () => {
    expect(serializeTransferParameters(PARAMS)).toBe(serializeTransferParameters(PARAMS));
  });

  it("differs when any payment field changes", () => {
    const changes: Array<Partial<TransferParameters>> = [
      { amount: "2.6" },
      { recipientAddress: "0x05619d1a133623b322a8f366ea9594e4e586f26e" },
      { chainId: 84532 },
      { tokenAddress: "0x036cbd53842c5426634e7929541ec2318f3dcf7e" },
      { gasLimitMultiplier: 1.2 },
    ];
    const original = serializeTransferParameters(PARAMS);
    for (const change of changes) {
      expect(serializeTransferParameters({ ...PARAMS, ...change })).not.toBe(original);
    }
  });
});

describe("assertSameTransferParameters", () => {
  it("accepts identical parameters", () => {
    expect(() => assertSameTransferParameters(PARAMS, PARAMS)).not.toThrow();
  });

  it("rejects a mutated amount with a stable error", () => {
    expect(() => assertSameTransferParameters(PARAMS, { ...PARAMS, amount: "25" })).toThrow();
    try {
      assertSameTransferParameters(PARAMS, { ...PARAMS, amount: "25" });
    } catch (error) {
      expect((error as { code?: string }).code).toBe("EXECUTION_PARITY_MISMATCH");
    }
  });

  it("rejects a mutated recipient with a stable error", () => {
    try {
      assertSameTransferParameters(PARAMS, {
        ...PARAMS,
        recipientAddress: "0x05619d1a133623b322a8f366ea9594e4e586f26e",
      });
      throw new Error("expected assertSameTransferParameters to throw");
    } catch (error) {
      expect((error as { code?: string }).code).toBe("EXECUTION_PARITY_MISMATCH");
    }
  });
});
