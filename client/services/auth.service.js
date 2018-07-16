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
const core_1 = require("@angular/core");
const http_1 = require("@angular/common/http");
const operators_1 = require("rxjs/operators");
const of_1 = require("rxjs/observable/of");
const ngx_cookie_service_1 = require("ngx-cookie-service");
const router_1 = require("@angular/router");
const api_route_1 = require("../utils/api-route");
const environment_1 = require("../environment");
const core_enums_1 = require("../../commons/core.enums");
const httpOptions = {
    headers: new http_1.HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' }),
    responseType: 'text'
};
let AuthService = class AuthService {
    constructor(http, cookie, router) {
        this.http = http;
        this.cookie = cookie;
        this.router = router;
        this.user = this._getObjectFromCookie('ey-user', {});
        this._allPermissions = this._getObjectFromCookie('ey-permissions', []);
        this._permApi = new api_route_1.ApiRoute(this.http, '/api/permissions');
        if (!environment_1.environment.production) {
            // If not in prod express is not used to serve the client and thus
            // the 'user' and 'permissions' cookies are not transmitted in the index.html page
            this._permApi.get()
                .subscribe((permissions) => {
                this._allPermissions = permissions;
                if (permissions) {
                    this.cookie.set('ey-permissions', JSON.stringify(permissions), null, '/');
                }
                // The 'permissions' route return user as cookie in DEV mode
                this.user = this._getObjectFromCookie('ey-user', {});
            });
        }
    }
    /**
     * User is logged
     */
    isLogged() {
        return !!this.user._id;
    }
    /**
     * User is guest
     */
    isGuest() {
        return this.isLogged() && this.user.roles.length === 1 && this.user.roles[0] === core_enums_1.ERole.Guest;
    }
    /**
     * Does user has requested permission
     * @param accessLevel
     * @param {User} user
     * @return {boolean}
     */
    authorize(accessLevel, user = null) {
        const memberRights = user && user.roles ? user.roles : this.user.roles || [core_enums_1.ERole.Guest];
        if (!!~memberRights.indexOf(core_enums_1.ERole.Admin)) {
            return true;
        }
        if (!this._allPermissions || !this._allPermissions.length) {
            return false;
        }
        for (const perm of this._allPermissions) {
            if (perm.name === accessLevel) {
                for (const m of memberRights) {
                    if (!!~perm.roles.indexOf(m)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    /**
     * Log in action
     */
    logIn(email, password) {
        return this.http.post('/login', {
            email: email,
            password: password
        }, httpOptions)
            .pipe(operators_1.tap(() => {
            this.user = this._getObjectFromCookie('ey-user', {});
            console.log(this.user);
            this.router.navigate(['']);
        }), operators_1.catchError(this._handleError('login')));
    }
    /**
     * Register action
     */
    register(email, password, username, desc) {
        return this.http.post('/register', {
            email: email,
            username: username && username.length ? username : undefined,
            password: password,
            desc: desc
        }, httpOptions)
            .pipe(operators_1.tap(() => {
            this.user = this._getObjectFromCookie('ey-user', {});
            this.router.navigate(['']);
        }), operators_1.catchError(this._handleError('login')));
    }
    /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    _handleError(operation = 'operation', result) {
        return (error) => {
            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead
            // // TODO: better job of transforming error for user consumption
            // this.log(`${operation} failed: ${error.message}`);
            // Let the app keep running by returning an empty result.
            return of_1.of(result);
        };
    }
    /**
     * Get object from cookie
     * @param {string} key
     * @param defaultValue
     * @private
     */
    _getObjectFromCookie(key, defaultValue = null) {
        const json = this.cookie.get(key);
        return json ? JSON.parse(json) : defaultValue;
    }
};
AuthService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.HttpClient, ngx_cookie_service_1.CookieService, router_1.Router])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map