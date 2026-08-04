import { describe, expect, it } from "vitest";
import { loadConfig } from "../../src/config/load-config.js";
import type { SkirwithConfig } from "../../src/config/schema.js";

const validYaml = `
version: 1
repository: acme/skirwith-demo
chain:
  id: 11155111
  explorer: https://sepolia.etherscan.io
  token:
    address: "0x1c7d4b196cb0c7b01d743fbc6116a902379c7238"
    symbol: USDC
    decimals: 6
payout:
  requiredLabel: skirwith-approved
  maximum: "25"
  amounts:
    skirwith-5: "5"
    skirwith-10: "10"
recipients:
  alice: "0x05619d1a133623b322a8f366ea9594e4e586f26d"
checks:
  required: true
  names:
    - CI / test
`;

describe("loadConfig", () => {
  it("parses a valid configuration into a typed config", () => {
    const config = loadConfig(validYaml, { expectedRepository: "acme/skirwith-demo" });
    expect(config.version).toBe(1);
    expect(config.repository).toBe("acme/skirwith-demo");
    expect(config.chain.id).toBe(11155111);
    expect(config.chain.token.symbol).toBe("USDC");
    expect(config.chain.token.decimals).toBe(6);
    expect(config.payout.maximum).toBe("25");
    expect(config.payout.amounts["skirwith-5"]).toBe("5");
    expect(config.recipients["alice"]).toBe("0x05619d1a133623b322a8f366ea9594e4e586f26d");
    expect(config.checks.required).toBe(true);
    expect(config.checks.names).toEqual(["CI / test"]);
  });

  it("rejects malformed YAML with a safe error", () => {
    expect(() => loadConfig(":::not: valid:yaml", { expectedRepository: "acme/x" })).toThrow();
  });

  it("rejects an unsupported schema version", () => {
    const bad = validYaml.replace("version: 1", "version: 99");
    expect(() => loadConfig(bad, { expectedRepository: "acme/skirwith-demo" })).toThrow(/version/i);
  });

  it("rejects a configuration for the wrong repository", () => {
    expect(() => loadConfig(validYaml, { expectedRepository: "other/org" })).toThrow(/repository/i);
  });
});

describe("loadConfig type shape", () => {
  it("returns a value assignable to SkirwithConfig", () => {
    const config: SkirwithConfig = loadConfig(validYaml, {
      expectedRepository: "acme/skirwith-demo",
    });
    expect(config.chain.token.address).toMatch(/^0x/);
  });
});
