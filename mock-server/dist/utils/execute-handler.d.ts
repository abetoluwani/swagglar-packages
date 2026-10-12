import type { HandlerContext } from './build-handler-context.js';
/**
 * Result of executing a handler, including the result and operation tracking.
 */
type HandlerExecutionResult = {
    result: any;
};
/**
 * Execute handler code inside the QuickJS sandbox.
 *
 * The handler can only reach the `store` and `faker` bridges and the injected
 * `req`/`res` inputs. It cannot touch the host runtime, so even untrusted code
 * from a remote or `$ref`-loaded document is safe to run.
 */
export declare function executeHandler(code: string, context: HandlerContext): Promise<HandlerExecutionResult>;
export {};
//# sourceMappingURL=execute-handler.d.ts.map