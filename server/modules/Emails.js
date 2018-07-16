"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
var sendEmailTransport = require("nodemailer-sendmail-transport");
var handlebars = require("handlebars");
var fs = require("fs");
var q = require("q");
var EmailTemplate = require("email-templates");
var ServerConfig_1 = require("../utils/ServerConfig");
var Logger_1 = require("../utils/Logger");
var core_enums_1 = require("../../commons/core.enums");
var Emails = (function () {
    function Emails() {
    }
    /**
     * TODO
     */
    Emails.sendWelcome = function (dest) {
    };
    /**
     * TODO
     */
    Emails.sendPasswordRecovery = function (dest) {
    };
    /**
     * TODO
     */
    Emails.sendLockedAccount = function (dest) {
    };
    /**
     * TODO
     */
    Emails.sendUnlockedAccount = function (dest) {
    };
    /**
     * Do send email with template
     * @param locals
     * @private
     */
    Emails._sendTemplateMail = function (locals) {
        var defer = q.defer();
        var transporter = this._smtpConnect();
        var template = new EmailTemplate(__dirname + "/../templates/" + locals.template);
        handlebars.registerHelper('if_even', function (conditional, options) {
            return conditional % 2 === 0 ? options.fn(this) : options.inverse(this);
        });
        handlebars.registerHelper('if_even2', function (conditional, options) {
            if (options.data.root.comments_near.length) {
                conditional = conditional + options.data.root.comments_near.length;
            }
            return conditional % 2 === 0 ? options.fn(this) : options.inverse(this);
        });
        if (ServerConfig_1.default.env !== core_enums_1.EEnv.Prod) {
            locals.email = 'dev@eygle.fr';
            locals.bccmail = '';
        }
        template.render(locals, function (err, results) {
            if (err) {
                Logger_1.default.error('Email template rendering error: ', err);
                defer.reject(err);
            }
            else {
                if (ServerConfig_1.default.env === core_enums_1.EEnv.Dev || ServerConfig_1.default.env === core_enums_1.EEnv.Test) {
                    transporter.use('stream', require('nodemailer-dkim').signer({
                        domainName: 'eygle.fr',
                        keySelector: 'key1',
                        privateKey: fs.readFileSync(ServerConfig_1.default.root + "/server/misc/key1.eygle.fr.pem")
                    }));
                }
                var optSendMail_1 = {
                    from: 'Eygle.fr ✔ <no-reply@eygle.fr>',
                    to: locals.email,
                    bcc: locals.bccmail,
                    subject: locals.subject,
                    html: results.html,
                    text: results.text
                };
                if (locals.attachments) {
                    optSendMail_1.attachments = locals.attachments;
                }
                transporter.sendMail(optSendMail_1, function (err2, responseStatus) {
                    if (err2) {
                        Logger_1.default.error("Error while sending email to " + optSendMail_1.to + ":", err2);
                        defer.reject(err2);
                    }
                    else {
                        defer.resolve();
                    }
                });
            }
        });
        return defer.promise;
    };
    /**
     * Create SMTP connexion
     * @return {Transporter}
     * @private
     */
    Emails._smtpConnect = function () {
        if (core_enums_1.EEnv.Dev === ServerConfig_1.default.env || core_enums_1.EEnv.Test === ServerConfig_1.default.env) {
            return nodemailer.createTransport(smtpTransport({
                host: 'smtp.free.fr',
                port: 465,
                secure: true,
                auth: {
                    user: 'mapuitest@free.fr',
                    pass: 'ruba1212'
                }
            }));
        }
        else {
            return nodemailer.createTransport(sendEmailTransport({ path: '/usr/sbin/sendmail' }));
        }
    };
    Emails._siteURL = 'https://www.dl.eygle.fr';
    return Emails;
}());
exports.default = Emails;
//# sourceMappingURL=Emails.js.map