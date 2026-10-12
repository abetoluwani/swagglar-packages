import type { OpenAPIV3_1 } from '@scalar/openapi-types';
/**
 * Takes a dereferenced OpenAPI document and returns all operations.
 * Keys use their wire capitalization: fixed methods are uppercase, additional methods retain their case.
 * Ignores other attributes, like summary, parameters, etc.
 */
export declare const getOperations: (path?: OpenAPIV3_1.PathItemObject & {
    additionalOperations?: Record<string, OpenAPIV3_1.OperationObject>;
}) => Record<string, OpenAPIV3_1.OperationObject>;
//# sourceMappingURL=get-operation.d.ts.map