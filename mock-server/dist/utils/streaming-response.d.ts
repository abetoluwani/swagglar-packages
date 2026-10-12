import type { OpenAPIV3_2 } from '@scalar/openapi-types';
import type { Context } from 'hono';
/** A finite mock stream, with its data-model value available to custom handlers. */
type StreamingResponse = {
    body: unknown;
    chunks: string[];
    contentType: string;
};
/**
 * Build a finite response for media types with an OpenAPI 3.2 itemSchema.
 * Explicit examples describe the whole response. Generated item-only streams contain three items,
 * keeping array-valued items intact. A complete schema controls the sequence when also present.
 */
export declare const getStreamingResponse: (mediaType: (Omit<OpenAPIV3_2.MediaTypeObject, "itemSchema"> & {
    itemSchema?: OpenAPIV3_2.MediaTypeObject["itemSchema"] | boolean;
}) | undefined, contentType: string, options?: {
    exampleName?: string;
    variables?: Record<string, unknown>;
    body?: unknown;
}) => StreamingResponse | undefined;
/** Write each mocked item separately and close the stream when the finite sequence is exhausted. */
export declare const sendStreamingResponse: (c: Context, response: StreamingResponse) => Response;
export {};
//# sourceMappingURL=streaming-response.d.ts.map