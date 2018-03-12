import ConfigDB from '../db/ConfigDB';
import {User} from '../../commons/models/User';
import {Permission} from "../models/Config";
import Logger from "../utils/Logger";

/**
 * List of permissions
 */
let list: Array<Permission> = null;

export default class Permissions {

  /**
   * Permission middleware
   */
  public static middleware(): Function {
    return (req, res, next) => {
      if (!list) {
        ConfigDB.getPermissions()
          .then((permissions: Array<Permission>) => {
            list = permissions;
            next();
          })
          .catch((err: Error) => {
             Logger.error('Mongo error', err);
            next(err);
          });
      } else {
        next();
      }
    };
  }

  /**
   * Ensure [[User]] has accessRole access
   * @param user
   * @param accessRole
   * @return {boolean}
   */
  public static ensureAuthorized(user: User, accessRole: string) {
    const memberRights = user.roles || ['public'];

    if (!!~memberRights.indexOf('admin')) {
      return true;
    }
    if (!list || !list.length) {
      return false;
    }

    for (const perm of list) {
      if (perm.name === accessRole) {
        for (const m of memberRights) {
          if (!!~perm.roles.indexOf(m)) {
            return true;
          }
        }
      }
    }
    return false;
  }
}
