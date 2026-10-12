import type { RootContent } from 'mdast';
/** Parse one description into blocks suitable for insertion into the current document. */
export type DescriptionParser = (value?: string) => Promise<RootContent[]>;
/** Share parsing across pages while giving every rendered document its own reference namespace. */
export declare const createDescriptionParser: () => (() => DescriptionParser);
//# sourceMappingURL=parse-description.d.ts.map