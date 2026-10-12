import type { OpenAPI } from '@scalar/openapi-types';
import type { Hono } from 'hono';
/** Registers a local RFC8628 approval flow before the permissive mock token handlers. */
export declare const setUpDeviceAuthorization: (app: Hono, document?: OpenAPI.Document) => void;
//# sourceMappingURL=set-up-device-authorization.d.ts.map