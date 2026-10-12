import { httpMethods } from '../types.js';
/**
 * Takes a dereferenced OpenAPI document and returns all operations.
 * Keys use their wire capitalization: fixed methods are uppercase, additional methods retain their case.
 * Ignores other attributes, like summary, parameters, etc.
 */
export const getOperations = (path) => {
    const operations = new Map();
    for (const method of httpMethods) {
        if (path?.[method]) {
            operations.set(method.toUpperCase(), path[method]);
        }
    }
    for (const [method, operation] of Object.entries(path?.additionalOperations ?? {})) {
        operations.set(method, operation);
    }
    return Object.fromEntries(operations);
};
