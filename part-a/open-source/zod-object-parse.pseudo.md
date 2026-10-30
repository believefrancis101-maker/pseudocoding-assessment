\# A2.3 — Zod `ZodObject.\_parse()`



\## Library

Zod



\## Version

3.25.76



\## Source file

`node\_modules/zod/src/v3/types.ts`



\## Function

`ZodObject.\_parse(input: ParseInput)`



\## INPUTS

\- `input` (ParseInput): Contains the data being validated, its validation path and its parent parsing context.

\- The object's schema definition, accessed through the instance, determines the expected properties, unknown-key behaviour and optional catchall validator.



\## OUTPUT

\- `ParseReturnType`: A result representing the validated object, an invalid result, or a promise resolving to a parsing result when asynchronous validation is enabled.



\## SIDE EFFECTS

\- Adds validation issues to the parsing context.

\- Updates parsing status when strict unknown-key validation fails.

\- Retrieves and caches the object's schema shape and keys.

\- Invokes validators for declared properties and additional properties.



\## FAILS WHEN

\- The supplied input is not an object.

\- One or more declared properties fail validation.

\- A catchall validator rejects an additional property.

\- Strict unknown-key validation finds properties not declared in the schema.

\- The schema has an invalid unknown-key configuration, causing an internal error.



\## AI-ASSISTED PSEUDOCODE RECONSTRUCTION



1\. Receive the parsing input.



2\. Determine the parsed type of the supplied data.



3\. Check whether the parsed type is an object.

&#x20;  - If it is not an object:

&#x20;    a. Retrieve the parsing context.

&#x20;    b. Add an invalid-type issue, specifying that an object was expected.

&#x20;    c. Return an invalid parsing result immediately.



4\. Process the input parameters to obtain the current parsing status and context.



5\. Retrieve the object's schema shape and its declared property keys from the cached schema information.



6\. Create an empty list called `extraKeys` to store properties that are not declared in the schema.



7\. Check whether the object uses a catchall validator or whether unknown properties are configured to be handled differently from the default strip behaviour.



8\. If this condition is true:

&#x20;  - Loop through every property in the input object.

&#x20;  - Check whether each property exists in the declared schema keys.

&#x20;  - If it does not exist, add its name to `extraKeys`.



9\. Create an empty list called `pairs` to hold the parsing results for object properties.



10\. Loop through every declared property in the schema:

&#x20;   - Retrieve that property's validator.

&#x20;   - Retrieve the corresponding value from the input object.

&#x20;   - Run the property's validator using the input value and its property path.

&#x20;   - Add a pair containing the property name and its validation result to `pairs`.

&#x20;   - Record whether the property was originally present in the input object.



11\. Check whether a catchall validator is configured.

&#x20;   - If no catchall validator exists:

&#x20;     a. Read the unknown-key handling configuration.



&#x20;     b. If the configuration is `passthrough`:

&#x20;        - Loop through every property in `extraKeys`.

&#x20;        - Add the property and its original value to `pairs` without validating it against a declared property schema.



&#x20;     c. If the configuration is `strict`:

&#x20;        - Check whether `extraKeys` contains any properties.

&#x20;        - If it does, add an unrecognized-keys validation issue to the context.

&#x20;        - Mark the parsing status as dirty.



&#x20;     d. If the configuration is `strip`:

&#x20;        - Do not add unknown properties to the result.



&#x20;     e. If the configuration contains an unsupported value:

&#x20;        - Throw an internal error.



12\. If a catchall validator exists:

&#x20;   - Retrieve the catchall validator.

&#x20;   - Loop through every property in `extraKeys`.

&#x20;   - Retrieve each property's original value.

&#x20;   - Validate the value using the catchall validator.

&#x20;   - Add the property name and validation result to `pairs`.

&#x20;   - Record whether the property was originally present.



13\. Check whether asynchronous parsing is enabled.



14\. If asynchronous parsing is enabled:

&#x20;   - Create a resolved promise.

&#x20;   - Wait for each property's key and value parsing result.

&#x20;   - Collect the resolved pairs into a new list.

&#x20;   - Merge the resolved pairs with the current parsing status.

&#x20;   - Return the resulting promise.



15\. If asynchronous parsing is disabled:

&#x20;   - Merge the pairs with the current parsing status immediately.

&#x20;   - Return the merged parsing result.



\## IMPORTANT OBSERVATIONS

\- The function rejects non-object input before processing properties.

\- Declared properties are validated using their individual schema validators.

\- Unknown properties are handled according to the schema configuration.

\- `strip` excludes unknown properties from the output.

\- `passthrough` preserves unknown properties.

\- `strict` records an issue when unknown properties are present.

\- A catchall validator takes responsibility for validating unknown properties.

\- Asynchronous mode waits for property validation results before merging the final object.



\## AI COMPARISON NOTES

\- The reconstruction preserves the initial object-type check and early invalid return.

\- It includes the loop over declared schema properties.

\- It distinguishes the three unknown-key handling modes.

\- It includes the alternative catchall validation path.

\- It preserves the synchronous and asynchronous result-merging branches.



\## REFLECTION

This function demonstrates how a schema validator can coordinate multiple property validators to validate a complete object. It also shows how unknown properties can be handled differently depending on configuration, and how asynchronous validation changes the way parsing results are combined.

