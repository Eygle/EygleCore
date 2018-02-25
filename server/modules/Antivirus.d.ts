/// <reference types="q" />
export declare class Antivirus {
    /**
     * Clamscan path
     */
    private _binPath;
    /**
     * ClamAV scanner
     */
    private _clam;
    /**
     * Log path
     */
    private _logPath;
    constructor();
    /**
     * Check file using CLamAV
     * @param file path
     */
    checkFile(file: any): Q.Promise<any>;
}
declare const _default: Antivirus;
export default _default;
