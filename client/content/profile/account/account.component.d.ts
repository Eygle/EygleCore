import { OnInit } from '@angular/core';
import { AuthService } from "../../../services/auth.service";
import { User } from "../../../../commons/models/User";
import { ProfileService } from "../profile.service";
export declare class AccountComponent implements OnInit {
    private auth;
    private profile;
    /**
     * Current logged user;
     */
    user: User;
    updateView: {
        info: boolean;
        password: boolean;
    };
    constructor(auth: AuthService, profile: ProfileService);
    ngOnInit(): void;
    /**
     * Update info
     */
    updateInfo(): void;
}
