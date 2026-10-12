import type { OpenAPIV3_1 } from '@scalar/openapi-types';
import type { MiddlewareHandler } from 'hono';
/**
 * Create a Hono middleware bound to a single resolved operation that enforces its request contract.
 *
 * Validators are compiled once here (at route-setup time) and reused on every request. On any
 * violation the middleware short-circuits with a `422` and a `application/problem+json` body;
 * otherwise it calls `next()` and the normal mock handler runs.
 *
 * TODO: Parity follow-ups, intentionally deferred — response validation, non-JSON body validation,
 * and validation proxy mode.
 */
export declare const validateRequest: (operation: OpenAPIV3_1.OperationObject, pathItemParameters?: OpenAPIV3_1.PathItemObject["parameters"]) => MiddlewareHandler;
//# sourceMappingURL=validate-request.d.ts.map