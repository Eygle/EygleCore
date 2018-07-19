"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var login_component_1 = require("./content/auth/login/login.component");
var register_component_1 = require("./content/auth/register/register.component");
var core_enums_1 = require("../commons/core.enums");
var account_component_1 = require("./content/profile/account/account.component");
var not_found_component_1 = require("./content/errors/not-found/not-found.component");
var ClientConfig_1 = require("./utils/ClientConfig");
var routes = [
    { path: '**', component: not_found_component_1.NotFoundComponent }
];
console.log(ClientConfig_1.default.implementsAuth, ClientConfig_1.default);
if (ClientConfig_1.default.implementsAuth) {
    console.log("implement auth !");
    routes.push({
        path: 'account',
        component: account_component_1.AccountComponent,
        translate: 'ACCOUNT.TITLE',
        icon: 'account_circle',
        access: core_enums_1.EPermission.SeeAccount,
        category: 'PROFILE'
    });
    routes.push({ path: 'auth/login', component: login_component_1.LoginComponent });
    routes.push({ path: 'auth/register', component: register_component_1.RegisterComponent });
}
exports.eygleCoreRoutes = routes;
//# sourceMappingURL=core-routes.js.map