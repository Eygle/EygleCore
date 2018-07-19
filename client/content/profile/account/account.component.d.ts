import { OnInit } from '@angular/core';
import { AuthService } from "../../../services/auth.service";
import { User } from "../../../../commons/models/User";
import { ConfigService } from "../../../services/config.service";
import { UserService } from "../../../services/user.service";
export declare class AccountComponent implements OnInit {
    private auth;
    private userService;
    private config;
    /**
     * Current logged user;
     */
    user: User;
    updateView: {
        info: boolean;
        password: boolean;
    };
    constructor(auth: AuthService, userService: UserService, config: ConfigService);
    ngOnInit(): void;
    /**
     * Update info
     */
    updateInfo(): void;
}
