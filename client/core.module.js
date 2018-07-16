"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const http_1 = require("@angular/common/http");
const ngx_cookie_service_1 = require("ngx-cookie-service");
const sidenav_component_1 = require("./content/sidenav/sidenav.component");
const login_component_1 = require("./content/auth/login/login.component");
const register_component_1 = require("./content/auth/register/register.component");
const config_service_1 = require("./services/config.service");
let AppModule = class AppModule {
};
AppModule = __decorate([
    core_1.NgModule({
        declarations: [
            sidenav_component_1.SidenavComponent,
            login_component_1.LoginComponent,
            register_component_1.RegisterComponent
        ],
        imports: [
            http_1.HttpClientModule
        ],
        entryComponents: [],
        providers: [
            config_service_1.ConfigService,
            ngx_cookie_service_1.CookieService
        ]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=core.module.js.map