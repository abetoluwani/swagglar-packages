import { isObjectLike } from '@scalar/helpers/object/is-object';
/** Default serialization style per parameter location. */
const DEFAULT_STYLE = {
    query: 'form',
    cookie: 'form',
    path: 'simple',
    header: 'simple',
};
/**
 * Resolve the effective `style` and `explode` for a parameter, applying the OpenAPI defaults.
 *
 * `explode` defaults to `true` only for the `form` style and `false` for every other style, so the
 * default depends on the resolved style rather than the location alone.
 */
export const resolveSerialization = (location, style, explode) => {
    const resolvedStyle = style ?? DEFAULT_STYLE[location];
    return { style: resolvedStyle, explode: explode ?? resolvedStyle === 'form' };
};
/**
 * Whether any composed subschema satisfies the predicate, looking through `anyOf`/`oneOf`/`allOf`.
 *
 * Optional array/object parameters are commonly described as `anyOf: [{ type: 'array' }, { type: 'null' }]`
 * (for example FastAPI/Pydantic `Optional[List[str]]`). Without unwrapping these we would treat the value
 * as a plain string and skip style-aware deserialization. Mirrors `getStructuredType` in
 * `@scalar/workspace-store`'s `de-serialize-parameter`.
 */
const matchesComposedSchema = (schema, predicate) => {
    for (const keyword of ['anyOf', 'oneOf', 'allOf']) {
        const subSchemas = schema[keyword];
        if (Array.isArray(subSchemas)) {
            for (const subSchema of subSchemas) {
                if (isObjectLike(subSchema) && predicate(subSchema)) {
                    return true;
                }
            }
        }
    }
    return false;
};
/** Whether a resolved schema describes an array, including the OpenAPI 3.1 `type: ['array', 'null']` form. */
export const isArraySchema = (schema) => {
    if (!schema) {
        return false;
    }
    const type = schema.type;
    if (type === 'array' || (Array.isArray(type) && type.includes('array')) || 'items' in schema) {
        return true;
    }
    return matchesComposedSchema(schema, isArraySchema);
};
/** Whether a resolved schema describes an object, including the OpenAPI 3.1 `type: ['object', 'null']` form. */
export const isObjectSchema = (schema) => {
    if (!schema) {
        return false;
    }
    const type = schema.type;
    if (type === 'object' || (Array.isArray(type) && type.includes('object')) || 'properties' in schema) {
        return true;
    }
    return matchesComposedSchema(schema, isObjectSchema);
};
/**
 * Collect the declared property names of an object schema, looking through `anyOf`/`oneOf`/`allOf`.
 *
 * `isObjectSchema` unwraps composed schemas (for example an optional object written as
 * `anyOf: [{ type: 'object', properties: {…} }, { type: 'null' }]`), so property extraction has to do the
 * same. Otherwise the names live on a subschema, the top level looks empty, and exploded `form` objects
 * fall back to free-form gathering — claiming unrelated keys and failing `additionalProperties: false`.
 */
export const getObjectPropertyNames = (schema) => {
    if (!schema) {
        return [];
    }
    const names = new Set();
    const properties = schema.properties;
    if (properties && typeof properties === 'object') {
        for (const key of Object.keys(properties)) {
            names.add(key);
        }
    }
    for (const keyword of ['anyOf', 'oneOf', 'allOf']) {
        const subSchemas = schema[keyword];
        if (Array.isArray(subSchemas)) {
            for (const subSchema of subSchemas) {
                if (isObjectLike(subSchema)) {
                    for (const name of getObjectPropertyNames(subSchema)) {
                        names.add(name);
                    }
                }
            }
        }
    }
    return [...names];
};
const wrap = (value) => (value === undefined ? undefined : [value]);
// An empty value is an empty list, not a one-element list of the empty string. Otherwise `?ids=`
// would satisfy a `minItems: 1` array while failing the element type check on `''`.
const split = (value, delimiter) => value === undefined ? undefined : value === '' ? [] : value.split(delimiter);
/**
 * Build an exploded array from the repeated values (query) or the single value (other locations).
 *
 * A lone empty value (`?ids=`) is an empty array, not `['']`, matching the non-exploded `split`
 * behaviour so an optional empty array is not rejected on its element type and `minItems` runs as
 * intended. An explicitly repeated empty (`?ids=a&ids=`) keeps every element.
 */
const explodedArray = (single, multi) => {
    const values = multi ?? wrap(single);
    if (values === undefined) {
        return undefined;
    }
    return values.length === 1 && values[0] === '' ? [] : values;
};
/** Drop a leading prefix (for example the `.` of `label` or the `;` of `matrix`) when present. */
const stripPrefix = (value, prefix) => value.startsWith(prefix) ? value.slice(prefix.length) : value;
/** Return the part of a `key=value` segment after the first `=`, or the whole segment when there is none. */
const valueAfterEquals = (segment) => {
    const equals = segment.indexOf('=');
    return equals === -1 ? segment : segment.slice(equals + 1);
};
/** Split a `matrix`-encoded value into its `;`-separated segments, dropping the leading `;` and empties. */
const matrixSegments = (value) => stripPrefix(value, ';')
    .split(';')
    .filter((segment) => segment.length > 0);
/**
 * Split a `label`-encoded value into its parts, dropping the leading `.`. Per the OpenAPI serialization
 * rules a non-exploded `label` value is comma-separated (`.blue,black,brown`, `.R,100,G,200`) while an
 * exploded one is dot-separated (`.blue.black.brown`, `.R=100.G=200`). An empty value means no parts.
 */
const labelParts = (value, explode) => {
    const inner = stripPrefix(value, '.');
    return inner === '' ? [] : inner.split(explode ? '.' : ',');
};
/** Build an object from a list of `key=value` segments (for example `['R=100', 'G=200']`). */
const pairsFromList = (parts) => {
    const result = {};
    for (const part of parts) {
        const equals = part.indexOf('=');
        if (equals !== -1) {
            result[part.slice(0, equals)] = part.slice(equals + 1);
        }
    }
    return result;
};
/** Build an object from a flat list alternating key, value (for example `['R', '100', 'G', '200']`). */
const alternatingFromList = (parts) => {
    const result = {};
    // Walk in pairs; a trailing key without a value is ignored.
    for (let index = 0; index + 1 < parts.length; index += 2) {
        const key = parts[index];
        const propertyValue = parts[index + 1];
        if (key !== undefined && propertyValue !== undefined) {
            result[key] = propertyValue;
        }
    }
    return result;
};
/**
 * Deserialize a `matrix`-style array (path only). Non-exploded values join the elements after a single
 * `;name=` prefix (`;ids=1,2,3`), while exploded values repeat the prefix per element (`;ids=1;ids=2`).
 */
const parseMatrixArray = (value, explode) => {
    if (value === undefined) {
        return undefined;
    }
    const segments = matrixSegments(value);
    if (explode) {
        return segments.map(valueAfterEquals);
    }
    // Non-exploded: a single `name=a,b,c` segment whose value is comma-separated.
    const [first] = segments;
    return first === undefined ? [] : valueAfterEquals(first).split(',');
};
/**
 * Deserialize a string-encoded array parameter into its elements.
 *
 * Returns `undefined` when the parameter is absent so the caller can enforce `required` separately.
 * Object parameters (`deepObject`, simple/form objects) are not handled yet and are validated as-is.
 */
export const deserializeArrayParameter = ({ style, explode, single, multi, }) => {
    switch (style) {
        case 'spaceDelimited':
            return explode ? explodedArray(single, multi) : split(single, ' ');
        case 'pipeDelimited':
            return explode ? explodedArray(single, multi) : split(single, '|');
        case 'simple':
            // Path and header arrays are comma-separated; `explode` does not change the delimiter. HTTP allows
            // optional whitespace after the comma in header list values (`a, b, c`), so trim each element.
            return single === undefined ? undefined : single === '' ? [] : single.split(',').map((element) => element.trim());
        case 'label':
            // Path `label` arrays are dot-prefixed. Non-exploded values are comma-separated (`.1,2,3`),
            // exploded values are dot-separated (`.1.2.3`).
            return single === undefined ? undefined : labelParts(single, explode);
        case 'matrix':
            return parseMatrixArray(single, explode);
        default:
            // `form` (and any unrecognised style): an exploded array repeats the key, otherwise it is comma-joined.
            return explode ? explodedArray(single, multi) : split(single, ',');
    }
};
/** Parse `R,100,G,200` (a flat list alternating key, value) into an object. */
const parseAlternating = (value, delimiter) => value === undefined ? undefined : alternatingFromList(value.split(delimiter));
/** Parse `R=100,G=200` (delimiter-separated `key=value` pairs) into an object. */
const parsePairs = (value, delimiter) => value === undefined ? undefined : pairsFromList(value.split(delimiter));
/** Parse `name[R]=100&name[G]=200` from the query map into an object. */
const parseDeepObject = (query, name) => {
    const prefix = `${name}[`;
    const result = {};
    for (const [key, value] of Object.entries(query)) {
        if (!key.startsWith(prefix) || !key.endsWith(']')) {
            continue;
        }
        const property = key.slice(prefix.length, -1);
        // `deepObject` only defines a single level of nesting, so ignore keys like `name[a][b]` whose
        // property still contains brackets rather than emitting a corrupt `a][b` property.
        if (property.includes('[') || property.includes(']')) {
            continue;
        }
        result[property] = value;
    }
    return Object.keys(result).length > 0 ? result : undefined;
};
/**
 * Deserialize a string-encoded object parameter into its properties, following the OpenAPI
 * `style`/`explode` rules. Property values stay as strings so the caller can coerce them against the
 * object's property schemas.
 *
 * Returns `undefined` when the parameter is absent so the caller can enforce `required` separately.
 * Property values are strings, except for repeated query keys (an array-valued property such as
 * `filter[tags]=a&filter[tags]=b`), which stay as a string array.
 */
export const deserializeObjectParameter = ({ style, explode, single, map, name, propertyNames, reservedKeys, }) => {
    // `deepObject`: properties are encoded as bracketed query keys, e.g. `color[R]=100`.
    if (style === 'deepObject') {
        return map ? parseDeepObject(map, name) : undefined;
    }
    // Exploded `form`: each property is its own top-level key, e.g. `R=100&G=200` (one cookie per property
    // for cookies). With declared properties we gather exactly those; a free-form object (no declared
    // properties) claims every remaining key in the location, excluding keys owned by *other* declared
    // parameters. Its own name stays claimable, so a property named like the parameter is not dropped.
    if (style === 'form' && explode) {
        if (!map) {
            return undefined;
        }
        const keys = propertyNames?.length
            ? propertyNames
            : Object.keys(map).filter((key) => key === name || !reservedKeys?.has(key));
        const result = {};
        for (const property of keys) {
            const value = map[property];
            if (value !== undefined) {
                result[property] = value;
            }
        }
        return Object.keys(result).length > 0 ? result : undefined;
    }
    // Exploded `simple` (path/header): comma-separated `key=value` pairs, e.g. `R=100,G=200`.
    if (style === 'simple' && explode) {
        return parsePairs(single, ',');
    }
    // `label` (path): dot-prefixed. Exploded uses dot-separated `key=value`, e.g. `.R=100.G=200`;
    // non-exploded alternates comma-separated key and value, e.g. `.R,100,G,200`.
    if (style === 'label') {
        if (single === undefined) {
            return undefined;
        }
        const parts = labelParts(single, explode);
        return explode ? pairsFromList(parts) : alternatingFromList(parts);
    }
    // `matrix` (path): semicolon-prefixed. Exploded repeats `;key=value` per property, e.g. `;R=100;G=200`;
    // non-exploded carries everything in one `;name=R,100,G,200` segment.
    if (style === 'matrix') {
        if (single === undefined) {
            return undefined;
        }
        const segments = matrixSegments(single);
        if (explode) {
            return pairsFromList(segments);
        }
        const [first] = segments;
        return first === undefined ? {} : alternatingFromList(valueAfterEquals(first).split(','));
    }
    // `spaceDelimited` / `pipeDelimited` (query): a flat alternating key,value list joined by the
    // delimiter, e.g. `R 100 G 200` or `R|100|G|200`. Only defined for the non-exploded form.
    if (style === 'spaceDelimited') {
        return parseAlternating(single, ' ');
    }
    if (style === 'pipeDelimited') {
        return parseAlternating(single, '|');
    }
    // Non-exploded `form` and `simple`: a flat list alternating key, value, e.g. `R,100,G,200`.
    return parseAlternating(single, ',');
};
