import type { OpenAPIV3_2 } from '@scalar/openapi-types';
/**
 * Find the whole-query parameter, giving operation declarations precedence over path declarations.
 * This module decodes incoming queries; workspace-store/src/helpers/querystring-parameter.ts serializes outgoing ones.
 */
export declare const findQuerystringParameter: (operation?: OpenAPIV3_2.OperationObject, pathParameters?: OpenAPIV3_2.PathItemObject["parameters"]) => OpenAPIV3_2.ParameterObject | undefined;
/** Validate JSON-encoded form properties before the coercing form validator can alter their native types. */
export declare const getQuerystringJsonSchema: (parameter: OpenAPIV3_2.ParameterObject | undefined) => Record<string, unknown> | null;
/** Decode the complete query without introducing the parameter's documentary name. Throws on malformed JSON or URI escaping. */
export declare const parseQuerystringParameter: (url: string, parameter: OpenAPIV3_2.ParameterObject) => unknown;
//# sourceMappingURL=querystring-parameter.d.ts.map