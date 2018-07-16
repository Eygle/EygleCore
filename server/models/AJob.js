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
var tracer = require("tracer");
var cron = require("node-schedule");
var CronJobDB_1 = require("../db/CronJobDB");
var CronJob_1 = require("../../commons/models/CronJob");
var ServerConfig_1 = require("../utils/ServerConfig");
var core_enums_1 = require("../../commons/core.enums");
var Logger_1 = require("../utils/Logger");
var AJob = (function (_super) {
    __extends(AJob, _super);
    function AJob(name) {
        var _this = _super.call(this) || this;
        _this.name = name;
        _this.logFilename = "eygle-" + _this._formatName();
        if (core_enums_1.EEnv.Prod === ServerConfig_1.default.env || core_enums_1.EEnv.Preprod === ServerConfig_1.default.env) {
            _this.logger = tracer.dailyfile({
                root: ServerConfig_1.default.root + "/logs",
                maxLogFiles: 10,
                allLogsFileName: _this.logFilename,
                format: "{{timestamp}} <{{title}}> {{message}}",
                dateformat: "HH:MM:ss.L"
            });
        }
        else {
            _this.logger = tracer.colorConsole({
                format: "{{timestamp}} <{{title}}> {{message}}",
                dateformat: "HH:MM:ss.L"
            });
        }
        return _this;
    }
    /**
     * Set database model
     * @param {CronJob} model
     */
    AJob.prototype.setModel = function (model) {
        this._model = model;
        this.isScheduled = this._model.isScheduled;
        this.lastRun = this._model.lastRun;
        this.isRunning = false;
        if (model.isRunning) {
            this.saveDBModel();
        }
    };
    /**
     * Run job
     */
    AJob.prototype.run = function () {
        if (!this.isRunning) {
            this.isRunning = true;
            this.lastRun = new Date();
            this.logger.log("Start task " + this.name);
            this.saveDBModel();
        }
    };
    ;
    /**
     * Schedule job
     */
    AJob.prototype.schedule = function () {
        this.isScheduled = true;
        Logger_1.default.trace("Cron load job " + this.name + " (rule: " + this.scheduleRule + ")");
        if (this._job) {
            this._job.reschedule(this.scheduleRule);
        }
        else {
            this._job = cron.scheduleJob(this.scheduleRule, this._getExecutable());
        }
        this.saveDBModel();
    };
    ;
    /**
     * Un-schedule job
     */
    AJob.prototype.unSchedule = function () {
        this.isScheduled = false;
        this._job.cancel();
        Logger_1.default.trace("Cron un-schedule job " + this.name);
        this.saveDBModel();
    };
    ;
    /**
     * Save job state in db
     * @private
     */
    AJob.prototype.saveDBModel = function () {
        this._model.name = this.name;
        this._model.scheduleRule = this.scheduleRule;
        this._model.isScheduled = this.isScheduled;
        this._model.isRunning = this.isRunning;
        this._model.lastRun = this.lastRun;
        CronJobDB_1.default.save(this._model)
            .catch(Logger_1.default.error);
    };
    /**
     * End of job execution
     */
    AJob.prototype.end = function () {
        this.isRunning = false;
        this.logger.log("End of task " + this.name);
        this.clean();
        this.saveDBModel();
    };
    ;
    /**
     * Allow to execute in another scope
     * @return {() => any}
     */
    AJob.prototype._getExecutable = function () {
        var _this = this;
        return function () {
            _this.run();
        };
    };
    /**
     * Format name for log filename
     * @return {string}
     * @private
     */
    AJob.prototype._formatName = function () {
        return this.name.match(/([A-Z][a-z]+)/g).join('-').toLowerCase();
    };
    return AJob;
}(CronJob_1.CronJob));
exports.default = AJob;
//# sourceMappingURL=AJob.js.map