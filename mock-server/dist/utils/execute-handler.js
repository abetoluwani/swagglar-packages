import { runInSandbox } from './sandbox.js';
/**
 * Execute handler code inside the QuickJS sandbox.
 *
 * The handler can only reach the `store` and `faker` bridges and the injected
 * `req`/`res` inputs. It cannot touch the host runtime, so even untrusted code
 * from a remote or `$ref`-loaded document is safe to run.
 */
export async function executeHandler(code, context) {
    const result = await runInSandbox({
        code,
        store: context.store,
        jsonGlobals: { req: context.req, res: context.res },
    });
    return { result };
}
