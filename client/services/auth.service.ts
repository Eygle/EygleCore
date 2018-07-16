import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

import {catchError, tap} from 'rxjs/operators';
import {of} from 'rxjs/observable/of';
import {CookieService} from 'ngx-cookie-service';
import {Router} from '@angular/router';
import {User} from '../../commons/models/User';
import {ApiRoute} from '../utils/api-route';
import {coreEnvironment} from '../core-environment';
import {ERole} from '../../commons/core.enums';

const httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json;charset=UTF-8'}),
    responseType: 'text'
};

@Injectable()
export class AuthService {

    /**
     * Current logged user
     */
    user: User;

    /**
     * List of permissions
     */
    permissions: [any];

    /**
     * Permissions API
     */
    private _permApi: ApiRoute;

    constructor(private http: HttpClient, private cookie: CookieService, private router: Router) {
        this.user = this._getObjectFromCookie('ey-user', {});
        this.permissions = this._getObjectFromCookie('ey-permissions', []);
        this._permApi = new ApiRoute(this.http, '/api/permissions');

        if (!coreEnvironment.production) {
            // If not in prod express is not used to serve the client and thus
            // the 'user' and 'permissions' cookies are not transmitted in the index.html page
            this._permApi.get()
                .subscribe((permissions: [any]) => {
                    this.permissions = permissions;
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
    public isLogged(): boolean {
        return !!this.user._id;
    }

    /**
     * User is guest
     */
    public isGuest(): boolean {
        return this.isLogged() && this.user.roles.length === 1 && this.user.roles[0] === ERole.Guest;
    }

    /**
     * Does user has requested permission
     * @param accessLevel
     * @param {User} user
     * @return {boolean}
     */
    public authorize(accessLevel, user: User = null) {
        const memberRights = user && user.roles ? user.roles : this.user.roles || [ERole.Guest];

        if (!!~memberRights.indexOf(ERole.Admin)) {
            return true;
        }
        if (!this.permissions || !this.permissions.length) {
            return false;
        }

        for (const perm of this.permissions) {
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
    public logIn(email: string, password: string): Observable<User> {
        return this.http.post<User>('/login', {
            email: email,
            password: password
        }, <{}>httpOptions)
            .pipe(
                tap(() => {
                    this.user = this._getObjectFromCookie('ey-user', {});
                    console.log(this.user);
                    this.router.navigate(['']);
                }),
                catchError(this._handleError<User>('login'))
            );
    }

    /**
     * Register action
     */
    public register(email: string, password: string, username: string, desc: string): Observable<User> {
        return this.http.post<User>('/register', {
            email: email,
            username: username && username.length ? username : undefined,
            password: password,
            desc: desc
        }, <{}>httpOptions)
            .pipe(
                tap(() => {
                    this.user = this._getObjectFromCookie('ey-user', {});
                    this.router.navigate(['']);
                }),
                catchError(this._handleError<User>('login'))
            );
    }

    /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    private _handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead

            // // TODO: better job of transforming error for user consumption
            // this.log(`${operation} failed: ${error.message}`);

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }

    /**
     * Get object from cookie
     * @param {string} key
     * @param defaultValue
     * @private
     */
    private _getObjectFromCookie(key: string, defaultValue: any = null) {
        const json = this.cookie.get(key);

        return json ? JSON.parse(json) : defaultValue;
    }
}
