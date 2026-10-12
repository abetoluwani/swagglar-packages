import type { MockTransport } from '../transports/types.js';
/**
 * Built-in transports, in match priority order. WebSocket is checked before SSE so a `ws`
 * channel is never claimed by the SSE fallback. Consumer transports are appended after these.
 */
export declare const defaultTransports: MockTransport[];
export { sseTransport } from './sse.js';
export { websocketTransport } from './websocket.js';
//# sourceMappingURL=index.d.ts.map