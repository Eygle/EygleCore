import { User } from '../../commons/models/User';
export default class Permissions {
    /**
     * Permission middleware
     */
    static middleware(): Function;
    /**
     * Ensure [[User]] has accessRole access
     * @param user
     * @param accessRole
     * @return {boolean}
     */
    static ensureAuthorized(user: User, accessRole: string): boolean;
}
