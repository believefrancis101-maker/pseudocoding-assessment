\# B1 - Coupon Engine: Function Pseudocode



\## FUNCTION



`calculateDiscount(subtotalKobo, enteredCouponCode, coupon, currentTimeEpochMs)`



\## INPUTS



1\. `subtotalKobo`

&#x20;  - Type: Integer

&#x20;  - Meaning: Order subtotal expressed in kobo.

&#x20;  - Must be a non-negative safe integer.



2\. `enteredCouponCode`

&#x20;  - Type: String

&#x20;  - Meaning: Coupon code entered by the customer.

&#x20;  - Leading and trailing whitespace must be ignored during validation and comparison.



3\. `coupon`

&#x20;  - Type: Coupon object or null.

&#x20;  - Meaning: The registered coupon record.

&#x20;  - Properties:

&#x20;    - `code`: String

&#x20;    - `isActive`: Boolean

&#x20;    - `discountPercentageBps`: Integer

&#x20;    - `minimumSubtotalKobo`: Integer

&#x20;    - `maximumDiscountKobo`: Integer or null

&#x20;    - `startsAtEpochMs`: Integer

&#x20;    - `expiresAtEpochMs`: Integer



4\. `currentTimeEpochMs`

&#x20;  - Type: Integer

&#x20;  - Meaning: Current time supplied as Unix epoch milliseconds.



\## OUTPUT



A structured result containing one of two possible outcomes.



\*\*Success:\*\*

\- `success`: true

\- `discountKobo`: Integer

\- `payableSubtotalKobo`: Integer



\*\*Failure:\*\*

\- `success`: false

\- `reason`: One of the supported failure codes.



\## SIDE EFFECTS



None.



The function must not:

\- Modify the coupon record or subtotal.

\- Access a database.

\- Make network requests.

\- Read the system clock.

\- Modify global application state.



\## FAILS WHEN



The function returns a structured failure result when:

\- The subtotal is invalid.

\- The entered coupon code is empty or whitespace-only.

\- The coupon record does not exist.

\- The coupon configuration is invalid.

\- The coupon code does not match.

\- The coupon is inactive.

\- The coupon has not started.

\- The coupon has expired.

\- The subtotal is below the minimum requirement.



\## NUMBERED STEPS



1\. Receive the order subtotal, entered coupon code, coupon record and current timestamp.



2\. Validate the order subtotal.

&#x20;  - Check whether it is an integer and a safe integer.

&#x20;  - Check whether it is greater than or equal to zero.

&#x20;  - If either condition fails, return `{ success: false, reason: INVALID\_SUBTOTAL }` immediately.



3\. Validate the entered coupon code.

&#x20;  - Check whether the value is a string.

&#x20;  - Remove leading and trailing whitespace for validation.

&#x20;  - If the value is empty after trimming, return `{ success: false, reason: INVALID\_COUPON\_CODE }` immediately.



4\. Check whether the coupon record exists.

&#x20;  - If the coupon record is null, return `{ success: false, reason: COUPON\_NOT\_FOUND }` immediately.



5\. Validate the coupon configuration.

&#x20;  - Check that the registered coupon code is a non-empty string after trimming.

&#x20;  - Check that `isActive` is a boolean.

&#x20;  - Check that `discountPercentageBps` is a safe integer greater than zero and no greater than 10,000.

&#x20;  - Check that `minimumSubtotalKobo` is a non-negative safe integer.

&#x20;  - Check that `maximumDiscountKobo` is either null or a non-negative safe integer.

&#x20;  - Check that both timestamps are safe integers.

&#x20;  - Check that the start timestamp is earlier than the expiry timestamp.

&#x20;  - If any configuration check fails, return `{ success: false, reason: INVALID\_COUPON\_CONFIGURATION }` immediately.



6\. Compare the entered coupon code with the registered coupon code.

&#x20;  - Trim leading and trailing whitespace from both codes.

&#x20;  - Convert both codes to the same letter case.

&#x20;  - If the normalized codes do not match, return `{ success: false, reason: COUPON\_CODE\_MISMATCH }` immediately.



7\. Check whether the coupon is active.

&#x20;  - If `isActive` is false, return `{ success: false, reason: COUPON\_INACTIVE }` immediately.



8\. Check whether the coupon has started.

&#x20;  - Compare the current timestamp with `startsAtEpochMs`.

&#x20;  - If the current timestamp is earlier than the start timestamp, return `{ success: false, reason: COUPON\_NOT\_STARTED }` immediately.

&#x20;  - The exact start timestamp is valid.



9\. Check whether the coupon has expired.

&#x20;  - Compare the current timestamp with `expiresAtEpochMs`.

&#x20;  - If the current timestamp is greater than or equal to the expiry timestamp, return `{ success: false, reason: COUPON\_EXPIRED }` immediately.

&#x20;  - The exact expiry timestamp is invalid.



10\. Check the minimum subtotal requirement.

&#x20;   - Compare `subtotalKobo` with `minimumSubtotalKobo`.

&#x20;   - If the subtotal is less than the minimum, return `{ success: false, reason: MINIMUM\_SUBTOTAL\_NOT\_MET }` immediately.

&#x20;   - A subtotal exactly equal to the minimum is accepted.



11\. Calculate the percentage discount.

&#x20;   - Multiply `subtotalKobo` by `discountPercentageBps`.

&#x20;   - Divide the result by 10,000.

&#x20;   - Round the result down to the nearest whole kobo using floor.

&#x20;   - Store the result as `calculatedDiscountKobo`.

&#x20;   - Use integer-safe arithmetic.



12\. Apply the maximum discount limit.

&#x20;   - If `maximumDiscountKobo` is null, use `calculatedDiscountKobo` as the discount.

&#x20;   - Otherwise, choose the smaller value between `calculatedDiscountKobo` and `maximumDiscountKobo`.

&#x20;   - Store the result as `cappedDiscountKobo`.



13\. Ensure the discount does not exceed the order subtotal.

&#x20;   - Compare `cappedDiscountKobo` with `subtotalKobo`.

&#x20;   - Choose the smaller value.

&#x20;   - Store the result as `discountKobo`.



14\. Calculate the payable subtotal.

&#x20;   - Subtract `discountKobo` from `subtotalKobo`.

&#x20;   - Store the result as `payableSubtotalKobo`.



15\. Return the successful result:

&#x20;   - `success`: true

&#x20;   - `discountKobo`: calculated final discount

&#x20;   - `payableSubtotalKobo`: subtotal remaining after discount



\## PROCESSING NOTES



\- Every failure must return immediately when its validation step fails.

\- Follow the numbered processing order exactly.

\- Do not use floating-point naira calculations.

\- All monetary values must remain integer kobo.

\- The function must produce the same result whenever it receives the same inputs.

\- The function must not perform database, network or payment operations.

