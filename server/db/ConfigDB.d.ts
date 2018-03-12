/// <reference types="q" />
import { Permission } from "../models/Config";
import ADBModel from "./ADBModel";
export default class ConfigDB extends ADBModel {
    /**
     * Get list of permissions
     * @return {Promise<Array<Permission>>}
     */
    static getPermissions(): Q.Promise<Array<Permission>>;
    /**
     * Fill permissions if empty
     * @returns {{}[]}
     * @private
     */
    private static _fill();
}
