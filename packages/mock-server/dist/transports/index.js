import { sseTransport } from './sse.js';
import { websocketTransport } from './websocket.js';
/**
 * Built-in transports, in match priority order. WebSocket is checked before SSE so a `ws`
 * channel is never claimed by the SSE fallback. Consumer transports are appended after these.
 */
export const defaultTransports = [websocketTransport, sseTransport];
export { sseTransport } from './sse.js';
export { websocketTransport } from './websocket.js';
