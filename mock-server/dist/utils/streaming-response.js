import { getStreamFormat } from '@scalar/helpers/http/is-streaming-content-type';
import { getResolvedRefDeep } from '@scalar/workspace-store/helpers/get-resolved-ref-deep';
import { serializeStreamExample } from '@scalar/workspace-store/helpers/serialize-stream-example';
import { coerceValue } from '@scalar/workspace-store/schemas/typebox-coerce';
import { SchemaObjectSchema } from '@scalar/workspace-store/schemas/v3.2/strict/openapi-document';
import { stream } from 'hono/streaming';
import { generateResponseExample } from './generate-response-example.js';
import { selectResponseExample } from './select-response-example.js';
/**
 * Build a finite response for media types with an OpenAPI 3.2 itemSchema.
 * Explicit examples describe the whole response. Generated item-only streams contain three items,
 * keeping array-valued items intact. A complete schema controls the sequence when also present.
 */
export const getStreamingResponse = (mediaType, contentType, options = {}) => {
    if (mediaType?.itemSchema === undefined) {
        return undefined;
    }
    const format = getStreamFormat(contentType);
    if (format === undefined || format === 'multipart') {
        return undefined;
    }
    const example = options.body !== undefined ? { value: options.body } : selectResponseExample(mediaType, options.exampleName);
    if (example && typeof example.value === 'string') {
        return { body: example.value, chunks: [example.value], contentType };
    }
    const itemSchema = typeof mediaType.itemSchema === 'boolean' ? mediaType.itemSchema : getResolvedRefDeep(mediaType.itemSchema);
    const completeSchema = typeof mediaType.schema === 'boolean' ? mediaType.schema : getResolvedRefDeep(mediaType.schema);
    const generateBody = () => {
        if (itemSchema === false || completeSchema === false) {
            return [];
        }
        if (completeSchema === undefined) {
            return Array.from({ length: 3 }, () => itemSchema === true
                ? null
                : generateResponseExample(coerceValue(SchemaObjectSchema, itemSchema), options.variables));
        }
        if (typeof completeSchema === 'object' && 'type' in completeSchema && completeSchema.type === 'array') {
            return generateResponseExample(coerceValue(SchemaObjectSchema, {
                ...completeSchema,
                items: ('items' in completeSchema ? completeSchema.items : undefined) ?? itemSchema,
            }), options.variables);
        }
        return generateResponseExample(coerceValue(SchemaObjectSchema, completeSchema), options.variables);
    };
    const body = example ? example.value : generateBody();
    const items = body === undefined ? [] : Array.isArray(body) ? body : [body];
    const chunks = items
        .filter((item) => item !== undefined)
        .map((item) => serializeStreamExample(item, contentType, true) ?? '');
    return { body, chunks, contentType };
};
/** Write each mocked item separately and close the stream when the finite sequence is exhausted. */
export const sendStreamingResponse = (c, response) => {
    c.header('Content-Type', response.contentType);
    c.header('Cache-Control', 'no-cache');
    c.header('X-Accel-Buffering', 'no');
    return stream(c, async (writer) => {
        for (const chunk of response.chunks) {
            if (writer.aborted) {
                break;
            }
            await writer.write(chunk);
        }
    });
};
