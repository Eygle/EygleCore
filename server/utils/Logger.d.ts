export default class Logger {
    /**
     * External logger instance
     */
    private static _instance;
    static init(): void;
    /**
     * Trace lvl
     * @param args
     */
    static trace(...args: any[]): void;
    /**
     * Log lvl
     * @param args
     */
    static log(...args: any[]): void;
    /**
     * Info lvl
     * @param args
     */
    static info(...args: any[]): void;
    /**
     * Debug lvl
     * @param args
     */
    static debug(...args: any[]): void;
    /**
     * Warn lvl
     * @param args
     */
    static warn(...args: any[]): void;
    /**
     * Error lvl
     * @param args
     */
    static error(...args: any[]): void;
}
