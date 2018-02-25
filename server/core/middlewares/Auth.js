"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const passport = require("passport");
const Utils_1 = require("../../../commons/core/utils/Utils");
const EdError_1 = require("../config/EdError");
const Emails_1 = require("../modules/Emails");
const User_schema_1 = require("../schemas/User.schema");
const Permissions_1 = require("../modules/Permissions");
const server_enums_1 = require("../typings/server.enums");
const Logger_1 = require("../config/Logger");
const ProjectConfig_1 = require("../config/ProjectConfig");
class Auth {
    constructor() {
        this._attempts = {};
    }
    /**
     * @return {(req:any, res:any, next:any)} Login middleware
     */
    loginMiddleware() {
        return (req, res, next) => {
            passport.authenticate('local', (err, user) => {
                if (err)
                    return next(err);
                if (!user || user.locked) {
                    return this._addLoginFailedAttempt(user, req, res, next);
                }
                this._cleanExpiredAttempts(req.body.username);
                req.logIn(user, (err2) => {
                    if (err2) {
                        return next(err2);
                    }
                    this.addUserCookie(res, user);
                    res.sendStatus(200);
                });
            })(req, res, next);
        };
    }
    /**
     * @return {(req:any, res:any, next:any)} Logout middleware
     */
    logoutMiddleware() {
        return (req, res) => {
            Logger_1.default.log(`User ${req.user ?
                req.user.fullName || req.user.email :
                '[null]'}${req.user ? ` (${req.user._id})` : ''} logged out`);
            req.logout();
            return res.sendStatus(200);
        };
    }
    /**
     * @return {(req:any, res:any, next:any)} Register middleware
     */
    registerMiddleware() {
        return (req, res, next) => {
            User_schema_1.default.add({
                email: req.body.email,
                userName: req.body.username,
                password: req.body.password
            })
                .then((user) => {
                Emails_1.default.sendWelcome(user);
                Logger_1.default.log(`User ${req.body.email} registered successfully`);
                passport.authenticate('local', (err, user) => {
                    if (err)
                        return next(err);
                    req.logIn(user, (err2) => {
                        if (err2) {
                            return next(err2);
                        }
                        this.addUserCookie(res, user);
                        res.sendStatus(200);
                    });
                })(req, res, next);
            })
                .catch(err => next(err));
        };
    }
    /**
     * @return {(req:any, res:any, next:any)} Forgot password middleware
     */
    forgotPasswordMiddleware() {
        return (req, res, next) => {
            User_schema_1.default.findOneByEmail(req.body.email).then((user) => {
                if (!user)
                    return res.status(404).send('UserSchema not found');
                user.password = null; // set password has null to force validMail generation
                User_schema_1.default.save(user).then((userSaved) => {
                    User_schema_1.default.getPasswordsById(userSaved._id.toString()).then(userWPwd => {
                        Emails_1.default.sendPasswordRecovery(userWPwd);
                        Logger_1.default.log(`User ${req.body.email} recovered password`);
                        res.sendStatus(200);
                    }).catch((err) => next(err));
                }).catch((err) => next(err));
            }).catch((err) => next(err));
        };
    }
    /**
     * @return {(req:any, res:any, next:any)} Change password middleware
     */
    changePasswordMiddleware() {
        return (req, res, next) => {
            const p = req.url.split('/');
            const id = p[p.length - 1];
            if (req.user._id !== id && !Permissions_1.default.ensureAuthorized(req.user, 'admin')) {
                return next(new EdError_1.CustomEdError(`Permission denied (admin) for user ${req.user ?
                    req.user.fullName || req.user.email :
                    '[null]'}`, server_enums_1.EHTTPStatus.Forbidden));
            }
            User_schema_1.default.changePasswordById(id, req.body.oldPwd, req.body.password)
                .then((user) => {
                Logger_1.default.log(`User ${req.user.email} changed password`);
                res.status(200).json(user);
            })
                .catch(err => next(err));
        };
    }
    /**
     * Anti login brute-force
     * This security will lock accounts after a certain amount of tries
     * @return {(req:any, res:any, next:any)} Login limit middleware
     */
    loginLimitMiddleware() {
        return (req, res, next) => {
            const username = req.body.username;
            if (!this._attempts.hasOwnProperty(username)) {
                return next();
            }
            this._cleanExpiredAttempts(username);
            if (this._attempts[username].locked) {
                return res.status(429).send('TooManyAttempts');
            }
            next();
        };
    }
    /**
     * Anti login brute-force
     * This security will lock accounts after a certain amount of tries
     * @return {(req:any, res:any, next:any)} Login limit middleware
     */
    unlockAccountMiddleware() {
        return (req, res, next) => {
            const p = req.url.split('/');
            const id = p[p.length - 1];
            if (!Permissions_1.default.ensureAuthorized(req.user, 'admin')) {
                return next(new EdError_1.EdError(server_enums_1.EHTTPStatus.Forbidden));
            }
            User_schema_1.default.saveById(id, {
                locked: false
            }).then((user) => {
                this._cleanAttempts(user.userName);
                this._cleanAttempts(user.email);
                Emails_1.default.sendUnlockedAccount(user);
                Logger_1.default.log(`User ${user.email} account has been unlocked by ${req.user.email}`);
                res.sendStatus(200);
            })
                .catch(err => next(err));
        };
    }
    /**
     * Add SET-COOKIE to request response headers
     * @param res
     * @param user
     */
    addUserCookie(res, user) {
        res.cookie('user', JSON.stringify(this._generateUserCookieData(user)), { secure: server_enums_1.EEnv.Dev !== ProjectConfig_1.default.env && server_enums_1.EEnv.Test !== ProjectConfig_1.default.env });
    }
    /**
     * Generate user data used in clients
     * @param user
     * @return any
     * @private
     */
    _generateUserCookieData(user) {
        return user ? {
            _id: user._id.toString(),
            userName: user.userName,
            email: user.email,
            roles: user.roles || ['public']
        } : {};
    }
    ///////////////////////////////////////////////////////////////////
    // Security utils methods (anti-bruteforce)
    ///////////////////////////////////////////////////////////////////
    /**
     * Add login failed attempt
     * @param user
     * @param req
     * @param res
     * @param next
     * @private
     */
    _addLoginFailedAttempt(user, req, res, next) {
        const username = req.body.username;
        this._addAttempt(username);
        if (this._attempts[username].locked) {
            User_schema_1.default.findOneByUserNameOrEmail(username).then((userRes) => {
                if (userRes && !userRes.locked) {
                    userRes.locked = true;
                    User_schema_1.default.save(userRes).then((userSaved) => {
                        Emails_1.default.sendLockedAccount(userSaved);
                        Logger_1.default.warn(`User ${username} account is locked due to too many login attempts`);
                    }).catch(err => next(err));
                }
                else {
                    Logger_1.default.warn(`User ${username} tried to logged in with a locked account`);
                }
                res.status(403).send('TooManyAttempts');
            }).catch(err => {
                next(err);
            });
        }
        else if (user) {
            Logger_1.default.warn(`User ${username} tried to logged in with a locked account`);
            res.status(403).send('TooManyAttempts');
        }
        else {
            res.status(400).send('FailedToLogin');
        }
    }
    /**
     * Clean attempts per username
     * @param username
     * @private
     */
    _cleanAttempts(username) {
        if (this._attempts.hasOwnProperty(username)) {
            this._attempts[username] = { list: [], locked: false };
        }
    }
    /**
     * Add failed attempt to list
     * @param username
     * @private
     */
    _addAttempt(username) {
        if (!this._attempts.hasOwnProperty(username)) {
            this._attempts[username] = { list: [], locked: false };
        }
        this._attempts[username].list.push(Date.now());
        if (!this._attempts[username].locked && this._attempts[username].list.length >= Utils_1.default.maxLoginAttempts) {
            this._attempts[username].locked = true;
        }
        if (this._attempts[username].list.length > Utils_1.default.maxLoginAttempts) {
            this._attempts[username].list.splice(0, 1);
        }
    }
    /**
     * Remove all expired attempts
     */
    _cleanExpiredAttempts(username) {
        if (!this._attempts.hasOwnProperty(username))
            return;
        const now = Date.now();
        const userAttempts = this._attempts[username].list;
        for (const idx in userAttempts) {
            if (userAttempts.hasOwnProperty(idx)) {
                if (now - userAttempts[idx] >= Utils_1.default.loginAttemptsExpire) {
                    userAttempts.splice(idx, 1);
                }
            }
        }
    }
}
exports.Auth = Auth;
exports.default = new Auth();
//# sourceMappingURL=Auth.js.map