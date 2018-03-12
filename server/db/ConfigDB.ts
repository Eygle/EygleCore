import * as q from 'q';
import {Permission} from "../models/Config";
import {EPermission, ERole} from "../../commons/core.enums";
import ADBModel from "./ADBModel";
import {configSchema} from "../schemas/config.schema";

export default class ConfigDB extends ADBModel {
    /**
     * Get list of permissions
     * @return {Promise<Array<Permission>>}
     */
    public static getPermissions(): Q.Promise<Array<Permission>> {
        const defer: any = q.defer();

        this._model.findOne({name: 'permissions'})
            .exec((err, permission: { data: Array<Permission> }) => {
                if (err) return defer.reject(err);
                defer.resolve(permission ? permission.data : this._fill());
            });

        return defer.promise;
    }

    /**
     * Fill permissions if empty
     * @returns {{}[]}
     * @private
     */
    private static _fill() {
        const permissions = [{
            name: EPermission.SeeHome,
            roles: [ERole.Guest, ERole.User]
        }, {
            name: EPermission.SeeLastAdded,
            roles: [ERole.User]
        }, {
            name: EPermission.SeeSoonToBeRemoved,
            roles: [ERole.User]
        }, {
            name: EPermission.SeeTVShows,
            roles: [ERole.User]
        }, {
            name: EPermission.EditTVShows,
            roles: [ERole.Contributor]
        }, {
            name: EPermission.DeleteTVShows,
            roles: [ERole.Admin]
        }, {
            name: EPermission.SeeMovies,
            roles: [ERole.User]
        }, {
            name: EPermission.EditMovies,
            roles: [ERole.Contributor]
        }, {
            name: EPermission.DeleteMovies,
            roles: [ERole.Admin]
        }, {
            name: EPermission.AddSubtitles,
            roles: [ERole.Contributor]
        }, {
            name: EPermission.RemoveSubtitles,
            roles: [ERole.Admin]
        }, {
            name: EPermission.SeeFiles,
            roles: [ERole.User]
        }, {
            name: EPermission.EditFiles,
            roles: [ERole.Admin]
        }, {
            name: EPermission.DeleteFiles,
            roles: [ERole.Admin]
        }, {
            name: EPermission.IdentifyMedia,
            roles: [ERole.Contributor]
        }, {
            name: EPermission.SeeAccount,
            roles: [ERole.Guest, ERole.User]
        }, {
            name: EPermission.EditAccount,
            roles: [ERole.Guest, ERole.User]
        }, {
            name: EPermission.SeeSettings,
            roles: [ERole.Guest, ERole.User]
        }, {
            name: EPermission.EditSettings,
            roles: [ERole.Guest, ERole.User]
        }, {
            name: EPermission.DeleteAccount,
            roles: [ERole.Admin]
        }, {
            name: EPermission.SeeAdminPanel,
            roles: [ERole.Admin]
        }, {
            name: EPermission.SeeMultipleResults,
            roles: [ERole.Admin]
        }, {
            name: EPermission.ManageMultipleResults,
            roles: [ERole.Admin]
        }, {
            name: EPermission.SeeUsers,
            roles: [ERole.Admin]
        }, {
            name: EPermission.EditUsers,
            roles: [ERole.Admin]
        }, {
            name: EPermission.SeeStats,
            roles: [ERole.Admin]
        }, {
            name: EPermission.ManageCron,
            roles: [ERole.Admin]
        }];

        this.add({
            name: 'permissions',
            data: permissions
        });

        return permissions;
    }
}

ConfigDB.init(configSchema);
module.exports.schema = ConfigDB; // Used by MongoDB models loader (need require)
