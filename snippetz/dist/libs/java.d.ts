import type { BodySegment } from './prepare-request.js';
/** Java literals need octal escapes for controls that Java processes before tokenization. */
export declare const quoteJava: (value: string) => string;
/** Build a byte array while preserving binary file contents in multipart requests. */
export declare const javaBody: (body: BodySegment[] | undefined) => string[];
//# sourceMappingURL=java.d.ts.map