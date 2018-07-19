import { EEnv } from '../core.enums';
export default class Utils {
    static roles: string[];
    /**
     * TMDB Api token
     */
    static tmdbToken: string;
    /**
     * TVDB Api token
     */
    static tvdbToken: string;
    /**
     * Is value a mongoId (24 chars hexadecimal string)
     * @param value
     * @return {boolean}
     */
    static isMongoId(value: any): boolean;
    /**
     * Convert value as string date to Javascript Date instance
     * @param value
     * @return {Date}
     */
    static convertDate(value: string): Date;
    /**
     * Check if object is defined and populated
     * (ie: check if member.hospital exists so if member.hospital._id is set)
     * @param value
     * @return {boolean}
     */
    static hasId(value: any): boolean;
    /**
     * Simulate es6 Number.isNaN
     * @param value
     * @return {boolean}
     */
    static isString(value: any): boolean;
    /**
     * Check if objects are defined and populated then compare their ids
     * One of the objects can be a string then it's value will be compared to the other object _id
     * @param obj1
     * @param obj2
     * @return {boolean}
     */
    static compareIds(obj1: any, obj2: any): boolean;
    /**
     * Get the Id of the given object
     * @param obj
     * @return {string}
     */
    static getId(obj: any): string;
    /**
     * Generate a random string composed of 10 digits
     * @return {string}
     */
    static generateValidMail(): string;
    /**
     * Format size from bytes to human readable string
     * @param {number} bytes
     * @return {string}
     */
    static formatSize(bytes: number): string;
    /**
     * Format duration from milliseconds to human readable string
     * @param {any} ms
     * @return {string}
     */
    static formatDuration(ms: number): string;
    /**
     * Compare two arrays and call callback function when a new item is found
     * @param {Array<any>} oArr
     * @param {Array<any>} nArr
     * @param callback
     * @param {string} idx
     */
    static forEachNewObject(oArr: Array<any>, nArr: Array<any>, callback: any, idx?: string): void;
    /**
     * Get {EEnv} from name
     * @param {string} envName
     * @return {EEnv}
     */
    static getEnvFromName(envName: string): EEnv;
    /**
     * Get envName from EEnv
     * @param {EEnv} env
     * @return {string}
     */
    static getEnvNameFromEnv(env: EEnv): string;
    /**
     * Normalize string
     * Lowercase string
     * Replace any non alphanumerical character by a single '-'
     * @param str
     * @return {string}
     */
    static normalize(str: string): string;
    /**
     * Map all accents to base letters
     * @private
     */
    private static _defaultDiacriticsRemovalMap;
}
