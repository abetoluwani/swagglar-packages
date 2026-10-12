import type { EncodingObject, ResponseObject } from '@scalar/workspace-store/schemas/v3.2/strict/openapi-document';
import type { RootContent } from 'mdast';
import type { DescriptionParser } from './parse-description.js';
import type { SchemaRenderer } from './render-schema.js';
/** Render response or multipart headers, whose names come from their containing map. */
export declare const renderHeaders: (headers: ResponseObject["headers"], description: DescriptionParser, schemas: SchemaRenderer, openapiVersion: string, schemaOpenapiVersion?: string) => Promise<RootContent[]>;
/** Preserve explicit encoding settings, including false flags and part headers. */
export declare const renderEncoding: (encoding: Record<string, EncodingObject> | undefined, mediaType: string, description: DescriptionParser, schemas: SchemaRenderer, openapiVersion: string, schemaOpenapiVersion?: string) => Promise<RootContent[]>;
/** Render response link expressions as literal values, without evaluating them. */
export declare const renderResponseLinks: (links: ResponseObject["links"], description: DescriptionParser) => Promise<RootContent[]>;
//# sourceMappingURL=render-operation-details.d.ts.map