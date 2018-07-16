"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var Resty_1 = require("../middlewares/Resty");
var Auth_1 = require("../middlewares/Auth");
var EmailsUnsubscribe_1 = require("../middlewares/EmailsUnsubscribe");
var Logger_1 = require("./Logger");
var ServerConfig_1 = require("./ServerConfig");
var core_enums_1 = require("../../commons/core.enums");
var Routes = (function () {
    function Routes() {
    }
    Routes.init = function (app, routes) {
        // Home exception (catch url '/', add cookie and serve index.html)
        app.get('/', [this.indexRedirect()]);
        // STATIC ROUTES
        app.use('/', express.static(ServerConfig_1.default.clientRoot));
        if (core_enums_1.EEnv.Prod !== ServerConfig_1.default.env && core_enums_1.EEnv.Preprod !== ServerConfig_1.default.env) {
            app.use('/bower_components', express.static(ServerConfig_1.default.root + "/../bower_components"));
        }
        // API ENTRY POINT
        app.all('/api/*', [Resty_1.default.httpMiddleware()]);
        // AUTH
        if (ServerConfig_1.default.implementsAuth) {
            app.post('/register', [Auth_1.default.registerMiddleware()]);
            app.post('/login', [Auth_1.default.loginLimitMiddleware(), Auth_1.default.loginMiddleware()]);
            app.post('/logout', [Auth_1.default.logoutMiddleware()]);
            app.post('/forgot-password', [Auth_1.default.forgotPasswordMiddleware()]);
            app.put('/change-password/*', [Auth_1.default.changePasswordMiddleware()]);
            app.put('/unlock-user/*', [Auth_1.default.unlockAccountMiddleware()]);
        }
        // EMAILS UNSUBSCRIBE
        if (ServerConfig_1.default.includeEmailUnsubscribe) {
            Logger_1.default.trace("Module Emails unsubscription activated");
            app.get('/unsubscribe/*', [EmailsUnsubscribe_1.default.getMiddleware()]);
            app.post('/unsubscribe/*', [EmailsUnsubscribe_1.default.getPostMiddleware()]);
        }
        // CUSTOM ROUTES
        for (var _i = 0, routes_1 = routes; _i < routes_1.length; _i++) {
            var route = routes_1[_i];
            app[route.method](route.path, route.middleware);
        }
        // FALLBACK (when reloading on a route redirect to index.html)
        app.get('/*', [this.indexRedirect()]);
    };
    Routes.indexRedirect = function () {
        return function (req, res) {
            Auth_1.default.addUserCookie(res, req.user || null);
            res.sendFile(ServerConfig_1.default.clientRoot + "/index.html");
        };
    };
    return Routes;
}());
exports.default = Routes;
//# sourceMappingURL=Routes.js.map