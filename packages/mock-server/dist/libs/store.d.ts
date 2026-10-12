export declare class Store {
    private data;
    /**
     * Get all items in a collection.
     */
    list(collection: string): any[];
    /**
     * Get a single item by ID.
     */
    get(collection: string, id: string): any | undefined;
    /**
     * Create a new item in a collection.
     * Auto-generates an ID if not provided.
     */
    create(collection: string, data: any): any;
    /**
     * Update an existing item in a collection.
     * Returns null if the item is not found.
     */
    update(collection: string, id: string, data: any): any | null;
    /**
     * Delete an item from a collection.
     * Returns null if the item is not found.
     */
    delete(collection: string, id: string): boolean | null;
    /**
     * Clear a specific collection or all collections.
     */
    clear(collection?: string): void;
}
/**
 * Singleton store instance shared across all requests.
 */
export declare const store: Store;
//# sourceMappingURL=store.d.ts.map