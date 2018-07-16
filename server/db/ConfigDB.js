"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var q = require("q");
var core_enums_1 = require("../../commons/core.enums");
var ADBModel_1 = require("./ADBModel");
var config_schema_1 = require("../schemas/config.schema");
var ConfigDB = (function (_super) {
    __extends(ConfigDB, _super);
    function ConfigDB() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Get list of permissions
     * @return {Promise<Array<Permission>>}
     */
    ConfigDB.getPermissions = function () {
        var _this = this;
        var defer = q.defer();
        this._model.findOne({ name: 'permissions' })
            .exec(function (err, permission) {
            if (err)
                return defer.reject(err);
            defer.resolve(permission ? permission.data : _this._fill());
        });
        return defer.promise;
    };
    /**
     * Fill permissions if empty
     * @returns {{}[]}
     * @private
     */
    ConfigDB._fill = function () {
        var permissions = [{
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
    };
    return ConfigDB;
}(ADBModel_1.default));
exports.default = ConfigDB;
ConfigDB.init(config_schema_1.configSchema);
module.exports.schema = ConfigDB; // Used by MongoDB models loader (need require)
//# sourceMappingURL=ConfigDB.js.map