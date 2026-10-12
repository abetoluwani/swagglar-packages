import type { RootContent } from 'mdast';
import { type ExampleSource } from './get-markdown-examples.js';
import type { DescriptionParser } from './parse-description.js';
/** Render supplied examples before considering a schema-generated fallback. */
export declare const renderExamples: (source: ExampleSource, description: DescriptionParser, mediaType?: string, mode?: "read" | "write", openapiVersion?: string, schemaOpenapiVersion?: string) => Promise<RootContent[]>;
//# sourceMappingURL=render-examples.d.ts.map