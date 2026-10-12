import type { OpenAPIV3_1 } from '@scalar/openapi-types';
import type { ExampleObject } from '@scalar/workspace-store/schemas/v3.2/strict/example';
type SelectedResponseExample = ExampleObject & {
    value: unknown;
    provenance?: 'serialized' | 'data';
};
/**
 * Pick the example body for a response media type.
 *
 * Precedence (per the OpenAPI Media Type Object plus the `Prefer: example=`
 * directive):
 * 1. A named example explicitly requested via `exampleName`.
 * 2. The singular `example` keyword.
 * 3. The first entry of the `examples` map.
 *
 * Returns a `{ value }` wrapper when an example is available — so a `null` or
 * otherwise falsy value is still treated as a real example — or `undefined`
 * to signal that the caller should fall back to generating a body from the
 * schema. An example whose resolved `value` is `undefined` (for example, an
 * Example Object that only carries an `externalValue`) is skipped, so the
 * caller still gets a schema-generated body. An unknown `exampleName` simply
 * falls through to the later steps.
 */
export declare const selectResponseExample: <T extends Pick<OpenAPIV3_1.MediaTypeObject, "example" | "examples"> & {
    schema?: unknown;
}>(mediaType: T | undefined, exampleName?: string) => SelectedResponseExample | undefined;
export {};
//# sourceMappingURL=select-response-example.d.ts.map