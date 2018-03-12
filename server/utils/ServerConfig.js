"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tracer = require("tracer");
const ProjectConfig_1 = require("../../commons/utils/ProjectConfig");
const Utils_1 = require("../../commons/utils/Utils");
class ServerConfig {
    static init() {
        this.dlURL = '/files/down';
        this.viewURL = '/files';
        this.sessionSecret = 'Un42Petit12Little75Secret12PuiMap!';
        this.userHash = 'UnPeu42DeseL';
        this.maxLoginAttempts = 5;
        this.loginAttemptsExpire = 24 * 3600 * 1000; // 24 hours
        this.maxIpLoginAttempts = 15;
        this.loginIpAttemptsExpire = 20 * 60 * 1000; // 20 minutes
        this.ipLockedTime = 60 * 60 * 1000; // 1 hour
        this.env = Utils_1.default.getEnvFromName(ProjectConfig_1.default.envName);
        /**
         * Load all ProjectConfig here
         */
        for (const key in ProjectConfig_1.default.server) {
            if (ProjectConfig_1.default.server.hasOwnProperty(key)) {
                this[key] = ProjectConfig_1.default.server[key];
            }
        }
    }
    /**
     * Generate logger with ProjectConfig as default conf but it can be override by given conf
     * @param conf
     * @return {any}
     */
    static generateLogger(conf = {}) {
        const tracerConf = {
            format: conf.format || this.loggerFormat,
            dateFormat: conf.dateFormat || this.loggerDateFormat
        };
        if (this.loggerType === 'console') {
            return tracer.colorConsole(tracerConf);
        }
        tracerConf.root = conf.root || this.loggerRoot;
        tracerConf.maxLogFiles = conf.maxLogFiles || this.loggerMaxLogFiles;
        tracerConf.allLogsFileName = conf.allLogsFileName || this.loggerAllLogsFileName;
        return tracer.dailyfile(tracerConf);
    }
}
exports.default = ServerConfig;
//# sourceMappingURL=ServerConfig.js.map