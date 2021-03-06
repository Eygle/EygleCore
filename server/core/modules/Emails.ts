import * as nodemailer from 'nodemailer';
import * as smtpTransport from 'nodemailer-smtp-transport';
import * as sendEmailTransport from 'nodemailer-sendmail-transport';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as q from 'q';
import {EmailTemplate} from 'email-templates';
import {EEnv} from '../typings/server.enums';
import {User} from '../../../commons/core/models/User';
import ProjectConfig from "../config/ProjectConfig";
import Logger from "../config/Logger";

class Emails {
  private _siteURL: string;

  constructor() {
    this._siteURL = 'https://www.dl.eygle.fr';
  }

  /**
   * TODO
   */
  public sendWelcome(dest: User) {

  }

  /**
   * TODO
   */
  public sendPasswordRecovery(dest: User) {

  }

  /**
   * TODO
   */
  public sendLockedAccount(dest: User) {

  }

  /**
   * TODO
   */
  public sendUnlockedAccount(dest: User) {

  }

  /**
   * Do send email with template
   * @param locals
   * @private
   */
  private _sendTemplateMail(locals) {
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

     if (ProjectConfig.env !== EEnv.Prod) {
      locals.email = 'dev@eygle.fr';
      locals.bccmail = '';
    }

    template.render(locals, function (err, results) {
      if (err) {
         Logger.error('Email template rendering error: ', err);
        defer.reject(err);
      } else {
         if (ProjectConfig.env === EEnv.Dev || ProjectConfig.env === EEnv.Test) {
          transporter.use('stream', require('nodemailer-dkim').signer({
            domainName: 'eygle.fr',
            keySelector: 'key1',
             privateKey: fs.readFileSync(`${ProjectConfig.root}/server/misc/key1.eygle.fr.pem`)
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
  private _smtpConnect() {
     if (EEnv.Dev === ProjectConfig.env || EEnv.Test === ProjectConfig.env) {
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

export default new Emails();
