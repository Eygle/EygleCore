"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var q = require("q");
var _ = require("underscore");
var CronJobDB_1 = require("../db/CronJobDB");
var ServerConfig_1 = require("../utils/ServerConfig");
var Logger_1 = require("../utils/Logger");
var path = require("path");
var CronManager = (function () {
    function CronManager() {
    }
    /**
     * Load of services from folder _jobsPath and schedule cron jobs if needed
     * @private
     */
    CronManager.init = function () {
        var _this = this;
        CronJobDB_1.default.getAll()
            .then(function (dbItems) {
            _this._list = [];
            var promises = [];
            var added = [];
            var _loop_1 = function (filename) {
                if (path.extname(filename) !== '.js') {
                    return "continue";
                }
                var item = require(_this._jobsPath + filename);
                var dbItem = _.find(dbItems, function (i) {
                    return i.name === item.name;
                });
                _this._list.push(item);
                added.push(item.name);
                if (dbItem) {
                    item.setModel(dbItem);
                }
                else {
                    // Schedule only if there is not environment restriction or the restriction is matched
                    item.isScheduled = !item.environments || !!~item.environments.indexOf(ServerConfig_1.default.env);
                    promises.push(CronJobDB_1.default.add(item)
                        .then(function (model) {
                        item.setModel(model);
                    }));
                }
            };
            for (var _i = 0, _a = fs.readdirSync(_this._jobsPath); _i < _a.length; _i++) {
                var filename = _a[_i];
                _loop_1(filename);
            }
            for (var _b = 0, dbItems_1 = dbItems; _b < dbItems_1.length; _b++) {
                var item = dbItems_1[_b];
                if (!~added.indexOf(item.name)) {
                    CronJobDB_1.default.remove(item);
                }
            }
            q.allSettled(promises)
                .then(function () {
                for (var _i = 0, _a = _this._list; _i < _a.length; _i++) {
                    var item = _a[_i];
                    if (item.isScheduled) {
                        item.schedule();
                    }
                }
                Logger_1.default.log('Crontab ready\n');
            });
        })
            .catch(function (err) { return Logger_1.default.error; });
    };
    /**
     * Run job once
     * @param job
     */
    CronManager.runJob = function (job) {
        for (var _i = 0, _a = this._list; _i < _a.length; _i++) {
            var item = _a[_i];
            if (item.name === job) {
                item.run();
                break;
            }
        }
    };
    /**
     * Schedule job once
     * @param job
     */
    CronManager.scheduleJob = function (job) {
        for (var _i = 0, _a = this._list; _i < _a.length; _i++) {
            var item = _a[_i];
            if (item.name === job) {
                item.schedule();
                break;
            }
        }
    };
    /**
     * Un-schedule job once
     * @param job
     */
    CronManager.unScheduleJob = function (job) {
        for (var _i = 0, _a = this._list; _i < _a.length; _i++) {
            var item = _a[_i];
            if (item.name === job) {
                item.unSchedule();
                break;
            }
        }
    };
    /**
     * Return list of jobs
     * @return {Array<CronJob>}
     */
    CronManager.jobs = function () {
        return this._list;
    };
    /**
     * Path of jobs folder
     * @type {string}
     * @private
     */
    CronManager._jobsPath = ServerConfig_1.default.root + "/server/cron-jobs/";
    return CronManager;
}());
exports.default = CronManager;
//# sourceMappingURL=CronManager.js.map