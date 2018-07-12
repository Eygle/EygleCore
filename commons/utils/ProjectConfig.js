"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const core_enums_1 = require("../core.enums");
class ProjectConfig {
    /**
     * Initialize
     * This method MUST BE called before the class is imported anywhere ! (static issues)
     */
    static init() {
        const root = path.resolve(`${path.dirname(process.mainModule.filename)}/..`);
        const conf = require(`${root}/commons/eygle-conf.js`);
        ProjectConfig._initForServer(root, conf, process.env.NODE_ENV);
        ProjectConfig._initForClient(conf, process.env.NODE_ENV);
    }
    /**
     *
     * @param conf
     * @param {string} envName
     */
    static _initForClient(conf, envName) {
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
    }
    /**
     * initialise for server
     * @param {string} rootPath
     * @param conf
     * @param {string} envName
     */
    static _initForServer(rootPath, conf, envName) {
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
    }
    /**
     * Add common default values
     * @param target
     * @param json
     * @param envName
     * @private
     */
    static _addCommons(target, json, envName) {
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
    }
    /**
     * Add all data to conf and erase existing data
     * @param conf
     * @param data
     * @private
     */
    static _addToConf(conf, data) {
        for (let i in data) {
            if (data.hasOwnProperty(i) && typeof data[i] !== 'object') {
                conf[i] = data[i];
            }
        }
    }
    /**
     * Format given string using saved data
     * @param {string} str
     * @return {string}
     * @private
     */
    static _formatConfStr(str) {
        str = str.replace('{{root}}', ProjectConfig.server.root);
        str = str.replace('{{appName}}', ProjectConfig.server.appName || ProjectConfig.client.appName);
        str = str.replace('{{env}}', ProjectConfig.envName);
        str = str.replace('{{pmId}}', process.env.pm_id);
        return str;
    }
}
/**
 * Server configuration
 */
ProjectConfig.server = {};
/**
 * Client configuration
 */
ProjectConfig.client = {};
exports.default = ProjectConfig;
ProjectConfig.init();
//# sourceMappingURL=ProjectConfig.js.map