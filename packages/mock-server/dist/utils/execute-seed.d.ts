import type { SeedContext } from './build-seed-context.js';
/**
 * Result of executing a seed handler.
 */
type SeedExecutionResult = {
    result: any;
};
/**
 * Execute seed code inside the QuickJS sandbox.
 *
 * The seed code can only reach the `store` and `faker` bridges and the `seed`
 * helper, which persists generated items through the store. It cannot touch the
 * host runtime.
 */
export declare function executeSeed(code: string, context: SeedContext): Promise<SeedExecutionResult>;
export {};
//# sourceMappingURL=execute-seed.d.ts.map