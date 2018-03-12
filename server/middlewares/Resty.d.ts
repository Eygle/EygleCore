import { EPermission } from '../../commons/core.enums';
import { User } from '../../commons/models/User';
import { IRestyContext, IRoutePermissions } from '../typings/resty.interface';
export default class Resty {
    private static _resources;
    /**
     * Express middleware used for http connexions
     * @param resourceDir
     * @return {(req:any, res:any)=>undefined}
     */
    static httpMiddleware(resourceDir: any): Function;
    /**
     * Send response
     * @param res
     * @param response
     * @param code
     * @private
     */
    private static _send(res, response, code?);
    /**
     * Common to both middleware
     * This will return the arguments and the resource to use based on the given url and method
     * @param url
     * @param method
     * @param context
     * @return {{args: Array, resource: *, error: null}}
     */
    private static _middlewareCommon(url, method, context);
    /**
     * Read folder and return list of files
     * @param resourceDir
     * @param resources
     * @return {{}}
     * @private
     */
    private static _addResources(resourceDir, resources);
}
export declare class RoutePermissions implements IRoutePermissions {
    'default': string;
    get: string;
    post: string;
    put: string;
    'delete': string;
    constructor(def: string);
}
export declare abstract class ARoute implements IRestyContext {
    /**
     * Request [[User]]
     */
    user: User;
    /**
     * Request body data (post, put, delete)
     */
    body: any;
    /**
     * Request query params (after ? in url)
     */
    query: any;
    /**
     * Express request
     */
    req: any;
    /**
     * Route permissions
     */
    permissions: RoutePermissions;
    constructor(defaultPermission?: EPermission);
    /**
     * Get route permission setter
     * @param {EPermission} perm
     */
    setGetPermission(perm: EPermission): void;
    /**
     * Post/Put route permission setter
     * @param {EPermission} perm
     */
    setPostOrPutPermission(perm: EPermission): void;
    /**
     * Delete route permission setter
     * @param {EPermission} perm
     */
    setDeletePermission(perm: EPermission): void;
    /**
     * Set context
     * @param context
     */
    setContext(context: IRestyContext): void;
}
