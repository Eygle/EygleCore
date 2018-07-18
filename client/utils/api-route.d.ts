import { HttpClient } from '@angular/common/http';
export declare class ApiRoute {
    private http;
    /**
     * Api route
     */
    private _endPoint;
    /**
     * List of options to use per request
     */
    private httpOptions;
    constructor(http: HttpClient, route: string, options?: any);
    /**
     * Send GET request
     * @param params
     * @returns {Observable<any>}
     */
    get<T>(params?: any): any;
    /**
     * Send PUT request
     * @param params
     * @param body
     * @returns {Observable<any>}
     */
    put<T>(params: any, body: any): any;
    /**
     * Send DELETE request
     * @param params
     * @param body
     * @returns {Observable<any>}
     */
    delete<T>(params: any, body: any): any;
    /**
     * Send POST request
     * @param params
     * @param body
     * @returns {Observable<any>}
     */
    post<T>(body: any, params?: any): any;
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
    formatUrl(args: any): string;
    /**
     * Do http request
     * @param {string} method
     * @param args
     * @param body
     * @returns {any}
     * @private
     */
    private _request<T>(method, args?, body?);
    /**
     * Handle error
     * @private
     */
    private _handleError<T>(method, url, result?);
    /**
     * Transform string date in javascript Date objects
     * @param data
     * @private
     */
    private _formatDates(data);
}
