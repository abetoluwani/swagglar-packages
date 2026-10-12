import type { MaybeRefSchemaObject, SchemaObject } from '@scalar/workspace-store/schemas/v3.2/strict/schema';
import type { RootContent } from 'mdast';
/** Boolean schemas must survive rendering without being coerced into empty objects. */
type MarkdownSchema = MaybeRefSchemaObject | boolean;
type SchemaView = {
    schema: SchemaObject | boolean;
    title?: string;
    description?: string;
    type?: string | string[];
    format?: string;
    enum?: unknown[];
    const?: unknown;
    default?: unknown;
    readOnly?: boolean;
    writeOnly?: boolean;
    allOf?: MarkdownSchema[];
    anyOf?: MarkdownSchema[];
    oneOf?: MarkdownSchema[];
    not?: MarkdownSchema;
    properties: [string, MarkdownSchema][];
    required: ReadonlySet<string>;
    items?: MarkdownSchema;
    minItems?: number;
    maxItems?: number;
    uniqueItems?: boolean;
    minimum?: number;
    maximum?: number;
    exclusiveMinimum?: number;
    exclusiveMaximum?: number;
    multipleOf?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    minProperties?: number;
    maxProperties?: number;
    additionalProperties?: MarkdownSchema;
    discriminator?: {
        propertyName: string;
        mapping?: Record<string, string>;
    };
    /** Set for references to a structured schema that is rendered once per document and referred to afterwards. */
    name?: string;
};
type RenderOptions = {
    hideDescription?: boolean;
    hideDetails?: boolean;
    property?: boolean;
    /** Record this root under the given name, for example in its own model section, even if it is not a reference. */
    name?: string;
};
/**
 * Schema normalization is cached separately from ancestry-dependent expansion.
 *
 * A renderer also tracks which shared schemas one output document already shows, so each one is
 * expanded once and referred to afterwards. Use `forDocument` for every document: renders can
 * run concurrently, and each needs its own record.
 */
export type SchemaRenderer = {
    view: (schema: MarkdownSchema) => SchemaView;
    render: (schema: MarkdownSchema, depth?: number, ancestors?: readonly unknown[], options?: RenderOptions) => RootContent[];
    /** Restore the node budget, for example for each operation or model section. */
    beginSection: () => void;
    /** Start a document that shares normalized views, given the models it renders in its own sections. */
    forDocument: (models?: Record<string, MarkdownSchema>) => SchemaRenderer;
};
type SchemaRendererOptions = {
    /** Upper bound on expanded schema nodes per section, so no description can make a page unbounded. */
    maxNodes?: number;
};
/** Keep merged reference siblings and sorted properties stable throughout an export. */
export declare const createSchemaRenderer: ({ maxNodes }?: SchemaRendererOptions) => SchemaRenderer;
export {};
//# sourceMappingURL=render-schema.d.ts.map