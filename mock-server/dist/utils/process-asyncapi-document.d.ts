import type { AsyncApiDocument } from '@scalar/types/asyncapi/3.1';
/**
 * Processes an AsyncAPI document by bundling external references and wrapping it so internal
 * references stay intact but resolve lazily — the AsyncAPI counterpart of
 * {@link processOpenApiDocument}.
 *
 * Unlike a full dereference, the returned document keeps `$ref` nodes in place. Consumers resolve
 * them on demand with `getResolvedRef` from `@scalar/workspace-store`, which reads the `$ref-value`
 * exposed by the magic proxy. This avoids eagerly flattening (and duplicating) the whole document.
 *
 * Only AsyncAPI 3.1 is supported; 2.x documents should be upgraded before being passed in.
 *
 * @param document - The AsyncAPI document to process. Can be a string (URL/path) or an object.
 * @param origin - Source file path or URL for resolving references in an already loaded document.
 * @returns A promise that resolves to the AsyncAPI document with lazily resolvable references.
 * @throws Error if the document cannot be processed or is invalid.
 */
export declare function processAsyncApiDocument(document: string | Record<string, any> | undefined, origin?: string): Promise<AsyncApiDocument>;
/**
 * Detects whether a loaded document describes an AsyncAPI API (rather than OpenAPI/Swagger).
 * Used to route an incoming document to the right mock engine.
 */
export declare function isAsyncApiDocument(document: unknown): boolean;
//# sourceMappingURL=process-asyncapi-document.d.ts.map