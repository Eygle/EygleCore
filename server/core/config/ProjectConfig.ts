import * as fs from 'fs';
import * as path from "path";
import {EEnv} from "../typings/server.enums";

class ProjectConfig {

   /**
    * Include implementsAuth
    */
   public implementsAuth: boolean;

   /**
    * Include includeCronManager manager
    */
   public includeCronManager: boolean;

   /**
    * Include email subscription managment
    */
   public includeEmailUnsubscribe: boolean;

   /**
    * Activate CSRF security
    */
   public activateCSRFSecurity: boolean;

   /**
    * Current environment
    */
   public envName: string;

   /**
    * Current environment
    */
   public env: EEnv;

   /**
    * Server port
    */
   public port: number;

   /**
    * Mongodb database name
    */
   public dbName: string;

   /**
    * Mongodb collections prefix
    */
   public dbCollectionsPrefix: string;

   /**
    * Application name
    */
   public appName: string;

   /**
    * Project root path
    */
   public root: string;

   /**
    * Api root path
    */
   public apiRoot: string;

   /**
    * Client root path
    * Replace {{root}} by given configuration root value
    */
   public clientRoot: string;

   /**
    * Server images root path
    * Replace {{root}} by given configuration root value
    */
   public imagesRoot: string;

   /**
    * Uploaded files folder path
    * Replace {{root}} by given configuration root value
    */
   public filesRoot: string;

   /**
    * Session cookie name
    */
   public sessionCookieName: string;

   /**
    * Logger type
    */
   public loggerType: string; // console or file

   /**
    * Logger
    */
   public logger: ILoggerConf;

   /**
    * Debug flag
    */
   public debug: boolean;

   constructor() {
      const confFile = path.normalize(`${__dirname}/../../../eygle-conf.json`);
      const data = <string>fs.readFileSync(confFile, {encoding: 'utf8'});

      if (!data) {
         console.error(`Fail to load file ${confFile}`);
         process.exit(-1);
      }

      const json = JSON.parse(data);
      if (!json) {
         console.error(`Fail to parse JSON file ${confFile}`);
         process.exit(-1);
      }

      this._loadEnv();
      this._buildConf(json.server || {});
   }

   /**
    * Load environment
    * @return {EEnv}
    */
   private _loadEnv(): void {
      this.envName = process.env.NODE_ENV;
      switch (this.envName) {
         case 'development':
            this.env = EEnv.Dev;
            break;
         case 'test':
            this.env = EEnv.Test;
            break;
         case 'preprod':
            this.env = EEnv.Preprod;
            break;
         case 'production':
         default:
            this.env = EEnv.Prod;
      }
   }

   /**
    * Build conf from JSON extracted data and default conf
    * It can be override depending on current environment
    * @param data
    * @private
    */
   private _buildConf(data: any) {
      const env = data.environments && data.environments.hasOwnProperty(this.envName) ?
         data.environments[this.envName] : {};
      env.logger = env.logger || {};
      data.logger = data.logger || {};


      this.implementsAuth = this._checkBooleanPresence('implementsAuth', env, data);
      this.includeCronManager =this._checkBooleanPresence('includeCronManager', env, data);
      this.includeEmailUnsubscribe = this._checkBooleanPresence('includeEmailUnsubscribe', env, data);
      this.activateCSRFSecurity = this._checkBooleanPresence('activateCSRFSecurity', env, data);

      this.appName = env.appName || data.appName || process.env.NODE_APP;
      this.port = env.port || data.port || process.env.PORT;
      this.dbName = env.dbName || data.dbName;
      this.dbCollectionsPrefix = env.dbCollectionsPrefix || data.dbCollectionsPrefix || null;
      this.root = path.normalize(env.root || data.root || `${__dirname}/../../..`);
      this.debug = this._checkBooleanPresence('debug', env, data);
      this.apiRoot = this._formatConfStr(env.apiRoot || data.apiRoot || '{{root}}/server/api');
      this.clientRoot = this._formatConfStr(env.clientRoot || data.clientRoot || '{{root}}/client');
      this.imagesRoot = this._formatConfStr(env.imagesRoot || data.imagesRoot || '{{root}}/client/images');
      this.filesRoot = this._formatConfStr(env.filesRoot || data.filesRoot || '{{root}}/server/files');
      this.sessionCookieName = this._formatConfStr(env.sessionCookieName || data.sessionCookieName || 'mapui-connect.sid');
      this.loggerType = env.logger.type || data.logger.type || "console";
      this.logger = {
         format: env.logger.format || data.logger.format || "{{timestamp}} <{{title}}> {{message}}", // DO not format this string, the values are replaces by tracer
         dateFormat: env.logger.dateFormat || data.logger.dateFormat || "HH:MM:ss.L",
      };

      if (this.loggerType === "file") {
         this.logger.root = this._formatConfStr(env.logger.root || data.logger.root || "{{root}}/server/logs");
         this.logger.maxLogFiles = env.logger.maxLogFiles || data.logger.maxLogFiles || 10;
         this.logger.allLogsFileName = this._formatConfStr(env.logger.allLogsFileName || data.logger.allLogsFileName || "{{appName}}-{{env}}-{{pmId}}.log");
      }
   }

   /**
    * Format given string using saved data
    * @param {string} str
    * @return {string}
    * @private
    */
   private _formatConfStr(str: string) {
      str = str.replace('{{root}}', this.root);
      str = str.replace('{{appName}}', this.appName);
      str = str.replace('{{env}}', this.envName);
      str = str.replace('{{pmId}}', process.env.pm_id);

      return str;
   }

   /**
    * Check if boolean value is present in env first or data or set def value
    * @param label
    * @param env
    * @param data
    * @param {boolean} def
    * @private
    */
   private _checkBooleanPresence(label, env, data, def = false) {
      if (env[label] !== undefined) {
         return env[label];
      }
      if (data[label] !== undefined) {
         return data[label];
      }
      return def;
   }
}

interface ILoggerConf {

   /**
    * Lines format (default: "{{timestamp}} <{{title}}> {{message}}")
    */
   format?: string;

   /**
    * Date format (default: "HH:MM:ss.L")
    */
   dateFormat?: string;

   /**
    * File root path
    */
   root?: string;

   /**
    * Maximum number of logs files
    */
   maxLogFiles?: number;

   /**
    * Log file name
    * Will replace {{appName}} and {{env}} by config matching values
    * Will replace {{pmId}} by process.env.pm_id value
    */
   allLogsFileName?: string;
}

export default new ProjectConfig();