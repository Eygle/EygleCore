import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
export declare class CoreRoutingModule {
    private router;
    private auth;
    /**
     * Checks to perform
     */
    private _checks;
    /**
     * Routes not to include in checks
     */
    private _ignoreRoutes;
    /**
     * List of errors routes (404, 500, ...)
     */
    private _errorsRoutes;
    constructor(router: Router, auth: AuthService);
    /**
     * Perform all checks and redirects
     * @private
     * @param url
     * @return {boolean}
     */
    private _performChecksNRedirects(url);
    /**
     * Should UserSchema be redirected to login view
     * @param url
     * @return {boolean}
     * @private
     */
    private _shouldLogin(url);
    /**
     * Should be redirected to home because user is already logged in
     * @param url
     * @return {boolean}
     * @private
     */
    private _shouldNotSeeAuth(url);
    /**
     * Should UserSchema be redirected to reset password view
     * @param url
     * @return {boolean}
     * @private
     */
    private _shouldSeeResetPassword(url);
    /**
     * Is url in exclude list
     * @param exclude
     * @param {string} url
     * @return {number}
     * @private
     */
    private _urlIn(exclude, url);
}
