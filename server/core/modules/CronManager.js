"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const q = require("q");
const _ = require("underscore");
const CronJob_schema_1 = require("../schemas/CronJob.schema");
const server_enums_1 = require("../typings/server.enums");
const ProjectConfig_1 = require("../config/ProjectConfig");
const Logger_1 = require("../config/Logger");
class CronManager {
    constructor() {
        /**
         * Path of jobs folder
         * @type {string}
         * @private
         */
        this._jobsPath = `${ProjectConfig_1.default.root}/server/cron-jobs/`;
    }
    /**
     * Load of services from folder _jobsPath and schedule cron jobs if needed
     * @private
     */
    init() {
        if (server_enums_1.EEnv.Prod !== ProjectConfig_1.default.env || parseInt(process.env.pm_id) === 1) {
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
                        item.isScheduled = !item.environments || !!~item.environments.indexOf(ProjectConfig_1.default.env);
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
    runJob(job) {
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
    scheduleJob(job) {
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
    unScheduleJob(job) {
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
    jobs() {
        return this._list;
    }
}
exports.CronManager = CronManager;
exports.default = new CronManager();
//# sourceMappingURL=CronManager.js.map