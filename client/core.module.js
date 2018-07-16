"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
const http_1 = require("@angular/common/http");
const ngx_cookie_service_1 = require("ngx-cookie-service");
const core_2 = require("@ngx-translate/core");
const material_module_1 = require("./material.module");
const flex_layout_1 = require("@angular/flex-layout");
const sidenav_component_1 = require("./content/sidenav/sidenav.component");
const login_component_1 = require("./content/auth/login/login.component");
const register_component_1 = require("./content/auth/register/register.component");
const config_service_1 = require("./services/config.service");
const auth_service_1 = require("./services/auth.service");
const router_1 = require("@angular/router");
const forms_1 = require("@angular/forms");
let EygleCoreModule = class EygleCoreModule {
};
EygleCoreModule = __decorate([
    core_1.NgModule({
        declarations: [
            sidenav_component_1.SidenavComponent,
            login_component_1.LoginComponent,
            register_component_1.RegisterComponent
        ],
        imports: [
            common_1.CommonModule,
            router_1.RouterModule,
            core_2.TranslateModule,
            material_module_1.MaterialModule,
            flex_layout_1.FlexLayoutModule,
            http_1.HttpClientModule,
            forms_1.FormsModule
        ],
        exports: [
            sidenav_component_1.SidenavComponent,
            common_1.CommonModule,
            router_1.RouterModule,
            core_2.TranslateModule,
            material_module_1.MaterialModule,
            flex_layout_1.FlexLayoutModule,
            forms_1.FormsModule
        ],
        providers: [
            ngx_cookie_service_1.CookieService,
            config_service_1.ConfigService,
            auth_service_1.AuthService
        ]
    })
], EygleCoreModule);
exports.EygleCoreModule = EygleCoreModule;
//# sourceMappingURL=core.module.js.map