export default class EmailsUnsubscribe {
    /**
     * Express middleware getter
     */
    static getMiddleware(): (req: any, res: any, next: any) => void;
    /**
     * Express middleware getter
     */
    static getPostMiddleware(): (req: any, res: any, next: any) => void;
    /**
     * User getter
     * @param email
     * @param hash
     * @param success
     * @param error
     * @private
     */
    private static _checkUser(email, hash, success, error);
}
