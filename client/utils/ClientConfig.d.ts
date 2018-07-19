import { AProjectConfigClient } from '../../commons/utils/ProjectConfig';
import { EPermission } from "../../commons/core.enums";
export declare class ClientConfig extends AProjectConfigClient {
    constructor();
    /**
     * Prepare routes by merging core routes with given routes
     * @param clientRoutes
     * @return {any}
     */
    prepareRoutes(clientRoutes: any): IRouteItem[];
}
declare const _default: ClientConfig;
export default _default;
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
