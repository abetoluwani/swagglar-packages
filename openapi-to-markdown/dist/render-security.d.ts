import type { OpenApiDocument } from '@scalar/workspace-store/schemas/v3.2/strict/openapi-document';
import type { RootContent } from 'mdast';
import type { DescriptionParser } from './parse-description.js';
/** Preserve OR between requirements and AND between schemes within a requirement. */
export declare const renderSecurity: (requirements: OpenApiDocument["security"], schemes: NonNullable<OpenApiDocument["components"]>["securitySchemes"], description: DescriptionParser) => Promise<RootContent[]>;
//# sourceMappingURL=render-security.d.ts.map