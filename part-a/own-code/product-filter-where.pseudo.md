# Function: productFilterWhere

## Purpose

Build a Prisma database filter object from validated product price and stock filters.

## Inputs

- `filters`: A validated `ProductFilters` object.
- `filters.minPrice`: Optional non-negative integer string representing a price in kobo.
- `filters.maxPrice`: Optional non-negative integer string representing a price in kobo.
- `filters.inStock`: Optional string containing `"true"`, `"false"`, `"1"`, or `"0"`.

## Output

A Prisma-compatible filter object containing the applicable price and stock conditions.

## Side effects

None. The function constructs and returns an object without modifying the database.

## Fails when

The function defines no explicit failure conditions for valid inputs. It relies on upstream validation to reject invalid price strings, unsupported stock values, and a minimum price greater than the maximum price.

## Pseudocode

1. Receive the validated filter object.

2. Create a price-range object:
   - If `minPrice` is not undefined, convert it to a number and add it as the inclusive lower price bound, called `gte`.
   - If `maxPrice` is not undefined, convert it to a number and add it as the inclusive upper price bound, called `lte`.

3. Create the result object:
   - If either price bound was provided, include the price-range object under `priceMinor`.
   - If neither price bound was provided, omit `priceMinor`.

4. If `inStock` is undefined, omit the stock condition.

5. Otherwise, if `inStock` is `"true"` or `"1"`, add a stock condition requiring stock to be greater than zero.

6. Otherwise, add a stock condition requiring stock to be less than or equal to zero. This branch handles `"false"` and `"0"` because validation restricts the value to the four allowed strings.

7. Return the result object.

## Hand Traces

### Test 1: No filters

Input:

`filters = {}`

Steps:
1. No price bounds are provided.
2. No stock filter is provided.
3. Return an empty object.

Expected output:

`{}`

### Test 2: Both price bounds and in-stock filter

Input:

`filters = { minPrice: "5000000", maxPrice: "10000000", inStock: "true" }`

Steps:
1. Convert the minimum price to 5000000.
2. Convert the maximum price to 10000000.
3. Include both bounds under `priceMinor`.
4. Add a stock condition requiring stock to be greater than zero.
5. Return the combined conditions.

Expected output:

`{ priceMinor: { gte: 5000000, lte: 10000000 }, stock: { gt: 0 } }`

### Test 3: Out-of-stock filter only

Input:

`filters = { inStock: "false" }`

Steps:
1. No price bounds are provided.
2. Add a stock condition requiring stock to be less than or equal to zero.
3. Return the conditions.

Expected output:

`{ stock: { lte: 0 } }`

## Scope and Validation

This function only builds database conditions. The separate `productFilterSchema` validates the input formats and allowed stock values. The separate `enforcePriceRange` refinement rejects a minimum price greater than the maximum price. Those checks must not be attributed to this function itself.