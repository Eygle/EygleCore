/// <reference types="mongoose" />
import * as mongoose from 'mongoose';
import ASchema from './ASchema.schema';
export declare class CronJobSchema extends ASchema {
    /**
     * Schema getter
     * @return {mongoose.Schema}
     */
    getSchema(): mongoose.Schema;
}
declare const instance: CronJobSchema;
export default instance;
