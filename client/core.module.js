"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var http_1 = require("@angular/common/http");
var ngx_cookie_service_1 = require("ngx-cookie-service");
var core_2 = require("@ngx-translate/core");
var material_module_1 = require("./material.module");
var flex_layout_1 = require("@angular/flex-layout");
var sidenav_component_1 = require("./content/sidenav/sidenav.component");
var login_component_1 = require("./content/auth/login/login.component");
var register_component_1 = require("./content/auth/register/register.component");
var config_service_1 = require("./services/config.service");
var auth_service_1 = require("./services/auth.service");
var router_1 = require("@angular/router");
var forms_1 = require("@angular/forms");
var platform_browser_1 = require("@angular/platform-browser");
var EygleCoreModule = (function () {
    function EygleCoreModule() {
    }
    EygleCoreModule = __decorate([
        core_1.NgModule({
            declarations: [
                sidenav_component_1.SidenavComponent,
                login_component_1.LoginComponent,
                register_component_1.RegisterComponent
            ],
            imports: [
                common_1.CommonModule,
                platform_browser_1.BrowserModule,
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
    return EygleCoreModule;
}());
exports.EygleCoreModule = EygleCoreModule;
//# sourceMappingURL=core.module.js.map