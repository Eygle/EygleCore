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
var ConfigDB_1 = require("../../db/ConfigDB");
var Resty_1 = require("../../middlewares/Resty");
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
        ConfigDB_1.default.getPermissions()
            .then(function (items) {
            next(items);
        })
            .catch(function (err) {
            next(err);
        });
    };
    return Collection;
}(Resty_1.ARoute));
module.exports.Collection = Collection;
//# sourceMappingURL=permissions.js.map