export declare class Utils {
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
     * Session cookie name
     */
    sessionCookieName: string;
    /**
     * Eygle user hash used to identify user in urls
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
    /**
     * TMDB Api token
     */
    tmdbToken: string;
    /**
     * TVDB Api token
     */
    tvdbToken: string;
    /**
     * Initialize utils values
     */
    constructor();
    /**
     * Is value a mongoId (24 chars hexadecimal string)
     * @param value
     * @return {boolean}
     */
    isMongoId(value: any): boolean;
    /**
     * Convert value as string date to Javascript Date instance
     * @param value
     * @return {Date}
     */
    convertDate(value: string): Date;
    /**
     * Check if object is defined and populated
     * (ie: check if member.hospital exists so if member.hospital._id is set)
     * @param value
     * @return {boolean}
     */
    hasId(value: any): boolean;
    /**
     * Simulate es6 Number.isNaN
     * @param value
     * @return {boolean}
     */
    isString(value: any): boolean;
    /**
     * Check if objects are defined and populated then compare their ids
     * One of the objects can be a string then it's value will be compared to the other object _id
     * @param obj1
     * @param obj2
     * @return {boolean}
     */
    compareIds(obj1: any, obj2: any): boolean;
    /**
     * Get the Id of the given object
     * @param obj
     * @return {string}
     */
    getId(obj: any): string;
    /**
     * Generate a random string composed of 10 digits
     * @return {string}
     */
    generateValidMail(): string;
    /**
     * Format size from bytes to human readable string
     * @param {number} bytes
     * @return {string}
     */
    formatSize(bytes: number): string;
    /**
     * Format duration from milliseconds to human readable string
     * @param {any} ms
     * @return {string}
     */
    formatDuration(ms: number): string;
    /**
     * Compare two arrays and call callback function when a new item is found
     * @param {Array<any>} oArr
     * @param {Array<any>} nArr
     * @param callback
     * @param {string} idx
     */
    forEachNewObject(oArr: Array<any>, nArr: Array<any>, callback: any, idx?: string): void;
    /**
     * Normalize string
     * Lowercase string
     * Replace any non alphanumerical character by a single '-'
     * @param str
     * @return {string}
     */
    normalize(str: string): string;
    /**
     * Map all accents to base letters
     * @private
     */
    private _defaultDiacriticsRemovalMap;
}
declare const _default: Utils;
export default _default;
