import { EEnv } from "../../commons/core.enums";
export default class ServerConfig {
    static includeEmailUnsubscribe: boolean;
    static activateCSRFSecurity: boolean;
    static implementsAuth: boolean;
    static includeCronManager: boolean;
    static loggerType: string;
    static loggerFormat: string;
    static loggerDateFormat: string;
    static loggerRoot: string;
    static loggerMaxLogFiles: number;
    static loggerAllLogsFileName: string;
    /**
     * Application name
     */
    static appName: string;
    /**
     * Current environment
     */
    static env: EEnv;
    /**
     * Debug mode
     */
    static debug: boolean;
    /**
     * Server port
     */
    static port: number;
    /**
     * Mongodb database name
     */
    static dbName: string;
    /**
     * Mongodb collections prefix
     */
    static dbCollectionsPrefix: string;
    /**
     * Files download base URL
     */
    static dlURL: string;
    /**
     * Project root path
     */
    static root: string;
    /**
     * Server root path
     */
    static serverRoot: string;
    /**
     * Client root path
     */
    static clientRoot: string;
    /**
     * Files root path
     */
    static filesRoot: string;
    /**
     * Api root path
     */
    static apiRoot: string;
    /**
     * Files view base URL
     */
    static viewURL: string;
    /**
     * Express session secret
     */
    static sessionSecret: string;
    /**
     * Session cookie name
     */
    static sessionCookieName: string;
    /**
     * User hash used to identify user in urls
     */
    static userHash: string;
    /**
     * Maximum attempts before having your account locked
     */
    static maxLoginAttempts: number;
    /**
     * Maximum attempts before having your IP locked
     */
    static maxIpLoginAttempts: number;
    /**
     * Number of milliseconds for attempts expire duration
     * Every attempts older than loginAttemptsExpire milliseconds will be voided
     */
    static loginAttemptsExpire: number;
    /**
     * Number of milliseconds for IP attempts expire duration
     */
    static loginIpAttemptsExpire: number;
    /**
     * Number of milliseconds the IP is locked
     */
    static ipLockedTime: number;
    static init(): void;
    /**
     * Generate logger with ProjectConfig as default conf but it can be override by given conf
     * @param conf
     * @return {any}
     */
    static generateLogger(conf?: any): any;
}
