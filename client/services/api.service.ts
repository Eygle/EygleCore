import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiRoute} from '../utils/api-route';
import {AModel} from "../../commons/models/AModel";

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

    /**
     * Save item
     * @param {AModel} item
     */
    public save<T>(item: AModel) {
        return this.api.put({id: item._id}, item);
    }

    /**
     * Save item
     * @param {AModel} item
     */
    public add<T>(item: AModel) {
        return this.api.post(item);
    }
}
