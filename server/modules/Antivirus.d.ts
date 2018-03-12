/// <reference types="q" />
export default class Antivirus {
    /**
     * Clamscan path
     */
    private static _binPath;
    /**
     * ClamAV scanner
     */
    private static _clam;
    /**
     * Log path
     */
    private static _logPath;
    static init(): void;
    /**
     * Check file using CLamAV
     * @param file path
     */
    static checkFile(file: any): Q.Promise<any>;
}
