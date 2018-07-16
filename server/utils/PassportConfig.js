"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var passport = require("passport");
var bcrypt = require("bcrypt");
var local = require("passport-local");
var UserDB_1 = require("../db/UserDB");
var Logger_1 = require("./Logger");
var PassportConfig = (function () {
    function PassportConfig() {
    }
    /**
     * Initialise passport
     * @param app
     */
    PassportConfig.init = function (app) {
        app.use(passport.initialize());
        app.use(passport.session());
        passport.use(this._localStrategy());
        passport.serializeUser(this._serializeUser());
        passport.deserializeUser(this._deserializeUser());
    };
    /**
     * User local login strategy
     * @private
     */
    PassportConfig._localStrategy = function () {
        return new local.Strategy({
            passReqToCallback: true,
            usernameField: 'email'
        }, function (req, username, password, done) {
            username = username.replace(' ', '');
            username = username.toLowerCase();
            UserDB_1.default.findOneByUserNameOrEmail(username, true)
                .then(function (user) {
                if (!user) {
                    Logger_1.default.log("User '" + username + "' login failed (no such username or email)");
                    return done(null, false);
                }
                bcrypt.compare(password, user.password, function (err, res) {
                    if (!res) {
                        Logger_1.default.log("User '" + username + "' login failed (wrong password)");
                        return done(null, false);
                    }
                    Logger_1.default.log("User '" + username + "' (" + user._id + ") logged in");
                    return done(null, user);
                });
            })
                .catch(function (err) {
                done(err);
            });
        });
    };
    /**
     * Passport serialize user
     * @private
     */
    PassportConfig._serializeUser = function () {
        return function (user, done) {
            return done(null, user._id.toString());
        };
    };
    /**
     * Passport deserialize user
     * @private
     */
    PassportConfig._deserializeUser = function () {
        return function (id, done) {
            UserDB_1.default.getFullCached(id)
                .then(function (user) {
                if (!user)
                    return done(null, false);
                done(null, user);
            })
                .catch(function (err) {
                Logger_1.default.error('Deserialize user error', err);
                done(null, false);
            });
        };
    };
    return PassportConfig;
}());
exports.default = PassportConfig;
//# sourceMappingURL=PassportConfig.js.map