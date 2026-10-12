import { store } from '../libs/store.js';
import { createStoreWrapper } from './store-wrapper.js';
/**
 * Build the seed context for a schema.
 */
export function buildSeedContext(schemaKey) {
    const { wrappedStore } = createStoreWrapper(store);
    return {
        store: wrappedStore,
        schema: schemaKey,
    };
}
