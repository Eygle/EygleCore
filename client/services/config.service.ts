import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {NavigationStart, Router} from '@angular/router';

@Injectable()
export class ConfigService {
  settings: any;
  defaultSettings: any;
  onSettingsChanged: BehaviorSubject<any>;

  constructor(private router: Router) {
    // Set the default settings
    this.defaultSettings = {
      layout: {
        navbar: true, // true, false
        navbarFolded: false, // true, false
        toolbar: true, // true, false
      },
      customScrollbars: true,
      routerAnimation: 'fadeIn' // fadeIn, slideUp, slideDown, slideRight, slideLeft, none
    };

    // Set the settings from the default settings
    this.settings = Object.assign({}, this.defaultSettings);

    // Reload the default settings on every navigation start
    router.events.subscribe(
      (event) => {
        if (event instanceof NavigationStart) {
          this.setSettings({layout: this.defaultSettings.layout});
        }
      }
    );

    // Create the behavior subject
    this.onSettingsChanged = new BehaviorSubject(this.settings);
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
}
