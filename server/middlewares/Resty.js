"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var _ = require("underscore");
var Permissions_1 = require("../modules/Permissions");
var Utils_1 = require("../../commons/utils/Utils");
var server_enums_1 = require("../typings/server.enums");
var core_enums_1 = require("../../commons/core.enums");
var Auth_1 = require("./Auth");
var ServerConfig_1 = require("../utils/ServerConfig");
var Logger_1 = require("../utils/Logger");
var EdError_1 = require("../utils/EdError");
var Resty = (function () {
    function Resty() {
    }
    /**
     * Express middleware used for http connexions
     * @return {(req:any, res:any)=>undefined}
     */
    Resty.httpMiddleware = function () {
        var _this = this;
        try {
            if (!this._resources) {
                this._resources = {};
                this._addResources(__dirname + "/../api", this._resources);
                this._addResources(ServerConfig_1.default.apiRoot, this._resources);
            }
            return function (req, res, next) {
                var method = req.method.toLowerCase();
                var context = {
                    body: req.body,
                    query: req.query,
                    user: req.user,
                    req: req
                };
                var _a = Resty._middlewareCommon(req.url, method, context), args = _a.args, resource = _a.resource, error = _a.error;
                if (error) {
                    return next(error);
                }
                args.push(function (data) {
                    if (data === void 0) { data = undefined; }
                    if (data instanceof Error) {
                        return next(data);
                    }
                    if (core_enums_1.EEnv.Dev === ServerConfig_1.default.env && req.url === '/api/permissions') {
                        Auth_1.default.addUserCookie(res, req.user);
                    }
                    _this._send(res, data);
                });
                resource.setContext(context);
                resource[method].apply(resource, args);
            };
        }
        catch (e) {
            Logger_1.default.error('Resty error:', e);
        }
    };
    /**
     * Send response
     * @param res
     * @param response
     * @param code
     * @private
     */
    Resty._send = function (res, response, code) {
        if (code === void 0) { code = 200; }
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate'); // HTTP 1.1.
        res.setHeader('Pragma', 'no-cache'); // HTTP 1.0.
        if (response === undefined) {
            res.sendStatus(code);
        }
        else {
            res.status(code).json(response);
        }
    };
    /**
     * Common to both middleware
     * This will return the arguments and the resource to use based on the given url and method
     * @param url
     * @param method
     * @param context
     * @return {{args: Array, resource: *, error: null}}
     */
    Resty._middlewareCommon = function (url, method, context) {
        var ret = {
            args: [],
            resource: this._resources,
            error: null
        };
        var collection = false;
        var components = url.split('?')[0].split('/');
        components.shift();
        components.shift();
        // Makes '/example/' and '/example' equivalent
        if (components[components.length - 1] === '') {
            components.pop();
        }
        for (var i = 0; i < components.length; i++) {
            ret.resource = ret.resource[components[i]];
            if (!ret.resource) {
                ret.error = new EdError_1.CustomEdError('Resource not found', server_enums_1.EHTTPStatus.NotFound);
                return ret;
            }
            if ((i + 1) < components.length) {
                if (Utils_1.default.isMongoId(components[i + 1])) {
                    ret.args.push(components[i + 1]);
                    i++;
                }
            }
            else {
                collection = true;
            }
        }
        if (!ret.resource) {
            ret.error = new EdError_1.CustomEdError('Resource not found', server_enums_1.EHTTPStatus.NotFound);
            return ret;
        }
        if (collection && ret.resource._main.Collection) {
            ret.resource = new ret.resource._main.Collection();
        }
        else if (!collection && ret.resource._main.Resource) {
            ret.resource = new ret.resource._main.Resource();
        }
        if (!ret.resource || !ret.resource[method]) {
            ret.error = new EdError_1.CustomEdError('Method not found', server_enums_1.EHTTPStatus.NotFound);
            return ret;
        }
        for (var _i = 0, _a = ret.args; _i < _a.length; _i++) {
            var a = _a[_i];
            if (!Utils_1.default.isMongoId(a)) {
                ret.error = new EdError_1.CustomEdError("Invalid mongo id " + a, server_enums_1.EHTTPStatus.BadRequest);
                return ret;
            }
        }
        if (ret.resource.permissions) {
            var permission = ret.resource.permissions[method] || ret.resource.permissions.default;
            if (permission && !Permissions_1.default.ensureAuthorized(context.user, permission)) {
                ret.error = new EdError_1.CustomEdError("Permission denied (" + permission + ") for user " + (context.user ?
                    context.user.email :
                    '[null]'), server_enums_1.EHTTPStatus.Forbidden);
            }
        }
        return ret;
    };
    /**
     * Read folder and return list of files
     * @param resourceDir
     * @param resources
     * @return {{}}
     * @private
     */
    Resty._addResources = function (resourceDir, resources) {
        for (var _i = 0, _a = fs.readdirSync(resourceDir); _i < _a.length; _i++) {
            var filename = _a[_i];
            var folder = path.join(resourceDir, filename);
            var file = path.join(folder, filename + '.js');
            var stat = fs.statSync(folder);
            if (stat.isDirectory()) {
                if (!resources[filename]) {
                    resources[filename] = {};
                }
                this._addResources(folder, resources[filename]);
                if (fs.existsSync(file)) {
                    var res = require(file);
                    if (!resources[filename].hasOwnProperty('_main')) {
                        resources[filename]._main = res;
                    }
                    else {
                        _.extend(resources[filename]['_main'], res);
                    }
                }
            }
        }
        return resources;
    };
    return Resty;
}());
exports.default = Resty;
var RoutePermissions = (function () {
    function RoutePermissions(def) {
        this.default = def;
    }
    return RoutePermissions;
}());
exports.RoutePermissions = RoutePermissions;
var ARoute = (function () {
    function ARoute(defaultPermission) {
        if (defaultPermission === void 0) { defaultPermission = null; }
        this.permissions = new RoutePermissions(defaultPermission);
    }
    /**
     * Get route permission setter
     * @param {EPermission} perm
     */
    ARoute.prototype.setGetPermission = function (perm) {
        this.permissions.get = perm;
    };
    /**
     * Post/Put route permission setter
     * @param {EPermission} perm
     */
    ARoute.prototype.setPostOrPutPermission = function (perm) {
        this.permissions.post = perm;
        this.permissions.put = perm;
    };
    /**
     * Delete route permission setter
     * @param {EPermission} perm
     */
    ARoute.prototype.setDeletePermission = function (perm) {
        this.permissions.delete = perm;
    };
    /**
     * Set context
     * @param context
     */
    ARoute.prototype.setContext = function (context) {
        this.user = context.user;
        this.body = context.body;
        this.query = context.query;
        this.req = context.req;
    };
    return ARoute;
}());
exports.ARoute = ARoute;
//# sourceMappingURL=Resty.js.map