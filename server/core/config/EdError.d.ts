import { EHTTPStatus } from '../typings/server.enums';
export declare class EdError extends Error {
    /**
     * HTTP status code
     */
    status: number;
    /**
     * Constructor
     * @param httpStatus
     */
    constructor(httpStatus: EHTTPStatus);
}
export declare class CustomEdError extends EdError {
    /**
     * Constructor
     * @param message
     * @param code
     */
    constructor(message?: string, code?: number);
}
export default EdError;
