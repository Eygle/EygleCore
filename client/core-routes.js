"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const login_component_1 = require("./content/auth/login/login.component");
const register_component_1 = require("./content/auth/register/register.component");
exports.coreRoutes = [
    // Profile
    // {
    //   path: 'account',
    //   component: HomeComponent,
    //   translate: 'ACCOUNT.TITLE',
    //   icon: 'account_circle',
    //   access: EPermission.SeeAccount,
    //   category: 'PROFILE'
    // },
    // {
    //   path: 'settings',
    //   component: HomeComponent,
    //   translate: 'SETTINGS.TITLE',
    //   icon: 'settings',
    //   access: EPermission.SeeSettings,
    //   category: 'PROFILE'
    // },
    // Auth
    { path: 'auth/login', component: login_component_1.LoginComponent },
    { path: 'auth/register', component: register_component_1.RegisterComponent },
];
//# sourceMappingURL=core-routes.js.map