/**
 * Cutdown Repository interface for readonly stores.
 */
export interface ReadRepository<T = any, Key = any> {
    /**
     * Find an model in the store by its key.  If no match is found null is returned.
     * @param id
     */
    find(id: Key): Promise<T | null>;

    /**
     * Get all models in the store. 
     */
    findAll(): Promise<Array<T>>;
}
