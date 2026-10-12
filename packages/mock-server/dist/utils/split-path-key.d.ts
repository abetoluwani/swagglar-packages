/**
 * Matches a `{parameterName}` template inside a path key.
 *
 * A template has to be balanced and non-empty, so a stray brace counts as literal path text.
 */
export declare const PATH_KEY_TEMPLATE: RegExp;
/** A query parameter that an OpenAPI path key pins, for example `beta=true` in `/v1/messages?beta=true`. */
export type PinnedQueryParameter = {
    /** Decoded name of the query parameter. */
    name: string;
    /** Decoded value the request has to send, or `undefined` when the path key only pins the name. */
    value: string | undefined;
};
/** An OpenAPI path key taken apart into the portion Hono can route and the query it pins. */
type SplitPathKey = {
    /** The path portion of the key, without the query string. */
    path: string;
    /** Query parameters the key pins. Empty for a regular path key. */
    query: PinnedQueryParameter[];
};
/**
 * Split an OpenAPI path key into its path and its pinned query parameters.
 *
 * Some documents carry a literal query string in the path key to describe a variant of an operation,
 * for example `/v1/messages?beta=true` next to `/v1/messages`. That is not a routable path, so the
 * query has to be peeled off and matched against the incoming request separately.
 */
export declare const splitPathKey: (pathKey: string) => SplitPathKey;
export {};
//# sourceMappingURL=split-path-key.d.ts.map