"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var core_enums_1 = require("../core.enums");
var ProjectConfig = (function () {
    function ProjectConfig() {
    }
    /**
     * Initialize
     * This method MUST BE called before the class is imported anywhere ! (static issues)
     */
    ProjectConfig.init = function () {
        if (process) {
            var root = path.resolve(path.dirname(process.mainModule.filename) + "/..");
            var conf = require(root + "/commons/eygle-conf.js");
            ProjectConfig._initForServer(root, conf, process.env.NODE_ENV);
        }
    };
    /**
     *
     * @param conf
     * @param {string} envName
     */
    ProjectConfig.initForClient = function (conf, envName) {
        ProjectConfig._addCommons(ProjectConfig.client, conf, envName);
        ProjectConfig._addToConf(ProjectConfig.client, {
            loggerLvl: core_enums_1.ELoggerLvl.WARN
        });
        if (conf.client) {
            ProjectConfig._addToConf(ProjectConfig.client, conf.client);
            if (conf.client.hasOwnProperty(envName)) {
                ProjectConfig._addToConf(ProjectConfig.client, conf.client[envName]);
            }
        }
    };
    /**
     * initialise for server
     * @param {string} rootPath
     * @param conf
     * @param {string} envName
     */
    ProjectConfig._initForServer = function (rootPath, conf, envName) {
        ProjectConfig._addCommons(ProjectConfig.server, conf, envName);
        ProjectConfig._addToConf(ProjectConfig.server, {
            includeEmailUnsubscribe: false,
            activateCSRFSecurity: false,
            root: rootPath,
            port: process.env.PORT,
            sessionCookieName: 'eygle-connect.sid',
            clientRoot: '{{root}}/client',
            serverRoot: '{{root}}/server',
            apiRoot: '{{root}}/server/api',
            filesRoot: '{{root}}/server/files',
            dbCollectionsPrefix: '',
            loggerType: 'console',
            loggerFormat: '{{timestamp}} <{{title}}> {{message}}',
            loggerDateFormat: 'H:MM:ss.L',
            loggerRoot: '{{root}}/server/logs',
            loggerMaxLogFiles: 10,
            loggerAllLogsFileName: '{{appName}}-{{env}}-{{pmId}}.log'
        });
        if (conf.server) {
            ProjectConfig._addToConf(ProjectConfig.server, conf.server);
            if (conf.server.hasOwnProperty(envName)) {
                ProjectConfig._addToConf(ProjectConfig.server, conf.server[envName]);
            }
        }
        ProjectConfig.server.clientRoot = ProjectConfig._formatConfStr(ProjectConfig.server.clientRoot);
        ProjectConfig.server.serverRoot = ProjectConfig._formatConfStr(ProjectConfig.server.serverRoot);
        ProjectConfig.server.apiRoot = ProjectConfig._formatConfStr(ProjectConfig.server.apiRoot);
        ProjectConfig.server.filesRoot = ProjectConfig._formatConfStr(ProjectConfig.server.filesRoot);
        ProjectConfig.server.loggerRoot = ProjectConfig._formatConfStr(ProjectConfig.server.loggerRoot);
        ProjectConfig.server.loggerAllLogsFileName = ProjectConfig._formatConfStr(ProjectConfig.server.loggerAllLogsFileName);
    };
    /**
     * Add common default values
     * @param target
     * @param json
     * @param envName
     * @private
     */
    ProjectConfig._addCommons = function (target, json, envName) {
        ProjectConfig.envName = envName || 'production';
        // Add default common configuration
        ProjectConfig._addToConf(target, {
            implementsAuth: false,
            includeCronManager: false,
            appName: process.env.NODE_APP,
            debug: false
        });
        ProjectConfig._addToConf(target, json);
        if (json.hasOwnProperty(envName)) {
            ProjectConfig._addToConf(target, json[envName]);
        }
    };
    /**
     * Add all data to conf and erase existing data
     * @param conf
     * @param data
     * @private
     */
    ProjectConfig._addToConf = function (conf, data) {
        for (var i in data) {
            if (data.hasOwnProperty(i) && typeof data[i] !== 'object') {
                conf[i] = data[i];
            }
        }
    };
    /**
     * Format given string using saved data
     * @param {string} str
     * @return {string}
     * @private
     */
    ProjectConfig._formatConfStr = function (str) {
        str = str.replace('{{root}}', ProjectConfig.server.root);
        str = str.replace('{{appName}}', ProjectConfig.server.appName || ProjectConfig.client.appName);
        str = str.replace('{{env}}', ProjectConfig.envName);
        str = str.replace('{{pmId}}', process.env.pm_id);
        return str;
    };
    /**
     * Server configuration
     */
    ProjectConfig.server = {};
    /**
     * Client configuration
     */
    ProjectConfig.client = {};
    return ProjectConfig;
}());
exports.default = ProjectConfig;
var AProjectConfigCommon = (function () {
    function AProjectConfigCommon() {
    }
    return AProjectConfigCommon;
}());
exports.AProjectConfigCommon = AProjectConfigCommon;
var AProjectConfigServer = (function (_super) {
    __extends(AProjectConfigServer, _super);
    function AProjectConfigServer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return AProjectConfigServer;
}(AProjectConfigCommon));
exports.AProjectConfigServer = AProjectConfigServer;
ProjectConfig.init();
var AProjectConfigClient = (function (_super) {
    __extends(AProjectConfigClient, _super);
    function AProjectConfigClient() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return AProjectConfigClient;
}(AProjectConfigCommon));
exports.AProjectConfigClient = AProjectConfigClient;
//# sourceMappingURL=ProjectConfig.js.map