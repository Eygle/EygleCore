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
var ProjectConfig_1 = require("../../commons/utils/ProjectConfig");
var ProjectConfig_2 = require("../../commons/utils/ProjectConfig");
var core_enums_1 = require("../../commons/core.enums");
var ClientConfig = (function (_super) {
    __extends(ClientConfig, _super);
    function ClientConfig() {
        var _this = _super.call(this) || this;
        /**
         * Load all ProjectConfig here
         */
        for (var key in ProjectConfig_2.default.client) {
            if (ProjectConfig_2.default.client.hasOwnProperty(key)) {
                _this[key] = ProjectConfig_2.default.client[key];
            }
        }
        return _this;
    }
    /**
     * Initialise environment
     * @param isProd
     */
    ClientConfig.prototype.initEnv = function (isProd) {
        this.env = isProd ? core_enums_1.EEnv.Prod : core_enums_1.EEnv.Dev;
    };
    return ClientConfig;
}(ProjectConfig_1.AProjectConfigClient));
exports.ClientConfig = ClientConfig;
exports.default = new ClientConfig();
//# sourceMappingURL=ClientConfig.js.map