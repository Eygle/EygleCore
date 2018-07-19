import ProjectConfig, {AProjectConfigClient} from '../../commons/utils/ProjectConfig';
import Utils from "../../commons/utils/Utils";

export class ClientConfig extends AProjectConfigClient {

    constructor() {
        super();
        const conf = require('../../../../commons/eygle-conf'); // load conf from node_module
        const env = require('../../../../client/environments/environment'); // load env
        ProjectConfig.initForClient(conf, Utils.getEnvNameFromEnv(env));

        /**
         * Load all ProjectConfig here
         */
        for (const key in ProjectConfig.client) {
            if (ProjectConfig.client.hasOwnProperty(key)) {
                this[key] = ProjectConfig.client[key];
            }
        }

    }
}

export default new ClientConfig();