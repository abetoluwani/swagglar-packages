import type { MockTransport } from '../transports/types.js';
/**
 * Built-in WebSocket transport. Serves channels whose servers speak `ws`/`wss` by upgrading the
 * channel route to a WebSocket connection.
 *
 * - `receive` operations (server push): one message is emitted per operation when a client connects.
 * - `send` operations (client -> server): each inbound frame is logged and echoed with a generated reply.
 */
export declare const websocketTransport: MockTransport;
//# sourceMappingURL=websocket.d.ts.map