\# Part B1 - Coupon Engine Feature Specification



\## 1. Feature Overview



\*\*Feature name:\*\* Coupon Engine



\*\*Project type:\*\* Standalone TypeScript module



\*\*Purpose:\*\* Calculate discounts for customer orders using coupon codes and predefined coupon rules.



This feature is designed independently of the existing ShopSphere API. It will not modify or integrate with that project.



\## 2. Main Function



`calculateDiscount()`



The function receives an order subtotal, a coupon code, a coupon record and the current time. It validates the coupon and calculates the applicable discount.



\## 3. Input Specification



\### Order subtotal

\- Type: Integer

\- Meaning: Total order value expressed in kobo.

\- Must be a non-negative safe integer.



\### Entered coupon code

\- Type: String

\- Meaning: Coupon code supplied by the customer.

\- Leading and trailing whitespace should be ignored.

\- Comparison should be case-insensitive.



\### Coupon record

\- Type: Coupon object or null.

\- Properties:

&#x20; - `code`: String, registered coupon code.

&#x20; - `isActive`: Boolean, indicates whether the coupon is active.

&#x20; - `discountPercentageBps`: Integer, discount percentage in basis points. For example, 1000 represents 10%.

&#x20; - `minimumSubtotalKobo`: Integer, minimum order subtotal required.

&#x20; - `maximumDiscountKobo`: Integer or null, optional maximum discount.

&#x20; - `startsAtEpochMs`: Integer, time when the coupon becomes valid.

&#x20; - `expiresAtEpochMs`: Integer, time when the coupon expires.



\### Current time

\- Type: Integer

\- Meaning: Current time represented as Unix epoch milliseconds.

\- Used to determine whether the coupon is within its validity period.



\## 4. Output Specification



The function returns one of two result types.



\### Success

\- `success`: true

\- `discountKobo`: Integer, calculated discount.

\- `payableSubtotalKobo`: Integer, subtotal after discount.



\### Failure

\- `success`: false

\- `reason`: A descriptive failure code.



Supported failure reasons:

\- `INVALID\_SUBTOTAL`

\- `INVALID\_COUPON\_CODE`

\- `COUPON\_NOT\_FOUND`

\- `COUPON\_CODE\_MISMATCH`

\- `COUPON\_INACTIVE`

\- `COUPON\_NOT\_STARTED`

\- `COUPON\_EXPIRED`

\- `MINIMUM\_SUBTOTAL\_NOT\_MET`

\- `INVALID\_COUPON\_CONFIGURATION`



\## 5. Business Rules



1\. The order subtotal must be a non-negative safe integer.

2\. An empty or whitespace-only coupon code is invalid.

3\. If no coupon record exists, return `COUPON\_NOT\_FOUND`.

4\. Compare the entered coupon code with the registered code after trimming whitespace and ignoring letter case.

5\. A mismatched coupon code must be rejected.

6\. An inactive coupon must be rejected.

7\. The coupon becomes valid at its start time, including the exact start timestamp.

8\. The coupon expires at its expiry timestamp, excluding the exact expiry timestamp.

9\. The order subtotal must be greater than or equal to the minimum subtotal.

10\. The discount percentage must be an integer greater than zero and no greater than 10,000 basis points.

11\. The minimum subtotal must be a non-negative safe integer.

12\. The maximum discount must either be null or a non-negative safe integer.

13\. The coupon start timestamp must be earlier than its expiry timestamp.

14\. Calculate the percentage discount using integer arithmetic:



&#x20;  `floor(subtotalKobo × discountPercentageBps ÷ 10,000)`



15\. If a maximum discount is configured, the calculated discount must not exceed that cap.

16\. The final discount must never exceed the order subtotal.

17\. The payable subtotal is the original subtotal minus the final discount.

18\. All monetary calculations must use integer kobo. No floating-point naira calculations are allowed.



\## 6. Processing Order



The function must check the inputs and coupon rules in the following order:



1\. Validate the subtotal.

2\. Validate the entered coupon code.

3\. Check whether the coupon record exists.

4\. Validate the coupon configuration.

5\. Compare the entered code with the registered code.

6\. Check whether the coupon is active.

7\. Check whether the current time is before the start time.

8\. Check whether the current time is at or after the expiry time.

9\. Check the minimum subtotal requirement.

10\. Calculate the percentage discount.

11\. Apply the maximum discount cap if configured.

12\. Ensure the discount does not exceed the subtotal.

13\. Calculate the payable subtotal.

14\. Return the successful result.



If any check fails, return its corresponding failure result immediately.



\## 7. Side Effects



The function must be pure:

\- It must not modify the coupon record.

\- It must not modify the order subtotal.

\- It must not access a database.

\- It must not make network requests.

\- It must not read the system clock directly.

\- It must not modify global application state.



\## 8. Failure Handling



Invalid inputs and coupon conditions must return structured failure results.



The function must not throw ordinary validation errors for invalid coupon usage.



Unexpected programming errors are outside the normal coupon-validation result.



\## 9. Scope Exclusions



This feature does not:

\- Create or store coupons.

\- Connect to a database.

\- Apply discounts to actual customer orders.

\- Handle payment processing.

\- Handle coupon usage limits or one-time redemption.

\- Integrate with ShopSphere API endpoints.



\## 10. Acceptance Criteria



The feature is considered correct when:

\- Valid coupons produce the correct discount.

\- Invalid coupons return the appropriate failure reason.

\- Minimum subtotal requirements are enforced.

\- Expiry and activation boundaries are handled correctly.

\- Maximum discount limits are respected.

\- Discounts never exceed the subtotal.

\- Monetary calculations remain in integer kobo.

\- The same inputs always produce the same output.

