import { getResolvedRef } from '@scalar/workspace-store/helpers/get-resolved-ref';
const isArrayResponseSchema = (schema) => {
    if (!schema) {
        return false;
    }
    const resolvedSchema = getResolvedRef(schema);
    if (!resolvedSchema || typeof resolvedSchema !== 'object') {
        return false;
    }
    if ('type' in resolvedSchema) {
        if (resolvedSchema.type === 'array') {
            return true;
        }
        if (Array.isArray(resolvedSchema.type) && resolvedSchema.type.includes('array')) {
            return true;
        }
    }
    return 'items' in resolvedSchema;
};
export const normalizeResponseBody = (body, schema) => {
    if (body === null || body === undefined || Array.isArray(body) || !isArrayResponseSchema(schema)) {
        return body;
    }
    return [body];
};
