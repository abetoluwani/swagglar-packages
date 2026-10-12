import type { MockMessage, ResolvedChannel } from '../transports/types.js';
/**
 * Generate an encoded mock frame for a channel message — the AsyncAPI analogue of the REST
 * mocker's response generation. Prefers a defined example, otherwise generates a value from the
 * message payload schema through the same `generateResponseExample` the HTTP mocker uses.
 *
 * @param channel - The resolved channel to mock a message for.
 * @param messageId - Which message to emit; defaults to the channel's first message.
 * @returns The encoded message, or `null` when the channel declares no messages.
 */
export declare function generateMessage(channel: ResolvedChannel, messageId?: string): MockMessage | null;
//# sourceMappingURL=generate-message.d.ts.map