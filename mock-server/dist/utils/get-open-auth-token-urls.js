import { getResolvedRef } from '@scalar/workspace-store/helpers/get-resolved-ref';
/**
 * Extract path from URL. Metadata routes preserve trailing slashes because discovery
 * fetches the exact declared URL, unlike normalized token routes.
 */
export function getPathFromUrl(url, { preserveTrailingSlash = false } = {}) {
    try {
        // Handle relative URLs by prepending a base
        const urlObject = url.startsWith('http') ? new URL(url) : new URL(url, 'http://example.com');
        // Normalize: remove trailing slash except for root path
        const path = urlObject.pathname;
        return preserveTrailingSlash || path === '/' ? path : path.replace(/\/$/, '');
    }
    catch {
        // If URL is invalid, return the original string
        return url;
    }
}
/**
 * Returns OAuth token and refresh URLs without the domain.
 */
// Type guard for OAuth2 security scheme
function isOAuth2Scheme(scheme) {
    return scheme.type === 'oauth2';
}
// Validate OAuth URL
function isValidOAuthUrl(url) {
    return url.trim().length > 0;
}
export function getOpenAuthTokenUrls(schema) {
    if (!schema?.components?.securitySchemes) {
        return [];
    }
    const securitySchemes = schema.components.securitySchemes;
    // Use Set from the start for better memory efficiency
    const oauthUrls = new Set();
    // Iterate through all security schemes
    for (const rawScheme of Object.values(securitySchemes)) {
        const scheme = getResolvedRef(rawScheme);
        // Skip schemes that could not be resolved (e.g. a `$ref` to a missing component)
        if (!scheme || !isOAuth2Scheme(scheme)) {
            continue;
        }
        const flows = scheme.flows;
        // Helper to safely add valid OAuth URLs
        const addOAuthUrl = (url) => {
            if (url && isValidOAuthUrl(url)) {
                oauthUrls.add(getPathFromUrl(url));
            }
        };
        addOAuthUrl(flows?.deviceAuthorization?.tokenUrl);
        addOAuthUrl(flows?.deviceAuthorization?.refreshUrl);
        addOAuthUrl(flows?.password?.tokenUrl);
        addOAuthUrl(flows?.password?.refreshUrl);
        addOAuthUrl(flows?.clientCredentials?.tokenUrl);
        addOAuthUrl(flows?.clientCredentials?.refreshUrl);
        addOAuthUrl(flows?.authorizationCode?.tokenUrl);
        addOAuthUrl(flows?.authorizationCode?.refreshUrl);
        addOAuthUrl(flows?.implicit?.refreshUrl);
    }
    return Array.from(oauthUrls);
}
