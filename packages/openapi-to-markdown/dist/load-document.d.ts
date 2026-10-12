import { type OpenApiDocument } from '@scalar/workspace-store/schemas/v3.2/strict/openapi-document';
/** Coerce one plain document and keep references linked to shared targets. */
export declare const loadDocument: (input: OpenApiDocument | Record<string, unknown> | string) => Promise<OpenApiDocument>;
//# sourceMappingURL=load-document.d.ts.map