import * as express from 'express';
import * as http from 'http';
import * as session from 'express-session';
import * as q from 'q';
import * as compress from "compression";
import * as bodyParser from "body-parser";
import * as busboy from "connect-busboy";
import * as methodOverride from "method-override";
import * as cookieParser from "cookie-parser";
import * as connectMongo from 'connect-mongo';
import * as csrf from "csurf";

import Permission from "./modules/Permissions";
import DB from './modules/DB';
import CronManager from "./modules/CronManager";
import Logger from "./utils/Logger";
import ServerConfig from "./utils/ServerConfig";
import {EEnv} from "../commons/core.enums";
import PassportConfig from "./utils/PassportConfig";
import Routes from "./utils/Routes";
import EdError from "./utils/EdError";
import ProjectConfig from "../commons/utils/ProjectConfig";
import {ICustomModule, ICustomRoute} from "./typings/customs.interface";

const MongoStore = connectMongo(session);

export class EygleServer {
   /**
    * Express application instance
    */
   private _app;

   /**
    * HTTP server
    */
   private _http: any;

   /**
    * Mongo store instance
    */
   private _mongoStore: any;

   /**
    * List of custom routes
    */
   private _customRoutes: ICustomRoute[];

    /**
     * List of custom modules
     */
    private _customModules: ICustomModule[];

    /**
     * Constructor
     * @param root
     * @param {string} config Project configuration file path
     */
    constructor(root: string, config: any) {
        this._customRoutes = [];
        this._customModules = [];
        this._app = express();
        ProjectConfig.initForServer(root, config, process.env.NODE_ENV);
        ServerConfig.init();
        Logger.init();
    }

   /**
    * Start node Express server
    */
   public start(): void {
     this._printHeader();

      const promises = [DB.init()];

      // Initialize all databases connections
      q.allSettled(promises).then(() => {
         Logger.info('All databases are connected and ready\n');
         this._init();

         Logger.info(`Node v${process.versions.node}`);
         Logger.info(`Environment: ${process.env.NODE_ENV || 'production'}`);

         const inst = this._http.listen(this._app.get('port'), this._app.get('ip'), () => {
            Logger.info("Express server listening on port %d\n", this._app.get('port'));
         });
      });
   }

    /**
     * Add custom routes
     * @param route
     */
    public addRoute(route: ICustomRoute) {
        this._customRoutes.push(route);
        return this;
    }

    /**
     * Add custom routes
     * @param {ICustomModule} module
     */
    public addModule(module: ICustomModule) {
        this._customModules.push(module);
        return this;
    }

   /**
    * Initialize server
    * @private
    */
   private _init(): void {
      try {
         this._http = http.createServer(this._app);

         // connect-mongo instance
         this._mongoStore = new MongoStore(<any>{
            mongooseConnection: DB.instance,
            db: ServerConfig.dbName
         });

         // Common express session used in express and socket.io
         const sessionX = session({
            name: ServerConfig.sessionCookieName,
            secret: ServerConfig.sessionSecret,
            cookie: {
               maxAge: 2592000000, // 30 days,
               domain: EEnv.Prod === ServerConfig.env || EEnv.Preprod === ServerConfig.env ? ".mapui.fr" : undefined
            },
            resave: true,
            rolling: true,
            saveUninitialized: true,
            store: this._mongoStore
         });

         this._app.set("view options", {layout: false});
         this._app.set('port', ServerConfig.port);
         this._app.disable('x-powered-by');

         this._app.use((<any>bodyParser).urlencoded({extended: true}));
         this._app.use(bodyParser.json({limit: '50mb'}));
         this._app.use(methodOverride());
         this._app.use(compress());
         this._app.use(cookieParser());
         this._app.use(sessionX);

         // INIT PERMISSIONS
         this._app.use(Permission.middleware());

         // INIT CSRF
         if (ServerConfig.activateCSRFSecurity) {
            this._initCSRF(this._app);
         }

         // MANAGE FILE UPLOADS
         this._app.use(busboy({
            limits: {
               fileSize: 10 * 1024 * 1024
            }
         }));

         if (ServerConfig.implementsAuth) {
            Logger.trace("Module Auth activated");
            PassportConfig.init(this._app);
         }
         Routes.init(this._app, this._customRoutes);
         this._handleErrors(this._app); // Last errors handler
         if (ServerConfig.includeCronManager) {
            Logger.trace("Module Cron Manager activated");
            CronManager.init();
         }

          // Initialize all custom modeules
          for (const module of this._customModules) {
              Logger.trace(`Module ${module.name} activated`);
              module.init(this._app);
          }

         Logger.info("All modules are loaded and activated\n");
      } catch (err) {
         console.error(err);
      }
   }

   /**
    * Handle error
    * @param app
    */
   private _handleErrors(app) {
      app.use(function (err, req, res, next) { // DO NOT REMOVE next argument
         if (err instanceof EdError || err.name === 'ValidationError') {
            Logger.error(`[user ${req.user ? req.user._id : '[null]'}] HTTP ${req.method.toUpperCase()} ${req.url} - Error ${err.status || 500}: ${err.message}`);
            res.status(err.status || 500).send(err.message);
         }
         else {
            Logger.error(`[user ${req.user ? req.user._id : '[null]'}] HTTP ${req.method.toUpperCase()} ${req.url} - Server Error ${err.status || 500}:`, err);
            res.status(err.status || 500).send(new EdError(err.status || 500).message);
         }
      });
   }

   /**
    * Init CSRF token checker
    * @param app
    * @private
    */
   private _initCSRF(app) {
      Logger.trace("Module CSRF activated");
      app.use(csrf(<any>{
         cookie: {
            secure: EEnv.Prod === ServerConfig.env || EEnv.Preprod === ServerConfig.env // Only for productions
         }
      }));

      app.use(function (req, res, next) {
         res.cookie('XSRF-TOKEN', req.csrfToken(), {secure: EEnv.Prod === ServerConfig.env || EEnv.Preprod === ServerConfig.env});
         next();
      });

      // Error handler
      app.use(function (err, req, res, next) {
         if (err.code !== 'EBADCSRFTOKEN') return next(err);

         // handle CSRF token errors here
         const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
         Logger.error(`Error with CSRF token: HTTP ${req.method.toUpperCase()} ${req.url} [${ip}]`);
         res.status(403).send('Form tampered with');
      });
   }

   /**
    * Print header in logs
    * @private
    */
   private _printHeader() {
      const sentence = `===== START ${ServerConfig.appName.toUpperCase()} SERVER =====`;
      Logger.info(`     ${(<any>'=').repeat(sentence.length)}`);
      Logger.info(`     ${sentence}`);
      Logger.info(`     ${(<any>'=').repeat(sentence.length)}\n`);
   }
}