"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const q = require("q");
const DB_1 = require("../modules/DB");
const Permissions_1 = require("../modules/Permissions");
const EdError_1 = require("../utils/EdError");
const server_enums_1 = require("../typings/server.enums");
const Utils_1 = require("../../commons/utils/Utils");
class ADBModel {
    /**
     * Initialise class
     * @param {mongoose.Schema} schema
     * @param {string[]} encryptKeys
     */
    static init(schema, encryptKeys = null) {
        this._schema = schema;
    }
    /**
     * Method called from MongoDB.ts in
     * @param name
     * @return {mongoose.Model<any>}
     */
    static importSchema(name) {
       this._model = mongoose.model(name, this._schema, name);
        return this._model;
    }
    /**
     * Get model by id
     * @param id
     * @param queryParams
     * @return {Promise<T>}
     */
    static get(id, queryParams = null) {
        const defer = q.defer();
        if (!Utils_1.default.isMongoId(id)) {
            defer.reject(new Error(`Invalid mongo id ${id}`));
        }
        else {
            const query = ADBModel._model.findById(id);
            ADBModel.applyQueryParams(query, queryParams);
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
    static getAll(queryParams = null) {
        const defer = q.defer();
        const query = ADBModel._model.find();
        ADBModel.applyQueryParams(query, queryParams);
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
     * @return mongoose.Model<any>
     */
    static create(data, exclude = null) {
        return new ADBModel._model(ADBModel.formatData(data, exclude));
    }
    /**
     * Create new model instance
     * @param data
     * @param exclude
     * @param populateOptions
     * @return {Promise<T>}
     */
    static add(data, exclude = null, populateOptions = null) {
        return DB_1.default.createItem(new ADBModel._model(ADBModel.formatData(data, exclude)), populateOptions, ADBModel._model);
    }
    /**
     * Save model instance
     * @param item
     * @param data
     * @param exclude
     * @param populateOptions
     */
    static save(item, data = null, exclude = null, populateOptions = null) {
        return DB_1.default.saveItem(item, ADBModel.formatData(data, exclude), populateOptions, ADBModel._model);
    }
    /**
     * Find model instance by id and save it
     * @param id
     * @param data
     * @param exclude
     * @param populateOptions
     * @return {Promise<T>}
     */
    static saveById(id, data = null, exclude = null, populateOptions = null) {
        const defer = q.defer();
        if (data && data.hasOwnProperty('_id')) {
            delete data._id;
        }
        ADBModel.get(id, {})
            .then(item => {
            ADBModel.save(item, data, exclude, populateOptions)
                .then(item => defer.resolve(item))
                .catch(err => defer.reject(err));
        })
            .catch(err => defer.reject(err));
        return defer.promise;
    }
    /**
     * Mark item as deleted (without really deleting it)
     * @param item
     * @param user
     * @param checkIsAuthor
     * @return {Promise<T>}
     */
    static setDeleted(item, user = null, checkIsAuthor = true) {
        const defer = q.defer();
        if (!item) {
            defer.reject(new Error('Item not found'));
        }
        else {
            if (checkIsAuthor && !Permissions_1.default.ensureAuthorized(user, 'admin') && item.creationUID !== user._id.toString()) {
                defer.reject(new Error('Permission denied'));
            }
            else {
                DB_1.default.saveItem(item, user, { deleted: true })
                    .then(item => defer.resolve(item))
                    .catch(err => defer.reject(err));
            }
        }
        return defer.promise;
    }
    /**
     * Mark item as deleted (without really deleting it)
     * @param id
     * @param user
     * @param checkIsAuthor
     */
    static setDeletedById(id, user = null, checkIsAuthor = false) {
        const defer = q.defer();
        ADBModel.get(id, {})
            .then(item => {
            ADBModel.setDeleted(item, user, checkIsAuthor)
                .then((item) => defer.resolve(item))
                .catch(err => defer.reject(err));
        })
            .catch(err => defer.reject(err));
        return defer.promise;
    }
    /**
     * Delete item
     * @param item
     * @param user
     * @param checkIsAuthor
     * @return {Promise<T>}
     */
    static remove(item, user = null, checkIsAuthor = true) {
        const defer = q.defer();
        if (!item) {
            defer.reject(new Error('Item not found'));
        }
        else {
            if (checkIsAuthor && !Permissions_1.default.ensureAuthorized(user, 'admin') && item.creationUID !== user._id.toString()) {
                defer.reject(new Error('Permission denied'));
            }
            else {
                item.remove((err) => {
                    if (err)
                        return defer.reject(err);
                    defer.resolve();
                });
            }
        }
        return defer.promise;
    }
    /**
     * Delete item by id
     * @param id
     * @param user
     * @param checkIsAuthor
     */
    static removeById(id, user = null, checkIsAuthor = false) {
        const defer = q.defer();
        ADBModel.get(id, {})
            .then(item => {
            ADBModel.remove(item, user, checkIsAuthor)
                .then((item) => defer.resolve(item))
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
    static formatData(body, exclude = null) {
        if (!body)
            return null;
        if (exclude) {
            for (let e of exclude) {
                if (body.hasOwnProperty(e)) {
                    delete body[e];
                }
            }
        }
        for (let idx in body) {
            if (body.hasOwnProperty(idx)) {
                const value = body[idx];
                if (value instanceof Array) {
                    for (let i in value) {
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
    static applyQueryParams(query, queryParams) {
        if (queryParams) {
            if (queryParams.select) {
                queryParams.select = queryParams.select instanceof Array ? queryParams.select : [queryParams.select];
                for (let select of queryParams.select) {
                    query.select(select);
                }
            }
            if (queryParams.populate) {
                queryParams.populate = queryParams.populate instanceof Array ? queryParams.populate : [queryParams.populate];
                for (let populate of queryParams.populate) {
                    query.populate(populate);
                }
            }
            if (queryParams.where) {
                for (const i in queryParams.where) {
                    if (queryParams.where.hasOwnProperty(i)) {
                        query.where(i).equals(queryParams.where[i]);
                    }
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
exports.default = ADBModel;
//# sourceMappingURL=ADBModel.js.map