export declare class AModel {
    constructor(data?: any);
    _id?: string;
    creationDate?: Date;
    updateDate?: Date;
    deleted?: boolean;
    /**
     * Format date for given key
     * @param {string} key
     */
    formatDate(key: string): void;
}
