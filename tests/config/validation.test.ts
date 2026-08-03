import { describe, expect, it } from "vitest";
import { loadConfig } from "../../src/config/load-config.js";

const base = `
version: 1
repository: acme/mergepay-demo
chain:
  id: 11155111
  explorer: https://sepolia.etherscan.io
  token:
    address: "0x1c7d4b196cb0c7b01d743fbc6116a902379c7238"
    symbol: USDC
    decimals: 6
payout:
  requiredLabel: mergepay-approved
  maximum: "25"
  amounts:
    mergepay-5: "5"
recipients:
  alice: "0x05619d1a133623b322a8f366ea9594e4e586f26d"
checks:
  required: true
  names:
    - CI / test
`;

function withChange(replacement: string): string {
  return base.replace(/^checks:\n\s{2}required: true[\s\S]*$/m, replacement);
}

describe("config semantic validation", () => {
  it("rejects an invalid token address", () => {
    const yaml = base.replace(
      'address: "0x1c7d4b196cb0c7b01d743fbc6116a902379c7238"',
      'address: "not-an-address"',
    );
    expect(() => loadConfig(yaml, { expectedRepository: "acme/mergepay-demo" })).toThrow(
      /address/i,
    );
  });

  it("rejects an invalid recipient address", () => {
    const yaml = base.replace(
      'alice: "0x05619d1a133623b322a8f366ea9594e4e586f26d"',
      'alice: "0x1234"',
    );
    expect(() => loadConfig(yaml, { expectedRepository: "acme/mergepay-demo" })).toThrow(
      /address/i,
    );
  });

  it("rejects invalid token decimals", () => {
    const yaml = base.replace("decimals: 6", "decimals: -1");
    expect(() => loadConfig(yaml, { expectedRepository: "acme/mergepay-demo" })).toThrow(
      /decimal/i,
    );
  });

  it("rejects a negative amount", () => {
    const yaml = base.replace('mergepay-5: "5"', 'mergepay-5: "-5"');
    expect(() => loadConfig(yaml, { expectedRepository: "acme/mergepay-demo" })).toThrow(/amount/i);
  });

  it("rejects an amount above the configured maximum", () => {
    const yaml = base.replace('mergepay-5: "5"', 'mergepay-5: "30"');
    expect(() => loadConfig(yaml, { expectedRepository: "acme/mergepay-demo" })).toThrow(
      /cap|max/i,
    );
  });

  it("rejects duplicate payout labels", () => {
    const yaml = base.replace(
      'amounts:\n    mergepay-5: "5"',
      'amounts:\n    mergepay-5: "5"\n    mergepay-5: "10"',
    );
    // YAML parsers reject duplicate mapping keys natively; either the parser's
    // uniqueness error or our semantic duplicate check is a safe failure.
    expect(() => loadConfig(yaml, { expectedRepository: "acme/mergepay-demo" })).toThrow(
      /duplicate|label|unique|parse/i,
    );
  });

  it("rejects an empty recipients mapping", () => {
    const yaml = base.replace(
      'recipients:\n  alice: "0x05619d1a133623b322a8f366ea9594e4e586f26d"',
      "recipients: {}",
    );
    expect(() => loadConfig(yaml, { expectedRepository: "acme/mergepay-demo" })).toThrow(
      /recipient/i,
    );
  });

  it("rejects unknown top-level fields", () => {
    const yaml = base + "\ndailyLimit: 5\n";
    expect(() => loadConfig(yaml, { expectedRepository: "acme/mergepay-demo" })).toThrow(
      /unknown|dailyLimit/i,
    );
  });

  it("rejects empty amounts mapping", () => {
    const yaml = base.replace('amounts:\n    mergepay-5: "5"', "amounts: {}");
    expect(() => loadConfig(yaml, { expectedRepository: "acme/mergepay-demo" })).toThrow(/amount/i);
  });

  it("treats disabled checks with no names as valid", () => {
    const yaml = withChange("checks:\n  required: false\n  names: []\n");
    expect(() => loadConfig(yaml, { expectedRepository: "acme/mergepay-demo" })).not.toThrow();
  });
});
