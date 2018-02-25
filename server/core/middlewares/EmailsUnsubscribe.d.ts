export declare class EmailsUnsubscribe {
    /**
     * Express middleware getter
     */
    getMiddleware(): (req: any, res: any, next: any) => void;
    /**
     * Express middleware getter
     */
    getPostMiddleware(): (req: any, res: any, next: any) => void;
    /**
     * User getter
     * @param email
     * @param hash
     * @param success
     * @param error
     * @private
     */
    private _checkUser(email, hash, success, error);
}
declare const _default: EmailsUnsubscribe;
export default _default;
