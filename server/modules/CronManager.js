"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const q = require("q");
const _ = require("underscore");
const CronJob_schema_1 = require("../schemas/CronJob.schema");
const ServerConfig_1 = require("../utils/ServerConfig");
const core_enums_1 = require("../../commons/core.enums");
const Logger_1 = require("../utils/Logger");
class CronManager {
    /**
     * Load of services from folder _jobsPath and schedule cron jobs if needed
     * @private
     */
    static init() {
        if (core_enums_1.EEnv.Prod !== ServerConfig_1.default.env || parseInt(process.env.pm_id) === 1) {
            CronJob_schema_1.default.getAll()
                .then((dbItems) => {
                this._list = [];
                const promises = [];
                const added = [];
                for (const filename of fs.readdirSync(this._jobsPath)) {
                    const item = require(this._jobsPath + filename);
                    const dbItem = _.find(dbItems, (i) => {
                        return i.name === item.name;
                    });
                    this._list.push(item);
                    added.push(item.name);
                    if (dbItem) {
                        item.setModel(dbItem);
                    }
                    else {
                        // Schedule only if there is not environment restriction or the restriction is matched
                        item.isScheduled = !item.environments || !!~item.environments.indexOf(ServerConfig_1.default.env);
                        promises.push(CronJob_schema_1.default.add(item)
                            .then((model) => {
                            item.setModel(model);
                        }));
                    }
                }
                for (const item of dbItems) {
                    if (!~added.indexOf(item.name)) {
                        CronJob_schema_1.default.remove(item);
                    }
                }
                q.allSettled(promises)
                    .then(() => {
                    for (const item of this._list) {
                        if (item.isScheduled) {
                            item.schedule();
                        }
                    }
                    Logger_1.default.log('Crontab ready\n');
                });
            })
                .catch(err => Logger_1.default.error);
        }
    }
    /**
     * Run job once
     * @param job
     */
    static runJob(job) {
        for (const item of this._list) {
            if (item.name === job) {
                item.run();
                break;
            }
        }
    }
    /**
     * Schedule job once
     * @param job
     */
    static scheduleJob(job) {
        for (const item of this._list) {
            if (item.name === job) {
                item.schedule();
                break;
            }
        }
    }
    /**
     * Un-schedule job once
     * @param job
     */
    static unScheduleJob(job) {
        for (const item of this._list) {
            if (item.name === job) {
                item.unSchedule();
                break;
            }
        }
    }
    /**
     * Return list of jobs
     * @return {Array<CronJob>}
     */
    static jobs() {
        return this._list;
    }
}
/**
 * Path of jobs folder
 * @type {string}
 * @private
 */
CronManager._jobsPath = `${ServerConfig_1.default.root}/server/cron-jobs/`;
exports.default = CronManager;
//# sourceMappingURL=CronManager.js.map