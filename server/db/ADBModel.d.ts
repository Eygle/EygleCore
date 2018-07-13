/// <reference types="mongoose" />
/// <reference types="q" />
import * as mongoose from 'mongoose';
import * as q from 'q';
import { AModel } from '../../commons/models/AModel';
import { User } from '../../commons/models/User';
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
    static init(schema: mongoose.Schema, encryptKeys?: string[]): void;
    /**
     * Method called from MongoDB.ts in
     * @param name
     * @param prefix
     * @param exclude
     * @return {mongoose.Model<any>}
     */
    static importSchema(name: string, prefix: any, exclude: any): mongoose.Model<any>;
    /**
     * Get model by id
     * @param id
     * @param queryParams
     * @return {Promise<T>}
     */
    static get(id: string, queryParams?: any): q.Promise<{}>;
    /**
     * Get all model
     * @return {Promise<T>}
     */
    static getAll(queryParams?: any): q.Promise<AModel[]>;
    /**
     * Create new model instance
     * @param data
     * @param exclude
     * @return mongoose.Model<any>
     */
    static create(data: any, exclude?: any): any;
    /**
     * Create new model instance
     * @param data
     * @param exclude
     * @param populateOptions
     * @return {Promise<T>}
     */
    static add(data: any, exclude?: string[], populateOptions?: any[]): q.Promise<{}>;
    /**
     * Save model instance
     * @param item
     * @param data
     * @param exclude
     * @param populateOptions
     */
    static save(item: any, data?: any, exclude?: string[], populateOptions?: any[]): q.Promise<{}>;
    /**
     * Find model instance by id and save it
     * @param id
     * @param data
     * @param exclude
     * @param populateOptions
     * @return {Promise<T>}
     */
    static saveById(id: string, data?: any, exclude?: string[], populateOptions?: any[]): q.Promise<{}>;
    /**
     * Mark item as deleted (without really deleting it)
     * @param item
     * @param user
     * @param checkIsAuthor
     * @return {Promise<T>}
     */
    static setDeleted(item: any, user?: User, checkIsAuthor?: boolean): q.Promise<{}>;
    /**
     * Mark item as deleted (without really deleting it)
     * @param id
     * @param user
     * @param checkIsAuthor
     */
    static setDeletedById(id: string, user?: User, checkIsAuthor?: boolean): q.Promise<{}>;
    /**
     * Delete item
     * @param item
     * @param user
     * @param checkIsAuthor
     * @return {Promise<T>}
     */
    static remove(item: any, user?: User, checkIsAuthor?: boolean): q.Promise<{}>;
    /**
     * Delete item by id
     * @param id
     * @param user
     * @param checkIsAuthor
     */
    static removeById(id: string, user?: User, checkIsAuthor?: boolean): q.Promise<{}>;
    /**
     * This method will format the given body by excluding provided keys (if any) and formatting any reference Objects
     * @param body
     * @param exclude
     */
    static formatData(body: any, exclude?: string[]): any;
    /**
     * Apply custom mongoose select and/or populate
     * @param query
     * @param queryParams
     * @private
     */
    protected static applyQueryParams(query: any, queryParams: any): void;
    /**
     * Add prefix to all references to non un-prefixed models
     * @param obj
     * @param prefix
     * @param exclude
     * @private
     */
    private static _addPrefix(obj, prefix, exclude);
}
