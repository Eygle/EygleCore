"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const q = require("q");
const core_enums_1 = require("../../commons/core.enums");
const ADBModel_1 = require("./ADBModel");
const config_schema_1 = require("../schemas/config.schema");
class ConfigDB extends ADBModel_1.default {
    /**
     * Get list of permissions
     * @return {Promise<Array<Permission>>}
     */
    static getPermissions() {
        const defer = q.defer();
        this._model.findOne({ name: 'permissions' })
            .exec((err, permission) => {
            if (err)
                return defer.reject(err);
            defer.resolve(permission ? permission.data : this._fill());
        });
        return defer.promise;
    }
    /**
     * Fill permissions if empty
     * @returns {{}[]}
     * @private
     */
    static _fill() {
        const permissions = [{
                name: core_enums_1.EPermission.SeeHome,
                roles: [core_enums_1.ERole.Guest, core_enums_1.ERole.User]
            }, {
                name: core_enums_1.EPermission.SeeLastAdded,
                roles: [core_enums_1.ERole.User]
            }, {
                name: core_enums_1.EPermission.SeeSoonToBeRemoved,
                roles: [core_enums_1.ERole.User]
            }, {
                name: core_enums_1.EPermission.SeeTVShows,
                roles: [core_enums_1.ERole.User]
            }, {
                name: core_enums_1.EPermission.EditTVShows,
                roles: [core_enums_1.ERole.Contributor]
            }, {
                name: core_enums_1.EPermission.DeleteTVShows,
                roles: [core_enums_1.ERole.Admin]
            }, {
                name: core_enums_1.EPermission.SeeMovies,
                roles: [core_enums_1.ERole.User]
            }, {
                name: core_enums_1.EPermission.EditMovies,
                roles: [core_enums_1.ERole.Contributor]
            }, {
                name: core_enums_1.EPermission.DeleteMovies,
                roles: [core_enums_1.ERole.Admin]
            }, {
                name: core_enums_1.EPermission.AddSubtitles,
                roles: [core_enums_1.ERole.Contributor]
            }, {
                name: core_enums_1.EPermission.RemoveSubtitles,
                roles: [core_enums_1.ERole.Admin]
            }, {
                name: core_enums_1.EPermission.SeeFiles,
                roles: [core_enums_1.ERole.User]
            }, {
                name: core_enums_1.EPermission.EditFiles,
                roles: [core_enums_1.ERole.Admin]
            }, {
                name: core_enums_1.EPermission.DeleteFiles,
                roles: [core_enums_1.ERole.Admin]
            }, {
                name: core_enums_1.EPermission.IdentifyMedia,
                roles: [core_enums_1.ERole.Contributor]
            }, {
                name: core_enums_1.EPermission.SeeAccount,
                roles: [core_enums_1.ERole.Guest, core_enums_1.ERole.User]
            }, {
                name: core_enums_1.EPermission.EditAccount,
                roles: [core_enums_1.ERole.Guest, core_enums_1.ERole.User]
            }, {
                name: core_enums_1.EPermission.SeeSettings,
                roles: [core_enums_1.ERole.Guest, core_enums_1.ERole.User]
            }, {
                name: core_enums_1.EPermission.EditSettings,
                roles: [core_enums_1.ERole.Guest, core_enums_1.ERole.User]
            }, {
                name: core_enums_1.EPermission.DeleteAccount,
                roles: [core_enums_1.ERole.Admin]
            }, {
                name: core_enums_1.EPermission.SeeAdminPanel,
                roles: [core_enums_1.ERole.Admin]
            }, {
                name: core_enums_1.EPermission.SeeMultipleResults,
                roles: [core_enums_1.ERole.Admin]
            }, {
                name: core_enums_1.EPermission.ManageMultipleResults,
                roles: [core_enums_1.ERole.Admin]
            }, {
                name: core_enums_1.EPermission.SeeUsers,
                roles: [core_enums_1.ERole.Admin]
            }, {
                name: core_enums_1.EPermission.EditUsers,
                roles: [core_enums_1.ERole.Admin]
            }, {
                name: core_enums_1.EPermission.SeeStats,
                roles: [core_enums_1.ERole.Admin]
            }, {
                name: core_enums_1.EPermission.ManageCron,
                roles: [core_enums_1.ERole.Admin]
            }];
        this.add({
            name: 'permissions',
            data: permissions
        });
        return permissions;
    }
}
exports.default = ConfigDB;
ConfigDB.init(config_schema_1.configSchema);
module.exports.schema = ConfigDB; // Used by MongoDB models loader (need require)
//# sourceMappingURL=ConfigDB.js.map