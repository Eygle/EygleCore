import { AuthService } from "../../services/auth.service";
import { IRouteItem } from "../../core-routes";
export declare class SidenavComponent {
    private Auth;
    routes: IRouteItem[];
    navItems: [{
        label?: string;
        items: [IRouteItem];
    }];
    constructor(Auth: AuthService);
    /**
     * Generate menu from routes list
     * @private
     */
    private _generateMenu();
}
