import type { OpenAPIV3_1 } from '@scalar/openapi-types';
type Schema = NonNullable<OpenAPIV3_1.ComponentsObject['schemas']>[string];
/**
 * Serializes a mocked response body for the negotiated media type.
 *
 * Returns `undefined` for an `undefined` body, mirroring `JSON.stringify`, so the caller can send an
 * empty body rather than the characters `undefined`.
 */
export declare const serializeResponseBody: (body: unknown, contentType: string | undefined, schema?: Schema, provenance?: "data" | "serialized") => string | undefined;
export {};
//# sourceMappingURL=serialize-response-body.d.ts.map