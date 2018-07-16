"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const http_1 = require("@angular/common/http");
const api_route_1 = require("../utils/api-route");
let ApiService = class ApiService {
    constructor(route, http) {
        this.api = new api_route_1.ApiRoute(http, route);
    }
    /**
     * Get all movies
     * @return {Observable<T[]>}
     */
    getAll(limit = null) {
        return this.api.get({ limit: limit });
    }
    /**
     *
     * @param {string} id
     * @returns {Observable<T>}
     */
    getById(id) {
        return this.api.get({ id: id });
    }
};
ApiService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [String, http_1.HttpClient])
], ApiService);
exports.ApiService = ApiService;
//# sourceMappingURL=api.service.js.map