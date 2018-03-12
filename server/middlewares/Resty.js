"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const _ = require("underscore");
const Permissions_1 = require("../modules/Permissions");
const Utils_1 = require("../../commons/utils/Utils");
const server_enums_1 = require("../typings/server.enums");
const core_enums_1 = require("../../commons/core.enums");
const Auth_1 = require("./Auth");
const ServerConfig_1 = require("../utils/ServerConfig");
const Logger_1 = require("../utils/Logger");
const EdError_1 = require("../utils/EdError");
class Resty {
    /**
     * Express middleware used for http connexions
     * @param resourceDir
     * @return {(req:any, res:any)=>undefined}
     */
    static httpMiddleware(resourceDir) {
        try {
            if (!this._resources) {
                this._resources = {};
                this._addResources(resourceDir, this._resources);
                this._addResources(ServerConfig_1.default.apiRoot, this._resources);
            }
            return (req, res, next) => {
                const method = req.method.toLowerCase();
                const context = {
                    body: req.body,
                    query: req.query,
                    user: req.user,
                    req: req
                };
                const { args, resource, error } = Resty._middlewareCommon(req.url, method, context);
                if (error) {
                    return next(error);
                }
                args.push((data = undefined) => {
                    if (data instanceof Error) {
                        return next(data);
                    }
                    if (core_enums_1.EEnv.Dev === ServerConfig_1.default.env && req.url === '/api/permissions') {
                        Auth_1.default.addUserCookie(res, req.user);
                    }
                    this._send(res, data);
                });
                resource.setContext(context);
                resource[method].apply(resource, args);
            };
        }
        catch (e) {
            Logger_1.default.error('Resty error:', e);
        }
    }
    /**
     * Send response
     * @param res
     * @param response
     * @param code
     * @private
     */
    static _send(res, response, code = 200) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate'); // HTTP 1.1.
        res.setHeader('Pragma', 'no-cache'); // HTTP 1.0.
        if (response === undefined) {
            res.sendStatus(code);
        }
        else {
            res.status(code).json(response);
        }
    }
    /**
     * Common to both middleware
     * This will return the arguments and the resource to use based on the given url and method
     * @param url
     * @param method
     * @param context
     * @return {{args: Array, resource: *, error: null}}
     */
    static _middlewareCommon(url, method, context) {
        const ret = {
            args: [],
            resource: this._resources,
            error: null
        };
        let collection = false;
        const components = url.split('?')[0].split('/');
        components.shift();
        components.shift();
        // Makes '/example/' and '/example' equivalent
        if (components[components.length - 1] === '') {
            components.pop();
        }
        for (let i = 0; i < components.length; i++) {
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
        for (const a of ret.args) {
            if (!Utils_1.default.isMongoId(a)) {
                ret.error = new EdError_1.CustomEdError(`Invalid mongo id ${a}`, server_enums_1.EHTTPStatus.BadRequest);
                return ret;
            }
        }
        if (ret.resource.permissions) {
            const permission = ret.resource.permissions[method] || ret.resource.permissions.default;
            if (permission && !Permissions_1.default.ensureAuthorized(context.user, permission)) {
                ret.error = new EdError_1.CustomEdError(`Permission denied (${permission}) for user ${context.user ?
                    context.user.email :
                    '[null]'}`, server_enums_1.EHTTPStatus.Forbidden);
            }
        }
        return ret;
    }
    /**
     * Read folder and return list of files
     * @param resourceDir
     * @param resources
     * @return {{}}
     * @private
     */
    static _addResources(resourceDir, resources) {
        for (const filename of fs.readdirSync(resourceDir)) {
            const folder = path.join(resourceDir, filename);
            const file = path.join(folder, filename + '.js');
            const stat = fs.statSync(folder);
            if (stat.isDirectory()) {
                if (!resources[filename]) {
                    resources[filename] = {};
                }
                this._addResources(folder, resources[filename]);
                if (fs.existsSync(file)) {
                    const res = require(file);
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
    }
}
exports.default = Resty;
class RoutePermissions {
    constructor(def) {
        this.default = def;
    }
}
exports.RoutePermissions = RoutePermissions;
class ARoute {
    constructor(defaultPermission = null) {
        this.permissions = new RoutePermissions(defaultPermission);
    }
    /**
     * Get route permission setter
     * @param {EPermission} perm
     */
    setGetPermission(perm) {
        this.permissions.get = perm;
    }
    /**
     * Post/Put route permission setter
     * @param {EPermission} perm
     */
    setPostOrPutPermission(perm) {
        this.permissions.post = perm;
        this.permissions.put = perm;
    }
    /**
     * Delete route permission setter
     * @param {EPermission} perm
     */
    setDeletePermission(perm) {
        this.permissions.delete = perm;
    }
    /**
     * Set context
     * @param context
     */
    setContext(context) {
        this.user = context.user;
        this.body = context.body;
        this.query = context.query;
        this.req = context.req;
    }
}
exports.ARoute = ARoute;
//# sourceMappingURL=Resty.js.map