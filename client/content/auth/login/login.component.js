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
var core_1 = require("@angular/core");
var config_service_1 = require("../../../services/config.service");
var auth_service_1 = require("../../../services/auth.service");
var LoginComponent = (function () {
    function LoginComponent(config, auth) {
        this.config = config;
        this.auth = auth;
        this.config.setSettings({
            layout: {
                navbar: false,
                toolbar: false
            }
        });
    }
    /**
     * Login action
     */
    LoginComponent.prototype.logIn = function (event) {
        event.preventDefault();
        this.auth.logIn(this.email, this.password)
            .subscribe(function (user) {
            console.log(user);
        });
    };
    LoginComponent = __decorate([
        core_1.Component({
            selector: 'core-login',
            template: require('./login.component.html'),
            styles: [require('../auth-common.scss')]
        }),
        __metadata("design:paramtypes", [config_service_1.ConfigService, auth_service_1.AuthService])
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login.component.js.map