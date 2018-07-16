import {NavigationEnd, Router, RouterEvent} from '@angular/router';
import {AuthService} from './services/auth.service';
import {NgModule} from "@angular/core";

@NgModule()
export class EygleCoreRoutingModule {
    /**
     * Checks to perform
     */
    private readonly _checks: Array<{ func: (url: string) => boolean, route: string }>;

    /**
     * Routes not to include in checks
     */
    protected ignoreRoutes: Array<String>;

    /**
     * List of errors routes (404, 500, ...)
     */
    protected errorsRoutes: Array<string>;

    constructor(private router: Router, private auth: AuthService) {
        this._checks = [
            {func: this._shouldLogin, route: 'auth/login'},
            {func: this._shouldNotSeeAuth, route: ''},
            {func: this._shouldSeeResetPassword, route: 'auth/reset-password'}
        ];

        // Check if user need redirection on every navigation start
        this.router.events.subscribe(
            (event: RouterEvent) => {
                if (event instanceof NavigationEnd) {
                    this._performChecksNRedirects(event.url);
                }
            }
        );
    }

    /**
     * Add check
     * @param {(url: string) => boolean} callback
     * @param {string} routeToRedirect
     */
    public addCheck(callback: (url: string) => boolean, routeToRedirect: string) {
        this._checks.push({func: callback, route: routeToRedirect});
    }

    /**
     * Perform all checks and redirects
     * @private
     * @param url
     * @return {boolean}
     */
    private _performChecksNRedirects(url: string): void {
        this.errorsRoutes = ['/errors/error-ie', '/errors/error-400', '/errors/error-500'];
        this.ignoreRoutes = ['/auth/forgot-password', '/auth/login', '/auth/register'];

        for (const check of this._checks) {
            if (check.func.apply(this, [url])) {
                if (check.hasOwnProperty('route')) { // Redirect to url
                    console.info('Redirect to route', check.route);
                    this.router.navigateByUrl(check.route);
                }
                return;
            }
        }
    }

    /**
     * Should UserSchema be redirected to login view
     * @param url
     * @return {boolean}
     * @private
     */
    private _shouldLogin(url) {
        return !this.auth.isLogged() && !this._urlIn(this.ignoreRoutes, url);
    }

    /**
     * Should be redirected to home because user is already logged in
     * @param url
     * @return {boolean}
     * @private
     */
    private _shouldNotSeeAuth(url) {
        return this.auth.isLogged() && this._urlIn(this.ignoreRoutes, url) &&
            !this._urlIn(this.errorsRoutes, url) && url !== '/auth/forgot-password';
    }

    /**
     * Should UserSchema be redirected to reset password view
     * @param url
     * @return {boolean}
     * @private
     */
    private _shouldSeeResetPassword(url) {
        this.ignoreRoutes.push('/auth/reset-password');
        return !this._urlIn(this.ignoreRoutes, url) && this.auth.user.changePassword;
    }

    /**
     * Is url in exclude list
     * @param exclude
     * @param {string} url
     * @return {number}
     * @private
     */
    private _urlIn(exclude: any, url: string) {
        exclude = exclude instanceof Array ? exclude : [exclude];
        return !!~exclude.indexOf(url);
    }
}
