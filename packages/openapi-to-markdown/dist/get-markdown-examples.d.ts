/** Example-bearing media types, parameters, and headers share the same precedence rules. */
export type ExampleSource = {
    schema?: unknown;
    example?: unknown;
    examples?: Record<string, unknown>;
};
/** Named examples can contain a literal value or point to an external value. */
type MarkdownExample = {
    name?: string;
    summary?: string;
    description?: string;
} & ({
    value: unknown;
} | {
    externalValue: string;
} | {
    serializedValue: string;
} | {
    omitted: true;
} | {
    dataValue: unknown;
} | {
    error: string;
});
/**
 * Estimate how many values an example generated from this schema contains, stopping just past the limit.
 * Counts are cached per schema and level, so this is linear in the size of the schema graph.
 */
export declare const countGeneratedExampleValues: (root: unknown, limit?: number) => number;
/** Preserve supplied values; generate a fallback only when examples are not supplied. */
export declare const getMarkdownExamples: (source: ExampleSource, mediaType: string, mode?: "read" | "write", openapiVersion?: string, schemaOpenapiVersion?: string) => MarkdownExample[];
export {};
//# sourceMappingURL=get-markdown-examples.d.ts.map