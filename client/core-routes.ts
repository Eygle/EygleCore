import {LoginComponent} from './content/auth/login/login.component';
import {RegisterComponent} from './content/auth/register/register.component';
import {EPermission} from '../commons/core.enums';
import {AccountComponent} from "./content/profile/account/account.component";
import {NotFoundComponent} from "./content/errors/not-found/not-found.component";
import ClientConfig from "./utils/ClientConfig";

const routes: IRouteItem[] = [
    <IRouteItem>{path: '**', component: NotFoundComponent}
];

console.log(ClientConfig);
if (ClientConfig.implementsAuth) {
    console.log("implement auth !");
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

    redirectTo?: string;

    translate?: string;
    icon?: string;
    category?: string;
    access?: EPermission;
    exactMatch?: boolean;
    url?: string;
}
