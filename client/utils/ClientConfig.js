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
var ClientConfig = (function (_super) {
    __extends(ClientConfig, _super);
    function ClientConfig() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Initialise environment
     * @param conf
     * @param isProd
     */
    ClientConfig.prototype.init = function (conf, isProd) {
        ProjectConfig_1.default.initForClient(conf, isProd ? 'production' : 'development');
        /**
         * Load all ProjectConfig here
         */
        for (var key in ProjectConfig_1.default.client) {
            if (ProjectConfig_1.default.client.hasOwnProperty(key)) {
                this[key] = ProjectConfig_1.default.client[key];
            }
        }
    };
    return ClientConfig;
}(ProjectConfig_1.AProjectConfigClient));
exports.ClientConfig = ClientConfig;
exports.default = new ClientConfig();
//# sourceMappingURL=ClientConfig.js.map