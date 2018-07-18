import {LoginComponent} from './content/auth/login/login.component';
import {RegisterComponent} from './content/auth/register/register.component';
import {EPermission} from '../commons/core.enums';
import ServerConfig from "../server/utils/ServerConfig";
import {AccountComponent} from "./content/profile/account/account.component";
import {NotFoundComponent} from "./content/errors/not-found/not-found.component";

const routes: IRouteItem[] = [
    <IRouteItem>{path: 'error-404', name: 'NotFound', component: NotFoundComponent},
    <IRouteItem>{path: '/*path', redirectTo: ['NotFound']}
];

if (ServerConfig.implementsAuth) {
    routes.push({
        path: 'account',
        component: AccountComponent,
        translate: 'ACCOUNT.TITLE',
        icon: 'account_circle',
        access: EPermission.SeeAccount,
        category: 'PROFILE'
    });
    routes.push({path: 'auth/login', component: LoginComponent});
    routes.push({path: 'auth/register', component: RegisterComponent})
}

export const eygleCoreRoutes = routes;

export interface IRouteItem {
    path: string;
    name?: string;
    component: any;

    redirectTo?: any[];

    translate?: string;
    icon?: string;
    category?: string;
    access?: EPermission;
    exactMatch?: boolean;
    url?: string;
}
