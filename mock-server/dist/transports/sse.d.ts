import type { MockTransport } from '../transports/types.js';
/**
 * Built-in Server-Sent Events transport. Serves one-way, server-push channels over HTTP: a `GET`
 * on the channel route opens an SSE stream and emits a generated message per `receive` operation.
 *
 * Claims channels whose servers speak `sse`, or plain `http`/`https` channels that have at least
 * one `receive` operation (a server-push channel). WebSocket takes precedence for `ws` channels
 * because it is registered first in the default transport list.
 */
export declare const sseTransport: MockTransport;
//# sourceMappingURL=sse.d.ts.map