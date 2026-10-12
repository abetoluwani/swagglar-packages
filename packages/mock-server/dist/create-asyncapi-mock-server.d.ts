import { type WebSocketServerLike } from '@hono/node-server';
import { Hono } from 'hono';
import type { MessageDirection, MockTransport } from './transports/types.js';
import type { MockServerLogger } from './types.js';
/** Options for {@link createAsyncApiMockServer}. */
export type AsyncApiMockServerOptions = {
    /**
     * The AsyncAPI 3.1 document to mock. Can be a string (URL or file path), a raw JSON/YAML
     * string, or an already-parsed object.
     */
    document?: string | Record<string, any>;
    /** Source file path or URL for resolving references in an already loaded document. */
    origin?: string;
    /**
     * Additional transports appended after the built-in WebSocket and SSE transports. Use this to
     * support extra protocols (for example SignalR) without changing the core. The first transport
     * whose `supports()` returns `true` for a channel owns it.
     */
    transports?: MockTransport[];
    /** Called for every message flowing in or out of the mock, for logging or inspection. */
    onMessage?: (event: {
        channel: string;
        direction: MessageDirection;
        payload: unknown;
    }) => void;
    /**
     * Control the transport lifecycle log lines the server prints. Pass `true` to log them to the
     * console, a `(line) => void` sink to route them elsewhere, or `false` (the default) to stay silent.
     *
     * Diagnostics such as a channel with no matching transport are printed either way.
     */
    logger?: boolean | MockServerLogger;
};
/** The result of {@link createAsyncApiMockServer}. */
export type AsyncApiMockServer = {
    /** The Hono app serving SSE channels and WebSocket upgrade routes. */
    app: Hono;
    /** Pass this option to `@hono/node-server`'s `serve()` to enable WebSocket channels. */
    websocket: {
        server: WebSocketServerLike;
    };
};
/**
 * Create a mock server for an AsyncAPI 3.1 document — the event-driven counterpart of
 * {@link createMockServer}. Each channel is registered on a transport (WebSocket or SSE by
 * default) that emits realistic mock messages generated from the channel's message payload
 * schemas, the same way the REST mocker generates HTTP response bodies.
 *
 * Pass the returned WebSocket option to `serve()`:
 *
 * ```ts
 * const { app, websocket } = await createAsyncApiMockServer({ document })
 * serve({ fetch: app.fetch, port: 3000, websocket })
 * ```
 */
export declare function createAsyncApiMockServer(options: AsyncApiMockServerOptions): Promise<AsyncApiMockServer>;
//# sourceMappingURL=create-asyncapi-mock-server.d.ts.map