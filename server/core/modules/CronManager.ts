import * as fs from 'fs';
import * as q from 'q';
import * as _ from 'underscore';
import CronJobSchema from '../schemas/CronJob.schema';
import {EEnv} from '../typings/server.enums';
import AJob from '../models/AJob';
import {CronJob} from '../models/CronJob';
import ProjectConfig from "../config/ProjectConfig";
import Logger from "../config/Logger";

class CronManager {
  /**
   * Path of jobs folder
   * @type {string}
   * @private
   */
  private _jobsPath = `${ProjectConfig.root}/server/cron/jobs/`;

  /**
   * All [[AJob]]s
   */
  private _list: Array<AJob>;

  /**
   * Load of services from folder _jobsPath and schedule cron jobs if needed
   * @private
   */
  public init(): void {
     if (EEnv.Prod !== ProjectConfig.env || parseInt(process.env.pm_id) === 1) { // Limit to a pm2 single instance for prod
      CronJobSchema.getAll()
        .then((dbItems: Array<CronJob>) => {
          this._list = [];
          const promises = [];
          const added = [];

          for (const filename of fs.readdirSync(this._jobsPath)) {
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
               item.isScheduled = !item.environments || !!~item.environments.indexOf(ProjectConfig.env);
              promises.push(
                CronJobSchema.add(item)
                  .then((model: CronJob) => {
                    item.setModel(model);
                  })
              );
            }
          }

          for (const item of dbItems) {
            if (!~added.indexOf(item.name)) {
              CronJobSchema.remove(item);
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
  }

  /**
   * Run job once
   * @param job
   */
  public runJob(job: string): void {
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
  public scheduleJob(job: string): void {
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
  public unScheduleJob(job: string): void {
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
  public jobs(): Array<CronJob> {
    return this._list;
  }
}

export default new CronManager();
