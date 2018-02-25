/// <reference types="q" />
/// <reference types="mongoose" />
import mongoose = require('mongoose');
import q = require('q');
export declare class DB {
    /**
     * Is database connected
     */
    private _connected;
    /**
     * Mongoose database instance
     */
    private _instance;
    /**
     * _instance getter
     * @return {any}
     */
    readonly instance: any;
    constructor();
    /**
     * Initialize database connexion
     * @return {Promise<any>}
     */
    init(): Q.Promise<any>;
    /**
     * Default mongoose schema creation
     * @param data
     * @param deleted
     * @param options
     * @return {"mongoose".Schema}
     */
    createSchema(data: any, deleted?: boolean, options?: any): mongoose.Schema;
    /**
     * Save item with author's information as updater
     * @param item
     * @param data
     * @param populateOptions
     * @param model
     */
    saveItem(item: any, data?: any, populateOptions?: any, model?: any): q.Promise<{}>;
    /**
     * Create item with author's information as creator
     * @param item
     * @param populateOptions
     * @param model
     * @return {any}
     */
    createItem(item: any, populateOptions?: any, model?: any): q.Promise<{}>;
    /**
     * Change all unpopulated references from String to Object ({_id: String}) (recursively)
     * This method is used in mongoose schema's toJSON & toObject methods
     * @param data
     */
    transformUnpopulatedReferences(data: any): void;
    /**
     * Load all models
     * @private
     */
    private _loadModels(prefix, path?, parent?);
}
declare const instance: DB;
export default instance;
