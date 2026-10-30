
import { describe, it, expect } from "vitest";
import { calculateDiscount, type Coupon } from "../src/coupon-engine.js";

const validCoupon: Coupon = {
  code: "SAVE10",
  isActive: true,
  discountPercentageBps: 1000,
  minimumSubtotalKobo: 1000000,
  maximumDiscountKobo: 300000,
  startsAtEpochMs: 1790812800000,
  expiresAtEpochMs: 1798761540000
};

describe("calculateDiscount", () => {
  it("applies a 10% discount to a valid purchase", () => {
    const result = calculateDiscount(2000000, "SAVE10", validCoupon, 1793000000000);

    expect(result).toEqual({
      success: true,
      discountKobo: 200000,
      payableSubtotalKobo: 1800000
    });
  });

  it("rounds fractional kobo down to the nearest whole kobo", () => {
    const result = calculateDiscount(
      1000001,
      "SAVE10",
      validCoupon,
      1793000000000
    );

    expect(result).toEqual({
      success: true,
      discountKobo: 100000,
      payableSubtotalKobo: 900001
    });
  });

  it("rejects an empty coupon code", () => {
    const result = calculateDiscount(2000000, "   ", validCoupon, 1793000000000);
    expect(result).toEqual({
      success: false,
      reason: "INVALID_COUPON_CODE"
    });
  });

  it("rejects a missing coupon", () => {
    const result = calculateDiscount(2000000, "SAVE10", null, 1793000000000);
    expect(result).toEqual({
      success: false,
      reason: "COUPON_NOT_FOUND"
    });
  });

  it("rejects an inactive coupon", () => {
    const inactiveCoupon: Coupon = { ...validCoupon, isActive: false };
    const result = calculateDiscount(2000000, "SAVE10", inactiveCoupon, 1793000000000);
    expect(result).toEqual({
      success: false,
      reason: "COUPON_INACTIVE"
    });
  });

  it("rejects a coupon with a discount above 100%", () => {
    const invalidCoupon: Coupon = { ...validCoupon, discountPercentageBps: 10001 };
    const result = calculateDiscount(2000000, "SAVE10", invalidCoupon, 1793000000000);
    expect(result).toEqual({
      success: false,
      reason: "INVALID_COUPON_CONFIGURATION"
    });
  });

  it("accepts coupon codes regardless of letter case", () => {
    const result = calculateDiscount(2000000, "save10", validCoupon, 1793000000000);
    expect(result).toEqual({
      success: true,
      discountKobo: 200000,
      payableSubtotalKobo: 1800000
    });
  });

  it("rejects a coupon code that does not match", () => {
    const result = calculateDiscount(2000000, "WRONGCODE", validCoupon, 1793000000000);
    expect(result).toEqual({
      success: false,
      reason: "COUPON_CODE_MISMATCH"
    });
  });

  it("rejects a purchase below the minimum subtotal", () => {
    const result = calculateDiscount(800000, "SAVE10", validCoupon, 1793000000000);
    expect(result).toEqual({
      success: false,
      reason: "MINIMUM_SUBTOTAL_NOT_MET"
    });
  });

  it("rejects an expired coupon", () => {
    const result = calculateDiscount(2000000, "SAVE10", validCoupon, validCoupon.expiresAtEpochMs);
    expect(result).toEqual({
      success: false,
      reason: "COUPON_EXPIRED"
    });
  });

  it("applies the maximum discount cap", () => {
    const result = calculateDiscount(5000000, "SAVE10", validCoupon, 1793000000000);
    expect(result).toEqual({
      success: true,
      discountKobo: 300000,
      payableSubtotalKobo: 4700000
    });
  });

  it("accepts a coupon at its exact start time", () => {
    const result = calculateDiscount(2000000, "SAVE10", validCoupon, validCoupon.startsAtEpochMs);
    expect(result).toEqual({
      success: true,
      discountKobo: 200000,
      payableSubtotalKobo: 1800000
    });
  });

  it("rejects a coupon before its start time", () => {
    const result = calculateDiscount(2000000, "SAVE10", validCoupon, validCoupon.startsAtEpochMs - 1);
    expect(result).toEqual({
      success: false,
      reason: "COUPON_NOT_STARTED"
    });
  });

  it("rejects a negative subtotal", () => {
    const result = calculateDiscount(-100, "SAVE10", validCoupon, 1793000000000);
    expect(result).toEqual({
      success: false,
      reason: "INVALID_SUBTOTAL"
    });
  });

  it("does not allow a 100% discount to produce a negative payable amount", () => {
    const fullDiscountCoupon: Coupon = {
      ...validCoupon,
      discountPercentageBps: 10000,
      maximumDiscountKobo: null
    };

    const result = calculateDiscount(2000000, "SAVE10", fullDiscountCoupon, 1793000000000);
    expect(result).toEqual({
      success: true,
      discountKobo: 2000000,
      payableSubtotalKobo: 0
    });
  });
});
