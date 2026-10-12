import type { OpenAPI } from '@scalar/openapi-types';
/**
 * Extract path from URL. Metadata routes preserve trailing slashes because discovery
 * fetches the exact declared URL, unlike normalized token routes.
 */
export declare function getPathFromUrl(url: string, { preserveTrailingSlash }?: {
    preserveTrailingSlash?: boolean;
}): string;
export declare function getOpenAuthTokenUrls(schema?: OpenAPI.Document): string[];
//# sourceMappingURL=get-open-auth-token-urls.d.ts.map