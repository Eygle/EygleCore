/// <reference types="q" />
/// <reference types="mongoose" />
import mongoose = require('mongoose');
import q = require('q');
export default class DB {
    /**
     * Is database connected
     */
    private static _connected;
    /**
     * Mongoose database instance
     */
    private static _instance;
    /**
     * _instance getter
     * @return {any}
     */
    static readonly instance: any;
    /**
     * Initialize database connexion
     * @return {Promise<any>}
     */
    static init(): Q.Promise<any>;
    /**
     * Default mongoose schema creation
     * @param data
     * @param deleted
     * @param options
     * @return {"mongoose".Schema}
     */
    static createSchema(data: any, deleted?: boolean, options?: any): mongoose.Schema;
    /**
     * Save item with author's information as updater
     * @param item
     * @param data
     * @param populateOptions
     * @param model
     */
    static saveItem(item: any, data?: any, populateOptions?: any, model?: any): q.Promise<{}>;
    /**
     * Create item with author's information as creator
     * @param item
     * @param populateOptions
     * @param model
     * @return {any}
     */
    static createItem(item: any, populateOptions?: any, model?: any): q.Promise<{}>;
    /**
     * Change all unpopulated references from String to Object ({_id: String}) (recursively)
     * This method is used in mongoose schema's toJSON & toObject methods
     * @param data
     */
    static transformUnpopulatedReferences(data: any): void;
    /**
     * Load all models
     * @private
     */
    private static _loadModels(prefix, path?, parent?);
}
