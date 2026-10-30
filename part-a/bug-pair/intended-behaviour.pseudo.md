\# A3.2 — Intended Behaviour of the Function



\## Scenario

ShopSphere API free-delivery eligibility.



\## Function

`isEligibleForFreeDelivery(subtotalKobo)`



\## Business Rule

Orders worth ₦5,000 or more qualify for free delivery.



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



\## INTENDED-BEHAVIOUR PSEUDOCODE



1\. Receive the order subtotal in kobo.

2\. Check whether the subtotal is greater than or equal to 500,000 kobo.

3\. If the subtotal is greater than or equal to 500,000:

&#x20;  - Return true.

4\. Otherwise:

&#x20;  - Return false.



\## CORRECT IMPLEMENTATION



```typescript

function isEligibleForFreeDelivery(subtotalKobo: number): boolean {

&#x20; return subtotalKobo >= 500\_000;

}

```



\## HAND TRACE



| Subtotal | Expected result | Explanation |

|---|---|---|

| ₦4,999.99 | false | Below threshold |

| ₦5,000.00 | true | Exactly meets threshold |

| ₦5,000.01 | true | Above threshold |



\## EXPECTED BEHAVIOUR

Every valid order with a subtotal of at least ₦5,000 should qualify for free delivery.

