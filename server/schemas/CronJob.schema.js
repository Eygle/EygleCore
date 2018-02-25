"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = require("../modules/DB");
const ASchema_schema_1 = require("./ASchema.schema");
const _schema = DB_1.default.createSchema({
    name: String,
    logFilename: String,
    scheduleRule: String,
    isScheduled: Boolean,
    isRunning: { type: Boolean, 'default': false },
    lastRun: Date
}, false);
class CronJobSchema extends ASchema_schema_1.default {
    /**
     * Schema getter
     * @return {mongoose.Schema}
     */
    getSchema() {
        return _schema;
    }
}
exports.CronJobSchema = CronJobSchema;
const instance = new CronJobSchema();
module.exports.schema = instance;
exports.default = instance;
//# sourceMappingURL=CronJob.schema.js.map