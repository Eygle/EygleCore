import { CronJob } from "../../commons/models/CronJob";
import { ILogger } from "../typings/server.interfaces";
import { EEnv } from "../../commons/core.enums";
declare abstract class AJob implements CronJob {
    /**
     * Log file name
     */
    logFilename: string;
    /**
     * Task name
     */
    name: string;
    /**
     * Job schedule rule
     */
    scheduleRule: string;
    /**
     * Is running
     */
    isScheduled: boolean;
    /**
     * Is running
     */
    isRunning: boolean;
    /**
     * Limited to specific environments (no limit if not set)
     */
    environments: Array<EEnv>;
    /**
     * Last run date
     */
    lastRun: Date;
    /**
     * Logger
     */
    protected logger: ILogger;
    /**
     * node-includeCronManager job instance
     */
    private _job;
    /**
     * Database model
     */
    private _model;
    constructor(name: string);
    /**
     * Free memory at the end of the job processing
     */
    protected clean(): void;
    /**
     * Set database model
     * @param {CronJob} model
     */
    setModel(model: CronJob): void;
    /**
     * Run job
     */
    run(): void;
    /**
     * Schedule job
     */
    schedule(): void;
    /**
     * Un-schedule job
     */
    unSchedule(): void;
    /**
     * Save job state in db
     * @private
     */
    saveDBModel(): void;
    /**
     * End of job execution
     */
    protected end(): void;
    /**
     * Allow to execute in another scope
     * @return {() => any}
     */
    private _getExecutable();
    /**
     * Format name for log filename
     * @return {string}
     * @private
     */
    private _formatName();
}
export default AJob;
