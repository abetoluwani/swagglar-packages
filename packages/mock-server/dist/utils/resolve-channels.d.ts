import type { AsyncApiDocument } from '@scalar/types/asyncapi/3.1';
import type { ResolvedChannel } from '../transports/types.js';
/**
 * Normalize an AsyncAPI 3.1 document into a flat list of {@link ResolvedChannel}s a transport can
 * serve. Channel, message, operation, and server resolution are delegated to
 * `@scalar/workspace-store/channel-example` — the same layer the API client uses to connect to
 * channels — so the mock and the client agree on how a document maps to channels and operations
 * (including operation traits). This function only adapts that output into the transport types.
 */
export declare function resolveChannels(document: AsyncApiDocument): ResolvedChannel[];
//# sourceMappingURL=resolve-channels.d.ts.map