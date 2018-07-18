import { EPermission } from '../commons/core.enums';
export declare const eygleCoreRoutes: IRouteItem[];
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
