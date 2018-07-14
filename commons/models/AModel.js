"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AModel {
    constructor(data = null) {
        if (data) {
            Object.assign(this, data);
        }
        this.formatDate('creationDate');
        this.formatDate('updateDate');
    }
    /**
     * Format date for given key
     * @param {string} key
     */
    formatDate(key) {
        if (this[key]) {
            this[key] = new Date(this[key]);
        }
    }
}
exports.AModel = AModel;
//# sourceMappingURL=AModel.js.map