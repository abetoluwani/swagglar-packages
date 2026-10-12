import type { Store } from '../libs/store.js';
/**
 * Public interface of the Store class (methods only, no private properties).
 */
export type StoreInterface = Pick<Store, 'list' | 'get' | 'create' | 'update' | 'delete' | 'clear'>;
/**
 * Represents a single store operation with its result.
 */
type StoreOperation = {
    /** The operation method name that was called. */
    operation: 'get' | 'create' | 'update' | 'delete' | 'list';
    /** The result of the operation. */
    result: any;
};
/**
 * Tracks all store operations performed.
 */
export type StoreOperationTracking = {
    /** All operations performed, in order. */
    operations: StoreOperation[];
};
/**
 * Creates a wrapped store that tracks operations.
 * Returns both the wrapped store and a tracking object that gets updated as operations are performed.
 */
export declare function createStoreWrapper(store: Store): {
    wrappedStore: StoreInterface;
    tracking: StoreOperationTracking;
};
export {};
//# sourceMappingURL=store-wrapper.d.ts.map