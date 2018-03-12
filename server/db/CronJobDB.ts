import ADBModel from "./ADBModel";
import {cronJobSchema} from "../schemas/CronJob.schema";

export default class CronJobDB extends ADBModel {
}

CronJobDB.init(cronJobSchema);
module.exports.schema = CronJobDB; // Used by MongoDB models loader (need require)