import * as nodemailer from 'nodemailer';
import * as smtpTransport from 'nodemailer-smtp-transport';
import * as sendEmailTransport from 'nodemailer-sendmail-transport';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as q from 'q';
import * as EmailTemplate from 'email-templates';
import {User} from '../../commons/models/User';
import ServerConfig from "../utils/ServerConfig";
import Logger from "../utils/Logger";
import {EEnv} from "../../commons/core.enums";

export default class Emails {
  private static _siteURL: string = 'https://www.dl.eygle.fr';

  /**
   * TODO
   */
  public static sendWelcome(dest: User) {

  }

  /**
   * TODO
   */
  public static sendPasswordRecovery(dest: User) {

  }

  /**
   * TODO
   */
  public static sendLockedAccount(dest: User) {

  }

  /**
   * TODO
   */
  public static sendUnlockedAccount(dest: User) {

  }

  /**
   * Do send email with template
   * @param locals
   * @private
   */
  private static _sendTemplateMail(locals) {
    const defer = q.defer();
    const transporter = this._smtpConnect();
    const template = new EmailTemplate(<any>`${__dirname}/../templates/${locals.template}`);

    handlebars.registerHelper('if_even', function (conditional, options) {
      return conditional % 2 === 0 ? options.fn(this) : options.inverse(this);
    });

    handlebars.registerHelper('if_even2', function (conditional, options) {
      if (options.data.root.comments_near.length) {
        conditional = conditional + options.data.root.comments_near.length;
      }
      return conditional % 2 === 0 ? options.fn(this) : options.inverse(this);
    });

     if (ServerConfig.env !== EEnv.Prod) {
      locals.email = 'dev@eygle.fr';
      locals.bccmail = '';
    }

    template.render(locals, function (err, results) {
      if (err) {
         Logger.error('Email template rendering error: ', err);
        defer.reject(err);
      } else {
         if (ServerConfig.env === EEnv.Dev || ServerConfig.env === EEnv.Test) {
          transporter.use('stream', require('nodemailer-dkim').signer({
            domainName: 'eygle.fr',
            keySelector: 'key1',
             privateKey: fs.readFileSync(`${ServerConfig.root}/server/misc/key1.eygle.fr.pem`)
          }));
        }

        const optSendMail: any = {
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
             Logger.error(`Error while sending email to ${optSendMail.to}:`, err2);
            defer.reject(err2);
          } else {
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
  private static _smtpConnect() {
     if (EEnv.Dev === ServerConfig.env || EEnv.Test === ServerConfig.env) {
      return nodemailer.createTransport(smtpTransport({
        host: 'smtp.free.fr',
        port: 465,
        secure: true,
        auth: {
          user: 'mapuitest@free.fr',
          pass: 'ruba1212'
        }
      }));
    } else {
      return nodemailer.createTransport(sendEmailTransport({path: '/usr/sbin/sendmail'}));
    }
  }
}
