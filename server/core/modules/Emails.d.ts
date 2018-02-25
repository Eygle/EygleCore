import { User } from '../../../commons/core/models/User';
export declare class Emails {
    private _siteURL;
    constructor();
    /**
     * TODO
     */
    sendWelcome(dest: User): void;
    /**
     * TODO
     */
    sendPasswordRecovery(dest: User): void;
    /**
     * TODO
     */
    sendLockedAccount(dest: User): void;
    /**
     * TODO
     */
    sendUnlockedAccount(dest: User): void;
    /**
     * Do send email with template
     * @param locals
     * @private
     */
    private _sendTemplateMail(locals);
    /**
     * Create SMTP connexion
     * @return {Transporter}
     * @private
     */
    private _smtpConnect();
}
declare const _default: Emails;
export default _default;
