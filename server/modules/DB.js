"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const q = require("q");
const fs = require("fs");
const Utils_1 = require("../../commons/utils/Utils");
const server_enums_1 = require("../typings/server.enums");
const ServerConfig_1 = require("../utils/ServerConfig");
const Logger_1 = require("../utils/Logger");
const EdError_1 = require("../utils/EdError");
const path = require("path");
class DB {
    /**
     * _instance getter
     * @return {any}
     */
    static get instance() {
        return this._instance;
    }
    /**
     * Initialize database connexion
     * @return {Promise<any>}
     */
    static init() {
        const defer = q.defer();
        mongoose.connect('mongodb://localhost/' + ServerConfig_1.default.dbName);
        this._instance = mongoose.connection;
        this._instance.on('error', () => {
            Logger_1.default.error('Mongoose connection error');
        });
        this._instance.once('open', () => {
            this._loadModels(`${__dirname}/../db`, 'EygleCore');
            this._loadModels(`${ServerConfig_1.default.root}/server/db`, ServerConfig_1.default.appName, ServerConfig_1.default.dbCollectionsPrefix);
            Logger_1.default.info(`Mongo database '${ServerConfig_1.default.dbName}' connected`);
            defer.resolve();
        });
        return defer.promise;
    }
    /**
     * Default mongoose schema creation
     * @param data
     * @param deleted
     * @param options
     * @return {"mongoose".Schema}
     */
    static createSchema(data, deleted = true, options = null) {
        data.creationDate = { type: Date, required: true, 'default': Date.now };
        data.updateDate = { type: Date, required: true };
        data.__v = { type: Number, select: false }; // Avoid VersionError with schema having arrays
        if (deleted) {
            data.deleted = { type: Boolean, required: true, 'default': false, select: false };
        }
        const schema = new mongoose.Schema(data, options || {
            toJSON: {
                transform: function (doc, ret) {
                    this.transformUnpopulatedReferences(ret);
                    return ret;
                }
            }
        });
        schema.pre('save', function (next) {
            this.updateDate = new Date();
            next();
        });
        if (deleted) {
            schema.pre('find', function (next) {
                if (!this._conditions.hasOwnProperty('_id') && !this._conditions.hasOwnProperty('deleted')) {
                    this.where('deleted').equals(false);
                }
                else if (this._conditions.hasOwnProperty('deleted') && this._conditions.deleted === null) {
                    delete this._conditions.deleted; // remove deleted condition (include all, deleted or not)
                }
                next();
            });
            schema.pre('findOne', function (next) {
                if (!this._conditions.hasOwnProperty('deleted')) {
                    this.where('deleted').equals(false);
                }
                else if (this._conditions.hasOwnProperty('deleted') && this._conditions.deleted === null) {
                    delete this._conditions.deleted; // remove deleted condition (include all, deleted or not)
                }
                next();
            });
        }
        return schema;
    }
    /**
     * Save item with author's information as updater
     * @param item
     * @param data
     * @param populateOptions
     * @param model
     */
    static saveItem(item, data = null, populateOptions = null, model = null) {
        const defer = q.defer();
        if (!item) {
            defer.reject(new EdError_1.CustomEdError('Item not found', server_enums_1.EHTTPStatus.BadRequest));
        }
        else {
            if (data) {
                Object.assign(item, data);
            }
            item.updateDate = new Date();
            item.save(function (err, res) {
                if (populateOptions) {
                    model.populate(res, populateOptions)
                        .then(defer.resolve);
                }
                else if (err) {
                    defer.reject(err);
                }
                else {
                    defer.resolve(res);
                }
            });
        }
        return defer.promise;
    }
    /**
     * Create item with author's information as creator
     * @param item
     * @param populateOptions
     * @param model
     * @return {any}
     */
    static createItem(item, populateOptions = null, model = null) {
        return this.saveItem(item, null, populateOptions, model);
    }
    /**
     * Change all unpopulated references from String to Object ({_id: String}) (recursively)
     * This method is used in mongoose schema's toJSON & toObject methods
     * @param data
     */
    static transformUnpopulatedReferences(data) {
        const excludes = ['_id', 'id', 'creationUID', 'updateUID'];
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                if (typeof data[key] === 'string' && !~excludes.indexOf(key) && Utils_1.default.isMongoId(data[key])) {
                    data[key] = { _id: data[key] };
                }
                else if (data[key] instanceof Object) {
                    this.transformUnpopulatedReferences(data[key]);
                }
            }
        }
    }
    /**
     * Load all models
     * @private
     */
    static _loadModels(dir, appName, prefix = '', parent = null) {
        if (!fs.existsSync(dir))
            return null;
        for (let f of fs.readdirSync(dir)) {
            const file = `${dir}/${f}`;
            const stat = fs.statSync(file);
            if (stat.isDirectory()) {
                this._loadModels(file, appName, f);
                continue;
            }
            if (path.extname(f) !== '.js')
                continue;
            let modelName = prefix + f.split('.')[0];
            if (modelName === 'ADBModel')
                continue;
            if (modelName.endsWith('DB')) {
                modelName = modelName.substr(0, modelName.length - 2);
            }
            const model = require(file).schema.importSchema(modelName);
            model.on('error', (err) => {
                Logger_1.default.error(`Mongo error: [${err.name}] ${err.message}`, err.errors);
            });
            Logger_1.default.trace(`Model ${appName}/${parent ? `${parent}/${modelName}` : modelName} loaded`);
        }
    }
    ;
}
/**
 * Is database connected
 */
DB._connected = false;
exports.default = DB;
//# sourceMappingURL=DB.js.map