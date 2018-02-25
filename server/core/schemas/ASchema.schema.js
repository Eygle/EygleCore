"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const q = require("q");
const DB_1 = require("../modules/DB");
const Utils_1 = require("../../../commons/core/utils/Utils");
const EdError_1 = require("../config/EdError");
const server_enums_1 = require("../typings/server.enums");
class ASchema {
    constructor(encryptKeys = null) {
        this._encryptKeys = encryptKeys;
    }
    /**
     * Method called from DB.ts in
     * @param name
     * @return {mongoose.Model<any>}
     */
    importSchema(name) {
        this._model = mongoose.model(name, this.getSchema(), name);
        return this._model;
    }
    /**
     * Get model by id
     * @param id
     * @param queryParams
     * @return {Promise<T>}
     */
    get(id, queryParams = null) {
        const defer = q.defer();
        if (!Utils_1.default.isMongoId(id)) {
            defer.reject(new Error(`Invalid mongo id ${id}`));
        }
        else {
            const query = this._model.findById(id);
            this.applyQueryParams(query, queryParams);
            query.exec((err, item) => {
                if (err)
                    return defer.reject(err);
                if (!item)
                    return defer.reject(new EdError_1.CustomEdError('No such item', server_enums_1.EHTTPStatus.BadRequest));
                defer.resolve(item);
            });
        }
        return defer.promise;
    }
    /**
     * Get all model
     * @return {Promise<T>}
     */
    getAll(queryParams = null) {
        const defer = q.defer();
        const query = this._model.find();
        this.applyQueryParams(query, queryParams);
        query.exec((err, items) => {
            if (err)
                return defer.reject(err);
            defer.resolve(items);
        });
        return defer.promise;
    }
    /**
     * Create new model instance
     * @param data
     * @param exclude
     * @return {Promise<T>}
     */
    create(data, exclude = null) {
        return new this._model(this.formatData(data, exclude));
    }
    /**
     * Create new model instance and save it
     * @param data
     * @param exclude
     * @param populateOptions
     * @return {Promise<T>}
     */
    add(data, exclude = null, populateOptions = null) {
        return DB_1.default.createItem(this.create(data, exclude), populateOptions, this._model);
    }
    /**
     * Save model instance
     * @param item
     * @param data
     * @param exclude
     * @param populateOptions
     */
    save(item, data = null, exclude = null, populateOptions = null) {
        return DB_1.default.saveItem(item, this.formatData(data, exclude), populateOptions, this._model);
    }
    /**
     * Find model instance by id and save it
     * @param id
     * @param data
     * @param exclude
     * @param populateOptions
     * @return {Promise<T>}
     */
    saveById(id, data = null, exclude = null, populateOptions = null) {
        const defer = q.defer();
        if (data && data.hasOwnProperty('_id')) {
            delete data._id;
        }
        this.get(id, {})
            .then(item => {
            this.save(item, data, exclude, populateOptions)
                .then(res => defer.resolve(res))
                .catch(err => defer.reject(err));
        })
            .catch(err => defer.reject(err));
        return defer.promise;
    }
    /**
     * Mark item as deleted (without really deleting it)
     * @param item
     * @return {Promise<T>}
     */
    setDeleted(item) {
        const defer = q.defer();
        if (!item) {
            defer.reject(new Error('Item not found'));
        }
        else {
            DB_1.default.saveItem(item, { deleted: true })
                .then(res => defer.resolve(res))
                .catch(err => defer.reject(err));
        }
        return defer.promise;
    }
    /**
     * Mark item as deleted (without really deleting it)
     * @param id
     */
    setDeletedById(id) {
        const defer = q.defer();
        this.get(id, {})
            .then(item => {
            this.setDeleted(item)
                .then((res) => defer.resolve(res))
                .catch(err => defer.reject(err));
        })
            .catch(err => defer.reject(err));
        return defer.promise;
    }
    /**
     * Delete item
     * @param item
     * @return {Promise<T>}
     */
    remove(item) {
        const defer = q.defer();
        if (!item) {
            defer.reject(new Error('Item not found'));
        }
        else {
            item.remove((err) => {
                if (err)
                    return defer.reject(err);
                defer.resolve();
            });
        }
        return defer.promise;
    }
    /**
     * Delete item by id
     * @param id
     */
    removeById(id) {
        const defer = q.defer();
        this.get(id, {})
            .then(item => {
            this.remove(item)
                .then((res) => defer.resolve(res))
                .catch(err => defer.reject(err));
        })
            .catch(err => defer.reject(err));
        return defer.promise;
    }
    /**
     * This method will format the given body by excluding provided keys (if any) and formatting any reference Objects
     * @param body
     * @param exclude
     */
    formatData(body, exclude = null) {
        if (!body)
            return null;
        if (exclude) {
            for (const e of exclude) {
                if (body.hasOwnProperty(e)) {
                    delete body[e];
                }
            }
        }
        for (const idx in body) {
            if (body.hasOwnProperty(idx)) {
                const value = body[idx];
                if (value instanceof Array) {
                    for (const i in value) {
                        if (value.hasOwnProperty(i) && value[i] && value[i].hasOwnProperty('_id')) {
                            value[i] = value[i]._id;
                        }
                    }
                }
                else if (value instanceof Object && value.hasOwnProperty('_id')) {
                    body[idx] = value._id;
                }
                if (idx === '__v') {
                    delete body.__v;
                }
            }
        }
        return body;
    }
    /**
     * Apply custom mongoose select and/or populate
     * @param query
     * @param queryParams
     * @private
     */
    applyQueryParams(query, queryParams) {
        if (queryParams) {
            if (queryParams.select) {
                queryParams.select = queryParams.select instanceof Array ? queryParams.select : [queryParams.select];
                for (const select of queryParams.select) {
                    query.select(select);
                }
            }
            if (queryParams.populate) {
                queryParams.populate = queryParams.populate instanceof Array ? queryParams.populate : [queryParams.populate];
                for (const populate of queryParams.populate) {
                    query.populate(populate);
                }
            }
            if (queryParams.sort) {
                query.sort(queryParams.sort);
            }
            if (queryParams.limit) {
                query.sort(queryParams.limit);
            }
        }
    }
}
exports.default = ASchema;
//# sourceMappingURL=ASchema.schema.js.map