/// <reference types="q" />
import * as q from 'q';
import { User } from '../../commons/models/User';
import ADBModel from "./ADBModel";
export default class UserDB extends ADBModel {
    /**
     * Get by id
     * @param {string} id
     * @return {Q.Promise<any>}
     */
    static getFullCached(id: any): q.Promise<{}>;
    /**
     * Find single user by email
     * @param email
     * @param queryParams
     * @return {Promise<T>}
     */
    static findOneByEmail(email: string, queryParams?: any): q.Promise<User>;
    /**
     * Find single user by either email or userName
     * @param value
     * @param includePassword
     */
    static findOneByUserNameOrEmail(value: string, includePassword?: boolean): q.Promise<User>;
    /**
     * Get user password
     * @param {string} id
     * @return {Q.Promise<User>}
     */
    static getPasswordsById(id: string): q.Promise<User>;
    /**
     * Change user's password
     * @param {string} id
     * @param {string} oldPwd
     * @param {string} password
     * @return {Q.Promise<User>}
     */
    static changePasswordById(id: string, oldPwd: string, password: string): q.Promise<User>;
}
