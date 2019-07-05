import { ApiFetch } from 'apifetch-json';
import { Repository } from './Repository';

/**
 * Repository service for CRUD access over REST apis over HTTP(S).  Implements the Repository interface.
 */
export class HttpRestRepository<T = any, Key = any> implements Repository {
    protected readonly url: string = '';
    protected readonly api: ApiFetch;

    /**
     * Constructor.
     * @param url URL of the REST endpoint.
     * @param apiFetch custom ApiFetch object used for network access.
     */
    constructor(url: string, apiFetch?: ApiFetch) {
        this.url = url;
        this.api = apiFetch ? apiFetch : new ApiFetch();
    }

    /**
     * Find an model in the store by its key.  If no match is found null is returned.
     * @param id
     */
    async find(id: string): Promise<T> {
        const url = `${this.url}/${encodeURIComponent(id)}`;
        let ret = this.api.get<T>(url, undefined, { expireOnEvents: [url] /* expire only if we are told this specific id has changed. */ });
        return ret;
    }

    /**
     * Get all models in the store.
     */
    async findAll(): Promise<Array<T>> {
        let ret = await this.api.get<Array<T>>(this.url, undefined, { expireOnEvents: [this.url], /* Clear cache when model of this type is changed. */ });
        return ret;
    }

    /**
     * Create a new model.
     *
     * NOTE this does not add the model to the store.  That is only done if save() is called on the returned model.
     */
    async create(): Promise<T> {
        return {} as T;
        //// Read the defaults from the server.
        //// NOTE we don't allow the results to be cached as we want the server to perform any logic it needs, including time and user
        //// sensative logic if required.
        //let ret = await this.api.fetch<T>(`${this.url}/defaults`, undefined, { allowCacheRead: false, allowCacheWrite: false });
        //return ret;
    }

    /**
     * Save a model back to it's store.
     * @param id
     * @param model
     * @param isCreate
     */
    async save(id: string, model: T, isCreate?: boolean): Promise<void> {
        if (isCreate) {
            let url = `${this.url}/`;
            await this.api.post(url, model);
        } else {
            let url = `${this.url}/${encodeURIComponent(id)}`;
            await this.api.put(url, model);
        }
        
        this.raiseExpiryEvents(id);
    }

    /**
     * Remove a model from the store.
     * @param id
     */
    async remove(id: string): Promise<void> {
        let url = `${this.url}/${encodeURIComponent(id)}`;

        await this.api.delete(url);
        this.raiseExpiryEvents(id);
    }

    /**
     * Raise the expiry events for models being saved through this repository.
     * We expire the specific id thats changed, and anyone listening to the root
     * endpoint URL as well.
     */
    protected raiseExpiryEvents(id: string) {
        this.api.raiseExpireEvents(`${this.url}/${encodeURIComponent(id)}`, this.url);
    }
}