import { AuthService } from '../../../services/auth.service';
import { ConfigService } from '../../../services/config.service';
export declare class RegisterComponent {
    private config;
    private auth;
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
    constructor(config: ConfigService, auth: AuthService);
    /**
     * Register action
     */
    register(event: Event): void;
}
