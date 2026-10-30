\# Coupon Engine — Implementation Notes



\## 1. Overview



The Coupon Engine implements a pure function called `calculateDiscount()`.



It receives a purchase subtotal in kobo, an entered coupon code, a coupon record, and the current time. It either returns a calculated discount and payable subtotal or a structured failure reason.



The function does not communicate with a database, make network requests, process payments, or modify external state.



\## 2. Implementation Structure



The implementation is located in:



\- `implementation/src/coupon-engine.ts`

\- `implementation/tests/coupon-engine.test.ts`



The main function is:



`calculateDiscount(subtotalKobo, enteredCouponCode, coupon, currentTimeEpochMs)`



The implementation uses TypeScript interfaces and union types to define its inputs and outputs.



\## 3. Validation Process



The function validates inputs in a deliberate order:



1\. Checks that the subtotal is a non-negative safe integer.

2\. Rejects empty or whitespace-only coupon codes.

3\. Checks whether a coupon record exists.

4\. Validates the coupon configuration.

5\. Compares normalized coupon codes without case sensitivity.

6\. Checks whether the coupon is active.

7\. Checks whether the coupon has started.

8\. Checks whether the coupon has expired.

9\. Checks the minimum purchase requirement.



Each failed validation returns immediately with a specific failure reason.



\## 4. Discount Calculation



The percentage is represented in basis points.



For example:



\- 1,000 basis points = 10%.

\- 1,500 basis points = 15%.

\- 10,000 basis points = 100%.



The discount calculation uses integer arithmetic:



`floor(subtotalKobo \* discountPercentageBps / 10,000)`



BigInt is used during multiplication and division to avoid unsafe intermediate JavaScript number calculations.



The calculated discount is then limited by the optional maximum discount and the purchase subtotal.



The payable subtotal is calculated by subtracting the final discount from the original subtotal.



All monetary calculations use integer kobo rather than floating-point naira values.



\## 5. Time Boundaries



The coupon start time is inclusive. A coupon can be used at its exact start timestamp.



The expiry time is exclusive. A coupon cannot be used at or after its expiry timestamp.



The current timestamp is supplied as an input rather than obtained from the system clock. This keeps the function deterministic for identical inputs.



The current timestamp is expected to be a valid epoch-millisecond value. Explicit invalid-current-time rejection is not currently part of the failure contract.



\## 6. Testing



The implementation was tested using Vitest.



The 15 tests cover:



\- Successful discount calculation.

\- Fractional-kobo rounding.

\- Empty coupon codes.

\- Missing coupons.

\- Inactive coupons.

\- Invalid discount percentages.

\- Case-insensitive coupon matching.

\- Coupon code mismatch.

\- Minimum subtotal enforcement.

\- Expired coupons.

\- Maximum discount caps.

\- Exact coupon start time.

\- Coupon not yet started.

\- Negative subtotals.

\- A 100% discount without a negative payable amount.



\### Verification results



\- TypeScript typecheck: passed.

\- Automated tests: 15 passed.

\- Failed tests: 0.



\## 7. AI Assistance Disclosure



AI assistance was used during the implementation process for guidance, code review, debugging, and test development. The implementation was entered and executed in the local assessment repository, and its behaviour was verified through automated tests.



The pseudocode and feature specification were used as the basis for the implementation.



\## 8. Known Scope Limitations



The implementation does not include:



\- Database persistence.

\- Coupon creation or management.

\- Payment processing.

\- Coupon usage limits.

\- Customer authentication.

\- Network or external service integration.



These concerns are outside the scope of this standalone discount-calculation feature.

