import * as tracer from 'tracer';

import ProjectConfig, {AProjectConfigServer} from '../../commons/utils/ProjectConfig';
import Utils from '../../commons/utils/Utils';

export class ServerConfig extends AProjectConfigServer {
    /**
     * Application name
     */
    public appName: string;

    /**
     * Debug mode
     */
    public debug: boolean;

    /**
     * Mongodb database name
     */
    public dbName: string;

    /**
     * Files download base URL
     */
    public dlURL: string;

    /**
     * Files view base URL
     */
    public viewURL: string;

    /**
     * Express session secret
     */
    public sessionSecret: string;

    /**
     * User hash used to identify user in urls
     */
    public userHash: string;

    /**
     * Maximum attempts before having your account locked
     */
    public maxLoginAttempts: number;

    /**
     * Maximum attempts before having your IP locked
     */
    public maxIpLoginAttempts: number;

    /**
     * Number of milliseconds for attempts expire duration
     * Every attempts older than loginAttemptsExpire milliseconds will be voided
     */
    public loginAttemptsExpire: number;

    /**
     * Number of milliseconds for IP attempts expire duration
     */
    public loginIpAttemptsExpire: number;

    /**
     * Number of milliseconds the IP is locked
     */
    public ipLockedTime: number;

    constructor() {
        super();
        this.dlURL = '/files/down';
        this.viewURL = '/files';

        this.sessionSecret = 'Un42Petit12Little75Secret12PuiMap!';
        this.userHash = 'UnPeu42DeseL';

        this.maxLoginAttempts = 5;

        this.loginAttemptsExpire = 24 * 3600 * 1000; // 24 hours

        this.maxIpLoginAttempts = 15;
        this.loginIpAttemptsExpire = 20 * 60 * 1000; // 20 minutes
        this.ipLockedTime = 60 * 60 * 1000; // 1 hour

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
    public generateLogger(conf: any = {}): any {
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

export default new ServerConfig();
