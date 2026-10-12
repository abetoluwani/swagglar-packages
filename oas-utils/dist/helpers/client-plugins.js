/**
 * Subscribes a single plugin's `on` listener to the given event bus via `onAny`.
 *
 * The plugin's `on` is passed straight through to `bus.onAny`, so it will
 * receive every event emitted on the bus as a `{ event, payload }` object.
 * Plugins without an `on` listener get a no-op unsubscribe.
 *
 * Returns an unsubscribe function. Call it when the plugin is torn down or
 * the bus is destroyed to remove the wildcard listener.
 *
 * @example
 * const unsubscribe = subscribePluginEvents(eventBus, plugin)
 * // later...
 * unsubscribe()
 */
export const subscribePluginEvents = (eventBus, plugin) => {
    if (!plugin.on) {
        return () => {
            // no-op
        };
    }
    return eventBus.onAny(plugin.on);
};
/**
 * Execute a request hook with type-safe payload handling.
 * The payload type is inferred from the hook name to ensure correct usage.
 */
export const executeHook = async (payload, hookName, plugins) => {
    let currentPayload = payload;
    for (const plugin of plugins) {
        const hook = plugin.hooks?.[hookName];
        if (hook) {
            const modifiedPayload = await hook(currentPayload);
            currentPayload = modifiedPayload ?? currentPayload;
        }
    }
    return currentPayload;
};
/** Execute response hooks in order, releasing discarded stream branches after each hook. */
export const executeResponseHook = async (payload, plugins) => {
    let current = payload;
    for (const plugin of plugins) {
        const hook = plugin.hooks?.responseReceived;
        if (hook) {
            const previousResponse = current.response;
            const clone = previousResponse.clone();
            let nextResponse;
            try {
                const response = await hook({ ...current, response: clone });
                nextResponse = response ?? previousResponse;
                current = { ...current, response: nextResponse };
            }
            finally {
                // Release discarded tee branches on success or failure so open streams cannot buffer
                // without a consumer. A transformed stream owns its locked input.
                // Do not await cancellation: it can wait for the retained branch to finish.
                for (const body of [previousResponse.body, clone.body]) {
                    if (body && body !== nextResponse?.body && !body.locked) {
                        void body.cancel().catch(() => { });
                    }
                }
            }
        }
    }
    return current;
};
/**
 * Execute a WebSocket plugin hook across all plugins.
 *
 * For `beforeConnect`, the returned URL string (if any) is threaded through
 * sequentially so each plugin can transform the URL. For fire-and-forget hooks
 * (`onWebSocketMessage`, `onWebSocketClose`) the return value is ignored.
 */
export const executeWebSocketHook = async (payload, hookName, plugins) => {
    let currentPayload = payload;
    for (const plugin of plugins) {
        const hook = plugin.webSocketHooks?.[hookName];
        if (hook) {
            const result = await hook(currentPayload);
            if (hookName === 'beforeConnect' && typeof result === 'string') {
                currentPayload = { ...currentPayload, url: result };
            }
        }
    }
    return currentPayload;
};
