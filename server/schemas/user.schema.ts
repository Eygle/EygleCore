import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

import DB from '../modules/DB';
import Cache from '../modules/Cache';
import Utils from '../../commons/utils/Utils';
import {EHTTPStatus} from '../typings/server.enums';
import {CustomEdError} from '../utils/EdError';
import {ERole} from "../../commons/core.enums";

export const userSchema: mongoose.Schema = DB.createSchema({
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

    userName: {type: String, required: false, maxlength: 10, minlength: 2},

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

userSchema.pre('save', function (next) { // DO NOT use big arrow here ( => )
    if (this.userName) {
        this.userName = this.userName.toLowerCase();
        this.userNameNorm = Utils.normalize(this.userName);
    }
    next();
});

/**
 * Error's handler asynchronous hook
 */
userSchema.post('save', function (error, doc, next) {
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
userSchema.post('save', function (doc) {
    Cache.remove(this._id.toString());
});
