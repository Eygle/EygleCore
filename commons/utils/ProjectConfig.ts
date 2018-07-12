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
    private static _initForClient(conf: any, envName: string) {
        ProjectConfig._addCommons(ProjectConfig.client, conf, envName);
        ProjectConfig._addToConf(ProjectConfig.client, {
            loggerLvl: ELoggerLvl.WARN
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
    private static _initForServer(rootPath: string, conf: any, envName: string) {

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
            loggerFormat: '{{timestamp}} <{{title}}> {{message}}', // DO not format this string, the values are replaces by tracer
            loggerDateFormat: 'H:MM:ss.L', // DO not format this string, the values are replaces by tracer
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
    private static _addCommons(target: any, json: any, envName: string) {
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
        str = str.replace('{{root}}', ProjectConfig.server.root);
        str = str.replace('{{appName}}', ProjectConfig.server.appName || ProjectConfig.client.appName);
        str = str.replace('{{env}}', ProjectConfig.envName);
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