"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ConfigDB_1 = require("../db/ConfigDB");
const Logger_1 = require("../utils/Logger");
/**
 * List of permissions
 */
let list = null;
class Permissions {
    /**
     * Permission middleware
     */
    static middleware() {
        return (req, res, next) => {
            if (!list) {
                ConfigDB_1.default.getPermissions()
                    .then((permissions) => {
                    list = permissions;
                    next();
                })
                    .catch((err) => {
                    Logger_1.default.error('Mongo error', err);
                    next(err);
                });
            }
            else {
                next();
            }
        };
    }
    /**
     * Ensure [[User]] has accessRole access
     * @param user
     * @param accessRole
     * @return {boolean}
     */
    static ensureAuthorized(user, accessRole) {
        const memberRights = user.roles || ['public'];
        if (!!~memberRights.indexOf('admin')) {
            return true;
        }
        if (!list || !list.length) {
            return false;
        }
        for (const perm of list) {
            if (perm.name === accessRole) {
                for (const m of memberRights) {
                    if (!!~perm.roles.indexOf(m)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
}
exports.default = Permissions;
//# sourceMappingURL=Permissions.js.map