import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { IRouteItem } from "./typings/route-item.interface";
export declare abstract class EygleCoreRoutingModule {
    private router;
    private auth;
    /**
     * Checks to perform
     */
    private readonly _checks;
    /**
     * Routes not to include in checks
     */
    protected ignoreRoutes: Array<String>;
    /**
     * List of errors routes (404, 500, ...)
     */
    protected errorsRoutes: Array<string>;
    constructor(router: Router, auth: AuthService);
    /**
     * Prepare routes by merging core routes with given routes
     * @param clientRoutes
     * @return {any}
     */
    static prepareRoutes(clientRoutes: any): IRouteItem[];
    /**
     * Add check
     * @param {(url: string) => boolean} callback
     * @param {string} routeToRedirect
     */
    addCheck(callback: (url: string) => boolean, routeToRedirect: string): void;
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
