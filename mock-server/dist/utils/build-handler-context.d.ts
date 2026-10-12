import type { OpenAPIV3_1 } from '@scalar/openapi-types';
import type { Context } from 'hono';
import { type StoreOperationTracking, createStoreWrapper } from './store-wrapper.js';
/**
 * Context object provided to x-handler code.
 */
export type HandlerContext = {
    store: ReturnType<typeof createStoreWrapper>['wrappedStore'];
    req: {
        body: any;
        params: Record<string, string>;
        /** Named query values, or the decoded content of an `in: querystring` parameter. */
        query: unknown;
        headers: Record<string, string>;
    };
    res: Record<string, any>;
};
/**
 * Result of building handler context, including operation tracking.
 */
type HandlerContextResult = {
    context: HandlerContext;
    tracking: StoreOperationTracking;
};
/**
 * Build the handler context from a Hono context.
 */
export declare function buildHandlerContext(c: Context, operation?: OpenAPIV3_1.OperationObject, pathItemParameters?: OpenAPIV3_1.PathItemObject['parameters']): Promise<HandlerContextResult>;
export {};
//# sourceMappingURL=build-handler-context.d.ts.map