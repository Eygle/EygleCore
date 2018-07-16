"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const DB_1 = require("../modules/DB");
const Cache_1 = require("../modules/Cache");
const Utils_1 = require("../../commons/utils/Utils");
const server_enums_1 = require("../typings/server.enums");
const EdError_1 = require("../utils/EdError");
const core_enums_1 = require("../../commons/core.enums");
exports.userSchema = DB_1.default.createSchema({
    email: {
        type: String,
        unique: true,
        required: [true, 'UserDB email required'],
        validate: {
            validator: function (v) {
                return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v);
            },
            message: 'Invalid email format'
        }
    },
    userName: { type: String, required: false, maxlength: 10, minlength: 2 },
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
exports.userSchema.pre('save', function (next) {
    if (this.userName) {
        this.userName = this.userName.toLowerCase();
        this.userNameNorm = Utils_1.default.normalize(this.userName);
    }
    next();
});
/**
 * Error's handler asynchronous hook
 */
exports.userSchema.post('save', function (error, doc, next) {
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
exports.userSchema.post('save', function (doc) {
    Cache_1.default.remove(this._id.toString());
});
//# sourceMappingURL=user.schema.js.map