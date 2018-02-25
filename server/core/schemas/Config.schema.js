"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const q = require("q");
const DB_1 = require("../modules/DB");
const ASchema_schema_1 = require("./ASchema.schema");
const core_enums_1 = require("../../../commons/core/core.enums");
const _schema = DB_1.default.createSchema({
    name: { type: String, required: true, unique: true },
    data: mongoose.Schema.Types.Mixed
}, false);
class ConfigSchema extends ASchema_schema_1.default {
    /**
     * Get list of permissions
     * @return {Promise<Array<Permission>>}
     */
    getPermissions() {
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
    _fill() {
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
    /**
     * Get FileSchema schema
     * @return {"mongoose".Schema}
     */
    getSchema() {
        return _schema;
    }
}
exports.ConfigSchema = ConfigSchema;
const instance = new ConfigSchema();
module.exports.schema = instance; // Used by DB models loader (need require)
exports.default = instance; // Used anywhere else
//# sourceMappingURL=Config.schema.js.map