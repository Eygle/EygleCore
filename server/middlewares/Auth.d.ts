export default class Auth {
    /**
     * Users login attempts failed
     */
    private static _attempts;
    /**
     * @return {(req:any, res:any, next:any)} Login middleware
     */
    static loginMiddleware(): (req: any, res: any, next: any) => void;
    /**
     * @return {(req:any, res:any, next:any)} Logout middleware
     */
    static logoutMiddleware(): (req: any, res: any) => any;
    /**
     * @return {(req:any, res:any, next:any)} Register middleware
     */
    static registerMiddleware(): (req: any, res: any, next: any) => void;
    /**
     * @return {(req:any, res:any, next:any)} Forgot password middleware
     */
    static forgotPasswordMiddleware(): (req: any, res: any, next: any) => void;
    /**
     * @return {(req:any, res:any, next:any)} Change password middleware
     */
    static changePasswordMiddleware(): (req: any, res: any, next: any) => any;
    /**
     * Anti login brute-force
     * This security will lock accounts after a certain amount of tries
     * @return {(req:any, res:any, next:any)} Login limit middleware
     */
    static loginLimitMiddleware(): (req: any, res: any, next: any) => any;
    /**
     * Anti login brute-force
     * This security will lock accounts after a certain amount of tries
     * @return {(req:any, res:any, next:any)} Login limit middleware
     */
    static unlockAccountMiddleware(): (req: any, res: any, next: any) => any;
    /**
     * Add SET-COOKIE to request response headers
     * @param res
     * @param user
     */
    static addUserCookie(res: any, user: any): void;
    /**
     * Generate user data used in clients
     * @param user
     * @return any
     * @private
     */
    private static _generateUserCookieData(user);
    /**
     * Add login failed attempt
     * @param user
     * @param req
     * @param res
     * @param next
     * @private
     */
    private static _addLoginFailedAttempt(user, req, res, next);
    /**
     * Clean attempts per username
     * @param username
     * @private
     */
    private static _cleanAttempts(username);
    /**
     * Add failed attempt to list
     * @param username
     * @private
     */
    private static _addAttempt(username);
    /**
     * Remove all expired attempts
     */
    private static _cleanExpiredAttempts(username);
}
