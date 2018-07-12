"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ProjectConfig_1 = require("../commons/utils/ProjectConfig");
class EygleServer {
    /**
     * Initialize first (root)
     * @param {string} root
     * @param config
     * @return {any}
     */
    static init(root, config) {
        ProjectConfig_1.default.initForServer(root, config, process.env.NODE_ENV);
        const instance = require('./utils/EygleServer');
        return new instance();
    }
}
exports.EygleServer = EygleServer;
//# sourceMappingURL=EygleServer.js.map