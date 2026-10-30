
import { describe, it, expect } from "vitest";

import {
  calculateDiscount as calculatePartB
} from "../../../part-b/implementation/src/coupon-engine.js";

import {
  calculateDiscount as calculatePartC
} from "../src/coupon-engine.js";

const validCoupon = {
  code: "SAVE10",
  isActive: true,
  discountPercentageBps: 1000,
  minimumSubtotalKobo: 1000000,
  maximumDiscountKobo: 300000,
  startsAtEpochMs: 1790812800000,
  expiresAtEpochMs: 1798761540000
};

const currentTime = 1793000000000;

const scenarios = [
  {
    name: "Baseline 1: valid 10% discount",
    subtotal: 2000000,
    code: "SAVE10",
    coupon: validCoupon,
    time: currentTime,
    expected: {
      success: true,
      discountKobo: 200000,
      payableSubtotalKobo: 1800000
    }
  },
  {
    name: "Baseline 2: subtotal below minimum",
    subtotal: 800000,
    code: "SAVE10",
    coupon: validCoupon,
    time: currentTime,
    expected: {
      success: false,
      reason: "MINIMUM_SUBTOTAL_NOT_MET"
    }
  },
  {
    name: "Baseline 3: maximum discount cap",
    subtotal: 5000000,
    code: "SAVE10",
    coupon: validCoupon,
    time: currentTime,
    expected: {
      success: true,
      discountKobo: 300000,
      payableSubtotalKobo: 4700000
    }
  },
  {
    name: "Baseline 4: expired coupon",
    subtotal: 2000000,
    code: "SAVE10",
    coupon: validCoupon,
    time: validCoupon.expiresAtEpochMs,
    expected: {
      success: false,
      reason: "COUPON_EXPIRED"
    }
  },
  {
    name: "Baseline 5: mismatched coupon code",
    subtotal: 2000000,
    code: "WRONG",
    coupon: validCoupon,
    time: currentTime,
    expected: {
      success: false,
      reason: "COUPON_CODE_MISMATCH"
    }
  },
  {
    name: "Additional 1: exact minimum subtotal",
    subtotal: 1000000,
    code: "SAVE10",
    coupon: validCoupon,
    time: currentTime,
    expected: {
      success: true,
      discountKobo: 100000,
      payableSubtotalKobo: 900000
    }
  },
  {
    name: "Additional 2: whitespace around coupon code",
    subtotal: 2000000,
    code: "  SAVE10  ",
    coupon: validCoupon,
    time: currentTime,
    expected: {
      success: true,
      discountKobo: 200000,
      payableSubtotalKobo: 1800000
    }
  },
  {
    name: "Additional 3: zero maximum discount",
    subtotal: 2000000,
    code: "SAVE10",
    coupon: { ...validCoupon, maximumDiscountKobo: 0 },
    time: currentTime,
    expected: {
      success: true,
      discountKobo: 0,
      payableSubtotalKobo: 2000000
    }
  },
  {
    name: "Additional 4: full 100% discount",
    subtotal: 2000000,
    code: "SAVE10",
    coupon: {
      ...validCoupon,
      discountPercentageBps: 10000,
      maximumDiscountKobo: null
    },
    time: currentTime,
    expected: {
      success: true,
      discountKobo: 2000000,
      payableSubtotalKobo: 0
    }
  },
  {
    name: "Additional 5: invalid coupon timestamp configuration",
    subtotal: 2000000,
    code: "SAVE10",
    coupon: {
      ...validCoupon,
      startsAtEpochMs: validCoupon.expiresAtEpochMs
    },
    time: currentTime,
    expected: {
      success: false,
      reason: "INVALID_COUPON_CONFIGURATION"
    }
  }
];

describe("Part B versus Part C implementation comparison", () => {
  it.each(scenarios)("$name", (scenario) => {
    const partBResult = calculatePartB(
      scenario.subtotal,
      scenario.code,
      scenario.coupon,
      scenario.time
    );

    const partCResult = calculatePartC(
      scenario.subtotal,
      scenario.code,
      scenario.coupon,
      scenario.time
    );

    expect(partBResult).toEqual(scenario.expected);
    expect(partCResult).toEqual(scenario.expected);
    expect(partCResult).toEqual(partBResult);
  });
});
