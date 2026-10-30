\# Function: createOrder



\## Source



`src/routes/orders.ts` — `POST /`



\## Purpose



Validate a new order request, verify that its customer and products exist, create the order and its items in a database transaction, calculate the total, and return the created order.



\## Inputs



\- `req.body`: An object containing:

&#x20; - `customerId`: A valid customer UUID.

&#x20; - `items`: An array containing at least one item and no more than the configured maximum.

&#x20; - Each item contains a valid `productId` UUID and an integer `quantity` within the configured minimum and maximum.

\- `res`: The Express response object.

\- Database records: The customer and products referenced by the request.



\## Output



On success:

\- HTTP status `201 Created`.

\- A `Location` header pointing to `/api/v1/orders/{new order ID}`.

\- A JSON response containing the created order, its items, and `totalMinor`.



On failure:

\- An API error for invalid request data or missing customer/product records.

\- Unexpected errors are passed through the asynchronous error-handling mechanism.



\## Side effects



\- Reads customer and product records from the database.

\- Creates one order record and multiple order-item records inside a database transaction.

\- Sends an HTTP response.



\## Fails when



\- The request body does not match the strict order schema.

\- The customer UUID does not refer to an existing customer.

\- One or more requested product UUIDs do not refer to existing products.

\- A database operation fails.

\- An unexpected error occurs during processing.



Validation errors and missing customer/product records produce HTTP 422 responses. Unexpected errors are handled by the application's error-handling middleware.



\## Pseudocode



1\. Receive the HTTP request and response objects.



2\. Validate the request body against the strict order-creation schema.

&#x20;  - Require a valid customer UUID.

&#x20;  - Require an items array with at least one item.

&#x20;  - Enforce the configured maximum number of items.

&#x20;  - For each item, require a valid product UUID and an integer quantity within the configured limits.

&#x20;  - Reject unknown fields.

&#x20;  - Reject duplicate product IDs.



3\. If validation fails:

&#x20;  - Take the first validation issue.

&#x20;  - Determine the field associated with that issue.

&#x20;  - Create an API error with status 422, code `UNPROCESSABLE\_ENTITY`, and a message identifying the field and problem.

&#x20;  - Stop processing the request.



4\. Extract the validated customer ID and items from the parsed request body.



5\. Look up the customer by ID, selecting only its ID.



6\. If the customer does not exist:

&#x20;  - Raise an API error with status 422 and code `UNPROCESSABLE\_ENTITY`.

&#x20;  - Use a message identifying `customerId` and stating that the customer does not exist.

&#x20;  - Stop processing the request.



7\. Extract all product IDs from the validated items array.



8\. Look up the requested products, selecting each product's ID and price in minor currency units.



9\. Compare the number of products found with the number of requested product IDs.

&#x20;  - If the counts differ, identify the first requested item whose product was not found.

&#x20;  - Raise an API error with status 422 and code `UNPROCESSABLE\_ENTITY`.

&#x20;  - Use a message identifying that item's `productId` and stating that the product does not exist.

&#x20;  - Stop processing the request.



10\. Start a database transaction.



11\. Inside the transaction, create a new order:

&#x20;   - Associate it with the validated customer ID.

&#x20;   - Set its initial status to `pending`.



12\. For every requested item:

&#x20;   - Find the corresponding product in the previously retrieved product records.

&#x20;   - Create an order-item input containing the new order ID, product ID, requested quantity, and the product's current database price.

&#x20;   - Use that database price as the order item's unit-price snapshot.



13\. Create all order items together using the transaction.



14\. Retrieve the created order items, selecting their IDs, product IDs, quantities, and unit prices.

&#x20;   - Sort the items by ID in ascending order.



15\. Calculate the order total by adding the quantity multiplied by the unit price for every retrieved item.



16\. Build the result object containing the order details, items, and calculated `totalMinor`.



17\. Return the result from the transaction.

&#x20;   - If an operation inside the transaction fails, the transaction does not commit its partial order and item changes.



18\. After the transaction succeeds:

&#x20;   - Set the `Location` response header to `/api/v1/orders/{new order ID}`.

&#x20;   - Set the HTTP status to 201.

&#x20;   - Send the result in the standard item-response envelope.



\## Hand Traces



\### Test 1: Valid order



Input:

\- Existing customer.

\- One existing product priced at 2,000 kobo.

\- Quantity: 3.



Execution:

1\. Validate the request successfully.

2\. Find the customer.

3\. Find the product and retrieve its database price.

4\. Start the transaction.

5\. Create a pending order.

6\. Create one order item with quantity 3 and unit price 2,000 kobo.

7\. Calculate the total: 3 × 2,000 = 6,000 kobo.

8\. Commit the transaction.

9\. Return HTTP 201 and the created order.



Expected result:

\- HTTP status: `201`

\- `totalMinor`: `6000`

\- One order item with quantity `3`.



\### Test 2: Invalid quantity



Input:

\- Existing customer.

\- Existing product.

\- Quantity: `0`.



Execution:

1\. Validate the request body.

2\. Reject the item because quantity must be at least 1.

3\. Raise an API error with status 422.

4\. Do not perform the customer/product lookups or create the order.



Expected result:

\- HTTP status: `422`

\- Error code: `UNPROCESSABLE\_ENTITY`

\- No new order or order items.



\### Test 3: Customer does not exist



Input:

\- Validly formatted customer UUID that has no matching database record.

\- Otherwise valid item data.



Execution:

1\. Validate the request body successfully.

2\. Look up the customer.

3\. Find no matching customer.

4\. Raise the customer-related API error.

5\. Stop before product lookup and order creation.



Expected result:

\- HTTP status: `422`

\- Error message identifies `customerId`.

\- No new order or order items.



\### Test 4: Product does not exist



Input:

\- Existing customer.

\- Validly formatted product UUID with no matching database record.

\- Valid quantity.



Execution:

1\. Validate the request successfully.

2\. Find the customer.

3\. Query the requested products.

4\. Detect that at least one requested product is missing.

5\. Identify the first missing product's index.

6\. Raise the product-related API error.

7\. Stop before starting the transaction.



Expected result:

\- HTTP status: `422`

\- Error message identifies the missing item's `productId`.

\- No new order or order items.



\### Test 5: Transaction fails during item creation



Input:

\- Existing customer.

\- Existing product.

\- Valid quantity.

\- A database failure occurs during the transaction's order-item creation.



Execution:

1\. Validate the request successfully.

2\. Find the customer and product.

3\. Start the transaction.

4\. Create the pending order inside the transaction.

5\. Attempt to create the order items.

6\. The database operation fails.

7\. The transaction rolls back its uncommitted order and item changes.

8\. The unexpected error propagates to the application's error-handling mechanism.



Expected result:

\- No partially committed order or order items from the failed transaction.

\- The client receives the error response determined by the application's error-handling middleware.



\## Important Design Observations



\- Customer and product existence checks occur before the transaction.

\- The order and its items are created within the same transaction.

\- The unit price is taken from the database product record, not supplied by the client.

\- The order total is calculated from the created items and their saved unit-price snapshots.

\- The total is expressed in minor currency units, such as kobo.

\- The handler does not explicitly calculate the total before creating the order items.



