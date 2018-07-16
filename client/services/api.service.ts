import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiRoute} from '../utils/api-route';

@Injectable()
export abstract class ApiService {

    /**
     * ApiRoute instance
     */
    protected api: ApiRoute;

    constructor(route: string, http: HttpClient) {
        this.api = new ApiRoute(http, route);
    }

    /**
     * Get all movies
     * @return {Observable<T[]>}
     */
    public getAll<T>(limit: number = null) {
        return this.api.get<T[]>({limit: limit});
    }

    /**
     *
     * @param {string} id
     * @returns {Observable<T>}
     */
    public getById<T>(id: string) {
        return this.api.get<T>({id: id});
    }
}
