import * as _ from 'underscore';
import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {IRouteItem} from "../../typings/route-item.interface";

@Component({
    selector: 'core-navigation',
    template: require('./navigation.component.html'),
    styles: [require('./navigation.component.scss')]
})
export class NavigationComponent implements OnInit {

    @Input() routes: IRouteItem[];

    navItems: [{ label?: string, items: [IRouteItem] }];

    constructor(private Auth: AuthService) {
    }

    ngOnInit() {
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

        for (const item of _.sortBy(this.routes, 'order') || []) {
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
