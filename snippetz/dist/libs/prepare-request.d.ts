import type { HarRequest, PluginConfiguration } from '@scalar/types/snippetz';
/** A body segment is either literal UTF-8 text or a file read when the snippet runs. */
export type BodySegment = {
    text: string;
} | {
    file: string;
};
/** Request values shared by generators that serialize a body explicitly. */
type PreparedRequest = {
    url: string;
    method: string;
    headers: {
        name: string;
        value: string;
    }[];
    body: BodySegment[] | undefined;
};
/** Normalize HAR values without dropping duplicate headers, cookies, query parameters, or empty bodies. */
export declare const prepareRequest: (request?: Partial<HarRequest>, configuration?: PluginConfiguration) => PreparedRequest;
export {};
//# sourceMappingURL=prepare-request.d.ts.map