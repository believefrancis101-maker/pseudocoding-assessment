\# Product Engineering Bootcamp: Pseudocoding Assessment



\## Overview



This repository contains my work for the pseudocoding assessment. It covers reading existing code and expressing its behaviour as pseudocode, specifying and implementing a new feature, and using AI-generated code as a subject for reverse engineering and comparison.



The new feature developed for Parts B and C is a standalone Coupon Engine. It calculates percentage discounts using integer kobo values and validates coupon rules before returning a result.



\## Repository Structure



```text

pseudocoding-assessment/

│

├── README.md

│

├── part-a/

│   ├── own-code/

│   │   ├── create-order.pseudo.md

│   │   ├── error-handler.pseudo.md

│   │   └── product-filter-where.pseudo.md

│   │

│   ├── open-source/

│   │   ├── is-valid-ip.pseudo.md

│   │   ├── safe-parse.pseudo.md

│   │   └── zod-object-parse.pseudo.md

│   │

│   └── bug-pair/

│       ├── actual-behaviour.pseudo.md

│       ├── intended-behaviour.pseudo.md

│       └── bug-analysis.md

│

├── part-b/

│   ├── feature-specification.md

│   ├── coupon-engine.pseudo.md

│   ├── hand-traces.md

│   └── implementation/

│       ├── package.json

│       ├── package-lock.json

│       ├── tsconfig.json

│       ├── implementation-notes.md

│       ├── src/

│       │   └── coupon-engine.ts

│       └── tests/

│           └── coupon-engine.test.ts

│

└── part-c/

&#x20;   ├── reverse-engineered-pseudocode.md

&#x20;   ├── difference-analysis.md

&#x20;   ├── comparison-results.md

&#x20;   ├── defence-script.md

&#x20;   └── ai-implementation/

&#x20;       ├── package.json

&#x20;       ├── package-lock.json

&#x20;       ├── tsconfig.json

&#x20;       ├── src/

&#x20;       │   └── coupon-engine.ts

&#x20;       └── tests/

&#x20;           ├── coupon-engine.test.ts

&#x20;           └── implementation-comparison.test.ts

```



\## Part A: Understanding Existing Code



Part A contains three pseudocode documents based on functions from my own project, three pseudocode documents based on the Zod open-source library, a source comparison, and a planted bug exercise.



The open-source library used was Zod 3.25.76, resolved in the ShopSphere API project.



The planted bug example demonstrates the difference between using `>` and `>=` for a free-delivery threshold. The intended rule is that a subtotal equal to the threshold qualifies.



\## Part B: Feature Specification and Implementation



Part B introduces a standalone Coupon Engine.



\### Main function



`calculateDiscount()`



\### Key behaviour



\- Validates subtotal and coupon input.

\- Checks coupon existence and configuration.

\- Compares coupon codes without case sensitivity.

\- Checks active status and validity dates.

\- Enforces minimum subtotal.

\- Calculates percentage discounts using basis points.

\- Applies an optional maximum discount.

\- Ensures the discount cannot exceed the subtotal.

\- Returns either a successful calculation or a defined failure reason.



All monetary calculations use integer kobo. The function is designed to be deterministic and does not access a database, network, or system clock.



\### Run Part B



From the Part B implementation directory:



```powershell

cd part-b/implementation

npm install

npm run typecheck

npm test

```



\## Part C: AI Implementation and Comparison



Part C contains a separate AI-generated implementation based on the Part B pseudocode.



The work includes:



\- AI-generated TypeScript implementation.

\- Unit tests for the AI implementation.

\- Reverse-engineered pseudocode written from the generated code.

\- Comparison of the generated implementation against the original pseudocode.

\- Comparative tests covering five baseline and five additional scenarios.



\### Run Part C



From the Part C AI implementation directory:



```powershell

cd part-c/ai-implementation

npm install

npm run typecheck

npm test

```



The comparative test file imports both implementations. Keep the repository folder structure intact when running it.



\## Verification Evidence



The recorded verification results are:



\- Part B TypeScript type checking passed.

\- Part B unit tests passed: 15 tests.

\- Part C TypeScript type checking passed.

\- Part C AI implementation unit tests passed: 15 tests.

\- Part C comparative tests passed: 10 tests.

\- Part C total: 25 tests passed, with zero failures.



See `part-b/implementation/implementation-notes.md` and `part-c/comparison-results.md` for further details.



\## AI Assistance and Disclosure



AI assistance was used during parts of this assessment, including pseudocode development, explanation of source behaviour, implementation guidance, code review, debugging, test development, and comparison.



The Part B implementation was entered and executed locally with guidance. The Part C implementation was generated with AI from the Part B pseudocode and then reviewed, reverse-engineered, and tested.



This disclosure is included to distinguish AI-assisted work from work completed without AI assistance.



\## Scope and Limitations



The Coupon Engine is a standalone assessment feature. It does not connect to the ShopSphere API or modify that project.



It does not implement coupon storage, coupon creation, authentication, payment processing, redemption limits, or database persistence.



\## Remaining Submission Evidence



The assessment also requires a short recorded explanation and feedback from a listener. These should be added or submitted separately once completed. The defence script is available in `part-c/defence-script.md`.

