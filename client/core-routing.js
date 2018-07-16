"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("@angular/router");
const auth_service_1 = require("./services/auth.service");
const core_1 = require("@angular/core");
let EygleCoreRoutingModule = class EygleCoreRoutingModule {
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
     * Add check
     * @param {(url: string) => boolean} callback
     * @param {string} routeToRedirect
     */
    addCheck(callback, routeToRedirect) {
        this._checks.push({ func: callback, route: routeToRedirect });
    }
    /**
     * Perform all checks and redirects
     * @private
     * @param url
     * @return {boolean}
     */
    _performChecksNRedirects(url) {
        this.errorsRoutes = ['/errors/error-ie', '/errors/error-400', '/errors/error-500'];
        this.ignoreRoutes = ['/auth/forgot-password', '/auth/login', '/auth/register'];
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
        return !this.auth.isLogged() && !this._urlIn(this.ignoreRoutes, url);
    }
    /**
     * Should be redirected to home because user is already logged in
     * @param url
     * @return {boolean}
     * @private
     */
    _shouldNotSeeAuth(url) {
        return this.auth.isLogged() && this._urlIn(this.ignoreRoutes, url) &&
            !this._urlIn(this.errorsRoutes, url) && url !== '/auth/forgot-password';
    }
    /**
     * Should UserSchema be redirected to reset password view
     * @param url
     * @return {boolean}
     * @private
     */
    _shouldSeeResetPassword(url) {
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
    _urlIn(exclude, url) {
        exclude = exclude instanceof Array ? exclude : [exclude];
        return !!~exclude.indexOf(url);
    }
};
EygleCoreRoutingModule = __decorate([
    core_1.NgModule(),
    __metadata("design:paramtypes", [router_1.Router, auth_service_1.AuthService])
], EygleCoreRoutingModule);
exports.EygleCoreRoutingModule = EygleCoreRoutingModule;
//# sourceMappingURL=core-routing.module.js.map