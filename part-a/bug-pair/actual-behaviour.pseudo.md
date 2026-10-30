\# A3.1 — Actual Behaviour of the Buggy Function



\## Scenario

ShopSphere API free-delivery eligibility.



\## Function

`isEligibleForFreeDelivery(subtotalKobo)`



\## Intended Business Rule

Orders worth ₦5,000 or more qualify for free delivery.



\## Planted Bug

The comparison uses `>` instead of `>=`.



\## INPUTS

\- `subtotalKobo` (integer): The order subtotal expressed in kobo.



\## OUTPUT

\- Boolean:

&#x20; - `true` means the order qualifies for free delivery.

&#x20; - `false` means the order does not qualify.



\## SIDE EFFECTS

\- None.



\## FAILS WHEN

\- The subtotal is not a valid non-negative integer.



\## ACTUAL-BEHAVIOUR PSEUDOCODE



1\. Receive the order subtotal in kobo.

2\. Check whether the subtotal is greater than 500,000 kobo.

3\. If the subtotal is greater than 500,000:

&#x20;  - Return true.

4\. Otherwise:

&#x20;  - Return false.



\## ACTUAL BUGGY IMPLEMENTATION



```typescript

function isEligibleForFreeDelivery(subtotalKobo: number): boolean {

&#x20; return subtotalKobo > 500\_000;

}

```



\## HAND TRACE



| Subtotal | Actual result | Explanation |

|---|---|---|

| ₦4,999.99 | false | Below threshold |

| ₦5,000.00 | false | Equal to threshold, so `>` fails |

| ₦5,000.01 | true | Greater than threshold |



\## OBSERVED BUG

An order worth exactly ₦5,000 incorrectly fails the free-delivery eligibility check.



The function does not implement the stated business rule at the boundary value.

