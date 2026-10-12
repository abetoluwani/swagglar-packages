/** Helper function create an OpenAPI document with security schemss */
export function createOpenApiDefinition(securitySchemes) {
    return {
        openapi: '3.1.1',
        info: { title: 'Test API', version: '1.0.0' },
        components: { securitySchemes },
    };
}
