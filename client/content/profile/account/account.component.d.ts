import { ProfileService } from "../profile.service";
import { AuthService } from "../../../services/auth.service";
import { User } from "../../../../commons/models/User";
export declare class AccountComponent {
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
    /**
     * Update info
     */
    updateInfo(): void;
}
