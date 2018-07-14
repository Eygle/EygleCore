"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tracer = require("tracer");
const cron = require("node-schedule");
const CronJobDB_1 = require("../db/CronJobDB");
const CronJob_1 = require("../../commons/models/CronJob");
const ServerConfig_1 = require("../utils/ServerConfig");
const core_enums_1 = require("../../commons/core.enums");
const Logger_1 = require("../utils/Logger");
class AJob extends CronJob_1.CronJob {
    constructor(name) {
        super();
        this.name = name;
        this.logFilename = `eygle-${this._formatName()}`;
        if (core_enums_1.EEnv.Prod === ServerConfig_1.default.env || core_enums_1.EEnv.Preprod === ServerConfig_1.default.env) {
            this.logger = tracer.dailyfile({
                root: `${ServerConfig_1.default.root}/logs`,
                maxLogFiles: 10,
                allLogsFileName: this.logFilename,
                format: "{{timestamp}} <{{title}}> {{message}}",
                dateformat: "HH:MM:ss.L"
            });
        }
        else {
            this.logger = tracer.colorConsole({
                format: "{{timestamp}} <{{title}}> {{message}}",
                dateformat: "HH:MM:ss.L"
            });
        }
    }
    /**
     * Set database model
     * @param {CronJob} model
     */
    setModel(model) {
        this._model = model;
        this.isScheduled = this._model.isScheduled;
        this.lastRun = this._model.lastRun;
        this.isRunning = false;
        if (model.isRunning) {
            this.saveDBModel();
        }
    }
    /**
     * Run job
     */
    run() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.lastRun = new Date();
            this.logger.log(`Start task ${this.name}`);
            this.saveDBModel();
        }
    }
    ;
    /**
     * Schedule job
     */
    schedule() {
        this.isScheduled = true;
        Logger_1.default.trace(`Cron load job ${this.name} (rule: ${this.scheduleRule})`);
        if (this._job) {
            this._job.reschedule(this.scheduleRule);
        }
        else {
            this._job = cron.scheduleJob(this.scheduleRule, this._getExecutable());
        }
        this.saveDBModel();
    }
    ;
    /**
     * Un-schedule job
     */
    unSchedule() {
        this.isScheduled = false;
        this._job.cancel();
        Logger_1.default.trace(`Cron un-schedule job ${this.name}`);
        this.saveDBModel();
    }
    ;
    /**
     * Save job state in db
     * @private
     */
    saveDBModel() {
        this._model.name = this.name;
        this._model.scheduleRule = this.scheduleRule;
        this._model.isScheduled = this.isScheduled;
        this._model.isRunning = this.isRunning;
        this._model.lastRun = this.lastRun;
        CronJobDB_1.default.save(this._model)
            .catch(Logger_1.default.error);
    }
    /**
     * End of job execution
     */
    end() {
        this.isRunning = false;
        this.logger.log(`End of task ${this.name}`);
        this.clean();
        this.saveDBModel();
    }
    ;
    /**
     * Allow to execute in another scope
     * @return {() => any}
     */
    _getExecutable() {
        return () => {
            this.run();
        };
    }
    /**
     * Format name for log filename
     * @return {string}
     * @private
     */
    _formatName() {
        return this.name.match(/([A-Z][a-z]+)/g).join('-').toLowerCase();
    }
}
exports.default = AJob;
//# sourceMappingURL=AJob.js.map