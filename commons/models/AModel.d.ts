export declare class AModel {
    _id?: string;
    creationDate?: Date;
    updateDate?: Date;
    deleted?: boolean;
    /**
     * Initialize object instance from data
     * @param data
     */
    initFromData(data: any): void;
    /**
     * Format date for given key
     * @param {string} key
     */
    formatDate(key: string): void;
}
