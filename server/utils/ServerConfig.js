"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({__proto__: []} instanceof Array && function (d, b) {
            d.__proto__ = b;
        }) ||
        function (d, b) {
            for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
    return function (d, b) {
        extendStatics(d, b);

        function __() {
            this.constructor = d;
        }

        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var tracer = require("tracer");
var ProjectConfig_1 = require("../../commons/utils/ProjectConfig");
var Utils_1 = require("../../commons/utils/Utils");
var ServerConfig = (function (_super) {
    __extends(ServerConfig, _super);
    function ServerConfig() {
        var _this = _super.call(this) || this;
        _this.dlURL = '/files/down';
        _this.viewURL = '/files';
        _this.sessionSecret = 'Un42Petit12Little75Secret12PuiMap!';
        _this.userHash = 'UnPeu42DeseL';
        _this.maxLoginAttempts = 5;
        _this.loginAttemptsExpire = 24 * 3600 * 1000; // 24 hours
        _this.maxIpLoginAttempts = 15;
        _this.loginIpAttemptsExpire = 20 * 60 * 1000; // 20 minutes
        _this.ipLockedTime = 60 * 60 * 1000; // 1 hour
        _this.env = Utils_1.default.getEnvFromName(ProjectConfig_1.default.envName);
        /**
         * Load all ProjectConfig here
         */
        for (var key in ProjectConfig_1.default.server) {
            if (ProjectConfig_1.default.server.hasOwnProperty(key)) {
                _this[key] = ProjectConfig_1.default.server[key];
            }
        }
        return _this;
    }
    /**
     * Generate logger with ProjectConfig as default conf but it can be override by given conf
     * @param conf
     * @return {any}
     */
    ServerConfig.prototype.generateLogger = function (conf) {
        if (conf === void 0) { conf = {}; }
        var tracerConf = {
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
    };
    return ServerConfig;
}(ProjectConfig_1.AProjectConfigServer));
exports.ServerConfig = ServerConfig;
exports.default = new ServerConfig();
//# sourceMappingURL=ServerConfig.js.map