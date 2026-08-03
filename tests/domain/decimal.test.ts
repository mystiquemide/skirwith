import { describe, expect, it } from "vitest";
import { atomicToHumanUnits, isZeroAmount, toAtomicUnits } from "../../src/domain/decimal.js";

describe("toAtomicUnits", () => {
  it("converts whole amounts using the token decimals", () => {
    expect(toAtomicUnits("5", 6)).toBe("5000000");
    expect(toAtomicUnits("7", 0)).toBe("7");
    expect(toAtomicUnits("0", 6)).toBe("0");
  });

  it("converts fractional amounts exactly without floating point", () => {
    expect(toAtomicUnits("0.5", 6)).toBe("500000");
    expect(toAtomicUnits("0.000001", 6)).toBe("1");
    expect(toAtomicUnits("5.000000", 6)).toBe("5000000");
    expect(toAtomicUnits("0.000000000000000001", 19)).toBe("10");
    expect(toAtomicUnits("0.0000000000000000001", 19)).toBe("1");
  });

  it("rejects fractional precision beyond the token decimals", () => {
    expect(toAtomicUnits("0.0000001", 6)).toBeUndefined();
    expect(toAtomicUnits("1.5", 0)).toBeUndefined();
    expect(toAtomicUnits("0.5", 0)).toBeUndefined();
  });

  it("rejects malformed decimal strings", () => {
    expect(toAtomicUnits("abc", 6)).toBeUndefined();
    expect(toAtomicUnits("-5", 6)).toBeUndefined();
    expect(toAtomicUnits("", 6)).toBeUndefined();
    expect(toAtomicUnits("5.", 6)).toBeUndefined();
    expect(toAtomicUnits("00", 6)).toBeUndefined();
  });

  it("compares over-cap values correctly at any scale", () => {
    const amount = toAtomicUnits("0.000000000000000001", 19);
    const cap = toAtomicUnits("0.0000000000000000001", 19);
    expect(amount).toBeDefined();
    expect(cap).toBeDefined();
    expect(BigInt(amount as string)).toBeGreaterThan(BigInt(cap as string));
  });
});

describe("atomicToHumanUnits", () => {
  it("converts whole atomic amounts to human units", () => {
    expect(atomicToHumanUnits("5000000", 6)).toBe("5");
    expect(atomicToHumanUnits("0", 6)).toBe("0");
    expect(atomicToHumanUnits("7", 0)).toBe("7");
  });

  it("converts fractional atomic amounts without floating point", () => {
    expect(atomicToHumanUnits("2500000", 6)).toBe("2.5");
    expect(atomicToHumanUnits("1", 6)).toBe("0.000001");
    expect(atomicToHumanUnits("2500001", 6)).toBe("2.500001");
  });

  it("round-trips with toAtomicUnits", () => {
    const cases: Array<[string, number]> = [
      ["2500000", 6],
      ["1", 6],
      ["0", 6],
      ["12345678901234567890", 18],
      ["7", 0],
      ["123456789012345678901234567890123456789", 18],
    ];
    for (const [amountAtomic, decimals] of cases) {
      const human = atomicToHumanUnits(amountAtomic, decimals);
      expect(toAtomicUnits(human, decimals)).toBe(amountAtomic);
    }
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
