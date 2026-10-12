import type { Context } from 'hono';
import type { PinnedQueryParameter } from '../utils/split-path-key.js';
/**
 * Check whether a request carries every query parameter a path key pins.
 *
 * `/v1/messages?beta=true` describes a variant of `/v1/messages`, so it may only answer requests
 * that actually send `beta=true`. A parameter pinned without a value (`?beta`) matches any value.
 */
export declare const requestMatchesPinnedQuery: (context: Context, query: PinnedQueryParameter[]) => boolean;
//# sourceMappingURL=request-matches-pinned-query.d.ts.map