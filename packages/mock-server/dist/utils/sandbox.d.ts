import type { StoreInterface } from './store-wrapper.js';
/**
 * Options for {@link runInSandbox}.
 */
type RunInSandboxOptions = {
    /** User-supplied handler or seed code. It runs inside an async wrapper, so top-level `return` and `await` work. */
    code: string;
    /** Host store bridge (already wrapped with operation tracking). */
    store: StoreInterface;
    /** Plain-JSON values exposed to the guest as globals (for example `req`, `res`, `schema`). */
    jsonGlobals?: Record<string, unknown>;
    /** When true, exposes the guest-side `seed` helper. Requires a `schema` entry in {@link jsonGlobals}. */
    includeSeed?: boolean;
};
/**
 * Execute untrusted handler or seed code inside a QuickJS WebAssembly sandbox.
 *
 * The guest has no access to the host runtime (`process`, `require`, `fetch`,
 * the `Function` constructor, and so on). It can only talk to the `store` and
 * `faker` bridges and read the injected JSON globals. Memory and time limits
 * bound the remaining denial-of-service risk.
 */
export declare function runInSandbox(options: RunInSandboxOptions): Promise<unknown>;
export {};
//# sourceMappingURL=sandbox.d.ts.map