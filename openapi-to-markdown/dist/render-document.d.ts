import type { OpenApiDocument } from '@scalar/workspace-store/schemas/v3.2/strict/openapi-document';
/** Build Markdown directly, retaining caches only for this immutable document snapshot. */
export declare const createDocumentRenderer: () => ((document: OpenApiDocument) => Promise<string>);
//# sourceMappingURL=render-document.d.ts.map