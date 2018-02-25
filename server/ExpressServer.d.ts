import { CustomRoute } from "./models/CustomRoute";
export declare class ExpressServer {
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
    constructor();
    /**
     * Start node Express server
     */
    start(): void;
    /**
     * Add custom routes
     * @param {[Route]} routes
     */
    setRoutes(routes: [CustomRoute]): this;
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
