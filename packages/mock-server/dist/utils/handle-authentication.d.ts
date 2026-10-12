import type { OpenAPIV3_1, OpenAPIV3_2 } from '@scalar/openapi-types';
import type { Context } from 'hono';
/**
 * Handles authentication for incoming requests based on the OpenAPI document.
 *
 * The `security` array is evaluated as OR-of-ANDs: the request is authenticated if
 * *any* requirement object is fully satisfied, and a requirement object is satisfied
 * only when *every* scheme it lists is satisfied. An empty requirement object (`{}`)
 * means authentication is optional and always passes.
 */
export declare function handleAuthentication(schema?: OpenAPIV3_1.Document | OpenAPIV3_2.Document, operation?: OpenAPIV3_2.OperationObject): (c: Context, next: () => Promise<void>) => Promise<Response | void>;
//# sourceMappingURL=handle-authentication.d.ts.map