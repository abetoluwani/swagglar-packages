import type { Context } from 'hono';
/**
 * OpenAPI endpoints
 */
export declare function respondWithOpenApiDocument(c: Context, input?: string | Record<string, any>, format?: 'json' | 'yaml'): (Response & import("hono").TypedResponse<"Not found", 404, "text">) | (Response & import("hono").TypedResponse<import("hono/utils/types").JSONValue, import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<string, 200, "text">) | (Response & import("hono").TypedResponse<{
    error: string;
    message: string;
}, 500, "json">) | (Response & import("hono").TypedResponse<{
    error: string;
    message: string;
}, 400, "json">);
//# sourceMappingURL=respond-with-openapi-document.d.ts.map