\# Part B2 — Coupon Engine Hand Traces



\## Test Fixture



The following coupon is used for the hand-tracing exercises.



| Property | Value |

|---|---|

| Code | SAVE10 |

| Active | true |

| Discount | 10% |

| Minimum subtotal | ₦10,000 (1,000,000 kobo) |

| Maximum discount | ₦3,000 (300,000 kobo) |

| Start time | 1 October 2026, 00:00 UTC |

| Expiry time | 31 December 2026, 23:59 UTC |



For consistency, all test timestamps are supplied explicitly in epoch milliseconds. The implementation will not read the system clock.



\## Test 1 — Valid coupon



\*\*Input\*\*

\- Subtotal: ₦20,000 (2,000,000 kobo)

\- Entered code: `SAVE10`

\- Coupon: Active and valid

\- Current time: Within validity period



\*\*Trace\*\*

1\. Subtotal is a valid non-negative integer.

2\. Coupon code is not empty.

3\. Coupon record exists.

4\. Coupon configuration is valid.

5\. Entered code matches registered code.

6\. Coupon is active.

7\. Current time is after the start time.

8\. Current time is before expiry.

9\. Subtotal meets the minimum.

10\. Calculate 10% of ₦20,000 = ₦2,000.

11\. Apply the maximum cap of ₦3,000. Discount remains ₦2,000.

12\. Discount does not exceed subtotal.

13\. Calculate payable subtotal: ₦20,000 - ₦2,000 = ₦18,000.



\*\*Expected result:\*\* Success, discount ₦2,000, payable subtotal ₦18,000.



\## Test 2 — Minimum subtotal not met



\*\*Input\*\*

\- Subtotal: ₦8,000 (800,000 kobo)

\- Entered code: `SAVE10`

\- Coupon: Active and valid

\- Current time: Within validity period



\*\*Trace\*\*

1\. Subtotal is valid.

2\. Coupon code is not empty.

3\. Coupon record exists.

4\. Coupon configuration is valid.

5\. Coupon code matches.

6\. Coupon is active.

7\. Coupon has started and has not expired.

8\. Subtotal is below the required ₦10,000 minimum.

9\. Return `MINIMUM\_SUBTOTAL\_NOT\_MET`.



\*\*Expected result:\*\* Failure, `MINIMUM\_SUBTOTAL\_NOT\_MET`.



\## Test 3 — Maximum discount cap applies



\*\*Input\*\*

\- Subtotal: ₦50,000 (5,000,000 kobo)

\- Entered code: `SAVE10`

\- Coupon: Active and valid

\- Current time: Within validity period



\*\*Trace\*\*

1\. Subtotal is valid.

2\. Coupon code is not empty.

3\. Coupon record exists.

4\. Coupon configuration is valid.

5\. Coupon code matches.

6\. Coupon is active.

7\. Coupon has started and has not expired.

8\. Subtotal meets the minimum.

9\. Calculate 10% of ₦50,000 = ₦5,000.

10\. Compare calculated discount with the ₦3,000 cap.

11\. Use ₦3,000 as the final discount.

12\. Calculate payable subtotal: ₦50,000 - ₦3,000 = ₦47,000.



\*\*Expected result:\*\* Success, discount ₦3,000, payable subtotal ₦47,000.



\## Test 4 — Expired coupon



\*\*Input\*\*

\- Subtotal: ₦20,000 (2,000,000 kobo)

\- Entered code: `SAVE10`

\- Coupon: Active but expired

\- Current time: At or after expiry timestamp



\*\*Trace\*\*

1\. Subtotal is valid.

2\. Coupon code is not empty.

3\. Coupon record exists.

4\. Coupon configuration is valid.

5\. Coupon code matches.

6\. Coupon is active.

7\. Check whether current time is at or after expiry.

8\. The condition is true.

9\. Return `COUPON\_EXPIRED`.



\*\*Expected result:\*\* Failure, `COUPON\_EXPIRED`.



\## Test 5 — Invalid coupon code



\*\*Input\*\*

\- Subtotal: ₦20,000 (2,000,000 kobo)

\- Entered code: `WRONG10`

\- Registered coupon code: `SAVE10`

\- Coupon: Active and valid

\- Current time: Within validity period



\*\*Trace\*\*

1\. Subtotal is valid.

2\. Coupon code is not empty.

3\. Coupon record exists.

4\. Coupon configuration is valid.

5\. Compare entered code with registered code.

6\. The codes do not match.

7\. Return `COUPON\_CODE\_MISMATCH`.



\*\*Expected result:\*\* Failure, `COUPON\_CODE\_MISMATCH`.



\## Test 6 — Discount cannot exceed subtotal



\*\*Input\*\*

\- Subtotal: ₦10,000 (1,000,000 kobo)

\- Entered code: `SAVE10`

\- Coupon: Active and valid

\- Current time: Within validity period



\*\*Trace\*\*

1\. Subtotal is valid.

2\. Coupon code is not empty.

3\. Coupon record exists.

4\. Coupon configuration is valid.

5\. Coupon code matches.

6\. Coupon is active.

7\. Coupon has started and has not expired.

8\. Subtotal meets the minimum.

9\. Calculate 10% of ₦10,000 = ₦1,000.

10\. Compare the calculated discount with the ₦3,000 maximum.

11\. Final discount is ₦1,000.

12\. Ensure discount does not exceed subtotal.

13\. Calculate payable subtotal: ₦10,000 - ₦1,000 = ₦9,000.



\*\*Expected result:\*\* Success, discount ₦1,000, payable subtotal ₦9,000.



\## 7. Summary of Hand Traces



| Test | Scenario | Expected outcome |

|---|---|---|

| 1 | Valid coupon | Success, ₦2,000 discount |

| 2 | Minimum not met | Failure |

| 3 | Maximum cap applies | Success, ₦3,000 discount |

| 4 | Expired coupon | Failure |

| 5 | Invalid code | Failure |

| 6 | Discount below subtotal | Success, ₦1,000 discount |



\## Reflection



The hand traces demonstrate how the specification handles both successful and unsuccessful coupon applications. They also demonstrate the importance of checking validation rules in the specified order and applying discount caps before calculating the final payable subtotal.

