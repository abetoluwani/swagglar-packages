import type { OpenAPIV3_2 } from '@scalar/openapi-types';
/** The RFC8414 fields exposed by the mock authorization server. */
type OAuth2Metadata = {
    issuer: string;
    authorization_endpoint?: string;
    device_authorization_endpoint?: string;
    token_endpoint?: string;
    response_types_supported: string[];
    grant_types_supported: string[];
    scopes_supported: string[];
};
/** Advertises local mock endpoints instead of sending clients to the real authorization server. */
export declare const getOAuth2Metadata: (flows: OpenAPIV3_2.OAuth2SecurityScheme["flows"], origin: string) => OAuth2Metadata;
export {};
//# sourceMappingURL=get-oauth2-metadata.d.ts.map