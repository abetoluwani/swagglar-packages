/** Prefix for the parameters we synthesize to match a literal path segment verbatim. */
export declare const LITERAL_PARAMETER_PREFIX = "__scalar_literal_";
/**
 * Convert an OpenAPI path key into a Hono route.
 *
 * Example: `/posts/{id}` → `/posts/:id`
 *
 * A segment whose literal text would be read as routing syntax is registered as a single parameter
 * with an explicit pattern instead, because Hono allows only one parameter per segment and that is
 * the only way to make it match such a segment verbatim. The request then routes to the right
 * operation, but the path parameters of that one segment are no longer bound by name: they surface
 * as the synthesized parameter, and a required path parameter in it reads as missing to request
 * validation. Hono cannot express both at once, and matching the wrong operation is worse.
 *
 * A query string in the key (`/v1/messages?beta=true`) is dropped here — it is matched against the
 * incoming request separately, see `splitPathKey`.
 */
export declare const honoRouteFromPath: (path: string) => string;
//# sourceMappingURL=hono-route-from-path.d.ts.map