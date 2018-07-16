"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Twig = require("twig");
var fs = require("fs");
var bcrypt = require("bcrypt");
var UserDB_1 = require("../db/UserDB");
var server_enums_1 = require("../typings/server.enums");
var EdError_1 = require("../utils/EdError");
var ServerConfig_1 = require("../utils/ServerConfig");
var Logger_1 = require("../utils/Logger");
var EmailsUnsubscribe = (function () {
    function EmailsUnsubscribe() {
    }
    /**
     * Express middleware getter
     */
    EmailsUnsubscribe.getMiddleware = function () {
        var _this = this;
        return function (req, res, next) {
            var _a = req.params[0].split('/'), email = _a[0], hash = _a[1];
            Logger_1.default.log("User " + email + " visited unsubscribe view");
            _this._checkUser(email, hash, function (user) {
                res.send(Twig.twig({
                    data: fs.readFileSync(ServerConfig_1.default.root + "/server/templates/unsubscribe_from_emails/unsubscribe.twig", { encoding: 'UTF-8' })
                }).render({
                    html_title: 'Gestion des listes de diffusions',
                    title: 'Liste de diffusion',
                    subtitle: "Pour le compte associ\u00E9 \u00E0 l'email " + email,
                    subscriptions: user.subscriptions
                }));
            }, next);
        };
    };
    /**
     * Express middleware getter
     */
    EmailsUnsubscribe.getPostMiddleware = function () {
        var _this = this;
        return function (req, res, next) {
            var _a = req.params[0].split('/'), email = _a[0], hash = _a[1];
            _this._checkUser(email, hash, function (user) {
                for (var k in req.body.subscriptions) {
                    if (req.body.subscriptions.hasOwnProperty(k)) {
                        user.subscriptions[k] = req.body.subscriptions[k] === 'true';
                    }
                }
                Logger_1.default.log("User '" + email + "' change it's subscriptions preferences");
                user.save(function (err) {
                    if (err)
                        return next(err);
                    res.sendStatus(200);
                });
            }, next);
        };
    };
    /**
     * User getter
     * @param email
     * @param hash
     * @param success
     * @param error
     * @private
     */
    EmailsUnsubscribe._checkUser = function (email, hash, success, error) {
        hash = hash.replace(new RegExp('\\+', 'g'), '/');
        UserDB_1.default.findOneByEmail(email)
            .then(function (user) {
            if (!user)
                return error(new EdError_1.CustomEdError('Email not found', server_enums_1.EHTTPStatus.BadRequest));
            if (bcrypt.compareSync(user._id.toString() + ServerConfig_1.default.userHash, hash)) {
                success(user);
            }
            else {
                error(new EdError_1.CustomEdError('Invalid user hash', server_enums_1.EHTTPStatus.BadRequest));
            }
        })
            .catch(function (err) { return error(err); });
    };
    return EmailsUnsubscribe;
}());
exports.default = EmailsUnsubscribe;
//# sourceMappingURL=EmailsUnsubscribe.js.map