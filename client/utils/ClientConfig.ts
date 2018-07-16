import ProjectConfig, {AProjectConfigClient} from '../../commons/utils/ProjectConfig';
import {EEnv} from '../../commons/core.enums';

export class ClientConfig extends AProjectConfigClient {
    constructor() {
        super();

        /**
         * Load all ProjectConfig here
         */
        for (const key in ProjectConfig.client) {
            if (ProjectConfig.client.hasOwnProperty(key)) {
                this[key] = ProjectConfig.client[key];
            }
        }
    }

    /**
     * Initialise environment
     * @param isProd
     */
    public initEnv(isProd) {
        this.env = isProd ? EEnv.Prod : EEnv.Dev;
    }
}

export default new ClientConfig();
