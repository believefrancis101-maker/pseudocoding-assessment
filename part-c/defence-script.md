\# Part C - Short Technical Explanation



\## Introduction



For this assessment, I worked on a Coupon Engine feature that calculates discounts for customer orders using coupon codes and predefined coupon rules.



I implemented the feature in Part B using TypeScript, then used AI to generate a separate implementation from my pseudocode in Part C.



\## How the Feature Works



The function receives four inputs: the order subtotal in kobo, the coupon code, a coupon record and the current timestamp.



It validates the subtotal, coupon code and coupon configuration before checking whether the coupon is active and within its validity period.



If all checks pass, it calculates the percentage discount using basis points and integer arithmetic.



It then applies the maximum discount limit, ensures the discount does not exceed the subtotal and calculates the payable amount.



\## AI Implementation



I provided the B1 pseudocode as the basis for the AI-generated implementation.



I then reviewed the generated code and translated its actual behaviour back into pseudocode.



I compared the generated implementation against the original pseudocode and documented matching behaviour, stricter validation and an unresolved timestamp-validation ambiguity.



\## Testing and Comparison



The AI implementation passed TypeScript type checking and 15 individual automated tests.



I also compared the Part B and Part C implementations using ten identical scenarios.



Both implementations passed all ten comparison scenarios, and the complete Part C test run reported 25 passing tests.



\## Conclusion



The main lesson from this exercise is that AI-generated code still needs to be inspected and tested.



A successful compilation or passing test suite does not automatically prove correctness.



The developer must understand the requirements, inspect the implementation, identify differences and verify the actual behaviour.

