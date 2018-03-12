import { ICustomRoute } from "../typings/customs.interface";
declare class Routes {
    static init(app: any, routes: ICustomRoute[]): void;
    private static indexRedirect();
}
export default Routes;
