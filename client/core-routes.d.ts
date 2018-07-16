import { EPermission } from '../commons/core.enums';
export declare const coreRoutes: [IRouteItem];
export interface IRouteItem {
    path: string;
    component: any;
    translate?: string;
    icon?: string;
    category?: string;
    access?: EPermission;
    exactMatch?: boolean;
    url?: string;
}
