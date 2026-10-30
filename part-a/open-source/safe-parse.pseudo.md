\# A2.2 — Zod `safeParse()`



\## Library

Zod



\## Version

3.25.76



\## Source file

`node\_modules/zod/src/v3/types.ts`



\## Function

`safeParse(data: unknown, params?: util.InexactPartial<ParseParams>)`



\## INPUTS

\- `data` (unknown): The value to validate against the Zod schema.

\- `params` (optional ParseParams): Optional parsing configuration, including asynchronous mode, validation path and custom error map.



\## OUTPUT

\- `SafeParseReturnType<Input, Output>`:

&#x20; - A success result containing validated data.

&#x20; - A failure result containing a Zod validation error.



\## SIDE EFFECTS

\- Creates and populates a parsing context.

\- Runs the schema's internal parsing operation.

\- Collects validation issues when validation fails.

\- Does not directly modify the original input.



\## FAILS WHEN

\- The input does not satisfy the schema, producing a failure result.

\- Internal parsing encounters an unexpected error.

\- Synchronous parsing is attempted on a schema operation that requires asynchronous parsing, which can cause an error.



\## AI-ASSISTED PSEUDOCODE RECONSTRUCTION



1\. Receive the input data and optional parsing parameters.

2\. Create a new parsing context.

3\. Initialise the context's common information.

4\. Create an empty list to collect validation issues.

5\. Set asynchronous mode using the supplied parameter, or default to false.

6\. Store the optional contextual error map.

7\. Set the validation path to the supplied path, or an empty list.

8\. Store the schema's configured error map.

9\. Set the parent context to null.

10\. Store the original input data.

11\. Determine the parsed type of the input.

12\. Call the internal synchronous parsing method using the input, validation path and parsing context.

13\. Pass the parsing context and parsing result to `handleResult()`.

14\. Return the result produced by `handleResult()`.



\## IMPORTANT OBSERVATIONS

\- The function uses synchronous parsing through `\_parseSync()`.

\- The default asynchronous setting is false.

\- Validation errors are represented in the returned result rather than normally being thrown directly by `safeParse()`.

\- `handleResult()` determines the final success or failure result.



\## AI COMPARISON NOTES

\- The reconstruction includes parsing-context initialisation.

\- The reconstruction preserves the synchronous parsing call.

\- The reconstruction includes the final result-handling operation.

\- The reconstruction identifies the optional parsing configuration.



\## REFLECTION

`safeParse()` separates validation success from validation failure by returning a structured result. This allows application code to inspect validation outcomes without relying on exceptions for ordinary invalid input.

