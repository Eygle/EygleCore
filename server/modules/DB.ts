import mongoose = require('mongoose');
import q = require('q');
import fs = require('fs');
import Utils from '../../commons/utils/Utils';
import {EHTTPStatus} from '../typings/server.enums';
import ServerConfig from "../utils/ServerConfig";
import Logger from "../utils/Logger";
import {CustomEdError} from "../utils/EdError";

export default class DB {
   /**
    * Is database connected
    */
   private static _connected: boolean = false;

   /**
    * Mongoose database instance
    */
   private static _instance: any;

   /**
    * _instance getter
    * @return {any}
    */
   public static get instance() {
      return this._instance;
   }

   /**
    * Initialize database connexion
    * @return {Promise<any>}
    */
   public static init(): Q.Promise<any> {
      const defer: Q.Deferred<any> = q.defer();

      mongoose.Promise = global.Promise;
      mongoose.connect('mongodb://localhost/' + ServerConfig.dbName);
      this._instance = mongoose.connection;
      this._instance.on('error', () => {
         Logger.error('Mongoose connection error');
      });
      this._instance.once('open', () => {
         this._loadModels(null);
         this._loadModels(ServerConfig.dbCollectionsPrefix, `${ServerConfig.root}/server/schemas/`);
         Logger.info(`Mongo database '${ServerConfig.dbName}' connected`);
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
   public static createSchema(data: any, deleted: boolean = true, options: any = null): mongoose.Schema {
      data.creationDate = {type: Date, required: true, 'default': Date.now};
      data.updateDate = {type: Date, required: true};
      data.__v = {type: Number, select: false}; // Avoid VersionError with schema having arrays

      if (deleted) {
         data.deleted = {type: Boolean, required: true, 'default': false, select: false};
      }

      const schema = new mongoose.Schema(data, options || {
         toJSON: {
            transform: function (doc, ret) {
               this.transformUnpopulatedReferences(ret);
               return ret;
            }
         }
      });

      schema.pre('save', function (next) { // DO NOT use big arrow (=>)
         this.updateDate = new Date();
         next();
      });

      if (deleted) {
         schema.pre('find', function (next) { // DO NOT use big arrow (=>)
            if (!this._conditions.hasOwnProperty('_id') && !this._conditions.hasOwnProperty('deleted')) {
               this.where('deleted').equals(false);
            } else if (this._conditions.hasOwnProperty('deleted') && this._conditions.deleted === null) {
               delete this._conditions.deleted; // remove deleted condition (include all, deleted or not)
            }

            next();
         });

         schema.pre('findOne', function (next) { // DO NOT use big arrow (=>)
            if (!this._conditions.hasOwnProperty('deleted')) {
               this.where('deleted').equals(false);
            } else if (this._conditions.hasOwnProperty('deleted') && this._conditions.deleted === null) {
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
   public static saveItem(item: any, data = null, populateOptions = null, model = null) {
      const defer = q.defer();

      if (!item) {
         defer.reject(new CustomEdError('Item not found', EHTTPStatus.BadRequest));
      } else {
         if (data) {
            Object.assign(item, data);
         }
         item.updateDate = new Date();
         item.save(function (err, res) {
            if (populateOptions) {
               model.populate(res, populateOptions)
                  .then(defer.resolve);
            } else if (err) {
               defer.reject(err);
            } else {
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
   public static createItem(item: any, populateOptions = null, model = null) {
      return this.saveItem(item, null, populateOptions, model);
   }

   /**
    * Change all unpopulated references from String to Object ({_id: String}) (recursively)
    * This method is used in mongoose schema's toJSON & toObject methods
    * @param data
    */
   public static transformUnpopulatedReferences(data) {
      const excludes = ['_id', 'id', 'creationUID', 'updateUID'];
      for (const key in data) {
         if (data.hasOwnProperty(key)) {
            if (typeof data[key] === 'string' && !~excludes.indexOf(key) && Utils.isMongoId(data[key])) {
               data[key] = {_id: data[key]};
            } else if (data[key] instanceof Object) {
               this.transformUnpopulatedReferences(data[key]);
            }
         }
      }
   }

   /**
    * Load all models
    * @private
    */
   private static _loadModels(prefix: string, path = `${__dirname}/../schemas`, parent = null): void {
      for (const f of fs.readdirSync(path)) {
         const modelName = (prefix || '') + f.split('.')[0];
         if (modelName === 'ASchema') continue;

         const file = `${path}/${f}`;
         const stat = fs.statSync(file);
         if (stat.isDirectory()) {
            this._loadModels(prefix, file, f);
            continue;
         }
         const model = require(file).schema.importSchema(modelName);
         model.on('error', (err) => {
            Logger.error(`Mongo error: [${err.name}] ${err.message}`, err.errors);
         });
         Logger.trace(`Model ${parent ? `${parent}/${modelName}` : modelName} loaded`);
      }
   }
}
