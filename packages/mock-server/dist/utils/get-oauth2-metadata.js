import { getPathFromUrl } from './get-open-auth-token-urls.js';
/** Advertises local mock endpoints instead of sending clients to the real authorization server. */
export const getOAuth2Metadata = (flows, origin) => {
    const authorizationFlow = flows?.authorizationCode ?? flows?.implicit;
    const tokenFlow = flows?.authorizationCode ?? flows?.clientCredentials ?? flows?.password ?? flows?.deviceAuthorization;
    const localUrl = (url) => new URL(getPathFromUrl(url), origin).href;
    const supportedFlows = [
        { flow: flows?.authorizationCode, grant: 'authorization_code', response: 'code' },
        { flow: flows?.implicit, grant: 'implicit', response: 'token' },
        { flow: flows?.clientCredentials, grant: 'client_credentials' },
        { flow: flows?.password, grant: 'password' },
        { flow: flows?.deviceAuthorization, grant: 'urn:ietf:params:oauth:grant-type:device_code' },
    ].filter(({ flow }) => flow);
    return {
        issuer: origin,
        ...(flows?.deviceAuthorization
            ? { device_authorization_endpoint: localUrl(flows.deviceAuthorization.deviceAuthorizationUrl || '/oauth/device') }
            : {}),
        ...(authorizationFlow
            ? { authorization_endpoint: localUrl(authorizationFlow.authorizationUrl ?? '/oauth/authorize') }
            : {}),
        ...(tokenFlow ? { token_endpoint: localUrl(tokenFlow.tokenUrl ?? '/oauth/token') } : {}),
        response_types_supported: supportedFlows.flatMap(({ response }) => (response ? [response] : [])),
        grant_types_supported: supportedFlows.map(({ grant }) => grant),
        scopes_supported: [...new Set(supportedFlows.flatMap(({ flow }) => Object.keys(flow?.scopes ?? {})))],
    };
};
