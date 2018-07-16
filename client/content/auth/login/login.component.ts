import {Component} from '@angular/core';
import {ConfigService} from '../../../services/config.service';
import {AuthService} from '../../../services/auth.service';
import {User} from '../../../../commons/models/User';

@Component({
  selector: 'ems-login',
  templateUrl: require('./login.component.html'),
  styleUrls: [require('../auth-common.scss')]
})
export class LoginComponent {
  /**
   * User name input
   */
  email: string;

  /**
   * Password input
   */
  password: string;

  constructor(private config: ConfigService, private auth: AuthService) {
    this.config.setSettings({
      layout: {
        navbar: false,
        toolbar: false
      }
    });
  }

  /**
   * Login action
   */
  public logIn(event: Event) {
    event.preventDefault();
    this.auth.logIn(this.email, this.password)
      .subscribe((user: User) => {
        console.log(user);
      });
  }
}
