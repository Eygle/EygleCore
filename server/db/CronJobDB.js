"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ADBModel_1 = require("./ADBModel");
const cronJob_schema_1 = require("../schemas/cronJob.schema");
class CronJobDB extends ADBModel_1.default {
}
exports.default = CronJobDB;
CronJobDB.init(cronJob_schema_1.cronJobSchema);
module.exports.schema = CronJobDB; // Used by MongoDB models loader (need require)
//# sourceMappingURL=CronJobDB.js.map