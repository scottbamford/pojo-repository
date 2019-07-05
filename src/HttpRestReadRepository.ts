import { ApiFetch } from 'apifetch-json';
import { ReadRepository } from './ReadRepository';

/**
 * Repository service for read only access over REST apis over HTTP(S).
 * Implements the ReadRepository interface.
 */
export class HttpRestReadRepository<T = any, Key = any> implements ReadRepository {
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
}