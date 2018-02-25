import { User } from '../../commons/models/User';
export declare class Permissions {
    /**
     * Permission middleware
     */
    middleware(): Function;
    /**
     * Ensure [[User]] has accessRole access
     * @param user
     * @param accessRole
     * @return {boolean}
     */
    ensureAuthorized(user: User, accessRole: string): boolean;
}
declare const permission: Permissions;
export default permission;
