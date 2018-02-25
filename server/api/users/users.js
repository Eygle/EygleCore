"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User_schema_1 = require("../../schemas/User.schema");
const Resty_1 = require("../../middlewares/Resty");
class Resource extends Resty_1.ARoute {
    /**
     * GET Route
     * @param id
     * @param next
     */
    get(id, next) {
        User_schema_1.default.getFullCached(id)
            .then((items) => {
            next(items);
        })
            .catch((err) => {
            next(err);
        });
    }
}
class Collection extends Resty_1.ARoute {
    /**
     * GET Route
     * @param next
     */
    get(next) {
        User_schema_1.default.getAll()
            .then((items) => {
            next(items);
        })
            .catch((err) => {
            next(err);
        });
    }
}
module.exports.Resource = Resource;
module.exports.Collection = Collection;
//# sourceMappingURL=users.js.map