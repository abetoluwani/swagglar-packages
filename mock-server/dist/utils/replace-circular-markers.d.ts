/**
 * Replace the `'[circular]'` markers `getResolvedRefDeep` leaves in schema positions with an empty
 * (always-valid) schema.
 *
 * A recursive schema — a `Node` whose `child` is another `Node` — resolves to a document where the
 * recursion point is the *string* `'[circular]'`. Ajv rejects the whole schema for it
 * (`data/properties/child must be object,boolean`), so a single recursive type silently disabled
 * validation of the request body, or of every parameter in the same location. Accepting anything at
 * the point where the cycle was cut keeps the rest of the schema enforceable.
 *
 * The rewrite only ever loosens what is enforced, so it can lose a violation but never invent one.
 * That is why relaxing is tracked as it goes: under `not`, `if`, `oneOf` or `contains` a looser
 * subschema would make the schema *stricter*, so those keywords are dropped rather than rewritten,
 * and a sibling `unevaluatedProperties`/`unevaluatedItems` goes with a relaxed in-place applicator
 * for the same reason.
 *
 * Only known schema positions are rewritten. A marker anywhere else — `enum`, `const`, `default`,
 * `example`, or a vendor extension — is data rather than a schema Ajv compiles, so it is copied
 * through untouched.
 */
export declare const replaceCircularMarkers: (schema: unknown) => unknown;
//# sourceMappingURL=replace-circular-markers.d.ts.map