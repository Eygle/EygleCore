"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var passport = require("passport");
var Emails_1 = require("../modules/Emails");
var UserDB_1 = require("../db/UserDB");
var Permissions_1 = require("../modules/Permissions");
var server_enums_1 = require("../typings/server.enums");
var Logger_1 = require("../utils/Logger");
var EdError_1 = require("../utils/EdError");
var core_enums_1 = require("../../commons/core.enums");
var ServerConfig_1 = require("../utils/ServerConfig");
var Auth = (function () {
    function Auth() {
    }
    /**
     * @return {(req:any, res:any, next:any)} Login middleware
     */
    Auth.loginMiddleware = function () {
        var _this = this;
        return function (req, res, next) {
            passport.authenticate('local', function (err, user) {
                if (err)
                    return next(err);
                if (!user || user.locked) {
                    return _this._addLoginFailedAttempt(user, req, res, next);
                }
                _this._cleanExpiredAttempts(req.body.username);
                req.logIn(user, function (err2) {
                    if (err2) {
                        return next(err2);
                    }
                    _this.addUserCookie(res, user);
                    res.sendStatus(200);
                });
            })(req, res, next);
        };
    };
    /**
     * @return {(req:any, res:any, next:any)} Logout middleware
     */
    Auth.logoutMiddleware = function () {
        return function (req, res) {
            Logger_1.default.log("User " + (req.user ?
                req.user.fullName || req.user.email :
                '[null]') + (req.user ? " (" + req.user._id + ")" : '') + " logged out");
            req.logout();
            return res.sendStatus(200);
        };
    };
    /**
     * @return {(req:any, res:any, next:any)} Register middleware
     */
    Auth.registerMiddleware = function () {
        var _this = this;
        return function (req, res, next) {
            UserDB_1.default.add({
                email: req.body.email,
                userName: req.body.username,
                password: req.body.password,
                desc: req.body.desc
            })
                .then(function (user) {
                Emails_1.default.sendWelcome(user);
                Logger_1.default.log("User " + req.body.email + " registered successfully");
                passport.authenticate('local', function (err, user) {
                    if (err)
                        return next(err);
                    req.logIn(user, function (err2) {
                        if (err2) {
                            return next(err2);
                        }
                        _this.addUserCookie(res, user);
                        res.sendStatus(200);
                    });
                })(req, res, next);
            })
                .catch(function (err) { return next(err); });
        };
    };
    /**
     * @return {(req:any, res:any, next:any)} Forgot password middleware
     */
    Auth.forgotPasswordMiddleware = function () {
        return function (req, res, next) {
            UserDB_1.default.findOneByEmail(req.body.email).then(function (user) {
                if (!user)
                    return res.status(404).send('UserDB not found');
                user.password = null; // set password has null to force validMail generation
                UserDB_1.default.save(user).then(function (userSaved) {
                    UserDB_1.default.getPasswordsById(userSaved._id.toString()).then(function (userWPwd) {
                        Emails_1.default.sendPasswordRecovery(userWPwd);
                        Logger_1.default.log("User " + req.body.email + " recovered password");
                        res.sendStatus(200);
                    }).catch(function (err) { return next(err); });
                }).catch(function (err) { return next(err); });
            }).catch(function (err) { return next(err); });
        };
    };
    /**
     * @return {(req:any, res:any, next:any)} Change password middleware
     */
    Auth.changePasswordMiddleware = function () {
        return function (req, res, next) {
            var p = req.url.split('/');
            var id = p[p.length - 1];
            if (req.user._id !== id && !Permissions_1.default.ensureAuthorized(req.user, 'admin')) {
                return next(new EdError_1.CustomEdError("Permission denied (admin) for user " + (req.user ?
                    req.user.fullName || req.user.email :
                    '[null]'), server_enums_1.EHTTPStatus.Forbidden));
            }
            UserDB_1.default.changePasswordById(id, req.body.oldPwd, req.body.password)
                .then(function (user) {
                Logger_1.default.log("User " + req.user.email + " changed password");
                res.status(200).json(user);
            })
                .catch(function (err) { return next(err); });
        };
    };
    /**
     * Anti login brute-force
     * This security will lock accounts after a certain amount of tries
     * @return {(req:any, res:any, next:any)} Login limit middleware
     */
    Auth.loginLimitMiddleware = function () {
        var _this = this;
        return function (req, res, next) {
            var username = req.body.username;
            if (!_this._attempts.hasOwnProperty(username)) {
                return next();
            }
            _this._cleanExpiredAttempts(username);
            if (_this._attempts[username].locked) {
                return res.status(429).send('TooManyAttempts');
            }
            next();
        };
    };
    /**
     * Anti login brute-force
     * This security will lock accounts after a certain amount of tries
     * @return {(req:any, res:any, next:any)} Login limit middleware
     */
    Auth.unlockAccountMiddleware = function () {
        var _this = this;
        return function (req, res, next) {
            var p = req.url.split('/');
            var id = p[p.length - 1];
            if (!Permissions_1.default.ensureAuthorized(req.user, 'admin')) {
                return next(new EdError_1.default(server_enums_1.EHTTPStatus.Forbidden));
            }
            UserDB_1.default.saveById(id, {
                locked: false
            }).then(function (user) {
                _this._cleanAttempts(user.userName);
                _this._cleanAttempts(user.email);
                Emails_1.default.sendUnlockedAccount(user);
                Logger_1.default.log("User " + user.email + " account has been unlocked by " + req.user.email);
                res.sendStatus(200);
            })
                .catch(function (err) { return next(err); });
        };
    };
    /**
     * Add SET-COOKIE to request response headers
     * @param res
     * @param user
     */
    Auth.addUserCookie = function (res, user) {
        res.cookie('ey-user', JSON.stringify(this._generateUserCookieData(user)), { secure: core_enums_1.EEnv.Dev !== ServerConfig_1.default.env && core_enums_1.EEnv.Test !== ServerConfig_1.default.env });
    };
    /**
     * Generate user data used in clients
     * @param user
     * @return any
     * @private
     */
    Auth._generateUserCookieData = function (user) {
        return user ? {
            _id: user._id.toString(),
            userName: user.userName,
            email: user.email,
            roles: user.roles || ['public']
        } : {};
    };
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
    Auth._addLoginFailedAttempt = function (user, req, res, next) {
        var username = req.body.username;
        this._addAttempt(username);
        if (this._attempts[username].locked) {
            UserDB_1.default.findOneByUserNameOrEmail(username).then(function (userRes) {
                if (userRes && !userRes.locked) {
                    userRes.locked = true;
                    UserDB_1.default.save(userRes).then(function (userSaved) {
                        Emails_1.default.sendLockedAccount(userSaved);
                        Logger_1.default.warn("User " + username + " account is locked due to too many login attempts");
                    }).catch(function (err) { return next(err); });
                }
                else {
                    Logger_1.default.warn("User " + username + " tried to logged in with a locked account");
                }
                res.status(403).send('TooManyAttempts');
            }).catch(function (err) {
                next(err);
            });
        }
        else if (user) {
            Logger_1.default.warn("User " + username + " tried to logged in with a locked account");
            res.status(403).send('TooManyAttempts');
        }
        else {
            res.status(400).send('FailedToLogin');
        }
    };
    /**
     * Clean attempts per username
     * @param username
     * @private
     */
    Auth._cleanAttempts = function (username) {
        if (this._attempts.hasOwnProperty(username)) {
            this._attempts[username] = { list: [], locked: false };
        }
    };
    /**
     * Add failed attempt to list
     * @param username
     * @private
     */
    Auth._addAttempt = function (username) {
        if (!this._attempts.hasOwnProperty(username)) {
            this._attempts[username] = { list: [], locked: false };
        }
        this._attempts[username].list.push(Date.now());
        if (!this._attempts[username].locked && this._attempts[username].list.length >= ServerConfig_1.default.maxLoginAttempts) {
            this._attempts[username].locked = true;
        }
        if (this._attempts[username].list.length > ServerConfig_1.default.maxLoginAttempts) {
            this._attempts[username].list.splice(0, 1);
        }
    };
    /**
     * Remove all expired attempts
     */
    Auth._cleanExpiredAttempts = function (username) {
        if (!this._attempts.hasOwnProperty(username))
            return;
        var now = Date.now();
        var userAttempts = this._attempts[username].list;
        for (var idx in userAttempts) {
            if (userAttempts.hasOwnProperty(idx)) {
                if (now - userAttempts[idx] >= ServerConfig_1.default.loginAttemptsExpire) {
                    userAttempts.splice(idx, 1);
                }
            }
        }
    };
    /**
     * Users login attempts failed
     */
    Auth._attempts = {};
    return Auth;
}());
exports.default = Auth;
//# sourceMappingURL=Auth.js.map