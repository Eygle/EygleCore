import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router } from '@angular/router';
export declare class ConfigService {
    private router;
    settings: any;
    defaultSettings: any;
    onSettingsChanged: BehaviorSubject<any>;
    constructor(router: Router);
    /**
     * Sets settings
     * @param settings
     */
    setSettings(settings: any): void;
}
