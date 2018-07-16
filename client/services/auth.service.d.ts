import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { User } from '../../commons/models/User';
export declare class AuthService {
    private http;
    private cookie;
    private router;
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
    private _permApi;
    constructor(http: HttpClient, cookie: CookieService, router: Router);
    /**
     * User is logged
     */
    isLogged(): boolean;
    /**
     * User is guest
     */
    isGuest(): boolean;
    /**
     * Does user has requested permission
     * @param accessLevel
     * @param {User} user
     * @return {boolean}
     */
    authorize(accessLevel: any, user?: User): boolean;
    /**
     * Log in action
     */
    logIn(email: string, password: string): Observable<User>;
    /**
     * Register action
     */
    register(email: string, password: string, username: string, desc: string): Observable<User>;
    /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    private _handleError<T>(operation?, result?);
    /**
     * Get object from cookie
     * @param {string} key
     * @param defaultValue
     * @private
     */
    private _getObjectFromCookie(key, defaultValue?);
}
