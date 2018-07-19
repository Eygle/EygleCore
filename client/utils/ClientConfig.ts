import ProjectConfig, {AProjectConfigClient} from '../../commons/utils/ProjectConfig';
import Utils from "../../commons/utils/Utils";
import {AccountComponent} from "../content/profile/account/account.component";
import {RegisterComponent} from "../content/auth/register/register.component";
import {EPermission} from "../../commons/core.enums";
import {LoginComponent} from "../content/auth/login/login.component";
import {NotFoundComponent} from "../content/errors/not-found/not-found.component";

export class ClientConfig extends AProjectConfigClient {

    constructor() {
        super();
        const conf = require('../../../../commons/eygle-conf'); // load conf from node_module
        const env = require('../../../../client/environments/environment'); // load env
        ProjectConfig.initForClient(conf, Utils.getEnvNameFromEnv(env));

        /**
         * Load all ProjectConfig here
         */
        for (const key in ProjectConfig.client) {
            if (ProjectConfig.client.hasOwnProperty(key)) {
                this[key] = ProjectConfig.client[key];
            }
        }

    }

    /**
     * Prepare routes by merginf core routes with given routes
     * @param clientRoutes
     * @return {any}
     */
    public prepareRoutes(clientRoutes): IRouteItem[] {
        const routes = [];

        if (this.implementsAuth) {
            routes.push({
                path: 'account',
                component: AccountComponent,
                translate: 'ACCOUNT.TITLE',
                icon: 'account_circle',
                access: EPermission.SeeAccount,
                category: 'PROFILE',
                order: 100
            });
            routes.push({path: 'auth/login', component: LoginComponent});
            routes.push({path: 'auth/register', component: RegisterComponent})
        }

        routes.push({path: '**', component: NotFoundComponent}); // Must be last

        return clientRoutes.concat(routes);
    }
}

export default new ClientConfig();

export interface IRouteItem {
    path: string;
    name?: string;
    component: any;
    redirectTo?: string;

    order?: number;
    translate?: string;
    icon?: string;
    category?: string;
    access?: EPermission;
    exactMatch?: boolean;
    url?: string;
}
