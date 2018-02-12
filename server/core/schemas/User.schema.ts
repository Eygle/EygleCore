import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as q from 'q';

import DB from '../modules/DB';
import Cache from '../modules/Cache';
import Utils from '../../../commons/core/utils/Utils';
import ASchema from './ASchema.schema';
import {EHTTPStatus} from '../typings/server.enums';
import {CustomEdError} from '../config/EdError';
import {User} from '../../../commons/core/models/User';
import {ERole} from "../../../commons/core/core.enums";

const _schema: mongoose.Schema = DB.createSchema({
   email: {
      type: String,
      unique: true,
      required: [true, 'UserSchema email required'],
      validate: {
         validator: function (v) {
            return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v);
         },
         message: 'Invalid email format'
      }
   },

   userName: {
      type: String,
      maxlength: 10,
      minlength: 2
   },

   password: {
      type: String,
      set: (plaintext) => {
         if (/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{6,}$/.test(plaintext)) {
            return bcrypt.hashSync(plaintext, bcrypt.genSaltSync());
         }
         return null;
      },
      validate: {
         validator: function (v) {
            return v.length > 10;
         },
         message: 'Invalid password format'
      },
      select: false
   },

   userNameNorm: {type: String, unique: true, sparse: true},

   validMail: {type: String, select: false},
   locked: {type: Boolean, 'default': false, select: false},

   googleId: String,
   googleToken: String,

   facebookId: String,
   facebookToken: String,

   roles: {
      type: [String],
      'default': [ERole.Guest],
      select: false
   },

   config: {
      type: mongoose.Schema.Types.Mixed,
      'default': {
         language: 'fr'
      }
   },

   desc: String,
}, false);

_schema.pre('save', function (next) { // DO NOT use big arrow here ( => )
   if (this.userName) {
      this.userName = this.userName.toLowerCase();
      this.userNameNorm = Utils.normalize(this.userName);
   }
   next();
});

/**
 * Error's handler asynchronous hook
 */
_schema.post('save', function (error, doc, next) {
   Cache.remove(this._id.toString());
   if (error.name === 'MongoError' && error.code === 11000) {
      const data = error.message.match(/E11000 duplicate key error[^{]+{\s*:\s*['"]([^"']+)['"]\s*}.*/);
      if (data.length >= 2) {
         if (!!~error.message.indexOf('email')) {
            next(new CustomEdError(`Email '${data[1]}' already assigned`, EHTTPStatus.BadRequest));
         } else if (!!~error.message.indexOf('userName')) {
            next(new CustomEdError(`Username '${data[1]}' already assigned`, EHTTPStatus.BadRequest));
         } else {
            next(error);
         }
      } else {
         next(error);
      }
   } else {
      next(error);
   }
});

/**
 * Synchronous success hook
 */
_schema.post('save', function (doc) {
   Cache.remove(this._id.toString());
});

class UserSchema extends ASchema {
   /**
    * Get by id
    * @param {string} id
    * @return {Q.Promise<any>}
    */
   public getFullCached(id) {
      const defer = q.defer();
      const user = Cache.get(id);

      if (user) {
         defer.resolve(user);
      } else {
         super.get(id, {
            select: '+roles'
         })
            .then((item: any) => {
               item = item.toObject();
               Cache.set(id, item, 3600 * 12);
               defer.resolve(item);
            })
            .catch(err => defer.reject(err));
      }

      return defer.promise;
   }


   /**
    * Find single user by email
    * @param email
    * @param queryParams
    * @return {Promise<T>}
    */
   public findOneByEmail(email: string, queryParams: any = null): q.Promise<User> {
      const defer = <q.Deferred<User>>q.defer();

      const query = this._model.findOne()
         .where('email').equals(email.toLowerCase());

      if (queryParams) {
         super.applyQueryParams(query, queryParams);
      }

      query.exec((err, user) => {
         if (err) return defer.reject(err);
         defer.resolve(user);
      });

      return defer.promise;
   }

   /**
    * Find single user by either email or userName
    * @param value
    * @param includePassword
    */
   public findOneByUserNameOrEmail(value: string, includePassword = false): q.Promise<User> {
      const defer = <q.Deferred<User>>q.defer();
      const query = this._model.findOne()
         .or([{userName: value.toLowerCase()}, {email: value.toLowerCase()}]);

      if (includePassword) {
         query.select('+password');
      }

      query.exec((err, user) => {
         if (err) return defer.reject(err);
         defer.resolve(user);
      });

      return defer.promise;
   }

   /**
    * Get user password
    * @param {string} id
    * @return {Q.Promise<User>}
    */
   public getPasswordsById(id: string) {
      const defer = <q.Deferred<User>>q.defer();

      this._model.findById(id)
         .select('password validMail')
         .exec((err, user) => {
            if (err) return defer.reject(err);
            if (!user) return defer.reject(new Error('UserSchema not found'));
            defer.resolve(user);
         });

      return defer.promise;
   }

   /**
    * Change user's password
    * @param {string} id
    * @param {string} oldPwd
    * @param {string} password
    * @return {Q.Promise<User>}
    */
   public changePasswordById(id: string, oldPwd: string, password: string) {
      const defer = <q.Deferred<User>>q.defer();

      this.getPasswordsById(id)
         .then(userPwds => {
            bcrypt.compare(oldPwd, userPwds.password, (err, same) => {
               if (err) return defer.reject(err);
               if (!same || !oldPwd) return defer.reject(new CustomEdError('Wrong password', EHTTPStatus.Forbidden));
               this.saveById(id, {_id: id, password: password})
                  .then((res: User) => defer.resolve(res))
                  .catch(err2 => defer.reject(err2));
            });
         })
         .catch(err => defer.reject(err));

      return defer.promise;
   }

   /**
    * Schema getter
    * @return {mongoose.Schema}
    */
   getSchema(): mongoose.Schema {
      return _schema;
   }
}

const instance = new UserSchema();

module.exports.schema = instance;
export default instance;
