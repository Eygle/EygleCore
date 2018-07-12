"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const core_enums_1 = require("../core.enums");
class ProjectConfig {
    /**
     * Initialize
     * This method MUST BE called before the class is imported anywhere ! (static issues)
     * @param {string} rootPath
     * @param conf
     * @param {string} envName
     */
    static init(rootPath, conf, envName) {
        this._initForServer(path.resolve(rootPath), conf, envName);
        this._initForClient(conf, envName);
    }
    /**
     *
     * @param conf
     * @param {string} envName
     */
    static _initForClient(conf, envName) {
        this._addCommons(this.client, conf, envName);
        this._addToConf(this.client, {
            loggerLvl: core_enums_1.ELoggerLvl.WARN
        });
        if (conf.client) {
            this._addToConf(this.client, conf.client);
            if (conf.client.hasOwnProperty(envName)) {
                this._addToConf(this.client, conf.client[envName]);
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
        this._addCommons(this.server, conf, envName);
        this._addToConf(this.server, {
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
            this._addToConf(this.server, conf.server);
            if (conf.server.hasOwnProperty(envName)) {
                this._addToConf(this.server, conf.server[envName]);
            }
        }
        this.server.clientRoot = this._formatConfStr(this.server.clientRoot);
        this.server.serverRoot = this._formatConfStr(this.server.serverRoot);
        this.server.apiRoot = this._formatConfStr(this.server.apiRoot);
        this.server.filesRoot = this._formatConfStr(this.server.filesRoot);
        this.server.loggerRoot = this._formatConfStr(this.server.loggerRoot);
        this.server.loggerAllLogsFileName = this._formatConfStr(this.server.loggerAllLogsFileName);
    }
    /**
     * Add common default values
     * @param target
     * @param json
     * @param envName
     * @private
     */
    static _addCommons(target, json, envName) {
        this.envName = envName || 'production';
        // Add default common configuration
        this._addToConf(target, {
            implementsAuth: false,
            includeCronManager: false,
            appName: process.env.NODE_APP,
            debug: false
        });
        this._addToConf(target, json);
        if (json.hasOwnProperty(envName)) {
            this._addToConf(target, json[envName]);
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
        str = str.replace('{{root}}', this.server.root);
        str = str.replace('{{appName}}', this.server.appName || this.client.appName);
        str = str.replace('{{env}}', this.envName);
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
module.exports = ProjectConfig; // used in other projects
//# sourceMappingURL=ProjectConfig.js.map