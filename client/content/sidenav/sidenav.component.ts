import * as _ from 'underscore';
import {Component, Input} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {IRouteItem} from "../../core-routes";

@Component({
    selector: 'ey-sidenav',
    template: require('./sidenav.component.html'),
    styles: [require('./sidenav.component.scss')]
})
export class SidenavComponent {

    @Input() routes: IRouteItem[];

    navItems: [{ label?: string, items: [IRouteItem] }];

    constructor(private Auth: AuthService) {
        console.log("Generate sidenav with routes", this.routes);
        this._generateMenu();
    }

    /**
     * Generate menu from routes list
     * @private
     */
    private _generateMenu() {
        this.navItems = [
            {
                label: undefined,
                items: <[IRouteItem]>[]
            }
        ];

        for (const item of this.routes || []) {
            if (item.icon && item.translate && this.Auth.authorize(item.access)) {
                item.url = `/${item.path}`;
                if (item.category) {
                    const cat = _.find(this.navItems, (it) => {
                        return it.label === item.category;
                    });

                    if (cat) {
                        cat.items.push(item);
                    } else {
                        this.navItems.push({
                            label: item.category,
                            items: [item]
                        });
                    }

                } else {
                    this.navItems[0].items.push(item);
                }
            }
        }
    }
}
