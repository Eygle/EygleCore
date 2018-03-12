import * as mongoose from 'mongoose';

import DB from '../modules/DB';

export const cronJobSchema: mongoose.Schema = DB.createSchema({
  name: String,
  logFilename: String,
  scheduleRule: String,
  isScheduled: Boolean,
  isRunning: {type: Boolean, 'default': false},
  lastRun: Date
}, false);