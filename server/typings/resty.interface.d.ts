import { User } from "../../commons/models/User";
export interface IRestyContext {
    body: any;
    query: any;
    req: any;
    user: User;
}
export interface IRoutePermissions {
    'default'?: string;
    get?: string;
    postPut?: string;
    'delete'?: string;
}
export declare type RestyCallback = (data?: any) => void;
