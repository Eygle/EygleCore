import * as mongoose from 'mongoose';
import * as q from 'q';
import * as fs from 'fs';
import Utils from '../../commons/utils/Utils';
import {EHTTPStatus} from '../typings/server.enums';
import ServerConfig from "../utils/ServerConfig";
import Logger from "../utils/Logger";
import {CustomEdError} from "../utils/EdError";
import * as path from "path";

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

      mongoose.connect('mongodb://localhost/' + ServerConfig.dbName);
      this._instance = mongoose.connection;
      this._instance.on('error', () => {
         Logger.error('Mongoose connection error');
      });
      this._instance.once('open', () => {
          this._loadModels(`${__dirname}/../db`, 'EygleCore');
          this._loadModels(`${ServerConfig.root}/server/db`, ServerConfig.appName, ServerConfig.dbCollectionsPrefix);
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
    private static _loadModels(dir: string, appName: string, prefix: string = '', parent: any = null): void {
        if (!fs.existsSync(dir)) return null;
        for (let f of fs.readdirSync(dir)) {
            const file = `${dir}/${f}`;
            const stat = fs.statSync(file);
            if (stat.isDirectory()) {
                this._loadModels(file, appName, f);
                continue;
            }

            if (path.extname(f) !== '.js') continue;

            let modelName = prefix + f.split('.')[0];
            if (modelName === 'ADBModel') continue;

            if (modelName.endsWith('DB')) {
                modelName = modelName.substr(0, modelName.length - 2);
            }
            const model = require(file).schema.importSchema(modelName);
            model.on('error', (err: any) => {
                Logger.error(`Mongo error: [${err.name}] ${err.message}`, err.errors);
            });
            Logger.trace(`Model ${appName}/${parent ? `${parent}/${modelName}` : modelName} loaded`);
        }
    };
}
