import type { OpenApiDocument } from '@scalar/workspace-store/schemas/v3.2/strict/openapi-document';
import { type OpenApiRenderOptions } from './select-document.js';
/**
 * Convert an OpenAPI document from the workspace store to Markdown in the browser.
 * References must already be resolved by the store. This entry point does not load
 * files, fetch URLs, or migrate raw API descriptions.
 */
export declare const createMarkdownFromOpenApi: (document: OpenApiDocument, options?: OpenApiRenderOptions) => Promise<string>;
//# sourceMappingURL=browser.d.ts.map