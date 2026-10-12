import { unescapeJsonPointer } from '@scalar/helpers/json/unescape-json-pointer';
import { isObject } from '@scalar/helpers/object/is-object';
import { getResolvedRef, mergeSiblingReferences } from '@scalar/workspace-store/helpers/get-resolved-ref';
import { inlineCode, item, list, paragraph, strong, text } from './markdown-nodes.js';
/** Guards against stack exhaustion. Past it, references to models point to their own section instead. */
const MAX_DEPTH = 64;
/**
 * Deduplicated output is proportional to the schema graph, so only a pathological description
 * (for example a YAML alias graph without references) reaches this.
 */
const MAX_NODES = 100_000;
/** Keywords that `render` expands, as opposed to annotations that `details` prints on one line. */
const structuralKeywords = new Set([
    'allOf',
    'anyOf',
    'oneOf',
    'not',
    'properties',
    'required',
    'items',
    'additionalProperties',
    'discriminator',
    'minItems',
    'maxItems',
    'uniqueItems',
]);
/** Link bookkeeping that is not a sibling keyword of a reference. */
const referenceKeys = new Set(['$ref', '$ref-value', '$global', '$status']);
const emphasis = (...children) => ({ type: 'emphasis', children });
/** Prefer the component name, which is how model sections and other references identify the schema. */
const getReferenceName = (ref) => {
    const match = /^#\/components\/schemas\/([^/]+)$/.exec(ref);
    if (!match)
        return ref;
    try {
        return unescapeJsonPointer(match[1]);
    }
    catch {
        return ref;
    }
};
/** Only references that add nothing structural can be replaced by the schema they point to. */
const getSharedName = (input, view) => {
    const ref = isObject(input) ? input.$ref : undefined;
    if (typeof ref !== 'string' || typeof view.schema !== 'object')
        return undefined;
    if (Object.keys(input).some((key) => structuralKeywords.has(key)))
        return undefined;
    const structured = Boolean(view.allOf?.length || view.anyOf?.length || view.oneOf?.length || view.properties.length) ||
        view.not !== undefined ||
        view.items !== undefined ||
        view.additionalProperties !== undefined;
    // Leaf schemas are as short as a reference to them, so they stay in place.
    return structured ? getReferenceName(ref) : undefined;
};
/** Boolean targets still combine with adjacent schema keywords. */
const resolveMarkdownSchema = (input) => {
    const target = getResolvedRef(input);
    const merged = getResolvedRef(input, mergeSiblingReferences);
    if (typeof target !== 'boolean')
        return merged;
    if (!isObject(merged) ||
        !Object.keys(merged).some((key) => !['$ref', '$ref-value', '$global', '$status'].includes(key)))
        return target;
    if (target)
        return merged;
    // A false target remains impossible, even when siblings describe a type or annotations.
    return { ...merged, allOf: [false, ...(Array.isArray(merged.allOf) ? merged.allOf : [])] };
};
/** Keep merged reference siblings and sorted properties stable throughout an export. */
export const createSchemaRenderer = ({ maxNodes = MAX_NODES } = {}) => {
    const views = new WeakMap();
    const view = (input) => {
        const cached = typeof input === 'object' ? views.get(input) : undefined;
        if (cached)
            return cached;
        // Keep the linked document's nested identities and boolean schemas. Coercing a
        // second time here would discard boolean children and copy recursive targets.
        const schema = resolveMarkdownSchema(input);
        const value = (typeof schema === 'object' ? schema : {});
        const required = new Set(value.required ?? []);
        const properties = Object.entries(value.properties ?? {})
            .filter(([, child]) => typeof child === 'boolean' || (child !== null && typeof child === 'object'))
            .sort(([a], [b]) => Number(required.has(b)) - Number(required.has(a)) || a.localeCompare(b));
        const result = {
            ...value,
            type: typeof schema === 'boolean' ? (schema ? 'any' : 'never') : value.type,
            schema: schema,
            required,
            properties,
        };
        result.name = getSharedName(input, result);
        if (typeof input === 'object')
            views.set(input, result);
        return result;
    };
    const details = (value, property = false, hideDescription = false, showType = true) => {
        if (typeof value.schema === 'boolean')
            return [text(value.schema ? 'any (true schema)' : 'never (false schema)')];
        const type = Array.isArray(value.type) ? value.type.join(' | ') : value.type;
        const nodes = showType && (type || property) ? [inlineCode(type || 'object')] : [];
        const add = (label, entry) => {
            if (entry !== undefined)
                nodes.push(text(`${nodes.length ? ', ' : ''}${label}: `), inlineCode(entry));
        };
        // Later references to a shared schema point back to this name.
        add('schema', value.name);
        add('format', value.format);
        if (value.enum)
            add('possible values', value.enum.map((entry) => JSON.stringify(entry)).join(', '));
        if (value.const !== undefined)
            add('const', JSON.stringify(value.const));
        if (value.default !== undefined)
            add('default', JSON.stringify(value.default));
        for (const key of [
            'minimum',
            'maximum',
            'exclusiveMinimum',
            'exclusiveMaximum',
            'multipleOf',
            'minLength',
            'maxLength',
            'pattern',
            'minProperties',
            'maxProperties',
        ])
            add(key, value[key]);
        for (const key of ['readOnly', 'writeOnly']) {
            if (value[key])
                nodes.push(text(`${nodes.length ? ', ' : ''}${key}`));
        }
        if (!hideDescription && value.description)
            nodes.push(text(`${nodes.length ? ' — ' : ''}${value.description}`));
        return nodes;
    };
    const forDocument = (models = {}) => {
        /** Shared schemas this document already expanded, with the name later references use. */
        const shown = new Map();
        /** Models that the document renders in their own sections after the operations. */
        const sections = new Set(Object.values(models).map((model) => getResolvedRef(model) ?? model));
        let nodeCount = 0;
        /** Refer to a schema expanded elsewhere, keeping annotations the reference itself adds. */
        const reference = (input, value, options, name, location) => {
            const nodes = [];
            const siblings = isObject(input) && Object.keys(input).some((key) => !referenceKeys.has(key));
            if (siblings && !options.hideDetails) {
                const annotations = details({ ...value, name: undefined }, false, options.hideDescription);
                if (annotations.length)
                    nodes.push(paragraph(...annotations));
            }
            nodes.push(paragraph(emphasis(text('Schema '), inlineCode(name), text(` is shown ${location}.`))));
            return nodes;
        };
        const render = (input, depth = 0, ancestors = [], options = {}) => {
            // Follow the original target: merging reference siblings creates fresh objects.
            const identity = getResolvedRef(input) ?? input;
            if (typeof identity === 'object' && ancestors.includes(identity)) {
                return [paragraph(emphasis(text('[Circular Reference]')))];
            }
            const value = view(input);
            // A named model with structural reference siblings is its own schema, not another
            // occurrence of its target. Otherwise either rendering order can hide properties.
            const sharedIdentity = isObject(input) && '$ref' in input && Object.keys(input).some((key) => structuralKeywords.has(key))
                ? input
                : identity;
            const shared = typeof sharedIdentity === 'object' && sharedIdentity !== null ? sharedIdentity : undefined;
            const name = options.name ?? value.name;
            if (shared && name !== undefined) {
                // Expanding every path through a shared schema grows exponentially, so expand it once.
                const previous = shown.get(shared);
                if (previous !== undefined) {
                    // A model section already prints its own annotations above the schema.
                    const referenceOptions = options.name === undefined ? options : { ...options, hideDetails: true };
                    return reference(input, value, referenceOptions, previous, 'above');
                }
                if (value.name !== undefined && options.name === undefined && depth >= MAX_DEPTH && sections.has(shared))
                    return reference(input, value, options, value.name, 'below under Schemas');
            }
            if (depth >= MAX_DEPTH)
                return [paragraph(text('[Maximum schema depth reached]'))];
            if (nodeCount >= maxNodes)
                return [paragraph(emphasis(text('[Schema output truncated]')))];
            nodeCount++;
            if (shared && name !== undefined && !shown.has(shared))
                shown.set(shared, name);
            if (typeof value.schema === 'boolean')
                return options.hideDetails ? [] : [paragraph(...details(value))];
            const childAncestors = [...ancestors, identity];
            const nodes = [];
            for (const [key, label] of [
                ['allOf', 'All of:'],
                ['anyOf', 'Any of:'],
                ['oneOf', 'One of:'],
            ]) {
                if (value[key]?.length)
                    nodes.push(paragraph(strong(text(label))), ...value[key].flatMap((child) => render(child, depth + 1, childAncestors)));
            }
            if (value.not !== undefined)
                nodes.push(paragraph(strong(text('Not:'))), ...render(value.not, depth + 1, childAncestors));
            const array = value.type === 'array' || value.items !== undefined;
            if (!options.hideDetails) {
                // Child sections imply a single container type, but never its nullable alternatives.
                const impliedType = (value.type === 'object' && value.properties.length > 0) ||
                    (value.type === 'array' && value.items !== undefined);
                const annotations = details(value, false, options.hideDescription, !impliedType);
                if (annotations.length)
                    nodes.push(paragraph(...annotations));
            }
            if (value.properties.length) {
                const properties = value.properties.map(([name, schema]) => {
                    const child = view(schema);
                    const label = [inlineCode(name)];
                    if (value.required.has(name))
                        label.push(text(' (required)'));
                    const blocks = [paragraph(strong(...label)), paragraph(...details(child, true))];
                    blocks.push(...render(schema, depth + 1, childAncestors, {
                        hideDetails: true,
                        property: true,
                    }));
                    return item(...blocks);
                });
                nodes.push(list(properties));
            }
            if (array && value.items !== undefined) {
                nodes.push(paragraph(strong(text(options.property ? 'Items:' : 'Array of:'))), ...render(value.items, depth + 1, childAncestors));
            }
            const constraints = [];
            if (value.minItems !== undefined)
                constraints.push(item(paragraph(text('Min items: '), inlineCode(value.minItems))));
            if (value.maxItems !== undefined)
                constraints.push(item(paragraph(text('Max items: '), inlineCode(value.maxItems))));
            if (value.uniqueItems !== undefined)
                constraints.push(item(paragraph(text('Unique items: '), inlineCode(value.uniqueItems))));
            if (constraints.length)
                nodes.push(list(constraints));
            if (value.additionalProperties !== undefined)
                nodes.push(paragraph(strong(text('Additional properties:'))), ...render(value.additionalProperties, depth + 1, childAncestors));
            if (value.discriminator) {
                nodes.push(paragraph(strong(text('Discriminator:')), text(' '), inlineCode(value.discriminator.propertyName)));
                const mappings = Object.entries(value.discriminator.mapping ?? {});
                if (mappings.length)
                    nodes.push(list(mappings.map(([name, target]) => item(paragraph(inlineCode(name), text(': '), inlineCode(target))))));
            }
            return nodes;
        };
        return {
            view,
            render,
            beginSection: () => {
                nodeCount = 0;
            },
            forDocument,
        };
    };
    return forDocument();
};
