import {Component} from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {ConfigService} from '../../../services/config.service';

@Component({
  selector: 'ems-register',
  templateUrl: require('./register.component.html'),
  styleUrls: [require('../auth-common.scss')]
})
export class RegisterComponent {
  /**
   * User name input
   */
  username: string;

  /**
   * User name input
   */
  email: string;

  /**
   * Password input
   */
  password: string;

  /**
   * Description
   */
  desc: string;

  constructor(private config: ConfigService, private auth: AuthService) {
    this.config.setSettings({
      layout: {
        navbar: false,
        toolbar: false
      }
    });
  }

  /**
   * Register action
   */
  public register(event: Event) {
    event.preventDefault();
    this.auth.register(this.email, this.password, this.username, this.desc);
  }
}
