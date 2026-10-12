import type { PartialDeep } from 'type-fest';
import { type ComputedRef, type MaybeRefOrGetter } from 'vue';
/** A locale identifier, for example `en` or `zh-CN`. */
export type Locale = string;
/** Text direction used when rendering localized content. */
export type TextDirection = 'ltr' | 'rtl';
/** Text direction preference. `auto` derives the direction from the locale. */
export type TextDirectionPreference = TextDirection | 'auto';
/** Values interpolated into a translation template through `{name}` placeholders. */
export type TranslateParams = Record<string, number | string>;
/** Translates a dot-path key into a localized string. */
export type TranslateFn<Key extends string> = (key: Key, params?: TranslateParams) => string;
/** Reactive localization context shared through Vue's provide/inject. */
export type LocalizationContext<Translations, Key extends string> = {
    locale: ComputedRef<Locale>;
    direction: ComputedRef<TextDirection>;
    translations: ComputedRef<Translations>;
    translate: TranslateFn<Key>;
};
/** Fully resolved localization state for a single locale. */
export type ResolvedLocalization<Translations> = {
    locale: Locale;
    direction: TextDirection;
    translations: Translations;
};
/** Localization input accepted by a localization instance. */
export type LocalizationInput<Translations> = {
    /** Locale used to select built-in translations. */
    locale?: Locale;
    /** Text direction. `auto` derives the direction from the locale. */
    direction?: TextDirectionPreference;
    /** Custom translations merged on top of the built-in locale and the default fallback. */
    translations?: PartialDeep<Translations>;
};
/** Content and defaults a localization instance is built from. */
export type LocalizationConfig<Translations extends Record<string, unknown>> = {
    /** Built-in translations keyed by locale identifier. Must include {@link LocalizationConfig.defaultLocale}. */
    localeTranslations: Record<string, Translations>;
    /** Locale used as the base fallback when a key or locale is missing. */
    defaultLocale: string;
    /** Languages (primary subtag, for example `ar`) that render right-to-left. */
    rtlLocales: Set<string>;
    /** Prefix used for the missing-translation development warning. */
    logPrefix?: string;
};
/**
 * Creates a localization instance bound to a specific set of translations.
 *
 * The returned `provideLocalization`/`useLocalization` pair shares a single module-level injection
 * key, so a component provided with one instance can be consumed from another package's instance.
 * This is what lets translations flow across package boundaries.
 *
 * @param config - Built-in translations plus locale/direction defaults.
 */
export declare const createLocalization: <Translations extends Record<string, unknown>, Key extends string>(config: LocalizationConfig<Translations>) => {
    resolveLocalization: (localization?: LocalizationInput<Translations>) => ResolvedLocalization<Translations>;
    provideLocalization: (localization: MaybeRefOrGetter<LocalizationInput<Translations> | undefined>) => LocalizationContext<Translations, Key>;
    useLocalization: () => LocalizationContext<Translations, Key>;
};
//# sourceMappingURL=create-localization.d.ts.map