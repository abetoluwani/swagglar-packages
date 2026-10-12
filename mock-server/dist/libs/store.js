export class Store {
    data = {};
    /**
     * Get all items in a collection.
     */
    list(collection) {
        const items = this.data[collection];
        return items ? Object.values(items) : [];
    }
    /**
     * Get a single item by ID.
     */
    get(collection, id) {
        return this.data[collection]?.[id];
    }
    /**
     * Create a new item in a collection.
     * Auto-generates an ID if not provided.
     */
    create(collection, data) {
        if (!this.data[collection]) {
            this.data[collection] = {};
        }
        // Handle null/undefined data by defaulting to empty object
        const safeData = data ?? {};
        const id = safeData.id ?? crypto.randomUUID();
        const item = { ...safeData, id };
        this.data[collection][id] = item;
        return item;
    }
    /**
     * Update an existing item in a collection.
     * Returns null if the item is not found.
     */
    update(collection, id, data) {
        if (!this.data[collection]?.[id]) {
            return null;
        }
        // Handle null/undefined data by defaulting to empty object
        const safeData = data ?? {};
        const updated = { ...this.data[collection][id], ...safeData, id };
        this.data[collection][id] = updated;
        return updated;
    }
    /**
     * Delete an item from a collection.
     * Returns null if the item is not found.
     */
    delete(collection, id) {
        if (!this.data[collection]?.[id]) {
            return null;
        }
        delete this.data[collection][id];
        return true;
    }
    /**
     * Clear a specific collection or all collections.
     */
    clear(collection) {
        if (collection) {
            delete this.data[collection];
        }
        else {
            this.data = {};
        }
    }
}
/**
 * Singleton store instance shared across all requests.
 */
export const store = new Store();
