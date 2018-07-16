"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const operators_1 = require("rxjs/operators");
const of_1 = require("rxjs/observable/of");
class ApiRoute {
    constructor(http, route, options = {}) {
        this.http = http;
        this._endPoint = route;
        this.httpOptions = {};
        // headers: new HttpHeaders({'Content-Type': 'application/json;charset=UTF-8'}), responseType: 'application/json'}
        for (const m of ['get', 'put', 'delete', 'post']) {
            this.httpOptions[m] = options.hasOwnProperty(m) ? options[m] : undefined;
        }
    }
    /**
     * Send GET request
     * @param params
     * @returns {Observable<any>}
     */
    get(params = null) {
        return this._request('get', params);
    }
    /**
     * Send PUT request
     * @param params
     * @param body
     * @returns {Observable<any>}
     */
    put(params, body) {
        return this._request('put', params, body);
    }
    /**
     * Send DELETE request
     * @param params
     * @param body
     * @returns {Observable<any>}
     */
    delete(params, body) {
        return this._request('delete', params, body);
    }
    /**
     * Send POST request
     * @param params
     * @param body
     * @returns {Observable<any>}
     */
    post(params, body) {
        return this._request('post', params, body);
    }
    /**
     * Format url and replace all params
     *   ie:
     *      _endPoint = '/route/:parentId/:id'
     *      args      = {parentId: 'foo', id: 'bar'}
     *      result    = '/route/foo/bar'
     * @param args
     * @returns {string}
     * @private
     */
    formatUrl(args) {
        const parts = this._endPoint.split('/');
        const url = [];
        const params = [];
        if (!args) {
            args = {};
        }
        for (const p of parts) {
            const match = p.match(/:([a-zA-Z_]+)/);
            if (!match) {
                url.push(p);
            }
            else if (args[match[1]]) {
                url.push(args[match[1]]);
                delete args[match[1]];
            }
        }
        for (const key in args) {
            if (args.hasOwnProperty(key) && args[key] !== undefined && args[key] !== null) {
                params.push(key + '=' + args[key]);
            }
        }
        return url.join('/') + (params.length ? '?' + params.join('&') : '');
    }
    /**
     * Do http request
     * @param {string} method
     * @param args
     * @param body
     * @returns {any}
     * @private
     */
    _request(method, args = null, body = null) {
        const url = this.formatUrl(args);
        const request = method === 'get' ? this.http.get(url, this.httpOptions[method]) :
            this.http[method](url, body, this.httpOptions[method]);
        return request
            .map(res => {
            this._formatDates(res);
            return res;
        })
            .pipe(operators_1.catchError(this._handleError(method.toUpperCase(), url)));
    }
    /**
     * Handle error
     * @private
     */
    _handleError(method, url, result) {
        return (error) => {
            // TODO: send the error to remote logging infrastructure
            console.error(`[${method}] ${url}`, error); // log to console instead
            // // TODO: better job of transforming error for user consumption
            // this.log(`${url} failed: ${error.message}`);
            // Let the app keep running by returning an empty result.
            return of_1.of(result);
        };
    }
    /**
     * Transform string date in javascript Date objects
     * @param data
     * @private
     */
    _formatDates(data) {
        for (const idx in data) {
            if (data.hasOwnProperty(idx)) {
                if (typeof data[idx] === "object") {
                    this._formatDates(data[idx]);
                }
                else if (typeof data[idx] === "string") {
                    if (data[idx].match(/\d{4}\-\d{2}\-\d{2}T\d{2}:\d{2}:\d{2}.\d{1,3}Z/)) {
                        data[idx] = new Date(data[idx]);
                    }
                }
            }
        }
    }
}
exports.ApiRoute = ApiRoute;
//# sourceMappingURL=api-route.js.map