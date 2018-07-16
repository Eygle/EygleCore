import { HttpClient } from "@angular/common/http";
import { ApiRoute } from "../utils/api-route";
export declare abstract class ApiService {
    /**
     * ApiRoute instance
     */
    protected api: ApiRoute;
    constructor(route: string, http: HttpClient);
    /**
     * Get all movies
     * @return {Observable<T[]>}
     */
    getAll<T>(limit?: number): any;
    /**
     *
     * @param {string} id
     * @returns {Observable<T>}
     */
    getById<T>(id: string): any;
}
