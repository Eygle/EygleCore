import ProjectConfig from "../commons/utils/ProjectConfig";

export class EygleServer {

    /**
     * Initialize first (root)
     * @param {string} root
     * @param config
     * @return {any}
     */
    public static init(root: string, config: any) {
        ProjectConfig.initForServer(root, config, process.env.NODE_ENV);
        const instance = require('./utils/EygleServer');
        return new instance();
    }
}