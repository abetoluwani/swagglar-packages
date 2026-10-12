/**
 * Helpers for turning string-encoded request parameters back into the structured values that JSON
 * Schema validation expects, following the OpenAPI `style`/`explode` serialization rules.
 *
 * @see https://spec.openapis.org/oas/v3.1.1.html#style-values
 */
/** OpenAPI parameter location, which determines the default serialization style. */
export type ParameterLocation = 'path' | 'query' | 'header' | 'cookie';
/**
 * Resolve the effective `style` and `explode` for a parameter, applying the OpenAPI defaults.
 *
 * `explode` defaults to `true` only for the `form` style and `false` for every other style, so the
 * default depends on the resolved style rather than the location alone.
 */
export declare const resolveSerialization: (location: ParameterLocation, style?: string, explode?: boolean) => {
    style: string;
    explode: boolean;
};
/** Whether a resolved schema describes an array, including the OpenAPI 3.1 `type: ['array', 'null']` form. */
export declare const isArraySchema: (schema: Record<string, unknown> | undefined) => boolean;
/** Whether a resolved schema describes an object, including the OpenAPI 3.1 `type: ['object', 'null']` form. */
export declare const isObjectSchema: (schema: Record<string, unknown> | undefined) => boolean;
/**
 * Collect the declared property names of an object schema, looking through `anyOf`/`oneOf`/`allOf`.
 *
 * `isObjectSchema` unwraps composed schemas (for example an optional object written as
 * `anyOf: [{ type: 'object', properties: {…} }, { type: 'null' }]`), so property extraction has to do the
 * same. Otherwise the names live on a subschema, the top level looks empty, and exploded `form` objects
 * fall back to free-form gathering — claiming unrelated keys and failing `additionalProperties: false`.
 */
export declare const getObjectPropertyNames: (schema: Record<string, unknown> | undefined) => string[];
/**
 * Deserialize a string-encoded array parameter into its elements.
 *
 * Returns `undefined` when the parameter is absent so the caller can enforce `required` separately.
 * Object parameters (`deepObject`, simple/form objects) are not handled yet and are validated as-is.
 */
export declare const deserializeArrayParameter: ({ style, explode, single, multi, }: {
    style: string;
    explode: boolean;
    /** The single, joined value (for example `1,2,3`) as read from path, query, header, or cookie */
    single: string | undefined;
    /** Every repeated value (query only, for example `?id=1&id=2` becomes `['1', '2']`) */
    multi?: string[] | undefined;
}) => string[] | undefined;
/**
 * Deserialize a string-encoded object parameter into its properties, following the OpenAPI
 * `style`/`explode` rules. Property values stay as strings so the caller can coerce them against the
 * object's property schemas.
 *
 * Returns `undefined` when the parameter is absent so the caller can enforce `required` separately.
 * Property values are strings, except for repeated query keys (an array-valued property such as
 * `filter[tags]=a&filter[tags]=b`), which stay as a string array.
 */
export declare const deserializeObjectParameter: ({ style, explode, single, map, name, propertyNames, reservedKeys, }: {
    style: string;
    explode: boolean;
    /** The single value (for example `R,100,G,200`) as read from path, query, header, or cookie */
    single: string | undefined;
    /**
     * The full key/value map for the location, needed for `deepObject` (query only) and exploded `form`
     * objects (query top-level keys, or one cookie per property). A key with repeated query values carries
     * a string array so array-valued object properties survive deserialization.
     */
    map?: Record<string, string | string[]> | undefined;
    name: string;
    /** Declared object property names, used to gather exploded `form` objects from the location map */
    propertyNames?: string[] | undefined;
    /**
     * Names of the other parameters declared in the same location. A free-form exploded object (no declared
     * properties) claims the remaining keys, so these are excluded to avoid swallowing a sibling parameter's
     * value (for example a required free-form `meta` must not be satisfied by a `limit` query key).
     */
    reservedKeys?: Set<string> | undefined;
}) => Record<string, string | string[]> | undefined;
//# sourceMappingURL=deserialize-parameter.d.ts.map