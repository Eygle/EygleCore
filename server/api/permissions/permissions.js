"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ConfigDB_1 = require("../../db/ConfigDB");
const Resty_1 = require("../../middlewares/Resty");
class Collection extends Resty_1.ARoute {
    /**
     * GET Route
     * @param next
     */
    get(next) {
        ConfigDB_1.default.getPermissions()
            .then((items) => {
            next(items);
        })
            .catch((err) => {
            next(err);
        });
    }
}
module.exports.Collection = Collection;
//# sourceMappingURL=permissions.js.map