import type { Context } from 'hono';
/**
 * Responds with a JSON object simulating an OAuth 2.0 token response.
 */
export declare function respondWithToken(c: Context): (Response & import("hono").TypedResponse<{
    error: string;
    error_description: string;
}, 400, "json">) | (Response & import("hono").TypedResponse<{
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
}, import("hono/utils/http-status").ContentfulStatusCode, "json">);
//# sourceMappingURL=respond-with-token.d.ts.map