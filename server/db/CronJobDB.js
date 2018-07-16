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
var ADBModel_1 = require("./ADBModel");
var cronJob_schema_1 = require("../schemas/cronJob.schema");
var CronJobDB = (function (_super) {
    __extends(CronJobDB, _super);
    function CronJobDB() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CronJobDB;
}(ADBModel_1.default));
exports.default = CronJobDB;
CronJobDB.init(cronJob_schema_1.cronJobSchema);
module.exports.schema = CronJobDB; // Used by MongoDB models loader (need require)
//# sourceMappingURL=CronJobDB.js.map