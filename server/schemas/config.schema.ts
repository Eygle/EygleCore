import * as mongoose from 'mongoose';
import DB from "../modules/DB";

export const configSchema: mongoose.Schema = DB.createSchema({
  name: {type: String, required: true, unique: true},
  data: mongoose.Schema.Types.Mixed
}, false);