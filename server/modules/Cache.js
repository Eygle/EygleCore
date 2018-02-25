"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const q = require("q");
const sizeof = require("object-sizeof");
const Utils_1 = require("../../commons/utils/Utils");
const Logger_1 = require("../config/Logger");
class Cache {
    constructor() {
        this._data = {};
        this._size = 0;
        this._keys = 0;
        this._maxSize = 1024 * 1024 * 50; // 50MB
        setInterval(() => {
            this._removeExpired();
        }, 3600000);
    }
    /**
     * Get cache item for given key
     * @param {string} key
     */
    get(key) {
        const entry = this._data[key];
        if (!entry)
            return null;
        if (entry.t && entry.t <= Date.now()) {
            this.remove(key, true);
            return null;
        }
        entry.u = Date.now();
        return entry.d;
    }
    /**
     * Set cache item for given key
     * @param {string} key
     * @param value
     * @param {number} TTL Time To Live (seconds)
     */
    set(key, value, TTL = 0) {
        const previous = this._data[key];
        const entry = {
            t: TTL > 0 ? Date.now() + (TTL * 1000) : null,
            d: value,
            s: 0,
            u: Date.now()
        };
        entry.s = sizeof(entry) + sizeof(key);
        let action = `Added '${key}' to cache`;
        if (previous) {
            this._size -= previous.s;
            action = `Replaced '${key}' in cache`;
        }
        else {
            this._keys++;
        }
        this._data[key] = entry;
        this._size += entry.s;
        Logger_1.default.trace(`${action} ${this._info()}`);
        this._checkCacheSize();
    }
    /**
     * Remove key from cache
     * @param {string} key
     * @param {boolean} sendLBMsg
     * @param expired
     * @param log
     */
    remove(key, expired = false, log = true) {
        const entry = this._data[key];
        if (entry) {
            delete this._data[key];
            this._size -= entry.s;
            this._keys--;
            if (log) {
                Logger_1.default.trace(`Removed ${expired ? 'expired ' : ''}'${key}' from cache ${this._info()}`);
            }
        }
    }
    _info() {
        return `(total: ${this._keys} keys - ${Utils_1.default.formatSize(this._size)})`;
    }
    /**
     * Check cache size and remove oldest items if size exceed maximum
     * @param {number} size
     * @return {Q.Promise<void>}
     * @private
     */
    _checkCacheSize() {
        const defer = q.defer();
        if (this._maxSize && this._size > this._maxSize) {
            setTimeout(() => {
                // First remove expired values
                this._removeExpired();
                const limit = this._maxSize * 0.75; // Remove elements until cache size is under 3/4 of max size
                let nbr = 0;
                while (this._size > limit) {
                    this._removeOldestValue();
                    nbr++;
                }
                Logger_1.default.info(`Cache size exceeded (${Utils_1.default.formatSize(this._maxSize)}). ${nbr} elements where removed. ${this._info()}`);
            });
        }
        defer.resolve();
        return defer.promise;
    }
    /**
     * Remove expired cached values
     * @private
     */
    _removeExpired() {
        const now = Date.now();
        for (const i in this._data) {
            if (this._data.hasOwnProperty(i) && this._data[i].t <= now) {
                this.remove(i, true);
            }
        }
    }
    /**
     * Remove oldest value from cache
     * @private
     */
    _removeOldestValue() {
        let key = null;
        let date = null;
        for (const i in this._data) {
            if (this._data.hasOwnProperty(i) && (!date || this._data[i].u <= date)) {
                date = this._data[i].u;
                key = i;
            }
        }
        if (key) {
            this.remove(key, false, false);
        }
    }
}
exports.Cache = Cache;
exports.default = new Cache();
//# sourceMappingURL=Cache.js.map