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
  // 1. Validate the order subtotal.
  if (!Number.isSafeInteger(subtotalKobo) || subtotalKobo < 0) {
    return { success: false, reason: "INVALID_SUBTOTAL" };
  }

  // 2. Validate the entered coupon code.
  if (
    typeof enteredCouponCode !== "string" ||
    enteredCouponCode.trim().length === 0
  ) {
    return { success: false, reason: "INVALID_COUPON_CODE" };
  }

  // 3. Check whether the coupon record exists.
  if (coupon === null) {
    return { success: false, reason: "COUPON_NOT_FOUND" };
  }

  // 4. Validate the coupon configuration.
  const validConfiguration =
    typeof coupon.code === "string" &&
    coupon.code.trim().length > 0 &&
    typeof coupon.isActive === "boolean" &&
    Number.isSafeInteger(coupon.discountPercentageBps) &&
    coupon.discountPercentageBps > 0 &&
    coupon.discountPercentageBps <= 10_000 &&
    Number.isSafeInteger(coupon.minimumSubtotalKobo) &&
    coupon.minimumSubtotalKobo >= 0 &&
    (coupon.maximumDiscountKobo === null ||
      (Number.isSafeInteger(coupon.maximumDiscountKobo) &&
        coupon.maximumDiscountKobo >= 0)) &&
    Number.isSafeInteger(coupon.startsAtEpochMs) &&
    Number.isSafeInteger(coupon.expiresAtEpochMs) &&
    coupon.startsAtEpochMs < coupon.expiresAtEpochMs;

  if (!validConfiguration) {
    return {
      success: false,
      reason: "INVALID_COUPON_CONFIGURATION"
    };
  }

  // 5. Compare normalized coupon codes.
  const submittedCode = enteredCouponCode.trim().toLowerCase();
  const registeredCode = coupon.code.trim().toLowerCase();

  if (submittedCode !== registeredCode) {
    return { success: false, reason: "COUPON_CODE_MISMATCH" };
  }

  // 6. Check whether the coupon is active.
  if (!coupon.isActive) {
    return { success: false, reason: "COUPON_INACTIVE" };
  }

  // 7. Check whether the coupon has started.
  if (currentTimeEpochMs < coupon.startsAtEpochMs) {
    return { success: false, reason: "COUPON_NOT_STARTED" };
  }

  // 8. Check whether the coupon has expired.
  if (currentTimeEpochMs >= coupon.expiresAtEpochMs) {
    return { success: false, reason: "COUPON_EXPIRED" };
  }

  // 9. Enforce the minimum subtotal.
  if (subtotalKobo < coupon.minimumSubtotalKobo) {
    return {
      success: false,
      reason: "MINIMUM_SUBTOTAL_NOT_MET"
    };
  }

  // 10. Calculate the percentage discount using integer arithmetic.
  const calculatedDiscountKobo = Number(
    (BigInt(subtotalKobo) * BigInt(coupon.discountPercentageBps)) /
      10_000n
  );

  // 11. Apply the maximum discount cap, if configured.
  const cappedDiscountKobo =
    coupon.maximumDiscountKobo === null
      ? calculatedDiscountKobo
      : Math.min(
          calculatedDiscountKobo,
          coupon.maximumDiscountKobo
        );

  // 12. Ensure the discount cannot exceed the subtotal.
  const discountKobo = Math.min(cappedDiscountKobo, subtotalKobo);

  // 13. Calculate the payable subtotal.
  const payableSubtotalKobo = subtotalKobo - discountKobo;

  // 14. Return the successful result.
  return {
    success: true,
    discountKobo,
    payableSubtotalKobo
  };
}