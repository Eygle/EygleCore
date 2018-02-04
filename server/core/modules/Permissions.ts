import ConfigSchema from '../schemas/Config.schema';
import {User} from '../../../commons/core/models/User';
import {Permission} from "../models/Config";
import Logger from "../config/Logger";

/**
 * List of permissions
 */
let list: Array<Permission> = null;

class Permissions {

  /**
   * Permission middleware
   */
  public middleware(): Function {
    return (req, res, next) => {
      if (!list) {
        ConfigSchema.getPermissions()
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
  public ensureAuthorized(user: User, accessRole: string) {
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

const permission = new Permissions(); // Accessible via static methods

export default permission;
