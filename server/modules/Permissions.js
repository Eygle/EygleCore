"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ConfigDB_1 = require("../db/ConfigDB");
var Logger_1 = require("../utils/Logger");
/**
 * List of permissions
 */
var list = null;
var Permissions = (function () {
    function Permissions() {
    }
    /**
     * Permission middleware
     */
    Permissions.middleware = function () {
        return function (req, res, next) {
            if (!list) {
                ConfigDB_1.default.getPermissions()
                    .then(function (permissions) {
                    list = permissions;
                    next();
                })
                    .catch(function (err) {
                    Logger_1.default.error('Mongo error', err);
                    next(err);
                });
            }
            else {
                next();
            }
        };
    };
    /**
     * Ensure [[User]] has accessRole access
     * @param user
     * @param accessRole
     * @return {boolean}
     */
    Permissions.ensureAuthorized = function (user, accessRole) {
        var memberRights = user.roles || ['public'];
        if (!!~memberRights.indexOf('admin')) {
            return true;
        }
        if (!list || !list.length) {
            return false;
        }
        for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
            var perm = list_1[_i];
            if (perm.name === accessRole) {
                for (var _a = 0, memberRights_1 = memberRights; _a < memberRights_1.length; _a++) {
                    var m = memberRights_1[_a];
                    if (!!~perm.roles.indexOf(m)) {
                        return true;
                    }
                }
            }
        }
        return false;
    };
    return Permissions;
}());
exports.default = Permissions;
//# sourceMappingURL=Permissions.js.map