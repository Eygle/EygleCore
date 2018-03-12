/// <reference types="q" />
/// <reference types="mongoose" />
import * as mongoose from 'mongoose';
import ASchema from './ASchema.schema';
import { Permission } from "../models/Config";
export declare class ConfigSchema extends ASchema {
    /**
     * Get list of permissions
     * @return {Promise<Array<Permission>>}
     */
    getPermissions(): Q.Promise<Array<Permission>>;
    /**
     * Fill permissions if empty
     * @returns {{}[]}
     * @private
     */
    private _fill();
    /**
     * Get FileSchema schema
     * @return {"mongoose".Schema}
     */
    getSchema(): mongoose.Schema;
}
declare const instance: ConfigSchema;
export default instance;
