import { OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { IRouteItem } from "../../typings/route-item.interface";
export declare class NavigationComponent implements OnInit {
    private Auth;
    routes: IRouteItem[];
    navItems: [{
        label?: string;
        items: [IRouteItem];
    }];
    constructor(Auth: AuthService);
    ngOnInit(): void;
    /**
     * Generate menu from routes list
     * @private
     */
    private _generateMenu();
}
