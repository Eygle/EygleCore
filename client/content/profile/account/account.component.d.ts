import { AuthService } from "../../../services/auth.service";
import { User } from "../../../../commons/models/User";
export declare class AccountComponent {
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
    /**
     * Update info
     */
    updateInfo(): void;
}
