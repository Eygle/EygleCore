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
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var operators_1 = require("rxjs/operators");
var of_1 = require("rxjs/observable/of");
var ngx_cookie_service_1 = require("ngx-cookie-service");
var router_1 = require("@angular/router");
var api_route_1 = require("../utils/api-route");
var core_environment_1 = require("../core-environment");
var core_enums_1 = require("../../commons/core.enums");
var httpOptions = {
    headers: new http_1.HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' }),
    responseType: 'text'
};
var AuthService = (function () {
    function AuthService(http, cookie, router) {
        var _this = this;
        this.http = http;
        this.cookie = cookie;
        this.router = router;
        this.user = this._getObjectFromCookie('ey-user', {});
        this._allPermissions = this._getObjectFromCookie('ey-permissions', []);
        this._permApi = new api_route_1.ApiRoute(this.http, '/api/permissions');
        if (!core_environment_1.coreEnvironment.production) {
            // If not in prod express is not used to serve the client and thus
            // the 'user' and 'permissions' cookies are not transmitted in the index.html page
            this._permApi.get()
                .subscribe(function (permissions) {
                _this._allPermissions = permissions;
                if (permissions) {
                    _this.cookie.set('ey-permissions', JSON.stringify(permissions), null, '/');
                }
                // The 'permissions' route return user as cookie in DEV mode
                _this.user = _this._getObjectFromCookie('ey-user', {});
            });
        }
    }
    /**
     * User is logged
     */
    AuthService.prototype.isLogged = function () {
        return !!this.user._id;
    };
    /**
     * User is guest
     */
    AuthService.prototype.isGuest = function () {
        return this.isLogged() && this.user.roles.length === 1 && this.user.roles[0] === core_enums_1.ERole.Guest;
    };
    /**
     * Does user has requested permission
     * @param accessLevel
     * @param {User} user
     * @return {boolean}
     */
    AuthService.prototype.authorize = function (accessLevel, user) {
        if (user === void 0) { user = null; }
        var memberRights = user && user.roles ? user.roles : this.user.roles || [core_enums_1.ERole.Guest];
        if (!!~memberRights.indexOf(core_enums_1.ERole.Admin)) {
            return true;
        }
        if (!this._allPermissions || !this._allPermissions.length) {
            return false;
        }
        for (var _i = 0, _a = this._allPermissions; _i < _a.length; _i++) {
            var perm = _a[_i];
            if (perm.name === accessLevel) {
                for (var _b = 0, memberRights_1 = memberRights; _b < memberRights_1.length; _b++) {
                    var m = memberRights_1[_b];
                    if (!!~perm.roles.indexOf(m)) {
                        return true;
                    }
                }
            }
        }
        return false;
    };
    /**
     * Log in action
     */
    AuthService.prototype.logIn = function (email, password) {
        var _this = this;
        return this.http.post('/login', {
            email: email,
            password: password
        }, httpOptions)
            .pipe(operators_1.tap(function () {
            _this.user = _this._getObjectFromCookie('ey-user', {});
            console.log(_this.user);
            _this.router.navigate(['']);
        }), operators_1.catchError(this._handleError('login')));
    };
    /**
     * Register action
     */
    AuthService.prototype.register = function (email, password, username, desc) {
        var _this = this;
        return this.http.post('/register', {
            email: email,
            username: username && username.length ? username : undefined,
            password: password,
            desc: desc
        }, httpOptions)
            .pipe(operators_1.tap(function () {
            _this.user = _this._getObjectFromCookie('ey-user', {});
            _this.router.navigate(['']);
        }), operators_1.catchError(this._handleError('login')));
    };
    /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    AuthService.prototype._handleError = function (operation, result) {
        if (operation === void 0) { operation = 'operation'; }
        return function (error) {
            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead
            // // TODO: better job of transforming error for user consumption
            // this.log(`${operation} failed: ${error.message}`);
            // Let the app keep running by returning an empty result.
            return of_1.of(result);
        };
    };
    /**
     * Get object from cookie
     * @param {string} key
     * @param defaultValue
     * @private
     */
    AuthService.prototype._getObjectFromCookie = function (key, defaultValue) {
        if (defaultValue === void 0) { defaultValue = null; }
        var json = this.cookie.get(key);
        return json ? JSON.parse(json) : defaultValue;
    };
    AuthService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.HttpClient, ngx_cookie_service_1.CookieService, router_1.Router])
    ], AuthService);
    return AuthService;
}());
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map