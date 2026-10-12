import type { OpenAPIV3_1 } from '@scalar/openapi-types';
import type { Context } from 'hono';
/**
 * Mock response using x-handler code.
 * Executes the handler and returns its result as the response.
 */
export declare function mockHandlerResponse(c: Context, operation: OpenAPIV3_1.OperationObject, pathItemParameters?: OpenAPIV3_1.PathItemObject['parameters'], openapiVersion?: string): Promise<Response>;
//# sourceMappingURL=mock-handler-response.d.ts.map