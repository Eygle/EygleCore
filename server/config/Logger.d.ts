export declare class Logger {
    /**
     * External logger instance
     */
    private _instance;
    constructor();
    /**
     * Trace lvl
     * @param args
     */
    trace(...args: any[]): void;
    /**
     * Log lvl
     * @param args
     */
    log(...args: any[]): void;
    /**
     * Info lvl
     * @param args
     */
    info(...args: any[]): void;
    /**
     * Debug lvl
     * @param args
     */
    debug(...args: any[]): void;
    /**
     * Warn lvl
     * @param args
     */
    warn(...args: any[]): void;
    /**
     * Error lvl
     * @param args
     */
    error(...args: any[]): void;
}
declare const _default: Logger;
export default _default;
