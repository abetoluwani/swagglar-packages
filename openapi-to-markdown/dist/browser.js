import { createDocumentRenderer } from './render-document.js';
import { selectDocument } from './select-document.js';
/**
 * Convert an OpenAPI document from the workspace store to Markdown in the browser.
 * References must already be resolved by the store. This entry point does not load
 * files, fetch URLs, or migrate raw API descriptions.
 */
export const createMarkdownFromOpenApi = async (document, options) => await createDocumentRenderer()(selectDocument(document, options));
