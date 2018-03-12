"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ServerConfig_1 = require("./ServerConfig");
class Logger {
    static init() {
        this._instance = ServerConfig_1.default.generateLogger();
    }
    /**
     * Trace lvl
     * @param args
     */
    static trace(...args) {
        this._instance.trace.apply(this, args);
    }
    /**
     * Log lvl
     * @param args
     */
    static log(...args) {
        this._instance.log.apply(this, args);
    }
    /**
     * Info lvl
     * @param args
     */
    static info(...args) {
        this._instance.info.apply(this, args);
    }
    /**
     * Debug lvl
     * @param args
     */
    static debug(...args) {
        this._instance.debug.apply(this, args);
    }
    /**
     * Warn lvl
     * @param args
     */
    static warn(...args) {
        this._instance.warn.apply(this, args);
    }
    /**
     * Error lvl
     * @param args
     */
    static error(...args) {
        this._instance.error.apply(this, args);
    }
}
exports.default = Logger;
//# sourceMappingURL=Logger.js.map