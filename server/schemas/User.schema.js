"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const q = require("q");
const DB_1 = require("../modules/DB");
const Cache_1 = require("../modules/Cache");
const Utils_1 = require("../../commons/utils/Utils");
const ASchema_schema_1 = require("./ASchema.schema");
const server_enums_1 = require("../typings/server.enums");
const EdError_1 = require("../config/EdError");
const core_enums_1 = require("../../commons/core.enums");
const _schema = DB_1.default.createSchema({
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
    userNameNorm: { type: String, unique: true, sparse: true },
    validMail: { type: String, select: false },
    locked: { type: Boolean, 'default': false, select: false },
    googleId: String,
    googleToken: String,
    facebookId: String,
    facebookToken: String,
    roles: {
        type: [String],
        'default': [core_enums_1.ERole.Guest],
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
_schema.pre('save', function (next) {
    if (this.userName) {
        this.userName = this.userName.toLowerCase();
        this.userNameNorm = Utils_1.default.normalize(this.userName);
    }
    next();
});
/**
 * Error's handler asynchronous hook
 */
_schema.post('save', function (error, doc, next) {
    Cache_1.default.remove(this._id.toString());
    if (error.name === 'MongoError' && error.code === 11000) {
        const data = error.message.match(/E11000 duplicate key error[^{]+{\s*:\s*['"]([^"']+)['"]\s*}.*/);
        if (data.length >= 2) {
            if (!!~error.message.indexOf('email')) {
                next(new EdError_1.CustomEdError(`Email '${data[1]}' already assigned`, server_enums_1.EHTTPStatus.BadRequest));
            }
            else if (!!~error.message.indexOf('userName')) {
                next(new EdError_1.CustomEdError(`Username '${data[1]}' already assigned`, server_enums_1.EHTTPStatus.BadRequest));
            }
            else {
                next(error);
            }
        }
        else {
            next(error);
        }
    }
    else {
        next(error);
    }
});
/**
 * Synchronous success hook
 */
_schema.post('save', function (doc) {
    Cache_1.default.remove(this._id.toString());
});
class UserSchema extends ASchema_schema_1.default {
    /**
     * Get by id
     * @param {string} id
     * @return {Q.Promise<any>}
     */
    getFullCached(id) {
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
    findOneByEmail(email, queryParams = null) {
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
    findOneByUserNameOrEmail(value, includePassword = false) {
        const defer = q.defer();
        const query = this._model.findOne()
            .or([{ userName: value.toLowerCase() }, { email: value.toLowerCase() }]);
        if (includePassword) {
            query.select('+password');
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
    getPasswordsById(id) {
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
    changePasswordById(id, oldPwd, password) {
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
    /**
     * Schema getter
     * @return {mongoose.Schema}
     */
    getSchema() {
        return _schema;
    }
}
exports.UserSchema = UserSchema;
const instance = new UserSchema();
module.exports.schema = instance;
exports.default = instance;
//# sourceMappingURL=User.schema.js.map