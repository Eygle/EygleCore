import { User } from '../../commons/models/User';
export default class Emails {
    private static _siteURL;
    /**
     * TODO
     */
    static sendWelcome(dest: User): void;
    /**
     * TODO
     */
    static sendPasswordRecovery(dest: User): void;
    /**
     * TODO
     */
    static sendLockedAccount(dest: User): void;
    /**
     * TODO
     */
    static sendUnlockedAccount(dest: User): void;
    /**
     * Do send email with template
     * @param locals
     * @private
     */
    private static _sendTemplateMail(locals);
    /**
     * Create SMTP connexion
     * @return {Transporter}
     * @private
     */
    private static _smtpConnect();
}
