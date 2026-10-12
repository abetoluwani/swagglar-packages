import { getResolvedRef } from '@scalar/workspace-store/helpers/get-resolved-ref';
import { getResolvedRefDeep } from '@scalar/workspace-store/helpers/get-resolved-ref-deep';
import { accepts } from 'hono/accepts';
import { store } from '../libs/store.js';
import { generateResponseExample } from './generate-response-example.js';
import { normalizeResponseBody } from './normalize-response-body.js';
import { parsePreferHeader } from './parse-prefer-header.js';
import { pathParameters } from './path-parameters.js';
import { findQuerystringParameter, parseQuerystringParameter } from './querystring-parameter.js';
import { createStoreWrapper } from './store-wrapper.js';
import { getStreamingResponse } from './streaming-response.js';
/**
 * Get example response from OpenAPI spec for a given status code.
 * Returns the example value if found, or null if not available.
 */
function getExampleFromResponse(c, statusCode, responses) {
    if (!responses) {
        return null;
    }
    const response = getResolvedRef(responses[statusCode] || responses.default);
    if (!response) {
        return null;
    }
    const supportedContentTypes = Object.keys(response.content ?? {});
    // If no content types are defined, return null
    if (supportedContentTypes.length === 0) {
        return null;
    }
    // Content-Type negotiation - prefer application/json
    const acceptedContentType = accepts(c, {
        header: 'Accept',
        supports: supportedContentTypes,
        default: supportedContentTypes.includes('application/json')
            ? 'application/json'
            : (supportedContentTypes[0] ?? 'text/plain;charset=UTF-8'),
    });
    const acceptedResponse = response.content?.[acceptedContentType];
    if (!acceptedResponse) {
        return null;
    }
    const streamingResponse = getStreamingResponse(acceptedResponse, acceptedContentType, {
        exampleName: parsePreferHeader(c.req.header('Prefer')).example,
        variables: pathParameters(c),
    });
    if (streamingResponse) {
        return streamingResponse.body;
    }
    const responseSchema = acceptedResponse.schema ? getResolvedRefDeep(acceptedResponse.schema) : undefined;
    // Extract example from example property or generate from schema
    return acceptedResponse.example !== undefined
        ? normalizeResponseBody(acceptedResponse.example, responseSchema)
        : responseSchema
            ? normalizeResponseBody(generateResponseExample(responseSchema, pathParameters(c)), responseSchema)
            : null;
}
/**
 * Build the handler context from a Hono context.
 */
export async function buildHandlerContext(c, operation, pathItemParameters) {
    let body = undefined;
    try {
        // Compare case-insensitively, since media types are case-insensitive and request validation
        // matches them the same way. Otherwise a body like `Application/JSON` could pass validation yet
        // never reach the handler as `req.body`.
        const contentType = (c.req.header('content-type') ?? '').toLowerCase();
        // An empty/absent Content-Type is treated as JSON to match request validation, so a headerless
        // JSON body that passes validation is still delivered to the handler as `req.body`.
        if (contentType === '' || contentType.includes('application/json')) {
            body = await c.req.json().catch(() => undefined);
        }
        else if (contentType.includes('application/x-www-form-urlencoded')) {
            body = await c.req.parseBody().catch(() => undefined);
        }
        else if (contentType.includes('text/')) {
            body = await c.req.text().catch(() => undefined);
        }
    }
    catch {
        // Ignore parsing errors, body remains undefined
    }
    const parameter = findQuerystringParameter(operation, pathItemParameters);
    let query = Object.fromEntries(new URL(c.req.url).searchParams.entries());
    if (parameter) {
        try {
            query = parseQuerystringParameter(c.req.url, parameter);
        }
        catch {
            // With validation disabled, malformed content remains unavailable just like an invalid body.
            query = undefined;
        }
    }
    const { wrappedStore, tracking } = createStoreWrapper(store);
    // Build res object with examples for all response status codes
    const res = {};
    if (operation?.responses) {
        for (const statusCode of Object.keys(operation.responses)) {
            res[statusCode] = getExampleFromResponse(c, statusCode, operation.responses);
        }
    }
    return {
        context: {
            store: wrappedStore,
            req: {
                body,
                params: pathParameters(c),
                query,
                headers: Object.fromEntries(Object.entries(c.req.header()).map(([key, value]) => [key, value ?? ''])),
            },
            res,
        },
        tracking,
    };
}
