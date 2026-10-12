import type { coerceValue } from '@scalar/workspace-store/schemas/typebox-coerce';
/** The OpenAPI objects outside of schemas that the linking pass tells apart. */
export type ObjectKind = 'document' | 'components' | 'pathItem' | 'operation' | 'callback' | 'response' | 'requestBody' | 'mediaType' | 'encoding' | 'parameter' | 'header' | 'example' | 'link' | 'securityScheme';
/** A value is either one object of a kind, or a map or array whose values all have that kind. */
export type KindPosition = ObjectKind | {
    values: ObjectKind;
};
type TargetSchema = Parameters<typeof coerceValue>[0];
/** Returns the kind of the value stored under `key`, or `undefined` outside the known structure. */
export declare const getChildKind: (position: KindPosition, key: string) => KindPosition | undefined;
/** Strict schemas for the objects that a Reference Object can stand in for. */
export declare const referenceTargetSchemas: Partial<Record<ObjectKind, TargetSchema>>;
export {};
//# sourceMappingURL=object-kinds.d.ts.map