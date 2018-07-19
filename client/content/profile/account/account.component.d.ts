import { OnInit } from '@angular/core';
import { AuthService } from "../../../services/auth.service";
import { User } from "../../../../commons/models/User";
export declare class AccountComponent implements OnInit {
    private auth;
    /**
     * Current logged user;
     */
    user: User;
    updateView: {
        info: boolean;
        password: boolean;
    };
    constructor(auth: AuthService);
    ngOnInit(): void;
    /**
     * Update info
     */
    updateInfo(): void;
}
