import { HttpClient } from '@angular/common/http';
import { ApiRoute } from '../utils/api-route';
import { AModel } from "../../commons/models/AModel";
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
    /**
     * Save item
     * @param {AModel} item
     */
    save<T>(item: AModel): any;
    /**
     * Save item
     * @param {AModel} item
     */
    add<T>(item: AModel): any;
}
