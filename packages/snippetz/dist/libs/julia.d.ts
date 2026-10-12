/**
 * Wraps a string in double quotes, escaped and ready to be inserted into Julia source code.
 */
export declare const wrapInDoubleQuotes: (str: string) => string;
/**
 * Produces an indented string using 4 spaces per level, following the Julia style guide.
 */
export declare const indent: (level: number, text: string) => string;
/**
 * Renders a collection (a vector, a `Dict`, a `HTTP.Form`, …) from already formatted entries.
 *
 * Short collections stay on a single line, everything else gets one entry per
 * line so that generated snippets remain readable.
 *
 * @param entries - The formatted entries, without trailing commas
 * @param open - The opening token, for example `[` or `Dict(`
 * @param close - The closing token, for example `]` or `)`
 * @param level - The indentation level the collection itself sits at
 */
export declare const formatCollection: (entries: string[], open: string, close: string, level: number) => string;
/**
 * Formats `name => value` pairs as a Julia vector of pairs, which is what HTTP.jl
 * expects for headers and query parameters.
 */
export declare const formatPairVector: (pairs: {
    name: string;
    value: string;
}[], level: number) => string;
/**
 * Formats `name => value` pairs as a Julia `Dict`.
 */
export declare const formatDict: (pairs: {
    name: string;
    value: string;
}[], level: number) => string;
/**
 * Converts a parsed JSON value into the equivalent Julia literal.
 *
 * Objects become `Dict`s and arrays become vectors, so the snippet can be edited
 * with plain Julia syntax before it is serialized with `JSON.json`.
 */
export declare const formatValue: (value: unknown, level: number) => string;
//# sourceMappingURL=julia.d.ts.map