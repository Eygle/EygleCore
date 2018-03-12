import * as passport from 'passport';
import * as bcrypt from 'bcrypt';
import * as local from 'passport-local';

import UserSchema from '../schemas/User.schema';
import {User} from '../../commons/models/User';
import Logger from "./Logger";

class PassportConfig {
  /**
   * Initialise passport
   * @param app
   */
  public static init(app) {
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(this._localStrategy());
    (<any>passport).serializeUser(this._serializeUser());
    (<any>passport).deserializeUser(this._deserializeUser());
  }

  /**
   * User local login strategy
   * @private
   */
  private static _localStrategy() {
     return new local.Strategy({passReqToCallback: true, usernameField: 'email'}, (req, username, password, done) => {
        console.log(username, password);
      username = username.replace(' ', '');
      username = username.toLowerCase();

      UserSchema.findOneByUserNameOrEmail(username, true)
        .then((user: User) => {
          if (!user) {
             Logger.log(`User '${username}' login failed (no such username or email)`);
            return done(null, false);
          }

          bcrypt.compare(password, user.password, (err, res) => {
            if (!res) {
               Logger.log(`User '${username}' login failed (wrong password)`);
              return done(null, false);
            }

             Logger.log(`User '${username}' (${user._id}) logged in`);
            return done(null, user);
          });
        })
        .catch(err => {
          done(err);
        });
    });
  }

  /**
   * Passport serialize user
   * @private
   */
  private static _serializeUser() {
    return (user, done) => {
      return done(null, user._id.toString());
    };
  }

  /**
   * Passport deserialize user
   * @private
   */
  private static _deserializeUser() {
    return (id, done) => {
      UserSchema.getFullCached(id)
        .then((user: User) => {
          if (!user) return done(null, false);
          done(null, user);
        })
        .catch(err => {
           Logger.error('Deserialize user error', err);
          done(null, false);
        });
    };
  }
}

export default PassportConfig;
