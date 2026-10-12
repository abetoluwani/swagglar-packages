import type { OpenAPIV3_1, OpenAPIV3_2 } from '@scalar/openapi-types';
/**
 * Processes an OpenAPI document by bundling external references, upgrading compatible input to OpenAPI 3.2,
 * and wrapping it so internal references stay intact but resolve lazily.
 *
 * Unlike a full dereference, the returned document keeps `$ref` nodes in place. Consumers
 * resolve them on demand with `getResolvedRef` from `@scalar/workspace-store`, which reads the
 * `$ref-value` exposed by the magic proxy. This avoids eagerly flattening (and duplicating)
 * the whole document up front.
 *
 * Compatibility failures retain the OpenAPI 3.1 document and its version, without applying partial migrations.
 *
 * @param document - The OpenAPI document to process. Can be a string (URL/path) or an object.
 * @param origin - Source file path or URL for resolving references in an already loaded document.
 * @returns A promise that resolves to the document with lazily resolvable references.
 * @throws Error if the document cannot be processed or is invalid.
 */
export declare function processOpenApiDocument(document: string | Record<string, any> | undefined, origin?: string): Promise<OpenAPIV3_1.Document | OpenAPIV3_2.Document>;
//# sourceMappingURL=process-openapi-document.d.ts.map