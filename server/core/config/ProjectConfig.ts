import * as fs from 'fs';
import * as path from "path";
import {EEnv} from "../typings/server.enums";

class ProjectConfig {
    /**
     * Include implementsAuth
     */
    public implementsAuth: boolean;

    /**
     * Include includeCronManager manager
     */
    public includeCronManager: boolean;

    /**
     * Include email subscription managment
     */
    public includeEmailUnsubscribe: boolean;

    /**
     * Activate CSRF security
     */
    public activateCSRFSecurity: boolean;

    /**
     * Server port
     */
    public port: number;

    /**
     * Mongodb database name
     */
    public dbName: string;

    /**
     * Application name
     */
    public appName: string;

    /**
     * Project root path
     */
    public root: string;

    /**
     * Client root path
     * Replace {{root}} by given configuration root value
     */
    public clientRoot: string;

    /**
     * Server images root path
     * Replace {{root}} by given configuration root value
     */
    public imagesRoot: string;

    /**
     * Uploaded files folder path
     * Replace {{root}} by given configuration root value
     */
    public filesRoot: string;

    /**
     * Session cookie name
     */
    public sessionCookieName: string;

    /**
     * Logger type
     */
    public loggerType: string; // console or file

    /**
     * Logger
     */
    public logger: ILoggerConf;

    /**
     * Debug flag
     */
    public debug: boolean;

    /**
     * Current environment
     */
    private _env;

    constructor() {
        const confFile = path.normalize(`${__dirname}/../../../eygle-conf.json`);
        const data = <string>fs.readFileSync(confFile, {encoding: 'utf8'});

        if (!data) {
            console.error(`Fail to load file ${confFile}`);
            process.exit(-1);
        }

        const json = JSON.parse(data);
        if (!json) {
            console.error(`Fail to parse JSON file ${confFile}`);
            process.exit(-1);
        }

        this._env = process.env.NODE_ENV;
        console.log("loaded data", json);
        this._buildConf(json);
    }

    /**
     * Get environment as EEnv enum
     * @return {EEnv}
     */
    public getEnv(): EEnv {
        switch (this._env) {
            case 'development':
                return EEnv.Dev;
            case 'test':
                return EEnv.Test;
            case 'preprod':
                return EEnv.Preprod;
            case 'production':
            default:
                return EEnv.Prod;
        }
    }

    /**
     * Build conf from JSON extracted data and default conf
     * @param data
     * @private
     */
    private _buildConf(data: any) {
        this.implementsAuth = data.implementsAuth || false;
        this.includeCronManager = data.includeCronManager || false;
        this.includeEmailUnsubscribe = data.includeEmailUnsubscribe || false;
        this.activateCSRFSecurity = data.activateCSRFSecurity || false;

        this._loadEnvironmentDependantConfFromData(data);
    }

    /**
     * Load configuration that can be override depending on current environment
     * @param data
     * @private
     */
    private _loadEnvironmentDependantConfFromData(data) {
        const env = data.environments && data.environments.hasOwnProperty(this._env) ?
            data.environments[this._env] : {};
        env.logger = env.logger || {};
        data.logger = data.logger || {};

        console.log("inside load env dep", env);
        this.appName = env.appName || data.appName || process.env.NODE_APP;
        this.root = path.normalize(env.root || data.root || `${__dirname}/../../..`);
        this.debug = env.debug !== undefined ? env.debug : data.debug !== undefined ? data.debug : false;
        this.clientRoot = this._formatConfStr(env.clientRoot || data.clientRoot || '{{root}}/client');
        this.imagesRoot = this._formatConfStr(env.imagesRoot || data.imagesRoot || '{{root}}/client/images');
        this.filesRoot = this._formatConfStr(env.filesRoot || data.filesRoot || '{{root}}/server/files');
        this.sessionCookieName = this._formatConfStr(env.sessionCookieName || data.sessionCookieName || 'mapui-connect.sid');
        this.loggerType = env.logger.type || data.logger.type || "console";
        this.logger = {
            format: env.logger.format || data.logger.format || "{{timestamp}} <{{title}}> {{message}}", // DO not format this string, the values are replaces by tracer
            dateFormat: env.logger.dateFormat || data.logger.dateFormat || "HH:MM:ss.L",
        };

        if (this.loggerType === "file") {
            this.logger.root = this._formatConfStr(env.logger.root || data.logger.root || "{{root}}/server/logs");
            this.logger.maxLogFiles = env.logger.maxLogFiles || data.logger.maxLogFiles || 10;
            this.logger.allLogsFileName = this._formatConfStr(env.logger.allLogsFileName || data.logger.allLogsFileName || "{{appName}}-{{env}}-{{pmId}}.log");
        }

        console.log(this);
    }

    /**
     * Format given string using saved data
     * @param {string} str
     * @return {string}
     * @private
     */
    private _formatConfStr(str: string) {
        str = str.replace('{{root}}', this.root);
        str = str.replace('{{appName}}', this.appName);
        str = str.replace('{{env}}', this._env);
        str = str.replace('{{pmId}}', process.env.pm_id);

        return str;
    }
}

interface ILoggerConf {

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

export default new ProjectConfig();