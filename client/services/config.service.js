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
const core_1 = require("@angular/core");
const BehaviorSubject_1 = require("rxjs/BehaviorSubject");
const router_1 = require("@angular/router");
let ConfigService = class ConfigService {
    constructor(router) {
        this.router = router;
        // Set the default settings
        this.defaultSettings = {
            layout: {
                navbar: true,
                navbarFolded: false,
                toolbar: true,
            },
            customScrollbars: true,
            routerAnimation: 'fadeIn' // fadeIn, slideUp, slideDown, slideRight, slideLeft, none
        };
        // Set the settings from the default settings
        this.settings = Object.assign({}, this.defaultSettings);
        // Reload the default settings on every navigation start
        router.events.subscribe((event) => {
            if (event instanceof router_1.NavigationStart) {
                this.setSettings({ layout: this.defaultSettings.layout });
            }
        });
        // Create the behavior subject
        this.onSettingsChanged = new BehaviorSubject_1.BehaviorSubject(this.settings);
    }
    /**
     * Sets settings
     * @param settings
     */
    setSettings(settings) {
        // Set the settings from the given object
        this.settings = Object.assign({}, this.settings, settings);
        // Trigger the event
        this.onSettingsChanged.next(this.settings);
    }
};
ConfigService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [router_1.Router])
], ConfigService);
exports.ConfigService = ConfigService;
//# sourceMappingURL=config.service.js.map