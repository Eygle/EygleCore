"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var q = require("q");
var fs = require("fs");
var Utils_1 = require("../../commons/utils/Utils");
var server_enums_1 = require("../typings/server.enums");
var ServerConfig_1 = require("../utils/ServerConfig");
var Logger_1 = require("../utils/Logger");
var EdError_1 = require("../utils/EdError");
var path = require("path");
var DB = (function () {
    function DB() {
    }
    Object.defineProperty(DB, "instance", {
        /**
         * _instance getter
         * @return {any}
         */
        get: function () {
            return DB._instance;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Initialize database connexion
     * @return {Promise<any>}
     */
    DB.init = function () {
        var defer = q.defer();
        mongoose.connect('mongodb://localhost/' + ServerConfig_1.default.dbName);
        DB._instance = mongoose.connection;
        DB._instance.on('error', function () {
            Logger_1.default.error('Mongoose connection error');
        });
        DB._instance.once('open', function () {
            DB._loadModels(__dirname + "/../db", 'EygleCore');
            DB._loadModels(ServerConfig_1.default.root + "/server/db", ServerConfig_1.default.appName, ServerConfig_1.default.dbCollectionsPrefix);
            Logger_1.default.info("Mongo database '" + ServerConfig_1.default.dbName + "' connected");
            defer.resolve();
        });
        return defer.promise;
    };
    /**
     * Default mongoose schema creation
     * @param data
     * @param deleted
     * @param options
     * @return {"mongoose".Schema}
     */
    DB.createSchema = function (data, deleted, options) {
        if (deleted === void 0) { deleted = true; }
        if (options === void 0) { options = null; }
        data.creationDate = { type: Date, required: true, 'default': Date.now };
        data.updateDate = { type: Date, required: true };
        data.__v = { type: Number, select: false }; // Avoid VersionError with schema having arrays
        if (deleted) {
            data.deleted = { type: Boolean, required: true, 'default': false, select: false };
        }
        var schema = new mongoose.Schema(data, options || {
            toJSON: {
                transform: function (doc, ret) {
                    DB.transformUnpopulatedReferences(ret);
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
    };
    /**
     * Save item with author's information as updater
     * @param item
     * @param data
     * @param populateOptions
     * @param model
     */
    DB.saveItem = function (item, data, populateOptions, model) {
        if (data === void 0) { data = null; }
        if (populateOptions === void 0) { populateOptions = null; }
        if (model === void 0) { model = null; }
        var defer = q.defer();
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
    };
    /**
     * Create item with author's information as creator
     * @param item
     * @param populateOptions
     * @param model
     * @return {any}
     */
    DB.createItem = function (item, populateOptions, model) {
        if (populateOptions === void 0) { populateOptions = null; }
        if (model === void 0) { model = null; }
        return DB.saveItem(item, null, populateOptions, model);
    };
    /**
     * Change all unpopulated references from String to Object ({_id: String}) (recursively)
     * This method is used in mongoose schema's toJSON & toObject methods
     * @param data
     */
    DB.transformUnpopulatedReferences = function (data) {
        var excludes = ['_id', 'id', 'creationUID', 'updateUID'];
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                if (typeof data[key] === 'string' && !~excludes.indexOf(key) && Utils_1.default.isMongoId(data[key])) {
                    data[key] = { _id: data[key] };
                }
                else if (data[key] instanceof Object) {
                    DB.transformUnpopulatedReferences(data[key]);
                }
            }
        }
    };
    /**
     * Load all models
     * @private
     */
    DB._loadModels = function (dir, appName, prefix, parent) {
        if (prefix === void 0) { prefix = ''; }
        if (parent === void 0) { parent = null; }
        if (!fs.existsSync(dir))
            return null;
        for (var _i = 0, _a = fs.readdirSync(dir); _i < _a.length; _i++) {
            var f = _a[_i];
            var file = dir + "/" + f;
            var stat = fs.statSync(file);
            if (stat.isDirectory()) {
                DB._loadModels(file, appName, f);
                continue;
            }
            if (path.extname(f) !== '.js')
                continue;
            var modelName = prefix + f.split('.')[0];
            if (modelName === 'ADBModel')
                continue;
            if (modelName.endsWith('DB')) {
                modelName = modelName.substr(0, modelName.length - 2);
            }
            var model = require(file).schema.importSchema(modelName);
            model.on('error', function (err) {
                Logger_1.default.error("Mongo error: [" + err.name + "] " + err.message, err.errors);
            });
            Logger_1.default.trace("Model " + appName + "/" + (parent ? parent + "/" + modelName : modelName) + " loaded");
        }
    };
    ;
    /**
     * Is database connected
     */
    DB._connected = false;
    return DB;
}());
exports.default = DB;
//# sourceMappingURL=DB.js.map