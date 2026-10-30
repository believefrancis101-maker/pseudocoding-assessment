\# A3.3 — Planted Bug Analysis



\## Bug Classification

Off-by-one / boundary-condition error.



\## Location

The comparison operator in `isEligibleForFreeDelivery()`.



\## Actual Code

`subtotalKobo > 500\_000`



\## Intended Code

`subtotalKobo >= 500\_000`



\## Root Cause

The implementation checks whether the subtotal is strictly greater than the threshold instead of checking whether it is greater than or equal to the threshold.



The business requirement includes orders exactly equal to ₦5,000, but the implementation excludes them.



\## Impact

Customers whose order subtotal is exactly ₦5,000 are incorrectly denied free delivery and may be charged a delivery fee.



\## How the Bug Was Identified

Boundary-value testing revealed that the actual and intended implementations produce different results when the subtotal is exactly 500,000 kobo.



\## Test Comparison



| Test | Input (kobo) | Buggy result | Intended result |

|---|---:|---|---|

| Below boundary | 499,999 | false | false |

| Exact boundary | 500,000 | false | true |

| Above boundary | 500,001 | true | true |



\## Fix

Replace the strict greater-than operator (`>`) with the greater-than-or-equal operator (`>=`).



\## Lesson

Boundary conditions must be tested explicitly. A function can behave correctly for values below and above a threshold while still failing at the exact threshold.

