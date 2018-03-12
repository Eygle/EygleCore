export default class Cache {
    /**
     * Node cache instance
     */
    private static _data;
    /**
     * Cache size in bytes
     */
    private static _size;
    /**
     * Number of keys in cache
     */
    private static _keys;
    /**
     * Cache max size (bytes)
     */
    private static _maxSize;
    static init(): void;
    /**
     * Get cache item for given key
     * @param {string} key
     */
    static get(key: string): any;
    /**
     * Set cache item for given key
     * @param {string} key
     * @param value
     * @param {number} TTL Time To Live (seconds)
     */
    static set(key: string, value: any, TTL?: number): void;
    /**
     * Remove key from cache
     * @param {string} key
     * @param {boolean} sendLBMsg
     * @param expired
     * @param log
     */
    static remove(key: string, expired?: boolean, log?: boolean): void;
    private static _info();
    /**
     * Check cache size and remove oldest items if size exceed maximum
     * @param {number} size
     * @return {Q.Promise<void>}
     * @private
     */
    private static _checkCacheSize();
    /**
     * Remove expired cached values
     * @private
     */
    private static _removeExpired();
    /**
     * Remove oldest value from cache
     * @private
     */
    private static _removeOldestValue();
}
