/** Where a value sits in an OpenAPI description: a schema, a map of schemas, or anything else. */
export type SchemaPosition = 'document' | 'schema' | 'map';
/**
 * Returns the position of the value stored under `key`, or `undefined` when that value
 * is not part of the schema tree, such as example payloads and schema metadata.
 */
export declare const getChildPosition: (position: SchemaPosition, key: string) => SchemaPosition | undefined;
/**
 * The workspace schema currently casts boolean JSON Schemas into empty objects.
 * Restore them only in schema positions, never in example payloads or metadata.
 * TODO: Remove this bridge when the shared schema accepts boolean JSON Schemas.
 */
export declare const restoreBooleanSchemas: (source: unknown, target: unknown, position?: SchemaPosition) => void;
//# sourceMappingURL=restore-boolean-schemas.d.ts.map