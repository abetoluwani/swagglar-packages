import type { Heading, InlineCode, Link, List, ListItem, Paragraph, PhrasingContent, Strong, Text } from 'mdast';
/** Collapse HTML-style inline whitespace; the serializer escapes generated text as Markdown. */
export declare const text: (value: unknown) => Text;
/** Inline code fences are chosen by the serializer. */
export declare const inlineCode: (value: unknown) => InlineCode;
/** Construct a paragraph from phrasing nodes. */
export declare const paragraph: (...children: PhrasingContent[]) => Paragraph;
/** Construct an emphasized label. */
export declare const strong: (...children: PhrasingContent[]) => Strong;
/** Construct a section heading. */
export declare const heading: (depth: Heading["depth"], ...children: PhrasingContent[]) => Heading;
/** Construct a list item that may contain nested blocks. */
export declare const item: (...children: ListItem["children"]) => ListItem;
/** Construct an unordered list. */
export declare const list: (children: ListItem[]) => List;
/**
 * Retain rehype-sanitize's protocol policy. The general sanitizeUrl helper allows
 * additional schemes and excludes IRC/XMPP, so it is not compatible here.
 */
export declare const safeUrl: (url: string) => string;
/** Links from OpenAPI metadata follow the same URL policy as descriptions. */
export declare const link: (url: string, label: string) => Link;
/** Render a metadata label and value with the established nonbreaking separator. */
export declare const field: (label: string, value: PhrasingContent) => ListItem;
//# sourceMappingURL=markdown-nodes.d.ts.map