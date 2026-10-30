\# Part C: Difference Analysis



\## Purpose



This document compares the Part B Coupon Engine pseudocode with the AI-generated implementation in `part-c/ai-implementation/src/coupon-engine.ts`.



The aim is to identify behaviour that matches, behaviour that differs, and details that were not fully specified in the original pseudocode.



\## Comparison



| Area | Part B pseudocode | AI implementation | Finding |

|---|---|---|---|

| Subtotal validation | Rejects negative or invalid subtotal values | Uses `Number.isSafeInteger()` and rejects negative values | Match |

| Coupon code validation | Rejects empty or whitespace-only input | Trims and rejects empty input | Match |

| Missing coupon | Returns `COUPON\_NOT\_FOUND` | Returns `COUPON\_NOT\_FOUND` | Match |

| Coupon configuration | Validates coupon fields and limits | Uses a configuration validation helper | Match |

| Code comparison | Trims and compares without case sensitivity | Trims and converts both codes to lowercase | Match |

| Active status | Rejects inactive coupons | Rejects inactive coupons | Match |

| Start time | Coupon is valid at its start time | Uses a less-than comparison, so the start time is inclusive | Match |

| Expiry time | Coupon is invalid at its expiry time | Uses greater-than-or-equal, so expiry is exclusive | Match |

| Minimum subtotal | Rejects subtotal below minimum | Rejects subtotal below minimum | Match |

| Percentage calculation | Calculates discount using basis points and rounds down | Uses `BigInt` arithmetic and integer division | Match |

| Maximum discount | Applies configured cap when present | Applies the same cap | Match |

| Discount limit | Discount cannot exceed subtotal | Uses `Math.min()` to enforce the limit | Match |

| Payable amount | Subtracts discount from subtotal | Performs the same subtraction | Match |

| Return behaviour | Returns success or a defined failure result | Returns the same result structure | Match |



\## Differences and Ambiguities



\### 1. Timestamp validation



The AI implementation validates the coupon start and expiry timestamps with `Number.isSafeInteger()`.



The original pseudocode describes these values as integer timestamps but does not explicitly state that they must be safe integers.



This is a stricter implementation detail. It is reasonable because JavaScript safe integers avoid precision problems, but it should be recognised as an additional validation constraint.



\### 2. Current-time validation



The pseudocode accepts the current time as an integer timestamp, but it does not define a failure reason for an invalid current-time value.



The AI implementation uses the supplied current time directly when checking the coupon's start and expiry boundaries. It does not independently validate that input.



This is an ambiguity in the specification rather than a clear implementation omission.



\### 3. Configuration validation structure



The AI implementation groups configuration checks into a helper rather than expressing every check as a separate top-level step.



This changes the code organisation, not the intended business behaviour.



\## Testing Evidence



The AI implementation passed its 15 individual tests.



The comparative test suite also checked both implementations against the same 10 scenarios. Both implementations returned the expected results in all 10 scenarios.



TypeScript type checking passed.



\## Conclusion



The AI-generated implementation follows the main business rules in the Part B pseudocode. No major business rule was found to be missing in the tested scenarios.



The main points worth noting are the stricter safe-integer timestamp checks and the ambiguity around validation of the current-time input.



This comparison demonstrates why generated code should be inspected and tested rather than accepted simply because it appears to follow the pseudocode.

