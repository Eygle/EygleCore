import { AProjectConfigClient } from '../../commons/utils/ProjectConfig';
export declare class ClientConfig extends AProjectConfigClient {
    constructor();
    /**
     * Initialise environment
     * @param isProd
     */
    initEnv(isProd: any): void;
}
declare const _default: ClientConfig;
export default _default;
