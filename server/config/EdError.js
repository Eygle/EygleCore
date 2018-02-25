"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_enums_1 = require("../typings/server.enums");
class EdError extends Error {
    /**
     * Constructor
     * @param httpStatus
     */
    constructor(httpStatus) {
        switch (httpStatus) {
            case server_enums_1.EHTTPStatus.BadRequest:
                super('Bad Request');
                break;
            case server_enums_1.EHTTPStatus.Forbidden:
                super('Permission Denied');
                break;
            case server_enums_1.EHTTPStatus.NotFound:
                super('Not Found');
                break;
            case server_enums_1.EHTTPStatus.InternalServerError:
                super('Internal Server Error');
                break;
        }
        this.status = httpStatus;
    }
}
exports.EdError = EdError;
class CustomEdError extends EdError {
    /**
     * Constructor
     * @param message
     * @param code
     */
    constructor(message = null, code = 500) {
        super(code);
        if (message) {
            this.message = message;
        }
    }
}
exports.CustomEdError = CustomEdError;
exports.default = EdError;
//# sourceMappingURL=EdError.js.map