import { getFirstMediaType } from '@scalar/helpers/http/get-first-media-type';
import { isJsonMediaType } from '@scalar/helpers/http/is-json-media-type';
import { parseMimeType } from '@scalar/helpers/http/mime-type';
import { getResolvedRef } from '@scalar/workspace-store/helpers/get-resolved-ref';
import { getResolvedRefDeep } from '@scalar/workspace-store/helpers/get-resolved-ref-deep';
import { deserializeArrayParameter, deserializeObjectParameter, getObjectPropertyNames, isArraySchema, isObjectSchema, resolveSerialization, } from './deserialize-parameter.js';
/**
 * Find the whole-query parameter, giving operation declarations precedence over path declarations.
 * This module decodes incoming queries; workspace-store/src/helpers/querystring-parameter.ts serializes outgoing ones.
 */
export const findQuerystringParameter = (operation, pathParameters) => [
    ...(Array.isArray(operation?.parameters) ? operation.parameters : []),
    ...(Array.isArray(pathParameters) ? pathParameters : []),
]
    .map((parameter) => getResolvedRef(parameter))
    .find((parameter) => parameter?.in === 'querystring');
/** Collect form properties through compositions so nullable and composed objects retain their encoding. */
const getPropertySchemas = (schema) => {
    const properties = {};
    for (const keyword of ['allOf', 'anyOf', 'oneOf']) {
        const branches = schema?.[keyword];
        if (Array.isArray(branches)) {
            for (const branch of branches) {
                if (branch && typeof branch === 'object') {
                    Object.assign(properties, getPropertySchemas(branch));
                }
            }
        }
    }
    return { ...properties, ...schema?.properties };
};
/** Validate JSON-encoded form properties before the coercing form validator can alter their native types. */
export const getQuerystringJsonSchema = (parameter) => {
    const [contentType, media] = getFirstMediaType(parameter?.content) ?? [];
    if (parseMimeType(contentType).essence !== 'application/x-www-form-urlencoded') {
        return null;
    }
    const selectJsonProperties = (schema) => {
        const properties = (schema?.properties ?? {});
        const jsonProperties = Object.fromEntries(Object.entries(properties).filter(([name, property]) => {
            const encoding = media?.encoding?.[name];
            if (encoding?.style !== undefined || encoding?.explode !== undefined || encoding?.allowReserved !== undefined) {
                return false;
            }
            const item = isArraySchema(property) ? property.items : property;
            return isJsonMediaType(encoding?.contentType) || isObjectSchema(item) || isArraySchema(item);
        }));
        const result = { properties: jsonProperties };
        for (const keyword of ['allOf', 'anyOf', 'oneOf']) {
            const branches = schema?.[keyword];
            if (Array.isArray(branches)) {
                // Non-JSON fields may distinguish oneOf branches. The complete validator enforces exclusivity.
                const target = keyword === 'oneOf' ? 'anyOf' : keyword;
                const selected = branches.map((branch) => selectJsonProperties(branch));
                if (target in result) {
                    result.allOf = [...(Array.isArray(result.allOf) ? result.allOf : []), { [target]: selected }];
                }
                else {
                    result[target] = selected;
                }
            }
        }
        return result;
    };
    return selectJsonProperties(getResolvedRefDeep(media?.schema));
};
/** Decode the complete query without introducing the parameter's documentary name. Throws on malformed JSON or URI escaping. */
export const parseQuerystringParameter = (url, parameter) => {
    const query = new URL(url).search.slice(1);
    if (!query) {
        return undefined;
    }
    const [contentType, media] = getFirstMediaType(parameter.content) ?? [];
    const mediaType = parseMimeType(contentType).essence;
    if (mediaType !== 'application/x-www-form-urlencoded') {
        const decoded = decodeURIComponent(query);
        return isJsonMediaType(mediaType) ? JSON.parse(decoded) : decoded;
    }
    const params = new URLSearchParams(query);
    const map = Object.fromEntries([...new Set(params.keys())].map((key) => {
        const values = params.getAll(key);
        return [key, values.length === 1 ? (values[0] ?? '') : values];
    }));
    const result = { ...map };
    const schema = getResolvedRefDeep(media?.schema);
    const properties = getPropertySchemas(schema);
    for (const name of getObjectPropertyNames(schema)) {
        const property = properties?.[name];
        const encoding = media?.encoding?.[name];
        const single = params.get(name) ?? undefined;
        const styleBased = encoding?.style !== undefined || encoding?.explode !== undefined || encoding?.allowReserved !== undefined;
        if (styleBased) {
            const { style, explode } = resolveSerialization('query', encoding?.style, encoding?.explode);
            const value = isObjectSchema(property)
                ? deserializeObjectParameter({
                    style,
                    explode,
                    single,
                    map,
                    name,
                    propertyNames: getObjectPropertyNames(property),
                    reservedKeys: new Set(Object.keys(properties)),
                })
                : isArraySchema(property)
                    ? deserializeArrayParameter({
                        style,
                        explode,
                        single,
                        multi: params.has(name) ? params.getAll(name) : undefined,
                    })
                    : single;
            if (value !== undefined) {
                if (isObjectSchema(property) &&
                    (style === 'deepObject' || (style === 'form' && explode)) &&
                    typeof value === 'object' &&
                    value !== null) {
                    for (const key of Object.keys(value)) {
                        delete result[style === 'deepObject' ? `${name}[${key}]` : key];
                    }
                }
                result[name] = value;
            }
            continue;
        }
        if (single === undefined) {
            continue;
        }
        const json = isJsonMediaType(encoding?.contentType);
        const decode = (value, itemSchema) => json || isObjectSchema(itemSchema) || isArraySchema(itemSchema) ? JSON.parse(value) : value;
        result[name] = isArraySchema(property)
            ? params.getAll(name).map((value) => decode(value, property?.items))
            : decode(single, property);
    }
    return result;
};
