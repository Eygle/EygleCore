"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const Resty_1 = require("../middlewares/Resty");
const Auth_1 = require("../middlewares/Auth");
const EmailsUnsubscribe_1 = require("../middlewares/EmailsUnsubscribe");
const server_enums_1 = require("../typings/server.enums");
const ProjectConfig_1 = require("./ProjectConfig");
const Logger_1 = require("./Logger");
class Routes {
    static init(app, routes) {
        // Home exception (catch url '/', add cookie and serve index.html)
        app.get('/', [this.indexRedirect()]);
        // STATIC ROUTES
        app.use('/', express.static(ProjectConfig_1.default.clientRoot));
        if (server_enums_1.EEnv.Prod !== ProjectConfig_1.default.env && server_enums_1.EEnv.Preprod !== ProjectConfig_1.default.env) {
            app.use('/bower_components', express.static(`${ProjectConfig_1.default.root}/../bower_components`));
        }
        // API ENTRY POINT
        app.all('/api/*', [Resty_1.default.httpMiddleware(`${__dirname}/../api`)]);
        // AUTH
        if (ProjectConfig_1.default.implementsAuth) {
            app.post('/register', [Auth_1.default.registerMiddleware()]);
            app.post('/login', [Auth_1.default.loginLimitMiddleware(), Auth_1.default.loginMiddleware()]);
            app.post('/logout', [Auth_1.default.logoutMiddleware()]);
            app.post('/forgot-password', [Auth_1.default.forgotPasswordMiddleware()]);
            app.put('/change-password/*', [Auth_1.default.changePasswordMiddleware()]);
            app.put('/unlock-user/*', [Auth_1.default.unlockAccountMiddleware()]);
        }
        // EMAILS UNSUBSCRIBE
        if (ProjectConfig_1.default.includeEmailUnsubscribe) {
            Logger_1.default.trace("Module Emails unsubscription activated");
            app.get('/unsubscribe/*', [EmailsUnsubscribe_1.default.getMiddleware()]);
            app.post('/unsubscribe/*', [EmailsUnsubscribe_1.default.getPostMiddleware()]);
        }
        // CUSTOM ROUTES
        for (const route of routes) {
            app[route.method](route.path, route.middleware);
        }
        // FALLBACK (when reloading on a route redirect to index.html)
        app.get('/*', [this.indexRedirect()]);
    }
    static indexRedirect() {
        return (req, res) => {
            Auth_1.default.addUserCookie(res, req.user || null);
            res.sendFile(`${ProjectConfig_1.default.clientRoot}/index.html`);
        };
    }
}
exports.default = Routes;
//# sourceMappingURL=Routes.js.map