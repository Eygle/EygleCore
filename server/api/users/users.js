"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var UserDB_1 = require("../../db/UserDB");
var Resty_1 = require("../../middlewares/Resty");
var Resource = (function (_super) {
    __extends(Resource, _super);
    function Resource() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * GET Route
     * @param id
     * @param next
     */
    Resource.prototype.get = function (id, next) {
        UserDB_1.default.getFullCached(id)
            .then(function (items) {
            next(items);
        })
            .catch(function (err) {
            next(err);
        });
    };
    return Resource;
}(Resty_1.ARoute));
var Collection = (function (_super) {
    __extends(Collection, _super);
    function Collection() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * GET Route
     * @param next
     */
    Collection.prototype.get = function (next) {
        UserDB_1.default.getAll()
            .then(function (items) {
            next(items);
        })
            .catch(function (err) {
            next(err);
        });
    };
    return Collection;
}(Resty_1.ARoute));
module.exports.Resource = Resource;
module.exports.Collection = Collection;
//# sourceMappingURL=users.js.map