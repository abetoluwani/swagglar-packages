import { loadDocument } from './load-document.js';
import { createDocumentRenderer } from './render-document.js';
import { selectDocument } from './select-document.js';
/**
 * Load and resolve an API description once, then render any number of selections.
 * Each renderer owns its document; create a new renderer to pick up source changes.
 */
export const createOpenApiMarkdownRenderer = async (input) => {
    const content = await loadDocument(input);
    const renderDocument = createDocumentRenderer();
    const render = async (options) => await renderDocument(selectDocument(content, options));
    return { render };
};
/** Generate Markdown from an API description, optionally scoped to a single page. */
export const createMarkdownFromOpenApi = async (input, options) => {
    const renderer = await createOpenApiMarkdownRenderer(input);
    return renderer.render(options);
};
