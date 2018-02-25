/// <reference types="mongoose" />
/// <reference types="q" />
import * as mongoose from 'mongoose';
import * as q from 'q';
import { AModel } from '../../commons/models/AModel';
declare abstract class ASchema {
    /**
     * Current schema's mongoose model
     */
    protected _model: mongoose.Model<any>;
    /**
     * Keys to encrypt before saving document
     */
    protected _encryptKeys: Array<string>;
    /**
     * Schema getter
     * @return {"mongoose".Schema}
     */
    abstract getSchema(): mongoose.Schema;
    constructor(encryptKeys?: any);
    /**
     * Method called from DB.ts in
     * @param name
     * @return {mongoose.Model<any>}
     */
    importSchema(name: string): mongoose.Model<any>;
    /**
     * Get model by id
     * @param id
     * @param queryParams
     * @return {Promise<T>}
     */
    get(id: string, queryParams?: any): q.Promise<{}>;
    /**
     * Get all model
     * @return {Promise<T>}
     */
    getAll(queryParams?: any): q.Promise<AModel[]>;
    /**
     * Create new model instance
     * @param data
     * @param exclude
     * @return {Promise<T>}
     */
    create(data: any, exclude?: any): any;
    /**
     * Create new model instance and save it
     * @param data
     * @param exclude
     * @param populateOptions
     * @return {Promise<T>}
     */
    add(data: any, exclude?: any, populateOptions?: any): q.Promise<{}>;
    /**
     * Save model instance
     * @param item
     * @param data
     * @param exclude
     * @param populateOptions
     */
    save(item: any, data?: any, exclude?: any, populateOptions?: any): q.Promise<{}>;
    /**
     * Find model instance by id and save it
     * @param id
     * @param data
     * @param exclude
     * @param populateOptions
     * @return {Promise<T>}
     */
    saveById(id: string, data?: any, exclude?: any, populateOptions?: any): q.Promise<{}>;
    /**
     * Mark item as deleted (without really deleting it)
     * @param item
     * @return {Promise<T>}
     */
    setDeleted(item: any): q.Promise<{}>;
    /**
     * Mark item as deleted (without really deleting it)
     * @param id
     */
    setDeletedById(id: any): q.Promise<{}>;
    /**
     * Delete item
     * @param item
     * @return {Promise<T>}
     */
    remove(item: any): q.Promise<any>;
    /**
     * Delete item by id
     * @param id
     */
    removeById(id: any): q.Promise<{}>;
    /**
     * This method will format the given body by excluding provided keys (if any) and formatting any reference Objects
     * @param body
     * @param exclude
     */
    formatData(body: any, exclude?: any): any;
    /**
     * Apply custom mongoose select and/or populate
     * @param query
     * @param queryParams
     * @private
     */
    protected applyQueryParams(query: any, queryParams: any): void;
}
export default ASchema;
