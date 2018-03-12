export interface ICustomRoute {
    path: string;
    method: string;
    middleware: any[];
}
export interface ICustomModule {
    init(app: any): any;
    name: string;
}
