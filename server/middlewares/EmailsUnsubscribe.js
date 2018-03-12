"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Twig = require("twig");
const fs = require("fs");
const bcrypt = require("bcrypt");
const User_schema_1 = require("../schemas/User.schema");
const server_enums_1 = require("../typings/server.enums");
const EdError_1 = require("../utils/EdError");
const ServerConfig_1 = require("../utils/ServerConfig");
const Logger_1 = require("../utils/Logger");
class EmailsUnsubscribe {
    /**
     * Express middleware getter
     */
    static getMiddleware() {
        return (req, res, next) => {
            const [email, hash] = req.params[0].split('/');
            Logger_1.default.log(`User ${email} visited unsubscribe view`);
            this._checkUser(email, hash, (user) => {
                res.send(Twig.twig({
                    data: fs.readFileSync(`${ServerConfig_1.default.root}/server/templates/unsubscribe_from_emails/unsubscribe.twig`, { encoding: 'UTF-8' })
                }).render({
                    html_title: 'Gestion des listes de diffusions',
                    title: 'Liste de diffusion',
                    subtitle: `Pour le compte associé à l'email ${email}`,
                    subscriptions: user.subscriptions
                }));
            }, next);
        };
    }
    /**
     * Express middleware getter
     */
    static getPostMiddleware() {
        return (req, res, next) => {
            const [email, hash] = req.params[0].split('/');
            this._checkUser(email, hash, (user) => {
                for (const k in req.body.subscriptions) {
                    if (req.body.subscriptions.hasOwnProperty(k)) {
                        user.subscriptions[k] = req.body.subscriptions[k] === 'true';
                    }
                }
                Logger_1.default.log(`User '${email}' change it's subscriptions preferences`);
                user.save((err) => {
                    if (err)
                        return next(err);
                    res.sendStatus(200);
                });
            }, next);
        };
    }
    /**
     * User getter
     * @param email
     * @param hash
     * @param success
     * @param error
     * @private
     */
    static _checkUser(email, hash, success, error) {
        hash = hash.replace(new RegExp('\\+', 'g'), '/');
        User_schema_1.default.findOneByEmail(email)
            .then((user) => {
            if (!user)
                return error(new EdError_1.CustomEdError('Email not found', server_enums_1.EHTTPStatus.BadRequest));
            if (bcrypt.compareSync(user._id.toString() + ServerConfig_1.default.userHash, hash)) {
                success(user);
            }
            else {
                error(new EdError_1.CustomEdError('Invalid user hash', server_enums_1.EHTTPStatus.BadRequest));
            }
        })
            .catch(err => error(err));
    }
}
exports.default = EmailsUnsubscribe;
//# sourceMappingURL=EmailsUnsubscribe.js.map