import * as tracer from 'tracer';

import ProjectConfig from '../../commons/utils/ProjectConfig';
import Utils from '../../commons/utils/Utils';
import {EEnv} from "../../commons/core.enums";

export default class ServerConfig {
    // region Methods defined in IProjectConfigServer
    public static includeEmailUnsubscribe: boolean;
    public static activateCSRFSecurity: boolean;
    public static implementsAuth: boolean;
    public static includeCronManager: boolean;

    public static loggerType: string;
    public static loggerFormat: string;
    public static loggerDateFormat: string;
    public static loggerRoot: string;
    public static loggerMaxLogFiles: number;
    public static loggerAllLogsFileName: string;
    // endregion

    /**
     * Application name
     */
    public static appName: string;

    /**
     * Current environment
     */
    public static env: EEnv;

    /**
     * Debug mode
     */
    public static debug: boolean;

    /**
     * Server port
     */
    public static port: number;

    /**
     * Mongodb database name
     */
    public static dbName: string;

    /**
     * Mongodb collections prefix
     */
    public static dbCollectionsPrefix: string;

    /**
     * Files download base URL
     */
    public static dlURL: string;

    /**
     * Project root path
     */
    public static root: string;

    /**
     * Server root path
     */
    public static serverRoot: string;

    /**
     * Client root path
     */
    public static clientRoot: string;

    /**
     * Files root path
     */
    public static filesRoot: string;

    /**
     * Api root path
     */
    public static apiRoot: string;

    /**
     * Files view base URL
     */
    public static viewURL: string;

    /**
     * Express session secret
     */
    public static sessionSecret: string;

    /**
     * Session cookie name
     */
    public static sessionCookieName: string;

    /**
     * User hash used to identify user in urls
     */
    public static userHash: string;

    /**
     * Maximum attempts before having your account locked
     */
    public static maxLoginAttempts: number;

    /**
     * Maximum attempts before having your IP locked
     */
    public static maxIpLoginAttempts: number;

    /**
     * Number of milliseconds for attempts expire duration
     * Every attempts older than loginAttemptsExpire milliseconds will be voided
     */
    public static loginAttemptsExpire: number;

    /**
     * Number of milliseconds for IP attempts expire duration
     */
    public static loginIpAttemptsExpire: number;

    /**
     * Number of milliseconds the IP is locked
     */
    public static ipLockedTime: number;

    public static init() {
        this.dlURL = '/files/down';
        this.viewURL = '/files';

        this.sessionSecret = 'Un42Petit12Little75Secret12PuiMap!';
        this.userHash = 'UnPeu42DeseL';

        this.maxLoginAttempts = 5;

        this.loginAttemptsExpire = 24 * 3600 * 1000; // 24 hours

        this.maxIpLoginAttempts = 15;
        this.loginIpAttemptsExpire = 20 * 60 * 1000; // 20 minutes
        this.ipLockedTime = 60 * 60 * 1000; // 1 hour

        this.env = Utils.getEnvFromName(ProjectConfig.envName);

        /**
         * Load all ProjectConfig here
         */
        for (const key in ProjectConfig.server) {
            if (ProjectConfig.server.hasOwnProperty(key)) {
                this[key] = ProjectConfig.server[key];
            }
        }
    }

    /**
     * Generate logger with ProjectConfig as default conf but it can be override by given conf
     * @param conf
     * @return {any}
     */
    public static generateLogger(conf: any = {}): any {
        const tracerConf: any = {
            format: conf.format || this.loggerFormat,
            dateFormat: conf.dateFormat || this.loggerDateFormat
        };

        if (this.loggerType === 'console') {
            return (<any>tracer).colorConsole(tracerConf);
        }

        tracerConf.root = conf.root || this.loggerRoot;
        tracerConf.maxLogFiles = conf.maxLogFiles || this.loggerMaxLogFiles;
        tracerConf.allLogsFileName = conf.allLogsFileName || this.loggerAllLogsFileName;
        return (<any>tracer).dailyfile(tracerConf);
    }
}