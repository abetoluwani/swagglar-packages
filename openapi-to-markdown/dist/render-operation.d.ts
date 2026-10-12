import type { OpenApiDocument, OperationObject, PathItemObject } from '@scalar/workspace-store/schemas/v3.2/strict/openapi-document';
import type { RootContent } from 'mdast';
import type { DescriptionParser } from './parse-description.js';
import type { SchemaRenderer } from './render-schema.js';
/** Dependencies shared by all sections of one prepared renderer. */
type RenderContext = {
    description: DescriptionParser;
    schemas: SchemaRenderer;
};
/** Render effective operation context without mutating the prepared document. */
export declare const renderOperation: (document: OpenApiDocument, path: string, method: string, pathItem: PathItemObject, operation: OperationObject, webhook: boolean, { description, schemas }: RenderContext) => Promise<RootContent[]>;
export {};
//# sourceMappingURL=render-operation.d.ts.map