"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = require("../modules/DB");
exports.cronJobSchema = DB_1.default.createSchema({
    name: String,
    logFilename: String,
    scheduleRule: String,
    isScheduled: Boolean,
    isRunning: { type: Boolean, 'default': false },
    lastRun: Date
}, false);
//# sourceMappingURL=CronJob.schema.js.map