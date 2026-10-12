import type { OpenAPIV3_1 } from '@scalar/openapi-types';
/** One event of a mocked Server-Sent Events response. */
type SseEvent = {
    /** Already-framed event text when `framed` is true, otherwise the `data` payload of one event. */
    text: string;
    /** Whether `text` is SSE framing of its own, to be written as is rather than wrapped in a `data:` line. */
    framed: boolean;
};
/**
 * The events a `text/event-stream` response emits, in order.
 *
 * Examples win over the schema, mirroring `selectResponseExample`, but a stream reads them as a
 * sequence rather than a single body:
 * 1. A named example requested via `Prefer: example=<name>`.
 * 2. The singular `example` keyword.
 * 3. Every entry of the `examples` map, in declaration order — an event stream that documents a
 *    `summary` and a `row` example is documenting the two events it sends. A map of nothing but
 *    complete framing is the exception: those are alternative streams, so only the first is served.
 * 4. Nothing declared: a schema-generated payload, repeated so the stream has more than one event.
 *
 * `generate` is a callback so the schema is only turned into an example when no example is declared.
 */
export declare const collectSseEvents: (mediaType: OpenAPIV3_1.MediaTypeObject | undefined, { exampleName, generate }: {
    exampleName?: string;
    generate: () => unknown;
}) => SseEvent[];
/** Whether a media type is Server-Sent Events, ignoring parameters such as `; charset=utf-8`. */
export declare const isEventStreamContentType: (contentType: string | undefined) => boolean;
export {};
//# sourceMappingURL=collect-sse-events.d.ts.map