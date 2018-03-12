import * as passport from 'passport';
import * as _ from 'underscore';

import Emails from '../modules/Emails';
import UserSchema from '../schemas/User.schema';
import Permission from '../modules/Permissions';
import {EHTTPStatus} from '../typings/server.enums';
import {User} from '../../commons/models/User';
import {ILoginAttempt} from "../typings/server.interfaces";
import Logger from "../utils/Logger";
import {CustomEdError, default as EdError} from "../utils/EdError";
import {EEnv} from "../../commons/core.enums";
import ServerConfig from "../utils/ServerConfig";

export default class Auth {
  /**
   * Users login attempts failed
   */
  private static _attempts: _.Dictionary<ILoginAttempt> = {};

  /**
   * @return {(req:any, res:any, next:any)} Login middleware
   */
  public static loginMiddleware() {
    return (req, res, next) => {
      passport.authenticate('local', (err, user) => {
        if (err) return next(err);
        if (!user || user.locked) {
          return this._addLoginFailedAttempt(user, req, res, next);
        }
        this._cleanExpiredAttempts(req.body.username);

        req.logIn(user, (err2) => {
          if (err2) {
            return next(err2);
          }
          this.addUserCookie(res, user);
          res.sendStatus(200);
        });
      })(req, res, next);
    };
  }

  /**
   * @return {(req:any, res:any, next:any)} Logout middleware
   */
  public static logoutMiddleware() {
    return (req, res) => {
       Logger.log(`User ${req.user ?
        req.user.fullName || req.user.email :
        '[null]'}${req.user ? ` (${req.user._id})` : ''} logged out`);
      req.logout();
      return res.sendStatus(200);
    };
  }

  /**
   * @return {(req:any, res:any, next:any)} Register middleware
   */
  public static registerMiddleware() {
    return (req, res, next) => {
      UserSchema.add({
        email: req.body.email,
         userName: req.body.username,
        password: req.body.password
      })
        .then((user: User) => {
          Emails.sendWelcome(user);
           Logger.log(`User ${req.body.email} registered successfully`);

           passport.authenticate('local', (err, user) => {
              if (err) return next(err);

              req.logIn(user, (err2) => {
                 if (err2) {
                    return next(err2);
                 }
                 this.addUserCookie(res, user);
                 res.sendStatus(200);
              });
           })(req, res, next);
        })
        .catch(err => next(err));
    };
  }

  /**
   * @return {(req:any, res:any, next:any)} Forgot password middleware
   */
  public static forgotPasswordMiddleware() {
    return (req, res, next) => {
      UserSchema.findOneByEmail(req.body.email).then((user: User) => {
        if (!user) return res.status(404).send('UserSchema not found');
        user.password = null; // set password has null to force validMail generation
        UserSchema.save(user).then((userSaved: User) => {
          UserSchema.getPasswordsById(userSaved._id.toString()).then(userWPwd => {
            Emails.sendPasswordRecovery(userWPwd);
             Logger.log(`User ${req.body.email} recovered password`);
            res.sendStatus(200);
          }).catch((err) => next(err));
        }).catch((err) => next(err));
      }).catch((err) => next(err));
    };
  }

  /**
   * @return {(req:any, res:any, next:any)} Change password middleware
   */
  public static changePasswordMiddleware() {
    return (req, res, next) => {
      const p = req.url.split('/');
      const id = p[p.length - 1];

      if (req.user._id !== id && !Permission.ensureAuthorized(req.user, 'admin')) {
        return next(new CustomEdError(`Permission denied (admin) for user ${req.user ?
          req.user.fullName || req.user.email :
          '[null]'}`, EHTTPStatus.Forbidden));
      }

      UserSchema.changePasswordById(id, req.body.oldPwd, req.body.password)
        .then((user) => {
           Logger.log(`User ${req.user.email} changed password`);
          res.status(200).json(user);
        })
        .catch(err => next(err));
    };
  }

  /**
   * Anti login brute-force
   * This security will lock accounts after a certain amount of tries
   * @return {(req:any, res:any, next:any)} Login limit middleware
   */
  public static loginLimitMiddleware() {
    return (req, res, next) => {
      const username = req.body.username;

      if (!(<any>this._attempts).hasOwnProperty(username)) {
        return next();
      }

      this._cleanExpiredAttempts(username);
      if (this._attempts[username].locked) {
        return res.status(429).send('TooManyAttempts');
      }

      next();
    };
  }

  /**
   * Anti login brute-force
   * This security will lock accounts after a certain amount of tries
   * @return {(req:any, res:any, next:any)} Login limit middleware
   */
  public static unlockAccountMiddleware() {
    return (req, res, next) => {
      const p = req.url.split('/');
      const id = p[p.length - 1];

      if (!Permission.ensureAuthorized(req.user, 'admin')) {
        return next(new EdError(EHTTPStatus.Forbidden));
      }

      UserSchema.saveById(id, {
        locked: false
      }).then((user: User) => {
        this._cleanAttempts(user.userName);
        this._cleanAttempts(user.email);
        Emails.sendUnlockedAccount(user);
         Logger.log(`User ${user.email} account has been unlocked by ${req.user.email}`);
        res.sendStatus(200);
      })
        .catch(err => next(err));
    };
  }

  /**
   * Add SET-COOKIE to request response headers
   * @param res
   * @param user
   */
  public static addUserCookie(res, user) {
    res.cookie('user',
      JSON.stringify(this._generateUserCookieData(user)),
       {secure: EEnv.Dev !== ServerConfig.env && EEnv.Test !== ServerConfig.env});
  }

  /**
   * Generate user data used in clients
   * @param user
   * @return any
   * @private
   */
  private static _generateUserCookieData(user) {
    return user ? {
      _id: user._id.toString(),
      userName: user.userName,
      email: user.email,
      roles: user.roles || ['public']
    } : {};
  }

  ///////////////////////////////////////////////////////////////////
  // Security utils methods (anti-bruteforce)
  ///////////////////////////////////////////////////////////////////
  /**
   * Add login failed attempt
   * @param user
   * @param req
   * @param res
   * @param next
   * @private
   */
  private static _addLoginFailedAttempt(user, req, res, next) {
    const username = req.body.username;
    this._addAttempt(username);

    if (this._attempts[username].locked) {
      UserSchema.findOneByUserNameOrEmail(username).then((userRes: User) => {
        if (userRes && !userRes.locked) {
          userRes.locked = true;
          UserSchema.save(userRes).then((userSaved: User) => {
            Emails.sendLockedAccount(userSaved);
             Logger.warn(`User ${username} account is locked due to too many login attempts`);
          }).catch(err => next(err));
        } else {
           Logger.warn(`User ${username} tried to logged in with a locked account`);
        }
        res.status(403).send('TooManyAttempts');
      }).catch(err => {
        next(err);
      });
    } else if (user) {
       Logger.warn(`User ${username} tried to logged in with a locked account`);
      res.status(403).send('TooManyAttempts');
    } else {
      res.status(400).send('FailedToLogin');
    }
  }

  /**
   * Clean attempts per username
   * @param username
   * @private
   */
  private static _cleanAttempts(username) {
    if ((<any>this._attempts).hasOwnProperty(username)) {
       this._attempts[username] = <ILoginAttempt>{list: [], locked: false};
    }
  }

  /**
   * Add failed attempt to list
   * @param username
   * @private
   */
  private static _addAttempt(username: string) {
    if (!(<any>this._attempts).hasOwnProperty(username)) {
      this._attempts[username] = <ILoginAttempt>{list: [], locked: false};
    }
    this._attempts[username].list.push(Date.now());

    if (!this._attempts[username].locked && this._attempts[username].list.length >= ServerConfig.maxLoginAttempts) {
      this._attempts[username].locked = true;
    }
    if (this._attempts[username].list.length > ServerConfig.maxLoginAttempts) {
      this._attempts[username].list.splice(0, 1);
    }
  }

  /**
   * Remove all expired attempts
   */
  private static _cleanExpiredAttempts(username) {
    if (!(<any>this._attempts).hasOwnProperty(username)) return;
    const now = Date.now();
    const userAttempts: any = this._attempts[username].list;

    for (const idx in userAttempts) {
      if (userAttempts.hasOwnProperty(idx)) {
        if (now - userAttempts[idx] >= ServerConfig.loginAttemptsExpire) {
          userAttempts.splice(idx, 1);
        }
      }
    }
  }
}
