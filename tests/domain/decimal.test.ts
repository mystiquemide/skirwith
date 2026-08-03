import { describe, expect, it } from "vitest";
import { exceedsDecimalString, isZeroAmount } from "../../src/domain/decimal.js";

describe("exceedsDecimalString", () => {
  it("compares whole amounts without floating point", () => {
    expect(exceedsDecimalString("5", "4")).toBe(true);
    expect(exceedsDecimalString("4", "5")).toBe(false);
    expect(exceedsDecimalString("5", "5")).toBe(false);
    expect(exceedsDecimalString("10", "9")).toBe(true);
  });

  it("compares fractional amounts exactly", () => {
    expect(exceedsDecimalString("5.5", "5.4")).toBe(true);
    expect(exceedsDecimalString("5.4", "5.5")).toBe(false);
    expect(exceedsDecimalString("5.5", "5.50")).toBe(false);
  });

  it("compares large and high-precision decimals", () => {
    expect(exceedsDecimalString("1234567890123456789012.123", "1234567890123456789011")).toBe(true);
    expect(exceedsDecimalString("0.000000000000000001", "0")).toBe(true);
    expect(exceedsDecimalString("0", "0.000000000000000001")).toBe(false);
  });
});

describe("isZeroAmount", () => {
  it("treats zero representations as zero", () => {
    expect(isZeroAmount("0")).toBe(true);
    expect(isZeroAmount("0.0")).toBe(true);
    expect(isZeroAmount("0.000000")).toBe(true);
    expect(isZeroAmount("000")).toBe(true);
    expect(isZeroAmount("00.00")).toBe(true);
  });

  it("treats non-zero amounts as non-zero", () => {
    expect(isZeroAmount("0.1")).toBe(false);
    expect(isZeroAmount("5")).toBe(false);
    expect(isZeroAmount("5.0")).toBe(false);
    expect(isZeroAmount("0.000000000000000001")).toBe(false);
  });
});
