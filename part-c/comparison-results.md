\# Part C: Comparative Testing Results



\## Objective



Compare the Part B implementation, written from the feature pseudocode, with the Part C AI-generated implementation.



Both implementations were run against the same 10 scenarios. The first five are the baseline scenarios used in Part B, while the remaining five provide additional coverage.



\## Test Results



| No. | Scenario | Expected result | Part B | Part C |

|---:|---|---|---|---|

| 1 | Valid 10% discount | Successful discount | PASS | PASS |

| 2 | Subtotal below minimum | `MINIMUM\_SUBTOTAL\_NOT\_MET` | PASS | PASS |

| 3 | Maximum discount cap | Discount limited by cap | PASS | PASS |

| 4 | Expired coupon | `COUPON\_EXPIRED` | PASS | PASS |

| 5 | Mismatched coupon code | `COUPON\_CODE\_MISMATCH` | PASS | PASS |

| 6 | Exact minimum subtotal | Successful discount | PASS | PASS |

| 7 | Whitespace around coupon code | Successful normalized comparison | PASS | PASS |

| 8 | Zero maximum discount | Zero discount | PASS | PASS |

| 9 | Full 100% discount | Zero payable subtotal | PASS | PASS |

| 10 | Invalid coupon timestamp configuration | `INVALID\_COUPON\_CONFIGURATION` | PASS | PASS |



\## Automated Test Results



The following commands were executed in the Part C AI implementation workspace:



```powershell

npm run typecheck

npm test

```



Results:



\- TypeScript type checking: passed.

\- AI implementation unit tests: 15 passed.

\- Comparative tests: 10 passed.

\- Total tests: 25 passed.

\- Failed tests: 0.



\## Observations



1\. Both implementations produced the expected results for all 10 comparative scenarios.

2\. Both handled coupon code normalization consistently.

3\. Both respected the inclusive start-time and exclusive expiry-time boundaries.

4\. Both applied the maximum discount cap correctly.

5\. Neither implementation allowed the discount to exceed the subtotal.

6\. Both used integer arithmetic for discount calculations.



\## Conclusion



The two implementations behaved consistently across the 10 comparative scenarios.



Passing tests does not prove that every possible input is correct. It provides evidence for the tested cases. The source comparison and reverse-engineering exercise were also necessary to identify implementation details and ambiguities that tests alone might not reveal.# Part C: Comparative Testing Results



\## Objective



Compare the Part B implementation, written from the feature pseudocode, with the Part C AI-generated implementation.



Both implementations were run against the same 10 scenarios. The first five are the baseline scenarios used in Part B, while the remaining five provide additional coverage.



\## Test Results



| No. | Scenario | Expected result | Part B | Part C |

|---:|---|---|---|---|

| 1 | Valid 10% discount | Successful discount | PASS | PASS |

| 2 | Subtotal below minimum | `MINIMUM\_SUBTOTAL\_NOT\_MET` | PASS | PASS |

| 3 | Maximum discount cap | Discount limited by cap | PASS | PASS |

| 4 | Expired coupon | `COUPON\_EXPIRED` | PASS | PASS |

| 5 | Mismatched coupon code | `COUPON\_CODE\_MISMATCH` | PASS | PASS |

| 6 | Exact minimum subtotal | Successful discount | PASS | PASS |

| 7 | Whitespace around coupon code | Successful normalized comparison | PASS | PASS |

| 8 | Zero maximum discount | Zero discount | PASS | PASS |

| 9 | Full 100% discount | Zero payable subtotal | PASS | PASS |

| 10 | Invalid coupon timestamp configuration | `INVALID\_COUPON\_CONFIGURATION` | PASS | PASS |



\## Automated Test Results



The following commands were executed in the Part C AI implementation workspace:



```powershell

npm run typecheck

npm test

```



Results:



\- TypeScript type checking: passed.

\- AI implementation unit tests: 15 passed.

\- Comparative tests: 10 passed.

\- Total tests: 25 passed.

\- Failed tests: 0.



\## Observations



1\. Both implementations produced the expected results for all 10 comparative scenarios.

2\. Both handled coupon code normalization consistently.

3\. Both respected the inclusive start-time and exclusive expiry-time boundaries.

4\. Both applied the maximum discount cap correctly.

5\. Neither implementation allowed the discount to exceed the subtotal.

6\. Both used integer arithmetic for discount calculations.



\## Conclusion



The two implementations behaved consistently across the 10 comparative scenarios.



Passing tests does not prove that every possible input is correct. It provides evidence for the tested cases. The source comparison and reverse-engineering exercise were also necessary to identify implementation details and ambiguities that tests alone might not reveal.

