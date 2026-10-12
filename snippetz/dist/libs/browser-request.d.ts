import type { HarRequest, PluginConfiguration } from '@scalar/types/snippetz';
/** Builds browser request values without collapsing repeated headers or form fields. */
export declare const prepareBrowserRequest: (request?: Partial<HarRequest>, configuration?: PluginConfiguration) => {
    url: string;
    method: string;
    headers: {
        name: string;
        value: string;
    }[];
    setup: string[];
    body: string;
    withCredentials: boolean;
};
//# sourceMappingURL=browser-request.d.ts.map