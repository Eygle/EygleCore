"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tracer = require("tracer");
const ProjectConfig_1 = require("./ProjectConfig");
class Logger {
    constructor() {
        switch (ProjectConfig_1.default.loggerType) {
            case "console":
                this._instance = tracer.colorConsole(ProjectConfig_1.default.logger);
                break;
            case "file":
                this._instance = tracer.dailyfile(ProjectConfig_1.default.logger);
                break;
        }
    }
    /**
     * Trace lvl
     * @param args
     */
    trace(...args) {
        this._instance.trace.apply(this, args);
    }
    /**
     * Log lvl
     * @param args
     */
    log(...args) {
        this._instance.log.apply(this, args);
    }
    /**
     * Info lvl
     * @param args
     */
    info(...args) {
        this._instance.info.apply(this, args);
    }
    /**
     * Debug lvl
     * @param args
     */
    debug(...args) {
        this._instance.debug.apply(this, args);
    }
    /**
     * Warn lvl
     * @param args
     */
    warn(...args) {
        this._instance.warn.apply(this, args);
    }
    /**
     * Error lvl
     * @param args
     */
    error(...args) {
        this._instance.error.apply(this, args);
    }
}
exports.Logger = Logger;
exports.default = new Logger();
//# sourceMappingURL=Logger.js.map