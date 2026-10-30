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

describe("AI calculateDiscount implementation", () => {
  it("calculates a valid 10% discount", () => {
    expect(
      calculateDiscount(2000000, "SAVE10", validCoupon, 1793000000000)
    ).toEqual({
      success: true,
      discountKobo: 200000,
      payableSubtotalKobo: 1800000
    });
  });

  it("rejects a negative subtotal", () => {
    expect(
      calculateDiscount(-100, "SAVE10", validCoupon, 1793000000000)
    ).toEqual({
      success: false,
      reason: "INVALID_SUBTOTAL"
    });
  });

  it("rejects an empty coupon code", () => {
    expect(
      calculateDiscount(2000000, "   ", validCoupon, 1793000000000)
    ).toEqual({
      success: false,
      reason: "INVALID_COUPON_CODE"
    });
  });

  it("rejects a missing coupon", () => {
    expect(
      calculateDiscount(2000000, "SAVE10", null, 1793000000000)
    ).toEqual({
      success: false,
      reason: "COUPON_NOT_FOUND"
    });
  });

  it("accepts coupon codes without regard to letter case", () => {
    expect(
      calculateDiscount(2000000, "save10", validCoupon, 1793000000000)
    ).toEqual({
      success: true,
      discountKobo: 200000,
      payableSubtotalKobo: 1800000
    });
  });

  it("rejects a mismatched coupon code", () => {
    expect(
      calculateDiscount(2000000, "WRONG", validCoupon, 1793000000000)
    ).toEqual({
      success: false,
      reason: "COUPON_CODE_MISMATCH"
    });
  });

  it("rejects an inactive coupon", () => {
    const coupon = { ...validCoupon, isActive: false };

    expect(
      calculateDiscount(2000000, "SAVE10", coupon, 1793000000000)
    ).toEqual({
      success: false,
      reason: "COUPON_INACTIVE"
    });
  });

  it("rejects a subtotal below the minimum", () => {
    expect(
      calculateDiscount(800000, "SAVE10", validCoupon, 1793000000000)
    ).toEqual({
      success: false,
      reason: "MINIMUM_SUBTOTAL_NOT_MET"
    });
  });

  it("applies the maximum discount cap", () => {
    expect(
      calculateDiscount(5000000, "SAVE10", validCoupon, 1793000000000)
    ).toEqual({
      success: true,
      discountKobo: 300000,
      payableSubtotalKobo: 4700000
    });
  });

  it("accepts the exact coupon start timestamp", () => {
    expect(
      calculateDiscount(
        2000000,
        "SAVE10",
        validCoupon,
        validCoupon.startsAtEpochMs
      )
    ).toEqual({
      success: true,
      discountKobo: 200000,
      payableSubtotalKobo: 1800000
    });
  });

  it("rejects a coupon before its start timestamp", () => {
    expect(
      calculateDiscount(
        2000000,
        "SAVE10",
        validCoupon,
        validCoupon.startsAtEpochMs - 1
      )
    ).toEqual({
      success: false,
      reason: "COUPON_NOT_STARTED"
    });
  });

  it("rejects a coupon at its exact expiry timestamp", () => {
    expect(
      calculateDiscount(
        2000000,
        "SAVE10",
        validCoupon,
        validCoupon.expiresAtEpochMs
      )
    ).toEqual({
      success: false,
      reason: "COUPON_EXPIRED"
    });
  });

  it("rejects a discount percentage above 100%", () => {
    const coupon = { ...validCoupon, discountPercentageBps: 10001 };

    expect(
      calculateDiscount(2000000, "SAVE10", coupon, 1793000000000)
    ).toEqual({
      success: false,
      reason: "INVALID_COUPON_CONFIGURATION"
    });
  });

  it("rounds a fractional kobo discount down", () => {
    expect(
      calculateDiscount(1000001, "SAVE10", validCoupon, 1793000000000)
    ).toEqual({
      success: true,
      discountKobo: 100000,
      payableSubtotalKobo: 900001
    });
  });

  it("does not produce a negative payable subtotal with a 100% discount", () => {
    const coupon = {
      ...validCoupon,
      discountPercentageBps: 10000,
      maximumDiscountKobo: null
    };

    expect(
      calculateDiscount(2000000, "SAVE10", coupon, 1793000000000)
    ).toEqual({
      success: true,
      discountKobo: 2000000,
      payableSubtotalKobo: 0
    });
  });
});