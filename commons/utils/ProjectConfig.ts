import * as path from 'path';
import {ELoggerLvl} from '../core.enums';

export default class ProjectConfig {

    /**
     * Server configuration
     */
    public static server: IProjectConfigServer = <IProjectConfigServer>{};

    /**
     * Client configuration
     */
    public static client: IProjectConfigClient = <IProjectConfigClient>{};

    /**
     * Current running environment name
     */
    public static envName: string;

    /**
     * Initialize
     * This method MUST BE called before the class is imported anywhere ! (static issues)
     */
    public static init() {
        const root = path.dirname(process.mainModule.filename);
        const conf = require(`${root}/commons/eygle-conf.js`);
        this._initForServer(root, conf, process.env.NODE_ENV);
        this._initForClient(conf, process.env.NODE_ENV);
    }

    /**
     *
     * @param conf
     * @param {string} envName
     */
    private static _initForClient(conf: any, envName: string) {
        this._addCommons(this.client, conf, envName);
        this._addToConf(this.client, {
            loggerLvl: ELoggerLvl.WARN
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
    private static _initForServer(rootPath: string, conf: any, envName: string) {

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
            loggerFormat: '{{timestamp}} <{{title}}> {{message}}', // DO not format this string, the values are replaces by tracer
            loggerDateFormat: 'H:MM:ss.L', // DO not format this string, the values are replaces by tracer
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
    private static _addCommons(target: any, json: any, envName: string) {
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
    private static _addToConf(conf: any, data: any): void {
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
    private static _formatConfStr(str: string) {
        str = str.replace('{{root}}', this.server.root);
        str = str.replace('{{appName}}', this.server.appName || this.client.appName);
        str = str.replace('{{env}}', this.envName);
        str = str.replace('{{pmId}}', process.env.pm_id);

        return str;
    }
}

export interface IProjectConfigCommon {
    /**
     * Include implementsAuth
     */
    implementsAuth: boolean;

    /**
     * Include cron manager
     */
    includeCronManager: boolean;

    /**
     * Application name
     */
    appName: string;

    /**
     * Debug mode
     */
    debug: boolean;
}

export interface IProjectConfigServer extends IProjectConfigCommon {

    /**
     * Include email subscription managment
     */
    includeEmailUnsubscribe: boolean;

    /**
     * Activate CSRF security
     */
    activateCSRFSecurity: boolean;

    /**
     * SessionDB cookie name
     */
    sessionCookieName: string;

    /**
     * Project root path
     */
    root: string;

    /**
     * Port used
     */
    port: number;

    /**
     * Mongo collections prefix (not applied on core collections)
     */
    dbCollectionsPrefix: string;

    /**
     * Server root path
     * Replace {{root}} by given configuration root value
     */
    serverRoot: string;

    /**
     * Client root path
     * Replace {{root}} by given configuration root value
     */
    clientRoot: string;

    /**
     * Api root path
     * Replace {{root}} by given configuration root value
     */
    apiRoot: string;

    /**
     * Uploaded files folder path
     * Replace {{root}} by given configuration root value
     */
    filesRoot: string;

    /**
     * Logger type
     */
    loggerType: string; // console or file

    /**
     * Logger format
     */
    loggerFormat: string;

    /**
     * Logger date format
     */
    loggerDateFormat: string;

    /**
     * Logger root
     */
    loggerRoot: string;

    /**
     * Logger max log files
     */
    loggerMaxLogFiles: number;

    /**
     * Logger all logs file name
     */
    loggerAllLogsFileName: string;
}

ProjectConfig.init();

export interface IProjectConfigClient extends IProjectConfigCommon {
    /**
     * Logger level (all logs starting at given level will be displayed)
     */
    loggerLvl: ELoggerLvl;
}