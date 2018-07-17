import { AProjectConfigServer } from '../../commons/utils/ProjectConfig';
export declare class ServerConfig extends AProjectConfigServer {
    /**
     * Application name
     */
    appName: string;
    /**
     * Debug mode
     */
    debug: boolean;
    /**
     * Mongodb database name
     */
    dbName: string;
    /**
     * Files download base URL
     */
    dlURL: string;
    /**
     * Files view base URL
     */
    viewURL: string;
    /**
     * Express session secret
     */
    sessionSecret: string;
    /**
     * User hash used to identify user in urls
     */
    userHash: string;
    /**
     * Maximum attempts before having your account locked
     */
    maxLoginAttempts: number;
    /**
     * Maximum attempts before having your IP locked
     */
    maxIpLoginAttempts: number;
    /**
     * Number of milliseconds for attempts expire duration
     * Every attempts older than loginAttemptsExpire milliseconds will be voided
     */
    loginAttemptsExpire: number;
    /**
     * Number of milliseconds for IP attempts expire duration
     */
    loginIpAttemptsExpire: number;
    /**
     * Number of milliseconds the IP is locked
     */
    ipLockedTime: number;
    constructor();
    /**
     * Generate logger with ProjectConfig as default conf but it can be override by given conf
     * @param conf
     * @return {any}
     */
    generateLogger(conf?: any): any;
}
declare const _default: ServerConfig;
export default _default;
