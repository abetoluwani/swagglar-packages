import type { OpenAPIV3_1 } from '@scalar/openapi-types';
type Schema = NonNullable<OpenAPIV3_1.ComponentsObject['schemas']>[string];
export declare const normalizeResponseBody: (body: unknown, schema: Schema) => unknown;
export {};
//# sourceMappingURL=normalize-response-body.d.ts.map