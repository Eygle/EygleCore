import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router } from '@angular/router';
export declare class ConfigService {
    private router;
    settings: IConfigSettings;
    defaultSettings: IConfigSettings;
    onSettingsChanged: BehaviorSubject<any>;
    constructor(router: Router);
    /**
     * Sets settings
     * @param settings
     */
    setSettings(settings: IConfigSettings): void;
}
export interface IConfigSettings {
    layout: {
        navbar?: boolean;
        navbarFolded?: boolean;
        toolbar?: boolean;
    };
    routerAnimation?: string;
}
