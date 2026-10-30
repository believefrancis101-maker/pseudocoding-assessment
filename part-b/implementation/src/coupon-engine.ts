export interface Coupon {
  code: string;
  isActive: boolean;
  discountPercentageBps: number;
  minimumSubtotalKobo: number;
  maximumDiscountKobo: number | null;
  startsAtEpochMs: number;
  expiresAtEpochMs: number;
}
export type CouponFailureReason =
  | "INVALID_SUBTOTAL"
  | "INVALID_COUPON_CODE"
  | "COUPON_NOT_FOUND"
  | "COUPON_CODE_MISMATCH"
  | "COUPON_INACTIVE"
  | "COUPON_NOT_STARTED"
  | "COUPON_EXPIRED"
  | "MINIMUM_SUBTOTAL_NOT_MET"
  | "INVALID_COUPON_CONFIGURATION";

export type DiscountResult =
  | {
      success: true;
      discountKobo: number;
      payableSubtotalKobo: number;
    }
  | {
      success: false;
      reason: CouponFailureReason;
    };

export function calculateDiscount(
  subtotalKobo: number,
  enteredCouponCode: string,
  coupon: Coupon | null,
  currentTimeEpochMs: number
): DiscountResult {

  // Step 1: Validate subtotal
  if (!Number.isSafeInteger(subtotalKobo) || subtotalKobo < 0) {
    return {
      success: false,
      reason: "INVALID_SUBTOTAL"
    };
  }

  // Step 2: Validate entered coupon code
  if (typeof enteredCouponCode !== "string" || enteredCouponCode.trim().length === 0) {
    return {
      success: false,
      reason: "INVALID_COUPON_CODE"
    };
}
  // Step 3: Check whether the coupon exists
  if (coupon === null) {
    return {
      success: false,
      reason: "COUPON_NOT_FOUND"
    };
  }
  
  // Step 4: Validate coupon configuration
  if (
    typeof coupon.code !== "string" ||
    coupon.code.trim().length === 0 ||
    typeof coupon.isActive !== "boolean"
    ||
    !Number.isSafeInteger(coupon.discountPercentageBps) ||
    coupon.discountPercentageBps <= 0 ||
    coupon.discountPercentageBps > 10000
    ||
    !Number.isSafeInteger(coupon.minimumSubtotalKobo) ||
    coupon.minimumSubtotalKobo < 0
    ||
    (coupon.maximumDiscountKobo !== null &&
      (!Number.isSafeInteger(coupon.maximumDiscountKobo) ||
        coupon.maximumDiscountKobo < 0))
    ||
    !Number.isSafeInteger(coupon.startsAtEpochMs) ||
    !Number.isSafeInteger(coupon.expiresAtEpochMs) ||
    coupon.startsAtEpochMs >= coupon.expiresAtEpochMs
  ) {
    return {
      success: false,
      reason: "INVALID_COUPON_CONFIGURATION"
    };
  }
  // Step 5: Compare normalized coupon codes
  if (enteredCouponCode.trim().toLowerCase() !== coupon.code.trim().toLowerCase()) {
    return {
      success: false,
      reason: "COUPON_CODE_MISMATCH"
    };
  }
  // Step 6: Check whether the coupon is active
  if (!coupon.isActive) {
    return {
      success: false,
      reason: "COUPON_INACTIVE"
    };
  }
  // Step 7: Check whether the coupon has started
  if (currentTimeEpochMs < coupon.startsAtEpochMs) {
    return {
      success: false,
      reason: "COUPON_NOT_STARTED"
    };
  }  // Step 8: Check whether the coupon has expired
  if (currentTimeEpochMs >= coupon.expiresAtEpochMs) {
    return {
      success: false,
      reason: "COUPON_EXPIRED"
    };
  }  // Step 9: Check minimum subtotal
  if (subtotalKobo < coupon.minimumSubtotalKobo) {
    return {
      success: false,
      reason: "MINIMUM_SUBTOTAL_NOT_MET"
    };
  }  // Step 10: Calculate percentage discount in integer kobo
  const calculatedDiscountKobo = Number(
    (BigInt(subtotalKobo) * BigInt(coupon.discountPercentageBps)) / 10000n
  );

  // Step 11: Apply maximum discount cap
  const cappedDiscountKobo =
    coupon.maximumDiscountKobo === null
      ? calculatedDiscountKobo
      : Math.min(calculatedDiscountKobo, coupon.maximumDiscountKobo);  

// Step 12: Ensure discount does not exceed subtotal
  const discountKobo = Math.min(cappedDiscountKobo, subtotalKobo);


  // Step 13: Calculate payable subtotal
  const payableSubtotalKobo = subtotalKobo - discountKobo;


  // Step 14: Return successful calculation
  return {
    success: true,
    discountKobo,
    payableSubtotalKobo
  };
}