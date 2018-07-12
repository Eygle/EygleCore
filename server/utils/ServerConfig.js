"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tracer = require("tracer");
const ProjectConfig_1 = require("../../commons/utils/ProjectConfig");
const Utils_1 = require("../../commons/utils/Utils");
class ServerConfig {
    static init() {
        ServerConfig.dlURL = '/files/down';
        ServerConfig.viewURL = '/files';
        ServerConfig.sessionSecret = 'Un42Petit12Little75Secret12PuiMap!';
        ServerConfig.userHash = 'UnPeu42DeseL';
        ServerConfig.maxLoginAttempts = 5;
        ServerConfig.loginAttemptsExpire = 24 * 3600 * 1000; // 24 hours
        ServerConfig.maxIpLoginAttempts = 15;
        ServerConfig.loginIpAttemptsExpire = 20 * 60 * 1000; // 20 minutes
        ServerConfig.ipLockedTime = 60 * 60 * 1000; // 1 hour
        ServerConfig.env = Utils_1.default.getEnvFromName(ProjectConfig_1.default.envName);
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
            format: conf.format || ServerConfig.loggerFormat,
            dateFormat: conf.dateFormat || ServerConfig.loggerDateFormat
        };
        if (ServerConfig.loggerType === 'console') {
            return tracer.colorConsole(tracerConf);
        }
        tracerConf.root = conf.root || ServerConfig.loggerRoot;
        tracerConf.maxLogFiles = conf.maxLogFiles || ServerConfig.loggerMaxLogFiles;
        tracerConf.allLogsFileName = conf.allLogsFileName || ServerConfig.loggerAllLogsFileName;
        return tracer.dailyfile(tracerConf);
    }
}
exports.default = ServerConfig;
ServerConfig.init();
//# sourceMappingURL=ServerConfig.js.map