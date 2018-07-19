import {Injectable} from "@angular/core";
import {ApiService} from "./api.service";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class UserService extends ApiService {
    constructor(http: HttpClient) {
        super('/api/users/:id', http);
    }
}
