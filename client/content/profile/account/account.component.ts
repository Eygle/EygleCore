import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {User} from "../../../../commons/models/User";
import {ProfileService} from "../profile.service";

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

    constructor(private auth: AuthService, private profile: ProfileService) {
        this.user = this.auth.user;
        this.updateView = {info: false, password: false};
    }

    ngOnInit() {
    }

    /**
     * Update info
     */
    public updateInfo() {
        this.profile.save(this.user)
            .subscribe(() => {
                this.updateView.info = false;
            });
    }
}
