/**
 * Directives parsed from an HTTP `Prefer` header (RFC 7240).
 *
 * The mock server understands `code` (pick a response status) and `example`
 * (pick a named example). The index signature keeps the shape open so future
 * directives can be read without changing the parser.
 */
type PreferDirectives = {
    /** Requested response status code, e.g. `code=404`. */
    code?: string;
    /** Requested named example from the `examples` map, e.g. `example=notFound`. */
    example?: string;
    [directive: string]: string | undefined;
};
/**
 * Parse an HTTP `Prefer` header into its directives.
 *
 * The header is a comma- and semicolon-separated list of `key=value` tokens
 * (RFC 7240). We treat every token uniformly, lower-case the keys, and strip
 * optional surrounding quotes from the values. A missing header or a token
 * without a value is simply ignored so callers always fall through to their
 * default behavior instead of erroring.
 */
export declare const parsePreferHeader: (header: string | null | undefined) => PreferDirectives;
export {};
//# sourceMappingURL=parse-prefer-header.d.ts.map