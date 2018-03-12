import * as mongoose from 'mongoose';
import * as q from 'q';
import * as _ from 'underscore';

import DB from '../modules/DB';
import Permission from '../modules/Permissions';
import {CustomEdError} from '../utils/EdError';
import {EHTTPStatus} from '../typings/server.enums';
import {AModel} from '../../commons/models/AModel';
import {User} from '../../commons/models/User';
import Utils from '../../commons/utils/Utils';

export default abstract class ADBModel {
    /**
     * Current schema's mongoose model
     */
    protected static _model: mongoose.Model<any>;

    /**
     * Mongoose schema
     */
    protected static _schema: mongoose.Schema;

    /**
     * Initialise class
     * @param {mongoose.Schema} schema
     * @param {string[]} encryptKeys
     */
    public static init(schema: mongoose.Schema, encryptKeys: string[] = null) {
        this._schema = schema;
    }

    /**
     * Method called from MongoDB.ts in
     * @param name
     * @return {mongoose.Model<any>}
     */
    public static importSchema(name: string) {
        this._model = mongoose.model(name, this._schema, name);
        return this._model;
    }

    /**
     * Get model by id
     * @param id
     * @param queryParams
     * @return {Promise<T>}
     */
    public static get(id: string, queryParams: any = null) {
        const defer = q.defer();

        if (!Utils.isMongoId(id)) {
            defer.reject(new Error(`Invalid mongo id ${id}`));
        }
        else {
            const query = this._model.findById(id);
            this.applyQueryParams(query, queryParams);
            query.exec((err, item) => {
                if (err) return defer.reject(err);
                if (!item) return defer.reject(new CustomEdError('No such item', EHTTPStatus.BadRequest));
                defer.resolve(item);
            });
        }
        return defer.promise;
    }

    /**
     * Get all model
     * @return {Promise<T>}
     */
    public static getAll(queryParams: any = null): q.Promise<AModel[]> {
        const defer = <q.Deferred<Array<AModel>>>q.defer();

        const query = this._model.find();
        this.applyQueryParams(query, queryParams);
        query.exec((err, items) => {
            if (err) return defer.reject(err);
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
    public static create(data: any, exclude = null) {
        return new this._model(this.formatData(data, exclude));
    }

    /**
     * Create new model instance
     * @param data
     * @param exclude
     * @param populateOptions
     * @return {Promise<T>}
     */
    public static add(data: any, exclude: string[] = null, populateOptions: any[] = null) {
        return DB.createItem(new this._model(this.formatData(data, exclude)), populateOptions, this._model);
    }

    /**
     * Save model instance
     * @param item
     * @param data
     * @param exclude
     * @param populateOptions
     */
    public static save(item: any, data: any = null, exclude: string[] = null, populateOptions: any[] = null) {
        return DB.saveItem(item, this.formatData(data, exclude), populateOptions, this._model);
    }

    /**
     * Find model instance by id and save it
     * @param id
     * @param data
     * @param exclude
     * @param populateOptions
     * @return {Promise<T>}
     */
    public static saveById(id: string, data: any = null, exclude: string[] = null, populateOptions: any[] = null) {
        const defer = q.defer();

        if (data && data.hasOwnProperty('_id')) {
            delete data._id;
        }
        this.get(id, {})
            .then(item => {
                this.save(item, data, exclude, populateOptions)
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
    public static setDeleted(item: any, user: User = null, checkIsAuthor = true) {
        const defer = q.defer();

        if (!item) {
            defer.reject(new Error('Item not found'));
        }
        else {
            if (checkIsAuthor && !Permission.ensureAuthorized(user, 'admin') && item.creationUID !== user._id.toString()) {
                defer.reject(new Error('Permission denied'));
            }
            else {
                DB.saveItem(item, user, {deleted: true})
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
    public static setDeletedById(id: string, user: User = null, checkIsAuthor = false) {
        const defer = q.defer();

        this.get(id, {})
            .then(item => {
                this.setDeleted(item, user, checkIsAuthor)
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
    public static remove(item: any, user: User = null, checkIsAuthor = true) {
        const defer = q.defer();

        if (!item) {
            defer.reject(new Error('Item not found'));
        }
        else {
            if (checkIsAuthor && !Permission.ensureAuthorized(user, 'admin') && item.creationUID !== user._id.toString()) {
                defer.reject(new Error('Permission denied'));
            }
            else {
                item.remove((err: any) => {
                    if (err) return defer.reject(err);
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
    public static removeById(id: string, user: User = null, checkIsAuthor = false) {
        const defer = q.defer();

        this.get(id, {})
            .then(item => {
                this.remove(item, user, checkIsAuthor)
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
    public static formatData(body: any, exclude: string[] = null) {
        if (!body) return null;
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
                if (value instanceof Array) { // Try to generate an array of {_id: mongoId} objects
                    for (let i in value) {
                        if (value.hasOwnProperty(i) && value[i] && value[i].hasOwnProperty('_id')) {
                            value[i] = value[i]._id;
                        }
                    }
                }
                else if (value instanceof Object && value.hasOwnProperty('_id')) { // Try to extract _id from object
                    body[idx] = (<any>value)._id;
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
    protected static applyQueryParams(query: any, queryParams: any) {
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
