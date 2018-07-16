import { ConfigService } from '../../../services/config.service';
import { AuthService } from '../../../services/auth.service';
export declare class LoginComponent {
    private config;
    private auth;
    /**
     * User name input
     */
    email: string;
    /**
     * Password input
     */
    password: string;
    constructor(config: ConfigService, auth: AuthService);
    /**
     * Login action
     */
    logIn(event: Event): void;
}
