/// <reference types="q" />
/// <reference types="mongoose" />
import * as mongoose from 'mongoose';
import * as q from 'q';
import ASchema from './ASchema.schema';
import { User } from '../../commons/models/User';
export declare class UserSchema extends ASchema {
    /**
     * Get by id
     * @param {string} id
     * @return {Q.Promise<any>}
     */
    getFullCached(id: any): q.Promise<{}>;
    /**
     * Find single user by email
     * @param email
     * @param queryParams
     * @return {Promise<T>}
     */
    findOneByEmail(email: string, queryParams?: any): q.Promise<User>;
    /**
     * Find single user by either email or userName
     * @param value
     * @param includePassword
     */
    findOneByUserNameOrEmail(value: string, includePassword?: boolean): q.Promise<User>;
    /**
     * Get user password
     * @param {string} id
     * @return {Q.Promise<User>}
     */
    getPasswordsById(id: string): q.Promise<User>;
    /**
     * Change user's password
     * @param {string} id
     * @param {string} oldPwd
     * @param {string} password
     * @return {Q.Promise<User>}
     */
    changePasswordById(id: string, oldPwd: string, password: string): q.Promise<User>;
    /**
     * Schema getter
     * @return {mongoose.Schema}
     */
    getSchema(): mongoose.Schema;
}
declare const instance: UserSchema;
export default instance;
