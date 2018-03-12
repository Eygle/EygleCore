import { CustomRoute } from "../models/CustomRoute";
declare class Routes {
    static init(app: any, routes: [CustomRoute]): void;
    private static indexRedirect();
}
export default Routes;
