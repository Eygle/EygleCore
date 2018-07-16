import { EEnv, ELoggerLvl } from '../core.enums';
export default class ProjectConfig {
    /**
     * Server configuration
     */
    static server: AProjectConfigServer;
    /**
     * Client configuration
     */
    static client: AProjectConfigClient;
    /**
     * Current running environment name
     */
    static envName: string;
    /**
     * Initialize
     * This method MUST BE called before the class is imported anywhere ! (static issues)
     */
    static init(): void;
    /**
     *
     * @param conf
     * @param {string} envName
     */
    static initForClient(conf: any, envName: string): void;
    /**
     * initialise for server
     * @param {string} rootPath
     * @param conf
     * @param {string} envName
     */
    private static _initForServer(rootPath, conf, envName);
    /**
     * Add common default values
     * @param target
     * @param json
     * @param envName
     * @private
     */
    private static _addCommons(target, json, envName);
    /**
     * Add all data to conf and erase existing data
     * @param conf
     * @param data
     * @private
     */
    private static _addToConf(conf, data);
    /**
     * Format given string using saved data
     * @param {string} str
     * @return {string}
     * @private
     */
    private static _formatConfStr(str);
}
export declare abstract class AProjectConfigCommon {
    /**
     * Current environment
     */
    env: EEnv;
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
export declare abstract class AProjectConfigServer extends AProjectConfigCommon {
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
    loggerType: string;
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
export declare abstract class AProjectConfigClient extends AProjectConfigCommon {
    /**
     * Logger level (all logs starting at given level will be displayed)
     */
    loggerLvl: ELoggerLvl;
}
