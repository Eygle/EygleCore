export class AModel {
    _id?: string;

    creationDate?: Date;
    updateDate?: Date;

    deleted?: boolean;

    /**
     * Initialize object instance from data
     * @param data
     */
    public initFromData(data: any) {
        if (data) {
            Object.assign(this, data);
            this.formatDate('creationDate');
            this.formatDate('updateDate');
        }
    }

    /**
     * Format date for given key
     * @param {string} key
     */
    public formatDate(key: string) {
        if (this[key]) {
            this[key] = new Date(this[key]);
        }
    }
}
