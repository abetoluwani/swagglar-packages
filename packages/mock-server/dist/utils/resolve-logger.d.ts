import type { MockServerLogger } from '../types.js';
/**
 * Resolve the `logger` option accepted by the mock server factories into a concrete sink.
 *
 * The option is a superset of a plain sink:
 * - a function is used as-is,
 * - `true` logs each line to the console,
 * - `false` drops every line,
 * - `undefined` falls back to the factory's default (`enabledByDefault`).
 */
export declare const resolveLogger: (logger: boolean | MockServerLogger | undefined, enabledByDefault: boolean) => MockServerLogger;
//# sourceMappingURL=resolve-logger.d.ts.map