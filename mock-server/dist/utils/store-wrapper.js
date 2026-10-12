/**
 * Creates a wrapped store that tracks operations.
 * Returns both the wrapped store and a tracking object that gets updated as operations are performed.
 */
export function createStoreWrapper(store) {
    const tracking = {
        operations: [],
    };
    const wrappedStore = {
        list(collection) {
            const result = store.list(collection);
            tracking.operations.push({ operation: 'list', result });
            return result;
        },
        get(collection, id) {
            const result = store.get(collection, id);
            tracking.operations.push({ operation: 'get', result });
            return result;
        },
        create(collection, data) {
            const result = store.create(collection, data);
            tracking.operations.push({ operation: 'create', result });
            return result;
        },
        update(collection, id, data) {
            const result = store.update(collection, id, data);
            tracking.operations.push({ operation: 'update', result });
            return result;
        },
        delete(collection, id) {
            const result = store.delete(collection, id);
            tracking.operations.push({ operation: 'delete', result });
            return result;
        },
        clear(collection) {
            store.clear(collection);
            // clear() doesn't set tracking as it's not a typical CRUD operation
        },
    };
    return { wrappedStore, tracking };
}
