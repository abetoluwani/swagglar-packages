import type { OperationMethod } from '@scalar/workspace-store/schemas/navigation';
import type { OpenApiDocument } from '@scalar/workspace-store/schemas/v3.2/strict/openapi-document';
/** Identify one operation by path and method, operation ID, or JSON pointer. */
export type OperationSelector = {
    path: string;
    method: OperationMethod;
} | {
    operationId: string;
} | {
    pointer: string;
};
/** Select one reference page, or omit selectors for the whole document. */
export type OpenApiRenderOptions = {
    [Key in keyof PageSelectors]: Partial<Record<Exclude<keyof PageSelectors, Key>, never>> & Pick<PageSelectors, Key>;
}[keyof PageSelectors] | Partial<Record<keyof PageSelectors, never>>;
type PageSelectors = {
    operation: OperationSelector;
    tag: string;
    model: string;
    webhook: {
        name: string;
        method: OperationMethod;
    };
    introduction: true;
};
/** Scope after resolving references and migrating older documents. */
export declare const selectDocument: (document: OpenApiDocument, options?: OpenApiRenderOptions) => OpenApiDocument;
export {};
//# sourceMappingURL=select-document.d.ts.map