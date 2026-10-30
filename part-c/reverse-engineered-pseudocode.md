\# Part C2 - Reverse-Engineered Pseudocode



\## Function: calculateDiscount()



\### 1. Inputs



\- `subtotalKobo`: Order subtotal represented as a safe integer in kobo.

\- `enteredCouponCode`: Coupon code supplied by the customer.

\- `coupon`: Coupon object containing the registered coupon rules, or null.

\- `currentTimeEpochMs`: Current timestamp supplied as Unix epoch milliseconds.



\### 2. Output



The function returns a structured result.



\*\*Successful result:\*\*

\- A success indicator.

\- The final discount in kobo.

\- The payable subtotal in kobo.



\*\*Failure result:\*\*

\- A failure indicator.

\- A reason describing the validation that failed.



\### 3. Actual Behaviour



1\. Receive the subtotal, entered coupon code, coupon record and current timestamp.



2\. Check whether the subtotal is a safe integer and is not negative.

&#x20;  - If invalid, return `INVALID\_SUBTOTAL`.



3\. Check whether the entered coupon code is a string containing at least one non-whitespace character.

&#x20;  - If invalid, return `INVALID\_COUPON\_CODE`.



4\. Check whether the coupon record is null.

&#x20;  - If it is null, return `COUPON\_NOT\_FOUND`.



5\. Validate the coupon configuration:

&#x20;  - The registered code must be a non-empty string after trimming.

&#x20;  - The active status must be a boolean.

&#x20;  - The discount percentage must be a safe integer greater than zero and no greater than 10,000 basis points.

&#x20;  - The minimum subtotal must be a non-negative safe integer.

&#x20;  - The maximum discount must be null or a non-negative safe integer.

&#x20;  - The start and expiry timestamps must be safe integers.

&#x20;  - The start timestamp must be earlier than the expiry timestamp.

&#x20;  - If any condition fails, return `INVALID\_COUPON\_CONFIGURATION`.



6\. Normalize the entered code and registered code by trimming whitespace and converting both to lowercase.

&#x20;  - If they are different, return `COUPON\_CODE\_MISMATCH`.



7\. Check whether the coupon is active.

&#x20;  - If it is inactive, return `COUPON\_INACTIVE`.



8\. Compare the current timestamp with the coupon start timestamp.

&#x20;  - If the current timestamp is earlier, return `COUPON\_NOT\_STARTED`.

&#x20;  - The exact start timestamp is accepted.



9\. Compare the current timestamp with the coupon expiry timestamp.

&#x20;  - If the current timestamp is equal to or later than expiry, return `COUPON\_EXPIRED`.



10\. Check whether the subtotal meets the minimum required amount.

&#x20;   - If it is below the minimum, return `MINIMUM\_SUBTOTAL\_NOT\_MET`.



11\. Calculate the percentage discount:

&#x20;   - Multiply the subtotal by the discount percentage in basis points.

&#x20;   - Divide by 10,000 using integer arithmetic.

&#x20;   - Convert the result to a whole number of kobo by rounding down.



12\. Apply the maximum discount:

&#x20;   - If no maximum discount is configured, retain the calculated discount.

&#x20;   - Otherwise, use the smaller of the calculated discount and the configured maximum.



13\. Compare the capped discount with the original subtotal.

&#x20;   - Use the smaller value to ensure the discount cannot exceed the subtotal.



14\. Subtract the final discount from the original subtotal to calculate the payable amount.



15\. Return a successful result containing the final discount and payable subtotal.



\### 4. Early Exit Behaviour



The function stops at the first failed validation. It does not continue checking the remaining coupon rules after returning a failure.



\### 5. External Calls and State Changes



\- No database calls are made.

\- No network requests are made.

\- No external services are called.

\- The function does not read the system clock.

\- The function does not modify the coupon record or global state.

\- The calculation uses the values supplied as function arguments.



\### 6. Observations



\- The function uses integer kobo rather than naira floating-point calculations.

\- It uses `BigInt` for the multiplication and division involved in calculating the percentage discount.

\- It accepts the exact coupon start timestamp.

\- It rejects the exact coupon expiry timestamp.

\- It applies the maximum discount before ensuring the discount does not exceed the subtotal.

\- A 100% discount can result in a payable subtotal of zero.

\- The current timestamp is used for date checks but is not independently validated by the implementation.

