"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var http = require("http");
var session = require("express-session");
var q = require("q");
var compress = require("compression");
var bodyParser = require("body-parser");
var busboy = require("connect-busboy");
var methodOverride = require("method-override");
var cookieParser = require("cookie-parser");
var connectMongo = require("connect-mongo");
var csrf = require("csurf");
var Permissions_1 = require("./modules/Permissions");
var DB_1 = require("./modules/DB");
var CronManager_1 = require("./modules/CronManager");
var Logger_1 = require("./utils/Logger");
var ServerConfig_1 = require("./utils/ServerConfig");
var core_enums_1 = require("../commons/core.enums");
var PassportConfig_1 = require("./utils/PassportConfig");
var Routes_1 = require("./utils/Routes");
var EdError_1 = require("./utils/EdError");
var MongoStore = connectMongo(session);
/**
 * Entry point
 * WARNING: the ProjectConfig MUST be initialized before even importing this file!
 */
var EygleServer = (function () {
    /**
     * Constructor
     */
    function EygleServer() {
        this._customRoutes = [];
        this._customModules = [];
        this._app = express();
        Logger_1.default.init();
    }
    /**
     * Start node Express server
     */
    EygleServer.prototype.start = function () {
        var _this = this;
        this._printHeader();
        var promises = [DB_1.default.init()];
        // Initialize all databases connections
        q.allSettled(promises).then(function () {
            Logger_1.default.info('All databases are connected and ready\n');
            _this._init();
            Logger_1.default.info("Node v" + process.versions.node);
            Logger_1.default.info("Environment: " + (process.env.NODE_ENV || 'production'));
            var inst = _this._http.listen(_this._app.get('port'), _this._app.get('ip'), function () {
                Logger_1.default.info('Express server listening on port %d\n', _this._app.get('port'));
            });
        });
    };
    /**
     * Add custom routes
     * @param route
     */
    EygleServer.prototype.addRoute = function (route) {
        this._customRoutes.push(route);
        return this;
    };
    /**
     * Add custom routes
     * @param {ICustomModule} module
     */
    EygleServer.prototype.addModule = function (module) {
        this._customModules.push(module);
        return this;
    };
    /**
     * Initialize server
     * @private
     */
    EygleServer.prototype._init = function () {
        try {
            this._http = http.createServer(this._app);
            // connect-mongo instance
            this._mongoStore = new MongoStore({
                mongooseConnection: DB_1.default.instance,
                db: ServerConfig_1.default.dbName
            });
            // Common express session used in express and socket.io
            var sessionX = session({
                name: ServerConfig_1.default.sessionCookieName,
                secret: ServerConfig_1.default.sessionSecret,
                cookie: {
                    maxAge: 2592000000,
                    domain: core_enums_1.EEnv.Prod === ServerConfig_1.default.env || core_enums_1.EEnv.Preprod === ServerConfig_1.default.env ? '.eygle.fr' : undefined
                },
                resave: true,
                rolling: true,
                saveUninitialized: true,
                store: this._mongoStore
            });
            this._app.set('view options', {layout: false});
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
                Logger_1.default.trace('Module Auth activated');
                PassportConfig_1.default.init(this._app);
            }
            Routes_1.default.init(this._app, this._customRoutes);
            this._handleErrors(this._app); // Last errors handler
            if (ServerConfig_1.default.includeCronManager) {
                Logger_1.default.trace('Module Cron Manager activated');
                CronManager_1.default.init();
            }
            // Initialize all custom modeules
            for (var _i = 0, _a = this._customModules; _i < _a.length; _i++) {
                var module_1 = _a[_i];
                Logger_1.default.trace("Module " + module_1.name + " activated");
                module_1.init(this._app);
            }
            Logger_1.default.info('All modules are loaded and activated\n');
        }
        catch (err) {
            console.error(err);
        }
    };
    /**
     * Handle error
     * @param app
     */
    EygleServer.prototype._handleErrors = function (app) {
        app.use(function (err, req, res, next) {
            if (err instanceof EdError_1.default || err.name === 'ValidationError') {
                Logger_1.default.error("[user " + (req.user ? req.user._id : '[null]') + "] HTTP " + req.method.toUpperCase() + " " + req.url + " - Error " + (err.status || 500) + ": " + err.message);
                res.status(err.status || 500).send(err.message);
            }
            else {
                Logger_1.default.error("[user " + (req.user ? req.user._id : '[null]') + "] HTTP " + req.method.toUpperCase() + " " + req.url + " - Server Error " + (err.status || 500) + ":", err);
                res.status(err.status || 500).send(new EdError_1.default(err.status || 500).message);
            }
        });
    };
    /**
     * Init CSRF token checker
     * @param app
     * @private
     */
    EygleServer.prototype._initCSRF = function (app) {
        Logger_1.default.trace('Module CSRF activated');
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
            var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
            Logger_1.default.error("Error with CSRF token: HTTP " + req.method.toUpperCase() + " " + req.url + " [" + ip + "]");
            res.status(403).send('Form tampered with');
        });
    };
    /**
     * Print header in logs
     * @private
     */
    EygleServer.prototype._printHeader = function () {
        var sentence = "===== START " + ServerConfig_1.default.appName.toUpperCase() + " SERVER =====";
        Logger_1.default.info("     " + '='.repeat(sentence.length));
        Logger_1.default.info("     " + sentence);
        Logger_1.default.info("     " + '='.repeat(sentence.length) + "\n");
    };
    return EygleServer;
}());
exports.EygleServer = EygleServer;
//# sourceMappingURL=EygleServer.js.map