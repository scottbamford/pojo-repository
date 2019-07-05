import { ReadRepository } from './ReadRepository';

/**
 * Repository interface for CRUD access to apis.
 * 
 * To use with REST APIs use HttpRestRepository.  You can also create your own repositories to abstract endpoints and we'll add more standard ones in the future.
 */
export interface Repository<T = any, Key = any> extends ReadRepository {
    /**
     * Create a new model. 
     * 
     * NOTE this does not add the model to the store.  That is only done if save() is called on the returned model.
     */
    create(): Promise<T>;

    /**
     * Save a model back to it's store.
     * @param id
     * @param model
     * @param isCreate
     */
    save(id: Key, model: T, isCreate?: boolean): Promise<void>;

    /**
     * Remove a model from the store.
     * @param id
     */
    remove(id: Key): Promise<void>;
}
