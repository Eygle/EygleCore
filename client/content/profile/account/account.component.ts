import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {User} from "../../../../commons/models/User";
import {ConfigService} from "../../../services/config.service";
import {UserService} from "../../../services/user.service";

@Component({
    selector: 'core-account',
    template: require('./account.component.html'),
    styles: [require('./account.component.scss')]
})
export class AccountComponent implements OnInit {

    /**
     * Current logged user;
     */
    public user: User;

    public updateView: {info: boolean, password: boolean};

    constructor(private auth: AuthService, private userService: UserService, private config: ConfigService) {
        this.config.setSettings({
            layout: {
                navbar: true,
                toolbar: false
            }
        });
        this.user = this.auth.user;
        this.updateView = {info: false, password: false};
    }

    ngOnInit() {
    }

    /**
     * Update info
     */
    public updateInfo() {
        this.userService.save(this.user)
            .subscribe(() => {
                this.updateView.info = false;
            });
    }
}
