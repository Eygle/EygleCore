"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require("bcrypt");
const q = require("q");
const Cache_1 = require("../modules/Cache");
const server_enums_1 = require("../typings/server.enums");
const EdError_1 = require("../utils/EdError");
const user_schema_1 = require("../schemas/user.schema");
const ADBModel_1 = require("./ADBModel");
class UserDB extends ADBModel_1.default {
    /**
     * Get by id
     * @param {string} id
     * @return {Q.Promise<any>}
     */
    static getFullCached(id) {
        const defer = q.defer();
        const user = Cache_1.default.get(id);
        if (user) {
            defer.resolve(user);
        }
        else {
            super.get(id, {
                select: '+roles'
            })
                .then((item) => {
                item = item.toObject();
                Cache_1.default.set(id, item, 3600 * 12);
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
    static findOneByEmail(email, queryParams = null) {
        const defer = q.defer();
        const query = this._model.findOne()
            .where('email').equals(email.toLowerCase());
        if (queryParams) {
            super.applyQueryParams(query, queryParams);
        }
        query.exec((err, user) => {
            if (err)
                return defer.reject(err);
            defer.resolve(user);
        });
        return defer.promise;
    }
    /**
     * Find single user by either email or userName
     * @param value
     * @param includePassword
     */
    static findOneByUserNameOrEmail(value, includePassword = false) {
        const defer = q.defer();
        const query = this._model.findOne()
            .or([{ userName: value.toLowerCase() }, { email: value.toLowerCase() }]);
        if (includePassword) {
            query.select('+password +roles');
        }
        query.exec((err, user) => {
            if (err)
                return defer.reject(err);
            defer.resolve(user);
        });
        return defer.promise;
    }
    /**
     * Get user password
     * @param {string} id
     * @return {Q.Promise<User>}
     */
    static getPasswordsById(id) {
        const defer = q.defer();
        this._model.findById(id)
            .select('password validMail')
            .exec((err, user) => {
            if (err)
                return defer.reject(err);
            if (!user)
                return defer.reject(new Error('UserSchema not found'));
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
    static changePasswordById(id, oldPwd, password) {
        const defer = q.defer();
        this.getPasswordsById(id)
            .then(userPwds => {
            bcrypt.compare(oldPwd, userPwds.password, (err, same) => {
                if (err)
                    return defer.reject(err);
                if (!same || !oldPwd)
                    return defer.reject(new EdError_1.CustomEdError('Wrong password', server_enums_1.EHTTPStatus.Forbidden));
                this.saveById(id, { _id: id, password: password })
                    .then((res) => defer.resolve(res))
                    .catch(err2 => defer.reject(err2));
            });
        })
            .catch(err => defer.reject(err));
        return defer.promise;
    }
}
exports.default = UserDB;
UserDB.init(user_schema_1.userSchema);
module.exports.schema = UserDB; // Used by MongoDB models loader (need require)
//# sourceMappingURL=UserDB.js.map