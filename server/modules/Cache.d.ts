export declare class Cache {
    /**
     * Node cache instance
     */
    private _data;
    /**
     * Cache size in bytes
     */
    private _size;
    /**
     * Number of keys in cache
     */
    private _keys;
    /**
     * Cache max size (bytes)
     */
    private _maxSize;
    constructor();
    /**
     * Get cache item for given key
     * @param {string} key
     */
    get(key: string): any;
    /**
     * Set cache item for given key
     * @param {string} key
     * @param value
     * @param {number} TTL Time To Live (seconds)
     */
    set(key: string, value: any, TTL?: number): void;
    /**
     * Remove key from cache
     * @param {string} key
     * @param {boolean} sendLBMsg
     * @param expired
     * @param log
     */
    remove(key: string, expired?: boolean, log?: boolean): void;
    private _info();
    /**
     * Check cache size and remove oldest items if size exceed maximum
     * @param {number} size
     * @return {Q.Promise<void>}
     * @private
     */
    private _checkCacheSize();
    /**
     * Remove expired cached values
     * @private
     */
    private _removeExpired();
    /**
     * Remove oldest value from cache
     * @private
     */
    private _removeOldestValue();
}
declare const _default: Cache;
export default _default;
