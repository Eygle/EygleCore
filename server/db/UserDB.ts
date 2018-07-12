import * as bcrypt from 'bcrypt';
import * as q from 'q';
import Cache from '../modules/Cache';
import {EHTTPStatus} from '../typings/server.enums';
import {CustomEdError} from '../utils/EdError';
import {User} from '../../commons/models/User';
import {userSchema} from "../schemas/User.schema";
import ADBModel from "./ADBModel";

export default class UserDB extends ADBModel {
    /**
     * Get by id
     * @param {string} id
     * @return {Q.Promise<any>}
     */
    public static getFullCached(id) {
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
    public static findOneByEmail(email: string, queryParams: any = null): q.Promise<User> {
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
    public static findOneByUserNameOrEmail(value: string, includePassword = false): q.Promise<User> {
        const defer = <q.Deferred<User>>q.defer();
        const query = this._model.findOne()
            .or([{userName: value.toLowerCase()}, {email: value.toLowerCase()}]);

        if (includePassword) {
            query.select('+password +roles');
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
    public static getPasswordsById(id: string) {
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
    public static changePasswordById(id: string, oldPwd: string, password: string) {
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
}

UserDB.init(userSchema);
module.exports.schema = UserDB; // Used by MongoDB models loader (need require)
