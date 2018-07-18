import { Injectable } from '@angular/core';
import {ApiService} from "../../services/api.service";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class ProfileService extends ApiService {

  constructor(http: HttpClient) {
    super('/api/user', http)
  }
}
