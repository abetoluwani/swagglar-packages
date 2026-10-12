import type { Context } from 'hono';
/**
 * Read the path parameters of a request, without the ones synthesized for routing.
 *
 * A path segment Hono cannot match as written is registered as a parameter with a generated name
 * (see `honoRouteFromPath`). That name is an implementation detail, so it has no business showing up
 * in an `x-handler` context or among the variables a mocked response body is generated from.
 *
 * The names are read back off the matched route rather than recognized by their prefix, so a
 * document that happens to declare a parameter of the same name keeps it.
 */
export declare const pathParameters: (context: Context) => Record<string, string>;
//# sourceMappingURL=path-parameters.d.ts.map