"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http = require("http");
const session = require("express-session");
const q = require("q");
const compress = require("compression");
const bodyParser = require("body-parser");
const busboy = require("connect-busboy");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const connectMongo = require("connect-mongo");
const csrf = require("csurf");
const Permissions_1 = require("./modules/Permissions");
const DB_1 = require("./modules/DB");
const CronManager_1 = require("./modules/CronManager");
const Logger_1 = require("./utils/Logger");
const ServerConfig_1 = require("./utils/ServerConfig");
const core_enums_1 = require("../commons/core.enums");
const PassportConfig_1 = require("./utils/PassportConfig");
const Routes_1 = require("./utils/Routes");
const EdError_1 = require("./utils/EdError");
const ProjectConfig_1 = require("../commons/utils/ProjectConfig");
const MongoStore = connectMongo(session);
class EygleServer {
    /**
     * Constructor
     * @param conf
     * @param {string} configFilePath Project configuration file path
     */
    constructor(conf, configFilePath) {
        this._customRoutes = [];
        this._customModules = [];
        this._app = express();
        ProjectConfig_1.default.initForServer(conf, configFilePath, process.env.NODE_ENV);
        ServerConfig_1.default.init();
        Logger_1.default.init();
    }
    /**
     * Start node Express server
     */
    start() {
        this._printHeader();
        const promises = [DB_1.default.init()];
        // Initialize all databases connections
        q.allSettled(promises).then(() => {
            Logger_1.default.info('All databases are connected and ready\n');
            this._init();
            Logger_1.default.info(`Node v${process.versions.node}`);
            Logger_1.default.info(`Environment: ${process.env.NODE_ENV || 'production'}`);
            const inst = this._http.listen(this._app.get('port'), this._app.get('ip'), () => {
                Logger_1.default.info("Express server listening on port %d\n", this._app.get('port'));
            });
        });
    }
    /**
     * Add custom routes
     * @param route
     */
    addRoute(route) {
        this._customRoutes.push(route);
        return this;
    }
    /**
     * Add custom routes
     * @param {ICustomModule} module
     */
    addModule(module) {
        this._customModules.push(module);
        return this;
    }
    /**
     * Initialize server
     * @private
     */
    _init() {
        try {
            this._http = http.createServer(this._app);
            // connect-mongo instance
            this._mongoStore = new MongoStore({
                mongooseConnection: DB_1.default.instance,
                db: ServerConfig_1.default.dbName
            });
            // Common express session used in express and socket.io
            const sessionX = session({
                name: ServerConfig_1.default.sessionCookieName,
                secret: ServerConfig_1.default.sessionSecret,
                cookie: {
                    maxAge: 2592000000,
                    domain: core_enums_1.EEnv.Prod === ServerConfig_1.default.env || core_enums_1.EEnv.Preprod === ServerConfig_1.default.env ? ".mapui.fr" : undefined
                },
                resave: true,
                rolling: true,
                saveUninitialized: true,
                store: this._mongoStore
            });
            this._app.set("view options", { layout: false });
            this._app.set('port', ServerConfig_1.default.port);
            this._app.disable('x-powered-by');
            this._app.use(bodyParser.urlencoded({ extended: true }));
            this._app.use(bodyParser.json({ limit: '50mb' }));
            this._app.use(methodOverride());
            this._app.use(compress());
            this._app.use(cookieParser());
            this._app.use(sessionX);
            // INIT PERMISSIONS
            this._app.use(Permissions_1.default.middleware());
            // INIT CSRF
            if (ServerConfig_1.default.activateCSRFSecurity) {
                this._initCSRF(this._app);
            }
            // MANAGE FILE UPLOADS
            this._app.use(busboy({
                limits: {
                    fileSize: 10 * 1024 * 1024
                }
            }));
            if (ServerConfig_1.default.implementsAuth) {
                Logger_1.default.trace("Module Auth activated");
                PassportConfig_1.default.init(this._app);
            }
            Routes_1.default.init(this._app, this._customRoutes);
            this._handleErrors(this._app); // Last errors handler
            if (ServerConfig_1.default.includeCronManager) {
                Logger_1.default.trace("Module Cron Manager activated");
                CronManager_1.default.init();
            }
            // Initialize all custom modeules
            for (const module of this._customModules) {
                Logger_1.default.trace(`Module ${module.name} activated`);
                module.init(this._app);
            }
            Logger_1.default.info("All modules are loaded and activated\n");
        }
        catch (err) {
            console.error(err);
        }
    }
    /**
     * Handle error
     * @param app
     */
    _handleErrors(app) {
        app.use(function (err, req, res, next) {
            if (err instanceof EdError_1.default || err.name === 'ValidationError') {
                Logger_1.default.error(`[user ${req.user ? req.user._id : '[null]'}] HTTP ${req.method.toUpperCase()} ${req.url} - Error ${err.status || 500}: ${err.message}`);
                res.status(err.status || 500).send(err.message);
            }
            else {
                Logger_1.default.error(`[user ${req.user ? req.user._id : '[null]'}] HTTP ${req.method.toUpperCase()} ${req.url} - Server Error ${err.status || 500}:`, err);
                res.status(err.status || 500).send(new EdError_1.default(err.status || 500).message);
            }
        });
    }
    /**
     * Init CSRF token checker
     * @param app
     * @private
     */
    _initCSRF(app) {
        Logger_1.default.trace("Module CSRF activated");
        app.use(csrf({
            cookie: {
                secure: core_enums_1.EEnv.Prod === ServerConfig_1.default.env || core_enums_1.EEnv.Preprod === ServerConfig_1.default.env // Only for productions
            }
        }));
        app.use(function (req, res, next) {
            res.cookie('XSRF-TOKEN', req.csrfToken(), { secure: core_enums_1.EEnv.Prod === ServerConfig_1.default.env || core_enums_1.EEnv.Preprod === ServerConfig_1.default.env });
            next();
        });
        // Error handler
        app.use(function (err, req, res, next) {
            if (err.code !== 'EBADCSRFTOKEN')
                return next(err);
            // handle CSRF token errors here
            const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
            Logger_1.default.error(`Error with CSRF token: HTTP ${req.method.toUpperCase()} ${req.url} [${ip}]`);
            res.status(403).send('Form tampered with');
        });
    }
    /**
     * Print header in logs
     * @private
     */
    _printHeader() {
        const sentence = `===== START ${ServerConfig_1.default.appName.toUpperCase()} SERVER =====`;
        Logger_1.default.info(`     ${'='.repeat(sentence.length)}`);
        Logger_1.default.info(`     ${sentence}`);
        Logger_1.default.info(`     ${'='.repeat(sentence.length)}\n`);
    }
}
exports.EygleServer = EygleServer;
//# sourceMappingURL=EygleServer.js.map