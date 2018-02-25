import { CronJob } from '../../../commons/core/models/CronJob';
export declare class CronManager {
    /**
     * Path of jobs folder
     * @type {string}
     * @private
     */
    private _jobsPath;
    /**
     * All [[AJob]]s
     */
    private _list;
    /**
     * Load of services from folder _jobsPath and schedule cron jobs if needed
     * @private
     */
    init(): void;
    /**
     * Run job once
     * @param job
     */
    runJob(job: string): void;
    /**
     * Schedule job once
     * @param job
     */
    scheduleJob(job: string): void;
    /**
     * Un-schedule job once
     * @param job
     */
    unScheduleJob(job: string): void;
    /**
     * Return list of jobs
     * @return {Array<CronJob>}
     */
    jobs(): Array<CronJob>;
}
declare const _default: CronManager;
export default _default;
