import * as fs from 'fs';
import * as q from 'q';
import * as _ from 'underscore';
import CronJobDB from '../db/CronJobDB';
import AJob from '../models/AJob';
import {CronJob} from '../../commons/models/CronJob';
import ServerConfig from "../utils/ServerConfig";
import Logger from "../utils/Logger";
import * as path from "path";

export default class CronManager {
    /**
     * Path of jobs folder
     * @type {string}
     * @private
     */
    private static _jobsPath = `${ServerConfig.root}/server/cron-jobs/`;

    /**
     * All [[AJob]]s
     */
    private static _list: Array<AJob>;

    /**
     * Load of services from folder _jobsPath and schedule cron jobs if needed
     * @private
     */
    public static init(): void {
        CronJobDB.getAll()
            .then((dbItems: Array<CronJob>) => {
                this._list = [];
                const promises = [];
                const added = [];

                for (const filename of fs.readdirSync(this._jobsPath)) {
                    if (path.extname(filename) !== '.js') {
                        continue;
                    }

                    const item: AJob = require(this._jobsPath + filename);
                    const dbItem: CronJob = _.find(dbItems, (i) => {
                        return i.name === item.name;
                    });

                    this._list.push(item);
                    added.push(item.name);

                    if (dbItem) {
                        item.setModel(dbItem);
                    } else {
                        // Schedule only if there is not environment restriction or the restriction is matched
                        item.isScheduled = !item.environments || !!~item.environments.indexOf(ServerConfig.env);
                        promises.push(
                            CronJobDB.add(item)
                                .then((model: CronJob) => {
                                    item.setModel(model);
                                })
                        );
                    }
                }

                for (const item of dbItems) {
                    if (!~added.indexOf(item.name)) {
                        CronJobDB.remove(item);
                    }
                }

                q.allSettled(promises)
                    .then(() => {
                        for (const item of this._list) {
                            if (item.isScheduled) {
                                item.schedule();
                            }
                        }
                        Logger.log('Crontab ready\n');
                    });
            })
            .catch(err => Logger.error);
    }

    /**
     * Run job once
     * @param job
     */
    public static runJob(job: string): void {
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
    public static scheduleJob(job: string): void {
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
    public static unScheduleJob(job: string): void {
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
    public static jobs(): Array<CronJob> {
        return this._list;
    }
}
