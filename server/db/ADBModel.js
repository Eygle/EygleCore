"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var q = require("q");
var DB_1 = require("../modules/DB");
var Permissions_1 = require("../modules/Permissions");
var EdError_1 = require("../utils/EdError");
var server_enums_1 = require("../typings/server.enums");
var Utils_1 = require("../../commons/utils/Utils");
var ADBModel = (function () {
    function ADBModel() {
    }
    /**
     * Initialise class
     * @param {mongoose.Schema} schema
     * @param {string[]} encryptKeys
     */
    ADBModel.init = function (schema, encryptKeys) {
        if (encryptKeys === void 0) { encryptKeys = null; }
        this._schema = schema;
    };
    /**
     * Method called from MongoDB.ts in
     * @param name
     * @return {mongoose.Model<any>}
     */
    ADBModel.importSchema = function (name) {
        this._model = mongoose.model(name, this._schema, name);
        return this._model;
    };
    /**
     * Get model by id
     * @param id
     * @param queryParams
     * @return {Promise<T>}
     */
    ADBModel.get = function (id, queryParams) {
        if (queryParams === void 0) { queryParams = null; }
        var defer = q.defer();
        if (!Utils_1.default.isMongoId(id)) {
            defer.reject(new Error("Invalid mongo id " + id));
        }
        else {
            var query = this._model.findById(id);
            this.applyQueryParams(query, queryParams);
            query.exec(function (err, item) {
                if (err)
                    return defer.reject(err);
                if (!item)
                    return defer.reject(new EdError_1.CustomEdError('No such item', server_enums_1.EHTTPStatus.BadRequest));
                defer.resolve(item);
            });
        }
        return defer.promise;
    };
    /**
     * Get all model
     * @return {Promise<AModel[]>}
     */
    ADBModel.getAll = function (queryParams) {
        if (queryParams === void 0) { queryParams = null; }
        var defer = q.defer();
        var query = this._model.find();
        this.applyQueryParams(query, queryParams);
        query.exec(function (err, items) {
            if (err)
                return defer.reject(err);
            defer.resolve(items);
        });
        return defer.promise;
    };
    /**
     * Create new model instance
     * @param data
     * @param exclude
     * @return mongoose.Model<any>
     */
    ADBModel.create = function (data, exclude) {
        if (exclude === void 0) { exclude = null; }
        return new this._model(this.formatData(data, exclude));
    };
    /**
     * Create new model instance
     * @param data
     * @param exclude
     * @param populateOptions
     * @return {Promise<T>}
     */
    ADBModel.add = function (data, exclude, populateOptions) {
        if (exclude === void 0) { exclude = null; }
        if (populateOptions === void 0) { populateOptions = null; }
        return DB_1.default.createItem(new this._model(this.formatData(data, exclude)), populateOptions, this._model);
    };
    /**
     * Save model instance
     * @param item
     * @param data
     * @param exclude
     * @param populateOptions
     */
    ADBModel.save = function (item, data, exclude, populateOptions) {
        if (data === void 0) { data = null; }
        if (exclude === void 0) { exclude = null; }
        if (populateOptions === void 0) { populateOptions = null; }
        return DB_1.default.saveItem(item, this.formatData(data, exclude), populateOptions, this._model);
    };
    /**
     * Find model instance by id and save it
     * @param id
     * @param data
     * @param exclude
     * @param populateOptions
     * @return {Promise<T>}
     */
    ADBModel.saveById = function (id, data, exclude, populateOptions) {
        var _this = this;
        if (data === void 0) { data = null; }
        if (exclude === void 0) { exclude = null; }
        if (populateOptions === void 0) { populateOptions = null; }
        var defer = q.defer();
        if (data && data.hasOwnProperty('_id')) {
            delete data._id;
        }
        this.get(id, {})
            .then(function (item) {
            _this.save(item, data, exclude, populateOptions)
                .then(function (item) { return defer.resolve(item); })
                .catch(function (err) { return defer.reject(err); });
        })
            .catch(function (err) { return defer.reject(err); });
        return defer.promise;
    };
    /**
     * Mark item as deleted (without really deleting it)
     * @param item
     * @param user
     * @param checkIsAuthor
     * @return {Promise<T>}
     */
    ADBModel.setDeleted = function (item, user, checkIsAuthor) {
        if (user === void 0) { user = null; }
        if (checkIsAuthor === void 0) { checkIsAuthor = true; }
        var defer = q.defer();
        if (!item) {
            defer.reject(new Error('Item not found'));
        }
        else {
            if (checkIsAuthor && !Permissions_1.default.ensureAuthorized(user, 'admin') && item.creationUID !== user._id.toString()) {
                defer.reject(new Error('Permission denied'));
            }
            else {
                DB_1.default.saveItem(item, user, { deleted: true })
                    .then(function (item) { return defer.resolve(item); })
                    .catch(function (err) { return defer.reject(err); });
            }
        }
        return defer.promise;
    };
    /**
     * Mark item as deleted (without really deleting it)
     * @param id
     * @param user
     * @param checkIsAuthor
     */
    ADBModel.setDeletedById = function (id, user, checkIsAuthor) {
        var _this = this;
        if (user === void 0) { user = null; }
        if (checkIsAuthor === void 0) { checkIsAuthor = false; }
        var defer = q.defer();
        this.get(id, {})
            .then(function (item) {
            _this.setDeleted(item, user, checkIsAuthor)
                .then(function (item) { return defer.resolve(item); })
                .catch(function (err) { return defer.reject(err); });
        })
            .catch(function (err) { return defer.reject(err); });
        return defer.promise;
    };
    /**
     * Delete item
     * @param item
     * @param user
     * @param checkIsAuthor
     * @return {Promise<T>}
     */
    ADBModel.remove = function (item, user, checkIsAuthor) {
        if (user === void 0) { user = null; }
        if (checkIsAuthor === void 0) { checkIsAuthor = true; }
        var defer = q.defer();
        if (!item) {
            defer.reject(new Error('Item not found'));
        }
        else {
            if (checkIsAuthor && !Permissions_1.default.ensureAuthorized(user, 'admin') && item.creationUID !== user._id.toString()) {
                defer.reject(new Error('Permission denied'));
            }
            else {
                item.remove(function (err) {
                    if (err)
                        return defer.reject(err);
                    defer.resolve();
                });
            }
        }
        return defer.promise;
    };
    /**
     * Delete item by id
     * @param id
     * @param user
     * @param checkIsAuthor
     */
    ADBModel.removeById = function (id, user, checkIsAuthor) {
        var _this = this;
        if (user === void 0) { user = null; }
        if (checkIsAuthor === void 0) { checkIsAuthor = false; }
        var defer = q.defer();
        this.get(id, {})
            .then(function (item) {
            _this.remove(item, user, checkIsAuthor)
                .then(function (item) { return defer.resolve(item); })
                .catch(function (err) { return defer.reject(err); });
        })
            .catch(function (err) { return defer.reject(err); });
        return defer.promise;
    };
    /**
     * This method will format the given body by excluding provided keys (if any) and formatting any reference Objects
     * @param body
     * @param exclude
     */
    ADBModel.formatData = function (body, exclude) {
        if (exclude === void 0) { exclude = null; }
        if (!body)
            return null;
        if (exclude) {
            for (var _i = 0, exclude_1 = exclude; _i < exclude_1.length; _i++) {
                var e = exclude_1[_i];
                if (body.hasOwnProperty(e)) {
                    delete body[e];
                }
            }
        }
        for (var idx in body) {
            if (body.hasOwnProperty(idx)) {
                var value = body[idx];
                if (value instanceof Array) {
                    for (var i in value) {
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
    };
    /**
     * Apply custom mongoose select and/or populate
     * @param query
     * @param queryParams
     * @private
     */
    ADBModel.applyQueryParams = function (query, queryParams) {
        if (queryParams) {
            if (queryParams.select) {
                queryParams.select = queryParams.select instanceof Array ? queryParams.select : [queryParams.select];
                for (var _i = 0, _a = queryParams.select; _i < _a.length; _i++) {
                    var select = _a[_i];
                    query.select(select);
                }
            }
            if (queryParams.populate) {
                queryParams.populate = queryParams.populate instanceof Array ? queryParams.populate : [queryParams.populate];
                for (var _b = 0, _c = queryParams.populate; _b < _c.length; _b++) {
                    var populate = _c[_b];
                    query.populate(populate);
                }
            }
            if (queryParams.where) {
                for (var i in queryParams.where) {
                    if (queryParams.where.hasOwnProperty(i)) {
                        query.where(i).equals(queryParams.where[i]);
                    }
                }
            }
            if (queryParams.sort) {
                query.sort(queryParams.sort);
            }
            if (queryParams.limit) {
                query.limit(parseInt(queryParams.limit));
            }
            if (queryParams.skip) {
                query.skip(parseInt(queryParams.skip));
            }
        }
    };
    return ADBModel;
}());
exports.default = ADBModel;
//# sourceMappingURL=ADBModel.js.map