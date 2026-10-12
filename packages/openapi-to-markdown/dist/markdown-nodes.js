/** Collapse HTML-style inline whitespace; the serializer escapes generated text as Markdown. */
export const text = (value) => ({
    type: 'text',
    value: String(value ?? '').replace(/[\t\n\f\r ]+/g, ' '),
});
/** Inline code fences are chosen by the serializer. */
export const inlineCode = (value) => ({ type: 'inlineCode', value: String(value ?? '') });
/** Construct a paragraph from phrasing nodes. */
export const paragraph = (...children) => ({ type: 'paragraph', children });
/** Construct an emphasized label. */
export const strong = (...children) => ({ type: 'strong', children });
/** Construct a section heading. */
export const heading = (depth, ...children) => ({
    type: 'heading',
    depth,
    children,
});
/** Construct a list item that may contain nested blocks. */
export const item = (...children) => ({ type: 'listItem', spread: false, children });
/** Construct an unordered list. */
export const list = (children) => ({ type: 'list', ordered: false, spread: false, children });
/**
 * Retain rehype-sanitize's protocol policy. The general sanitizeUrl helper allows
 * additional schemes and excludes IRC/XMPP, so it is not compatible here.
 */
export const safeUrl = (url) => {
    const normalized = url.replace(/[\u0000-\u0020\u007f-\u009f]/g, '');
    const protocol = /^([^/?#]*):/.exec(normalized)?.[1];
    return protocol && !['http', 'https', 'irc', 'ircs', 'mailto', 'xmpp'].includes(protocol.toLowerCase()) ? '' : url;
};
/** Links from OpenAPI metadata follow the same URL policy as descriptions. */
export const link = (url, label) => ({ type: 'link', url: safeUrl(url), children: [text(label)] });
/** Render a metadata label and value with the established nonbreaking separator. */
export const field = (label, value) => item(paragraph(strong(text(`${label}:`)), text('\u00a0'), value));
