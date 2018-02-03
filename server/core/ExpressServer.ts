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
import Utils from "./config/Utils";
import DB from './modules/DB';
import {EdError} from "./config/EdError";
import Routes from "./config/Routes";
import {EEnv} from "./typings/server.enums";
import ProjectConfig from "./config/ProjectConfig";
import PassportConfig from "./config/PassportConfig";
import CronManager from "./modules/CronManager";

const MongoStore = connectMongo(session);

export class ExpressServer {
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

   constructor() {
      this._app = express();
   }

   /**
    * Start node Express server
    */
   public start(): void {
     this._printHeader();

      const promises = [DB.init()];

      // Initialize all databases connections
      q.allSettled(promises).then(() => {
         Utils.logger.info('All databases are connected and ready\n');
         this._init();

         Utils.logger.info(`Node v${process.versions.node}`);
         Utils.logger.info(`Environment: ${process.env.NODE_ENV || 'production'}`);

         const inst = this._http.listen(this._app.get('port'), this._app.get('ip'), () => {
            Utils.logger.info("Express server listening on port %d\n", this._app.get('port'));
         });
      });
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
            db: Utils.dbName
         });

         // Common express session used in express and socket.io
         const sessionX = session({
            name: Utils.sessionCookieName,
            secret: Utils.sessionSecret,
            cookie: {
               maxAge: 2592000000, // 30 days,
               domain: EEnv.Prod === Utils.env || EEnv.Preprod === Utils.env ? ".mapui.fr" : undefined
            },
            resave: true,
            rolling: true,
            saveUninitialized: true,
            store: this._mongoStore
         });

         this._app.set("view options", {layout: false});
         this._app.set('port', Utils.port);
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
         if (ProjectConfig.activateCSRFSecurity) {
            this._initCSRF(this._app);
         }

         // MANAGE FILE UPLOADS
         this._app.use(busboy({
            limits: {
               fileSize: 10 * 1024 * 1024
            }
         }));

         if (ProjectConfig.implementsAuth) {
            PassportConfig.init(this._app);
         }
         Routes.init(this._app);
         this._handleErrors(this._app); // Last errors handler
         if (ProjectConfig.includeCronManager) {
            CronManager.init();
         }
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
            Utils.logger.error(`[user ${req.user ? req.user._id : '[null]'}] HTTP ${req.method.toUpperCase()} ${req.url} - Error ${err.status || 500}: ${err.message}`);
            res.status(err.status || 500).send(err.message);
         }
         else {
            Utils.logger.error(`[user ${req.user ? req.user._id : '[null]'}] HTTP ${req.method.toUpperCase()} ${req.url} - Server Error ${err.status || 500}:`, err);
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
      app.use(csrf(<any>{
         cookie: {
            secure: EEnv.Prod === Utils.env || EEnv.Preprod === Utils.env // Only for productions
         }
      }));

      app.use(function (req, res, next) {
         res.cookie('XSRF-TOKEN', req.csrfToken(), {secure: EEnv.Prod === Utils.env || EEnv.Preprod === Utils.env});
         next();
      });

      // Error handler
      app.use(function (err, req, res, next) {
         if (err.code !== 'EBADCSRFTOKEN') return next(err);

         // handle CSRF token errors here
         const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
         Utils.logger.error(`Error with CSRF token: HTTP ${req.method.toUpperCase()} ${req.url} [${ip}]`);
         res.status(403).send('Form tampered with');
      });
   }

   /**
    * Print header in logs
    * @private
    */
   private _printHeader() {
      const sentence = `===== START ${Utils.appName.toUpperCase()} SERVER =====`;
      Utils.logger.info(`     ${'='.repeat(sentence.length)}`);
      Utils.logger.info(`     ${sentence}`);
      Utils.logger.info(`     ${'='.repeat(sentence.length)}\n`);
   }
}