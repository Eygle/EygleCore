"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = require("@angular/router");
var EygleCoreRouting = (function () {
    function EygleCoreRouting(router, auth) {
        var _this = this;
        this.router = router;
        this.auth = auth;
        this._checks = [
            { func: this._shouldLogin, route: 'auth/login' },
            { func: this._shouldNotSeeAuth, route: '' },
            { func: this._shouldSeeResetPassword, route: 'auth/reset-password' }
        ];
        // Check if user need redirection on every navigation start
        this.router.events.subscribe(function (event) {
            if (event instanceof router_1.NavigationEnd) {
                _this._performChecksNRedirects(event.url);
            }
        });
    }
    /**
     * Add check
     * @param {(url: string) => boolean} callback
     * @param {string} routeToRedirect
     */
    EygleCoreRouting.prototype.addCheck = function (callback, routeToRedirect) {
        this._checks.push({ func: callback, route: routeToRedirect });
    };
    /**
     * Perform all checks and redirects
     * @private
     * @param url
     * @return {boolean}
     */
    EygleCoreRouting.prototype._performChecksNRedirects = function (url) {
        this.errorsRoutes = ['/errors/error-ie', '/errors/error-400', '/errors/error-500'];
        this.ignoreRoutes = ['/auth/forgot-password', '/auth/login', '/auth/register'];
        for (var _i = 0, _a = this._checks; _i < _a.length; _i++) {
            var check = _a[_i];
            if (check.func.apply(this, [url])) {
                if (check.hasOwnProperty('route')) {
                    console.info('Redirect to route', check.route);
                    this.router.navigateByUrl(check.route);
                }
                return;
            }
        }
    };
    /**
     * Should UserSchema be redirected to login view
     * @param url
     * @return {boolean}
     * @private
     */
    EygleCoreRouting.prototype._shouldLogin = function (url) {
        return !this.auth.isLogged() && !this._urlIn(this.ignoreRoutes, url);
    };
    /**
     * Should be redirected to home because user is already logged in
     * @param url
     * @return {boolean}
     * @private
     */
    EygleCoreRouting.prototype._shouldNotSeeAuth = function (url) {
        return this.auth.isLogged() && this._urlIn(this.ignoreRoutes, url) &&
            !this._urlIn(this.errorsRoutes, url) && url !== '/auth/forgot-password';
    };
    /**
     * Should UserSchema be redirected to reset password view
     * @param url
     * @return {boolean}
     * @private
     */
    EygleCoreRouting.prototype._shouldSeeResetPassword = function (url) {
        this.ignoreRoutes.push('/auth/reset-password');
        return !this._urlIn(this.ignoreRoutes, url) && this.auth.user.changePassword;
    };
    /**
     * Is url in exclude list
     * @param exclude
     * @param {string} url
     * @return {number}
     * @private
     */
    EygleCoreRouting.prototype._urlIn = function (exclude, url) {
        exclude = exclude instanceof Array ? exclude : [exclude];
        return !!~exclude.indexOf(url);
    };
    return EygleCoreRouting;
}());
exports.EygleCoreRouting = EygleCoreRouting;
//# sourceMappingURL=core-routing.js.map