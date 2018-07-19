"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("underscore");
var core_1 = require("@angular/core");
var auth_service_1 = require("../../services/auth.service");
var NavigationComponent = (function () {
    function NavigationComponent(Auth) {
        this.Auth = Auth;
    }
    NavigationComponent.prototype.ngOnInit = function () {
        this._generateMenu();
    };
    /**
     * Generate menu from routes list
     * @private
     */
    NavigationComponent.prototype._generateMenu = function () {
        this.navItems = [
            {
                label: undefined,
                items: []
            }
        ];
        var _loop_1 = function (item) {
            if (item.icon && item.translate && this_1.Auth.authorize(item.access)) {
                item.url = "/" + item.path;
                if (item.category) {
                    var cat = _.find(this_1.navItems, function (it) {
                        return it.label === item.category;
                    });
                    if (cat) {
                        cat.items.push(item);
                    }
                    else {
                        this_1.navItems.push({
                            label: item.category,
                            items: [item]
                        });
                    }
                }
                else {
                    this_1.navItems[0].items.push(item);
                }
            }
        };
        var this_1 = this;
        for (var _i = 0, _a = _.sortBy(this.routes, 'order') || []; _i < _a.length; _i++) {
            var item = _a[_i];
            _loop_1(item);
        }
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array)
    ], NavigationComponent.prototype, "routes", void 0);
    NavigationComponent = __decorate([
        core_1.Component({
            selector: 'core-navigation',
            template: require('./sidenav.component.html'),
            styles: [require('./sidenav.component.scss')]
        }),
        __metadata("design:paramtypes", [auth_service_1.AuthService])
    ], NavigationComponent);
    return NavigationComponent;
}());
exports.NavigationComponent = NavigationComponent;
//# sourceMappingURL=navigation.component.js.map