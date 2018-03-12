import { CronJob } from '../../commons/models/CronJob';
export default class CronManager {
    /**
     * Path of jobs folder
     * @type {string}
     * @private
     */
    private static _jobsPath;
    /**
     * All [[AJob]]s
     */
    private static _list;
    /**
     * Load of services from folder _jobsPath and schedule cron jobs if needed
     * @private
     */
    static init(): void;
    /**
     * Run job once
     * @param job
     */
    static runJob(job: string): void;
    /**
     * Schedule job once
     * @param job
     */
    static scheduleJob(job: string): void;
    /**
     * Un-schedule job once
     * @param job
     */
    static unScheduleJob(job: string): void;
    /**
     * Return list of jobs
     * @return {Array<CronJob>}
     */
    static jobs(): Array<CronJob>;
}
