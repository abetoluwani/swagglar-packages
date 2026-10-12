import { isObjectLike } from '@scalar/helpers/object/is-object';
/**
 * Escapes a string for use in a Julia double-quoted string literal.
 *
 * Julia interpolates `$` inside string literals, so it has to be escaped as
 * well, otherwise `"$foo"` would be evaluated instead of sent literally.
 */
const escapeString = (str) => str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\$/g, '\\$')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
/**
 * Wraps a string in double quotes, escaped and ready to be inserted into Julia source code.
 */
export const wrapInDoubleQuotes = (str) => `"${escapeString(str)}"`;
/**
 * Produces an indented string using 4 spaces per level, following the Julia style guide.
 */
export const indent = (level, text) => `${' '.repeat(level * 4)}${text}`;
/**
 * Renders a collection (a vector, a `Dict`, a `HTTP.Form`, …) from already formatted entries.
 *
 * Short collections stay on a single line, everything else gets one entry per
 * line so that generated snippets remain readable.
 *
 * @param entries - The formatted entries, without trailing commas
 * @param open - The opening token, for example `[` or `Dict(`
 * @param close - The closing token, for example `]` or `)`
 * @param level - The indentation level the collection itself sits at
 */
export const formatCollection = (entries, open, close, level) => {
    if (entries.length === 0) {
        return `${open}${close}`;
    }
    const [first] = entries;
    if (entries.length === 1 && first && !first.includes('\n')) {
        return `${open}${first}${close}`;
    }
    const lines = entries.map((entry) => indent(level + 1, entry)).join(',\n');
    return `${open}\n${lines}\n${indent(level, close)}`;
};
/**
 * Formats `name => value` pairs as a Julia vector of pairs, which is what HTTP.jl
 * expects for headers and query parameters.
 */
export const formatPairVector = (pairs, level) => formatCollection(pairs.map(({ name, value }) => `${wrapInDoubleQuotes(name)} => ${wrapInDoubleQuotes(value)}`), '[', ']', level);
/**
 * Formats `name => value` pairs as a Julia `Dict`.
 */
export const formatDict = (pairs, level) => formatCollection(pairs.map(({ name, value }) => `${wrapInDoubleQuotes(name)} => ${wrapInDoubleQuotes(value)}`), 'Dict(', ')', level);
/**
 * Converts a parsed JSON value into the equivalent Julia literal.
 *
 * Objects become `Dict`s and arrays become vectors, so the snippet can be edited
 * with plain Julia syntax before it is serialized with `JSON.json`.
 */
export const formatValue = (value, level) => {
    if (value === null || value === undefined) {
        return 'nothing';
    }
    if (typeof value === 'boolean') {
        return value ? 'true' : 'false';
    }
    if (typeof value === 'number') {
        return Number.isFinite(value) ? String(value) : 'nothing';
    }
    if (typeof value === 'string') {
        return wrapInDoubleQuotes(value);
    }
    if (Array.isArray(value)) {
        return formatCollection(value.map((item) => formatValue(item, level + 1)), '[', ']', level);
    }
    if (isObjectLike(value)) {
        return formatCollection(Object.entries(value).map(([key, item]) => `${wrapInDoubleQuotes(key)} => ${formatValue(item, level + 1)}`), 'Dict(', ')', level);
    }
    return wrapInDoubleQuotes(String(value));
};
