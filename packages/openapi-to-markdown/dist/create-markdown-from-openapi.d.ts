import type { OpenApiDocument } from '@scalar/workspace-store/schemas/v3.2/strict/openapi-document';
import { type OpenApiRenderOptions } from './select-document.js';
type AnyDocument = OpenApiDocument | Record<string, unknown> | string;
/** A resolved API description that can render multiple pages without loading it again. */
export type OpenApiMarkdownRenderer = {
    render: (options?: OpenApiRenderOptions) => Promise<string>;
};
/**
 * Load and resolve an API description once, then render any number of selections.
 * Each renderer owns its document; create a new renderer to pick up source changes.
 */
export declare const createOpenApiMarkdownRenderer: (input: AnyDocument) => Promise<OpenApiMarkdownRenderer>;
/** Generate Markdown from an API description, optionally scoped to a single page. */
export declare const createMarkdownFromOpenApi: (input: AnyDocument, options?: OpenApiRenderOptions) => Promise<string>;
export {};
//# sourceMappingURL=create-markdown-from-openapi.d.ts.map