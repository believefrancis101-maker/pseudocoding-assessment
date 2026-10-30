\# Function: errorHandler



\## Purpose



Handle application errors in Express and return a consistent JSON error response with the appropriate HTTP status code.



\## Inputs



\- `err`: An unknown error value received by the middleware.

\- `req`: The Express request object. It is unused by this handler.

\- `res`: The Express response object used to send the HTTP response.

\- `next`: The Express next-function parameter. It is unused by this handler.



\## Output



An HTTP response containing a JSON error envelope.



Possible outcomes include:

\- The status, code and message from a recognised API error.

\- HTTP 400 for malformed JSON.

\- HTTP 413 for an oversized request body.

\- HTTP 500 for any other unexpected error.



\## Side effects



\- Writes unexpected errors to the server-side console.

\- Sends an HTTP response to the client.



\## Fails when



The function defines no explicit recovery branch if sending the HTTP response itself fails. It does not pass errors to the next middleware.



\## Pseudocode



1\. Receive the error and the Express request, response and next-function parameters.



2\. Check whether the error is a recognised API error using `isApiError`.



3\. If it is a recognised API error:

&#x20;  - Create an error envelope containing the error's code and message.

&#x20;  - Set the HTTP status to the error's own status.

&#x20;  - Send the envelope as a JSON response.

&#x20;  - Stop processing this error.



4\. Otherwise, check whether the error is a body-parser error whose type is `entity.parse.failed`.



5\. If it is a malformed JSON error:

&#x20;  - Set the HTTP status to 400.

&#x20;  - Send an error envelope with code `INVALID\_JSON` and message `Request body is not valid JSON`.

&#x20;  - Stop processing this error.



6\. Otherwise, check whether the error is a body-parser error whose type is `entity.too.large`.



7\. If the request body is too large:

&#x20;  - Set the HTTP status to 413.

&#x20;  - Send an error envelope with code `PAYLOAD\_TOO\_LARGE` and message `Request body exceeds the size limit`.

&#x20;  - Stop processing this error.



8\. If none of the previous conditions matched:

&#x20;  - Log the unexpected error on the server using the error-handling log prefix.

&#x20;  - Create an error envelope with code `INTERNAL\_ERROR` and message `Internal server error`.

&#x20;  - Set the HTTP status to 500.

&#x20;  - Send the generic error envelope as a JSON response.



\## Hand Traces



\### Test 1: Recognised API error



Input example:



An API error with status 404, code `NOT\_FOUND`, and message `Product not found`.



Execution:

1\. `isApiError` recognises the error.

2\. The handler creates an envelope using the supplied code and message.

3\. It sends HTTP 404 with the error envelope.

4\. It returns without checking the remaining branches.



Expected response:



HTTP 404



`{ error: { code: "NOT\_FOUND", message: "Product not found" } }`



\### Test 2: Malformed JSON



Input example:



A body-parser error with type `entity.parse.failed`.



Execution:

1\. The error is not handled by the API-error branch.

2\. The malformed JSON condition matches.

3\. The handler sends HTTP 400 with code `INVALID\_JSON`.

4\. It returns without checking later branches.



Expected response:



HTTP 400



`{ error: { code: "INVALID\_JSON", message: "Request body is not valid JSON" } }`



\### Test 3: Oversized request body



Input example:



A body-parser error with type `entity.too.large`.



Execution:

1\. The API-error branch does not match.

2\. The malformed JSON condition does not match.

3\. The oversized-body condition matches.

4\. The handler sends HTTP 413 with code `PAYLOAD\_TOO\_LARGE`.

5\. It returns.



Expected response:



HTTP 413



`{ error: { code: "PAYLOAD\_TOO\_LARGE", message: "Request body exceeds the size limit" } }`



\### Test 4: Unexpected error



Input example:



An ordinary error that is neither a recognised API error nor a matching body-parser error.



Execution:

1\. The API-error branch does not match.

2\. The malformed JSON branch does not match.

3\. The oversized-body branch does not match.

4\. The handler logs the error server-side.

5\. It sends HTTP 500 with the generic error envelope.



Expected response:



HTTP 500



`{ error: { code: "INTERNAL\_ERROR", message: "Internal server error" } }`



\## Important Security Detail



The fallback response does not expose the original unexpected error message or stack trace to the client. Those details are logged server-side, while the client receives a generic message.

