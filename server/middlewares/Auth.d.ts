export declare class Auth {
    /**
     * Users login attempts failed
     */
    private _attempts;
    constructor();
    /**
     * @return {(req:any, res:any, next:any)} Login middleware
     */
    loginMiddleware(): (req: any, res: any, next: any) => void;
    /**
     * @return {(req:any, res:any, next:any)} Logout middleware
     */
    logoutMiddleware(): (req: any, res: any) => any;
    /**
     * @return {(req:any, res:any, next:any)} Register middleware
     */
    registerMiddleware(): (req: any, res: any, next: any) => void;
    /**
     * @return {(req:any, res:any, next:any)} Forgot password middleware
     */
    forgotPasswordMiddleware(): (req: any, res: any, next: any) => void;
    /**
     * @return {(req:any, res:any, next:any)} Change password middleware
     */
    changePasswordMiddleware(): (req: any, res: any, next: any) => any;
    /**
     * Anti login brute-force
     * This security will lock accounts after a certain amount of tries
     * @return {(req:any, res:any, next:any)} Login limit middleware
     */
    loginLimitMiddleware(): (req: any, res: any, next: any) => any;
    /**
     * Anti login brute-force
     * This security will lock accounts after a certain amount of tries
     * @return {(req:any, res:any, next:any)} Login limit middleware
     */
    unlockAccountMiddleware(): (req: any, res: any, next: any) => any;
    /**
     * Add SET-COOKIE to request response headers
     * @param res
     * @param user
     */
    addUserCookie(res: any, user: any): void;
    /**
     * Generate user data used in clients
     * @param user
     * @return any
     * @private
     */
    private _generateUserCookieData(user);
    /**
     * Add login failed attempt
     * @param user
     * @param req
     * @param res
     * @param next
     * @private
     */
    private _addLoginFailedAttempt(user, req, res, next);
    /**
     * Clean attempts per username
     * @param username
     * @private
     */
    private _cleanAttempts(username);
    /**
     * Add failed attempt to list
     * @param username
     * @private
     */
    private _addAttempt(username);
    /**
     * Remove all expired attempts
     */
    private _cleanExpiredAttempts(username);
}
declare const _default: Auth;
export default _default;
