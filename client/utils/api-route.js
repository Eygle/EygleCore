"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var operators_1 = require("rxjs/operators");
var of_1 = require("rxjs/observable/of");
var ApiRoute = (function () {
    function ApiRoute(http, route, options) {
        if (options === void 0) { options = {}; }
        this.http = http;
        this._endPoint = route;
        this.httpOptions = {};
        // headers: new HttpHeaders({'Content-Type': 'application/json;charset=UTF-8'}), responseType: 'application/json'}
        for (var _i = 0, _a = ['get', 'put', 'delete', 'post']; _i < _a.length; _i++) {
            var m = _a[_i];
            this.httpOptions[m] = options.hasOwnProperty(m) ? options[m] : undefined;
        }
    }
    /**
     * Send GET request
     * @param params
     * @returns {Observable<any>}
     */
    ApiRoute.prototype.get = function (params) {
        if (params === void 0) { params = null; }
        return this._request('get', params);
    };
    /**
     * Send PUT request
     * @param params
     * @param body
     * @returns {Observable<any>}
     */
    ApiRoute.prototype.put = function (params, body) {
        return this._request('put', params, body);
    };
    /**
     * Send DELETE request
     * @param params
     * @param body
     * @returns {Observable<any>}
     */
    ApiRoute.prototype.delete = function (params, body) {
        return this._request('delete', params, body);
    };
    /**
     * Send POST request
     * @param params
     * @param body
     * @returns {Observable<any>}
     */
    ApiRoute.prototype.post = function (params, body) {
        return this._request('post', params, body);
    };
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
    ApiRoute.prototype.formatUrl = function (args) {
        var parts = this._endPoint.split('/');
        var url = [];
        var params = [];
        if (!args) {
            args = {};
        }
        for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
            var p = parts_1[_i];
            var match = p.match(/:([a-zA-Z_]+)/);
            if (!match) {
                url.push(p);
            }
            else if (args[match[1]]) {
                url.push(args[match[1]]);
                delete args[match[1]];
            }
        }
        for (var key in args) {
            if (args.hasOwnProperty(key) && args[key] !== undefined && args[key] !== null) {
                params.push(key + '=' + args[key]);
            }
        }
        return url.join('/') + (params.length ? '?' + params.join('&') : '');
    };
    /**
     * Do http request
     * @param {string} method
     * @param args
     * @param body
     * @returns {any}
     * @private
     */
    ApiRoute.prototype._request = function (method, args, body) {
        var _this = this;
        if (args === void 0) { args = null; }
        if (body === void 0) { body = null; }
        var url = this.formatUrl(args);
        var request = method === 'get' ? this.http.get(url, this.httpOptions[method]) :
            this.http[method](url, body, this.httpOptions[method]);
        return request
            .map(function (res) {
            _this._formatDates(res);
            return res;
        })
            .pipe(operators_1.catchError(this._handleError(method.toUpperCase(), url)));
    };
    /**
     * Handle error
     * @private
     */
    ApiRoute.prototype._handleError = function (method, url, result) {
        return function (error) {
            // TODO: send the error to remote logging infrastructure
            console.error("[" + method + "] " + url, error); // log to console instead
            // // TODO: better job of transforming error for user consumption
            // this.log(`${url} failed: ${error.message}`);
            // Let the app keep running by returning an empty result.
            return of_1.of(result);
        };
    };
    /**
     * Transform string date in javascript Date objects
     * @param data
     * @private
     */
    ApiRoute.prototype._formatDates = function (data) {
        for (var idx in data) {
            if (data.hasOwnProperty(idx)) {
                if (typeof data[idx] === 'object') {
                    this._formatDates(data[idx]);
                }
                else if (typeof data[idx] === 'string') {
                    if (data[idx].match(/\d{4}\-\d{2}\-\d{2}T\d{2}:\d{2}:\d{2}.\d{1,3}Z/)) {
                        data[idx] = new Date(data[idx]);
                    }
                }
            }
        }
    };
    return ApiRoute;
}());
exports.ApiRoute = ApiRoute;
//# sourceMappingURL=api-route.js.map