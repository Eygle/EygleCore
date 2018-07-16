import {ICustomModule, ICustomRoute} from './typings/customs.interface';

/**
 * Entry point
 * WARNING: the ProjectConfig MUST be initialized before even importing this file!
 */
export declare class EygleServer {
    /**
     * Express application instance
     */
    private _app;
    /**
     * HTTP server
     */
    private _http;
    /**
     * Mongo store instance
     */
    private _mongoStore;
    /**
     * List of custom routes
     */
    private _customRoutes;
    /**
     * List of custom modules
     */
    private _customModules;
    /**
     * Constructor
     */
    constructor();
    /**
     * Start node Express server
     */
    start(): void;
    /**
     * Add custom routes
     * @param route
     */
    addRoute(route: ICustomRoute): this;
    /**
     * Add custom routes
     * @param {ICustomModule} module
     */
    addModule(module: ICustomModule): this;
    /**
     * Initialize server
     * @private
     */
    private _init();
    /**
     * Handle error
     * @param app
     */
    private _handleErrors(app);
    /**
     * Init CSRF token checker
     * @param app
     * @private
     */
    private _initCSRF(app);
    /**
     * Print header in logs
     * @private
     */
    private _printHeader();
}
