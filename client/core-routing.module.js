"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("@angular/router");
class CoreRoutingModule {
    constructor(router, auth) {
        this.router = router;
        this.auth = auth;
        this._checks = [
            { func: this._shouldLogin, route: 'auth/login' },
            { func: this._shouldNotSeeAuth, route: '' },
            { func: this._shouldSeeResetPassword, route: 'auth/reset-password' }
        ];
        // Check if user need redirection on every navigation start
        this.router.events.subscribe((event) => {
            if (event instanceof router_1.NavigationEnd) {
                this._performChecksNRedirects(event.url);
            }
        });
    }
    /**
     * Perform all checks and redirects
     * @private
     * @param url
     * @return {boolean}
     */
    _performChecksNRedirects(url) {
        this._errorsRoutes = ['/errors/error-ie', '/errors/error-400', '/errors/error-500'];
        this._ignoreRoutes = ['/auth/forgot-password', '/auth/login', '/auth/register'];
        for (const check of this._checks) {
            if (check.func.apply(this, [url])) {
                if (check.hasOwnProperty('route')) {
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
    _shouldLogin(url) {
        return !this.auth.isLogged() && !this._urlIn(this._ignoreRoutes, url);
    }
    /**
     * Should be redirected to home because user is already logged in
     * @param url
     * @return {boolean}
     * @private
     */
    _shouldNotSeeAuth(url) {
        return this.auth.isLogged() && this._urlIn(this._ignoreRoutes, url) &&
            !this._urlIn(this._errorsRoutes, url) && url !== '/auth/forgot-password';
    }
    /**
     * Should UserSchema be redirected to reset password view
     * @param url
     * @return {boolean}
     * @private
     */
    _shouldSeeResetPassword(url) {
        this._ignoreRoutes.push('/auth/reset-password');
        return !this._urlIn(this._ignoreRoutes, url) && this.auth.user.changePassword;
    }
    /**
     * Is url in exclude list
     * @param exclude
     * @param {string} url
     * @return {number}
     * @private
     */
    _urlIn(exclude, url) {
        exclude = exclude instanceof Array ? exclude : [exclude];
        return !!~exclude.indexOf(url);
    }
}
exports.CoreRoutingModule = CoreRoutingModule;
//# sourceMappingURL=core-routing.module.js.map