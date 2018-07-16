import ProjectConfig, {AProjectConfigClient} from '../../commons/utils/ProjectConfig';

export class ClientConfig extends AProjectConfigClient {

    /**
     * Initialise environment
     * @param conf
     * @param isProd
     */
    public init(conf: any, isProd: boolean) {
        ProjectConfig.initForClient(conf, isProd ? 'production' : 'development');

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
