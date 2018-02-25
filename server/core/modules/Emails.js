"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
const sendEmailTransport = require("nodemailer-sendmail-transport");
const handlebars = require("handlebars");
const fs = require("fs");
const q = require("q");
const EmailTemplate = require("email-templates");
const server_enums_1 = require("../typings/server.enums");
const ProjectConfig_1 = require("../config/ProjectConfig");
const Logger_1 = require("../config/Logger");
class Emails {
    constructor() {
        this._siteURL = 'https://www.dl.eygle.fr';
    }
    /**
     * TODO
     */
    sendWelcome(dest) {
    }
    /**
     * TODO
     */
    sendPasswordRecovery(dest) {
    }
    /**
     * TODO
     */
    sendLockedAccount(dest) {
    }
    /**
     * TODO
     */
    sendUnlockedAccount(dest) {
    }
    /**
     * Do send email with template
     * @param locals
     * @private
     */
    _sendTemplateMail(locals) {
        const defer = q.defer();
        const transporter = this._smtpConnect();
        const template = new EmailTemplate(`${__dirname}/../templates/${locals.template}`);
        handlebars.registerHelper('if_even', function (conditional, options) {
            return conditional % 2 === 0 ? options.fn(this) : options.inverse(this);
        });
        handlebars.registerHelper('if_even2', function (conditional, options) {
            if (options.data.root.comments_near.length) {
                conditional = conditional + options.data.root.comments_near.length;
            }
            return conditional % 2 === 0 ? options.fn(this) : options.inverse(this);
        });
        if (ProjectConfig_1.default.env !== server_enums_1.EEnv.Prod) {
            locals.email = 'dev@eygle.fr';
            locals.bccmail = '';
        }
        template.render(locals, function (err, results) {
            if (err) {
                Logger_1.default.error('Email template rendering error: ', err);
                defer.reject(err);
            }
            else {
                if (ProjectConfig_1.default.env === server_enums_1.EEnv.Dev || ProjectConfig_1.default.env === server_enums_1.EEnv.Test) {
                    transporter.use('stream', require('nodemailer-dkim').signer({
                        domainName: 'eygle.fr',
                        keySelector: 'key1',
                        privateKey: fs.readFileSync(`${ProjectConfig_1.default.root}/server/misc/key1.eygle.fr.pem`)
                    }));
                }
                const optSendMail = {
                    from: 'Eygle.fr ✔ <no-reply@eygle.fr>',
                    to: locals.email,
                    bcc: locals.bccmail,
                    subject: locals.subject,
                    html: results.html,
                    text: results.text
                };
                if (locals.attachments) {
                    optSendMail.attachments = locals.attachments;
                }
                transporter.sendMail(optSendMail, function (err2, responseStatus) {
                    if (err2) {
                        Logger_1.default.error(`Error while sending email to ${optSendMail.to}:`, err2);
                        defer.reject(err2);
                    }
                    else {
                        defer.resolve();
                    }
                });
            }
        });
        return defer.promise;
    }
    /**
     * Create SMTP connexion
     * @return {Transporter}
     * @private
     */
    _smtpConnect() {
        if (server_enums_1.EEnv.Dev === ProjectConfig_1.default.env || server_enums_1.EEnv.Test === ProjectConfig_1.default.env) {
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
    }
}
exports.Emails = Emails;
exports.default = new Emails();
//# sourceMappingURL=Emails.js.map