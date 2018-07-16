"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ServerConfig_1 = require("./ServerConfig");
var Logger = (function () {
    function Logger() {
    }
    Logger.init = function () {
        this._instance = ServerConfig_1.default.generateLogger();
    };
    /**
     * Trace lvl
     * @param args
     */
    Logger.trace = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this._instance.trace.apply(this, args);
    };
    /**
     * Log lvl
     * @param args
     */
    Logger.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this._instance.log.apply(this, args);
    };
    /**
     * Info lvl
     * @param args
     */
    Logger.info = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this._instance.info.apply(this, args);
    };
    /**
     * Debug lvl
     * @param args
     */
    Logger.debug = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this._instance.debug.apply(this, args);
    };
    /**
     * Warn lvl
     * @param args
     */
    Logger.warn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this._instance.warn.apply(this, args);
    };
    /**
     * Error lvl
     * @param args
     */
    Logger.error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this._instance.error.apply(this, args);
    };
    return Logger;
}());
exports.default = Logger;
//# sourceMappingURL=Logger.js.map