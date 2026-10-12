import { getValueAtPath } from '@scalar/helpers/object/get-value-at-path';
import { mergeObjects } from '@scalar/helpers/object/merge-objects';
import { computed, effectScope, inject, provide, toValue, } from 'vue';
/**
 * Shared injection key for the localization context.
 *
 * This lives at module scope so that every package consuming `@scalar/localization` injects the
 * exact same symbol a provider used. Instances created through {@link createLocalization} may be
 * typed differently, so the key is intentionally untyped here and narrowed inside each instance.
 * This shared identity is what lets a component provided in one package be consumed from another.
 */
const LOCALIZATION_SYMBOL = Symbol('scalar-localization');
/**
 * Creates a localization instance bound to a specific set of translations.
 *
 * The returned `provideLocalization`/`useLocalization` pair shares a single module-level injection
 * key, so a component provided with one instance can be consumed from another package's instance.
 * This is what lets translations flow across package boundaries.
 *
 * @param config - Built-in translations plus locale/direction defaults.
 */
export const createLocalization = (config) => {
    const { localeTranslations, defaultLocale, rtlLocales, logPrefix = '[@scalar/localization]' } = config;
    const resolveBuiltInLocale = (locale) => {
        if (!locale) {
            return defaultLocale;
        }
        if (locale in localeTranslations) {
            return locale;
        }
        const normalized = locale.replace('_', '-').toLowerCase();
        if (normalized.startsWith('zh') && 'zh-CN' in localeTranslations) {
            return 'zh-CN';
        }
        const language = normalized.split('-')[0];
        const match = Object.keys(localeTranslations).find((key) => key.toLowerCase() === language);
        return match ?? defaultLocale;
    };
    const resolveDirection = (localization) => {
        if (localization?.direction && localization.direction !== 'auto') {
            return localization.direction;
        }
        const locale = localization?.locale ?? defaultLocale;
        const language = locale.replace('_', '-').split('-')[0]?.toLowerCase();
        return language && rtlLocales.has(language) ? 'rtl' : 'ltr';
    };
    const resolveLocalization = (localization) => {
        const locale = localization?.locale ?? defaultLocale;
        const builtInLocale = resolveBuiltInLocale(locale);
        // The default locale is the base every other layer merges onto, so a missing key always
        // falls back to it rather than to the raw key.
        const base = localeTranslations[defaultLocale] ?? {};
        const translations = mergeObjects(mergeObjects(base, localeTranslations[builtInLocale]), localization?.translations);
        return {
            locale,
            direction: resolveDirection(localization),
            translations,
        };
    };
    const translate = (translations, key, params) => {
        const value = getValueAtPath(translations, key.split('.'));
        // Accessed defensively so the engine is safe outside a Vite/Vitest context, where
        // `import.meta.env` is not defined.
        const isDev = import.meta.env?.DEV;
        if (typeof value !== 'string' && isDev) {
            console.warn(`${logPrefix} Missing translation for key "${key}". Falling back to the key itself.`);
        }
        const template = typeof value === 'string' ? value : key;
        if (!params) {
            return template;
        }
        return Object.entries(params).reduce((result, [param, paramValue]) => result.replaceAll(`{${param}}`, () => String(paramValue)), template);
    };
    const createContext = (localization) => {
        const resolved = computed(() => resolveLocalization(toValue(localization)));
        return {
            locale: computed(() => resolved.value.locale),
            direction: computed(() => resolved.value.direction),
            translations: computed(() => resolved.value.translations),
            translate: (key, params) => translate(resolved.value.translations, key, params),
        };
    };
    const ownContexts = new WeakSet();
    const provideLocalization = (localization) => {
        const context = createContext(localization);
        ownContexts.add(context);
        provide(LOCALIZATION_SYMBOL, context);
        return context;
    };
    // Built once per instance and reused as the no-provider fallback, so `useLocalization` does not
    // construct a fresh context (and its computed chain) on every call.
    const fallbackContext = createContext(undefined);
    const inheritedContexts = new WeakMap();
    const useLocalization = () => {
        const inherited = inject(LOCALIZATION_SYMBOL, fallbackContext);
        if (inherited === fallbackContext || ownContexts.has(inherited)) {
            return inherited;
        }
        // Packages can contribute different dictionaries under the same provider. Resolve their own
        // defaults before consuming the inherited overrides, and share that work between consumers.
        const cached = inheritedContexts.get(inherited);
        if (cached) {
            return cached;
        }
        // This cached context outlives the first consumer. A detached scope makes ownership explicit;
        // the context contains only lazy computeds, with no watchers or external resources to dispose.
        const context = effectScope(true).run(() => createContext(() => ({
            locale: inherited.locale.value,
            direction: inherited.direction.value,
            translations: inherited.translations.value,
        })));
        inheritedContexts.set(inherited, context);
        return context;
    };
    return {
        resolveLocalization,
        provideLocalization,
        useLocalization,
    };
};
