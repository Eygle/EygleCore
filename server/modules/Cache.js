"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var q = require("q");
var sizeof = require("object-sizeof");
var Utils_1 = require("../../commons/utils/Utils");
var Logger_1 = require("../utils/Logger");
var Cache = (function () {
    function Cache() {
    }
    Cache.init = function () {
        var _this = this;
        setInterval(function () {
            _this._removeExpired();
        }, 3600000);
    };
    /**
     * Get cache item for given key
     * @param {string} key
     */
    Cache.get = function (key) {
        var entry = this._data[key];
        if (!entry)
            return null;
        if (entry.t && entry.t <= Date.now()) {
            this.remove(key, true);
            return null;
        }
        entry.u = Date.now();
        return entry.d;
    };
    /**
     * Set cache item for given key
     * @param {string} key
     * @param value
     * @param {number} TTL Time To Live (seconds)
     */
    Cache.set = function (key, value, TTL) {
        if (TTL === void 0) { TTL = 0; }
        var previous = this._data[key];
        var entry = {
            t: TTL > 0 ? Date.now() + (TTL * 1000) : null,
            d: value,
            s: 0,
            u: Date.now()
        };
        entry.s = sizeof(entry) + sizeof(key);
        var action = "Added '" + key + "' to cache";
        if (previous) {
            this._size -= previous.s;
            action = "Replaced '" + key + "' in cache";
        }
        else {
            this._keys++;
        }
        this._data[key] = entry;
        this._size += entry.s;
        Logger_1.default.trace(action + " " + this._info());
        this._checkCacheSize();
    };
    /**
     * Remove key from cache
     * @param {string} key
     * @param {boolean} sendLBMsg
     * @param expired
     * @param log
     */
    Cache.remove = function (key, expired, log) {
        if (expired === void 0) { expired = false; }
        if (log === void 0) { log = true; }
        var entry = this._data[key];
        if (entry) {
            delete this._data[key];
            this._size -= entry.s;
            this._keys--;
            if (log) {
                Logger_1.default.trace("Removed " + (expired ? 'expired ' : '') + "'" + key + "' from cache " + this._info());
            }
        }
    };
    Cache._info = function () {
        return "(total: " + this._keys + " keys - " + Utils_1.default.formatSize(this._size) + ")";
    };
    /**
     * Check cache size and remove oldest items if size exceed maximum
     * @param {number} size
     * @return {Q.Promise<void>}
     * @private
     */
    Cache._checkCacheSize = function () {
        var _this = this;
        var defer = q.defer();
        if (this._maxSize && this._size > this._maxSize) {
            setTimeout(function () {
                // First remove expired values
                _this._removeExpired();
                var limit = _this._maxSize * 0.75; // Remove elements until cache size is under 3/4 of max size
                var nbr = 0;
                while (_this._size > limit) {
                    _this._removeOldestValue();
                    nbr++;
                }
                Logger_1.default.info("Cache size exceeded (" + Utils_1.default.formatSize(_this._maxSize) + "). " + nbr + " elements where removed. " + _this._info());
            });
        }
        defer.resolve();
        return defer.promise;
    };
    /**
     * Remove expired cached values
     * @private
     */
    Cache._removeExpired = function () {
        var now = Date.now();
        for (var i in this._data) {
            if (this._data.hasOwnProperty(i) && this._data[i].t <= now) {
                this.remove(i, true);
            }
        }
    };
    /**
     * Remove oldest value from cache
     * @private
     */
    Cache._removeOldestValue = function () {
        var key = null;
        var date = null;
        for (var i in this._data) {
            if (this._data.hasOwnProperty(i) && (!date || this._data[i].u <= date)) {
                date = this._data[i].u;
                key = i;
            }
        }
        if (key) {
            this.remove(key, false, false);
        }
    };
    /**
     * Node cache instance
     */
    Cache._data = {};
    /**
     * Cache size in bytes
     */
    Cache._size = 0;
    /**
     * Number of keys in cache
     */
    Cache._keys = 0;
    /**
     * Cache max size (bytes)
     */
    Cache._maxSize = 1024 * 1024 * 50; // 50MB
    return Cache;
}());
exports.default = Cache;
Cache.init();
//# sourceMappingURL=Cache.js.map