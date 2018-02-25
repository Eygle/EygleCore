"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Config_schema_1 = require("../../schemas/Config.schema");
const Resty_1 = require("../../middlewares/Resty");
class Collection extends Resty_1.ARoute {
    /**
     * GET Route
     * @param next
     */
    get(next) {
        Config_schema_1.default.getPermissions()
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