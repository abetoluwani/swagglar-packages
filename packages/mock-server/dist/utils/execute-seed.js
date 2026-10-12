import { runInSandbox } from './sandbox.js';
/**
 * Execute seed code inside the QuickJS sandbox.
 *
 * The seed code can only reach the `store` and `faker` bridges and the `seed`
 * helper, which persists generated items through the store. It cannot touch the
 * host runtime.
 */
export async function executeSeed(code, context) {
    const result = await runInSandbox({
        code,
        store: context.store,
        jsonGlobals: { schema: context.schema },
        includeSeed: true,
    });
    return { result };
}
