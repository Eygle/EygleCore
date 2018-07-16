"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var bcrypt = require("bcrypt");
var q = require("q");
var Cache_1 = require("../modules/Cache");
var server_enums_1 = require("../typings/server.enums");
var EdError_1 = require("../utils/EdError");
var user_schema_1 = require("../schemas/user.schema");
var ADBModel_1 = require("./ADBModel");
var UserDB = (function (_super) {
    __extends(UserDB, _super);
    function UserDB() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Get by id
     * @param {string} id
     * @return {Q.Promise<any>}
     */
    UserDB.getFullCached = function (id) {
        var defer = q.defer();
        var user = Cache_1.default.get(id);
        if (user) {
            defer.resolve(user);
        }
        else {
            _super.get.call(this, id, {
                select: '+roles'
            })
                .then(function (item) {
                item = item.toObject();
                Cache_1.default.set(id, item, 3600 * 12);
                defer.resolve(item);
            })
                .catch(function (err) { return defer.reject(err); });
        }
        return defer.promise;
    };
    /**
     * Find single user by email
     * @param email
     * @param queryParams
     * @return {Promise<T>}
     */
    UserDB.findOneByEmail = function (email, queryParams) {
        if (queryParams === void 0) { queryParams = null; }
        var defer = q.defer();
        var query = this._model.findOne()
            .where('email').equals(email.toLowerCase());
        if (queryParams) {
            _super.applyQueryParams.call(this, query, queryParams);
        }
        query.exec(function (err, user) {
            if (err)
                return defer.reject(err);
            defer.resolve(user);
        });
        return defer.promise;
    };
    /**
     * Find single user by either email or userName
     * @param value
     * @param includePassword
     */
    UserDB.findOneByUserNameOrEmail = function (value, includePassword) {
        if (includePassword === void 0) { includePassword = false; }
        var defer = q.defer();
        var query = this._model.findOne()
            .or([{ userName: value.toLowerCase() }, { email: value.toLowerCase() }]);
        if (includePassword) {
            query.select('+password +roles');
        }
        query.exec(function (err, user) {
            if (err)
                return defer.reject(err);
            defer.resolve(user);
        });
        return defer.promise;
    };
    /**
     * Get user password
     * @param {string} id
     * @return {Q.Promise<User>}
     */
    UserDB.getPasswordsById = function (id) {
        var defer = q.defer();
        this._model.findById(id)
            .select('password validMail')
            .exec(function (err, user) {
            if (err)
                return defer.reject(err);
            if (!user)
                return defer.reject(new Error('UserSchema not found'));
            defer.resolve(user);
        });
        return defer.promise;
    };
    /**
     * Change user's password
     * @param {string} id
     * @param {string} oldPwd
     * @param {string} password
     * @return {Q.Promise<User>}
     */
    UserDB.changePasswordById = function (id, oldPwd, password) {
        var _this = this;
        var defer = q.defer();
        this.getPasswordsById(id)
            .then(function (userPwds) {
            bcrypt.compare(oldPwd, userPwds.password, function (err, same) {
                if (err)
                    return defer.reject(err);
                if (!same || !oldPwd)
                    return defer.reject(new EdError_1.CustomEdError('Wrong password', server_enums_1.EHTTPStatus.Forbidden));
                _this.saveById(id, { _id: id, password: password })
                    .then(function (res) { return defer.resolve(res); })
                    .catch(function (err2) { return defer.reject(err2); });
            });
        })
            .catch(function (err) { return defer.reject(err); });
        return defer.promise;
    };
    return UserDB;
}(ADBModel_1.default));
exports.default = UserDB;
UserDB.init(user_schema_1.userSchema);
module.exports.schema = UserDB; // Used by MongoDB models loader (need require)
//# sourceMappingURL=UserDB.js.map