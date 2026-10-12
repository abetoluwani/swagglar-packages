import { getResolvedRef, mergeSiblingReferences } from '@scalar/workspace-store/helpers/get-resolved-ref';
import { inlineCode, item, list, paragraph, strong, text } from './markdown-nodes.js';
import { renderExamples } from './render-examples.js';
/** Render response or multipart headers, whose names come from their containing map. */
export const renderHeaders = async (headers, description, schemas, openapiVersion, schemaOpenapiVersion = openapiVersion) => {
    const entries = [];
    for (const [name, reference] of Object.entries(headers ?? {})) {
        // OpenAPI reserves Content-Type for the media type map / encoding field.
        if (name.toLowerCase() === 'content-type')
            continue;
        if (!getResolvedRef(reference))
            continue;
        const header = getResolvedRef(reference, mergeSiblingReferences);
        const blocks = [
            paragraph(strong(inlineCode(name)), text(header.required ? ' (required)' : '')),
            ...(await description(header.description)),
        ];
        if ('schema' in header && header.schema !== undefined)
            blocks.push(...schemas.render(header.schema));
        if ('example' in header || 'examples' in header) {
            blocks.push(...(await renderExamples({ example: header.example, examples: header.examples }, description, 'application/json', undefined, openapiVersion, schemaOpenapiVersion)));
        }
        for (const [mediaType, content] of Object.entries('content' in header ? (header.content ?? {}) : {})) {
            blocks.push(paragraph(strong(text('Content-Type:')), text(` ${mediaType}`)));
            if (content.schema !== undefined)
                blocks.push(...schemas.render(content.schema));
            blocks.push(...(await renderExamples(content, description, mediaType, undefined, openapiVersion, schemaOpenapiVersion)));
        }
        entries.push(item(...blocks));
    }
    return entries.length ? [paragraph(strong(text('Headers:'))), list(entries)] : [];
};
/** Preserve explicit encoding settings, including false flags and part headers. */
export const renderEncoding = async (encoding, mediaType, description, schemas, openapiVersion, schemaOpenapiVersion = openapiVersion) => {
    const multipart = mediaType.startsWith('multipart/');
    if (!multipart && mediaType !== 'application/x-www-form-urlencoded')
        return [];
    const entries = [];
    for (const [name, entry] of Object.entries(encoding ?? {})) {
        const fields = [];
        for (const [key, label] of [
            ['contentType', 'Content-Type'],
            ['style', 'Style'],
            ['explode', 'Explode'],
            ['allowReserved', 'Allow reserved'],
        ]) {
            if (entry[key] !== undefined)
                fields.push(item(paragraph(text(`${label}: `), inlineCode(entry[key]))));
        }
        const blocks = [paragraph(strong(inlineCode(name)))];
        if (fields.length)
            blocks.push(list(fields));
        if (multipart)
            blocks.push(...(await renderHeaders(entry.headers, description, schemas, openapiVersion, schemaOpenapiVersion)));
        entries.push(item(...blocks));
    }
    return entries.length ? [paragraph(strong(text('Encoding:'))), list(entries)] : [];
};
const formatValue = (value) => (typeof value === 'string' ? value : (JSON.stringify(value) ?? ''));
/** Render response link expressions as literal values, without evaluating them. */
export const renderResponseLinks = async (links, description) => {
    const entries = [];
    for (const [name, reference] of Object.entries(links ?? {})) {
        if (!getResolvedRef(reference))
            continue;
        const link = getResolvedRef(reference, mergeSiblingReferences);
        const blocks = [
            paragraph(strong(text(name))),
            ...(await description(link.description)),
        ];
        if (link.operationId)
            blocks.push(paragraph(strong(text('Operation ID:')), text(' '), inlineCode(link.operationId)));
        if (link.operationRef)
            blocks.push(paragraph(strong(text('Operation reference:')), text(' '), inlineCode(link.operationRef)));
        const parameters = Object.entries(link.parameters ?? {});
        if (parameters.length)
            blocks.push(list(parameters.map(([name, value]) => item(paragraph(strong(text(`${name}:`)), text(' '), inlineCode(formatValue(value)))))));
        if (link.requestBody !== undefined)
            blocks.push(paragraph(strong(text('Request body:')), text(' '), inlineCode(formatValue(link.requestBody))));
        if (link.server)
            blocks.push(paragraph(strong(text('Server:')), text(' '), inlineCode(link.server.url)));
        entries.push(item(...blocks));
    }
    return entries.length ? [paragraph(strong(text('Links:'))), list(entries)] : [];
};
