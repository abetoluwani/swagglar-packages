import type { OpenAPIV3_2 } from '@scalar/openapi-types';
import type { MockServerLogger } from '../types.js';
/**
 * Log authentication instructions for different security schemes.
 *
 * Only the informational lines go through the provided `log` sink. Warnings and errors about
 * security schemes the mock server cannot handle are printed unconditionally, so a silenced startup
 * still surfaces schemes that will not work.
 */
export declare function logAuthenticationInstructions(securitySchemes: Record<string, OpenAPIV3_2.SecuritySchemeObject>, log?: MockServerLogger): void;
//# sourceMappingURL=log-authentication-instructions.d.ts.map