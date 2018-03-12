"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const passport = require("passport");
const bcrypt = require("bcrypt");
const local = require("passport-local");
const User_schema_1 = require("../schemas/User.schema");
const Logger_1 = require("./Logger");
class PassportConfig {
    /**
     * Initialise passport
     * @param app
     */
    static init(app) {
        app.use(passport.initialize());
        app.use(passport.session());
        passport.use(this._localStrategy());
        passport.serializeUser(this._serializeUser());
        passport.deserializeUser(this._deserializeUser());
    }
    /**
     * User local login strategy
     * @private
     */
    static _localStrategy() {
        return new local.Strategy({ passReqToCallback: true, usernameField: 'email' }, (req, username, password, done) => {
            console.log(username, password);
            username = username.replace(' ', '');
            username = username.toLowerCase();
            User_schema_1.default.findOneByUserNameOrEmail(username, true)
                .then((user) => {
                if (!user) {
                    Logger_1.default.log(`User '${username}' login failed (no such username or email)`);
                    return done(null, false);
                }
                bcrypt.compare(password, user.password, (err, res) => {
                    if (!res) {
                        Logger_1.default.log(`User '${username}' login failed (wrong password)`);
                        return done(null, false);
                    }
                    Logger_1.default.log(`User '${username}' (${user._id}) logged in`);
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
    static _serializeUser() {
        return (user, done) => {
            return done(null, user._id.toString());
        };
    }
    /**
     * Passport deserialize user
     * @private
     */
    static _deserializeUser() {
        return (id, done) => {
            User_schema_1.default.getFullCached(id)
                .then((user) => {
                if (!user)
                    return done(null, false);
                done(null, user);
            })
                .catch(err => {
                Logger_1.default.error('Deserialize user error', err);
                done(null, false);
            });
        };
    }
}
exports.default = PassportConfig;
//# sourceMappingURL=PassportConfig.js.map