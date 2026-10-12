import { upgradeWebSocket } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { WebSocketServer } from 'ws';
import { defaultTransports } from './transports/index.js';
import { generateMessage } from './utils/generate-message.js';
import { processAsyncApiDocument } from './utils/process-asyncapi-document.js';
import { resolveChannels } from './utils/resolve-channels.js';
import { resolveLogger } from './utils/resolve-logger.js';
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
export async function createAsyncApiMockServer(options) {
    const app = new Hono();
    const document = await processAsyncApiDocument(options.document, options.origin);
    const channels = resolveChannels(document);
    const transports = [...defaultTransports, ...(options.transports ?? [])];
    const log = resolveLogger(options.logger, false);
    // CORS for the SSE/HTTP routes (WebSocket upgrades are not subject to CORS).
    app.use(cors());
    const context = {
        app,
        upgradeWebSocket,
        generateMessage,
        onMessage: options.onMessage,
        log,
    };
    for (const channel of channels) {
        const transport = transports.find((candidate) => candidate.supports(channel));
        if (!transport) {
            // A channel with no matching transport is a configuration problem, so surface it through the
            // console unconditionally rather than the (silenceable) logger.
            console.warn(`[asyncapi] no transport for channel "${channel.id}" (protocols: ${channel.protocols.join(', ') || 'none'})`);
            continue;
        }
        transport.register(channel, context);
        log(`[asyncapi] ${transport.name} -> ${channel.route} (channel "${channel.id}")`);
    }
    return { app, websocket: { server: new WebSocketServer({ noServer: true }) } };
}
