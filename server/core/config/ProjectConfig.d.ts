import { EEnv } from "../typings/server.enums";
export declare class ProjectConfig {
    /**
     * Include implementsAuth
     */
    implementsAuth: boolean;
    /**
     * Include includeCronManager manager
     */
    includeCronManager: boolean;
    /**
     * Include email subscription managment
     */
    includeEmailUnsubscribe: boolean;
    /**
     * Activate CSRF security
     */
    activateCSRFSecurity: boolean;
    /**
     * Current environment
     */
    envName: string;
    /**
     * Current environment
     */
    env: EEnv;
    /**
     * Server port
     */
    port: number;
    /**
     * Mongodb database name
     */
    dbName: string;
    /**
     * Mongodb collections prefix
     */
    dbCollectionsPrefix: string;
    /**
     * Application name
     */
    appName: string;
    /**
     * Project root path
     */
    root: string;
    /**
     * Api root path
     */
    apiRoot: string;
    /**
     * Client root path
     * Replace {{root}} by given configuration root value
     */
    clientRoot: string;
    /**
     * Server images root path
     * Replace {{root}} by given configuration root value
     */
    imagesRoot: string;
    /**
     * Uploaded files folder path
     * Replace {{root}} by given configuration root value
     */
    filesRoot: string;
    /**
     * Session cookie name
     */
    sessionCookieName: string;
    /**
     * Logger type
     */
    loggerType: string;
    /**
     * Logger
     */
    logger: ILoggerConf;
    /**
     * Debug flag
     */
    debug: boolean;
    constructor();
    /**
     * Load environment
     * @return {EEnv}
     */
    private _loadEnv();
    /**
     * Build conf from JSON extracted data and default conf
     * It can be override depending on current environment
     * @param data
     * @private
     */
    private _buildConf(data);
    /**
     * Format given string using saved data
     * @param {string} str
     * @return {string}
     * @private
     */
    private _formatConfStr(str);
    /**
     * Check if boolean value is present in env first or data or set def value
     * @param label
     * @param env
     * @param data
     * @param {boolean} def
     * @private
     */
    private _checkBooleanPresence(label, env, data, def?);
}
export interface ILoggerConf {
    /**
     * Lines format (default: "{{timestamp}} <{{title}}> {{message}}")
     */
    format?: string;
    /**
     * Date format (default: "HH:MM:ss.L")
     */
    dateFormat?: string;
    /**
     * File root path
     */
    root?: string;
    /**
     * Maximum number of logs files
     */
    maxLogFiles?: number;
    /**
     * Log file name
     * Will replace {{appName}} and {{env}} by config matching values
     * Will replace {{pmId}} by process.env.pm_id value
     */
    allLogsFileName?: string;
}
declare const _default: ProjectConfig;
export default _default;
