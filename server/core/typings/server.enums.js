"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EEnv;
(function (EEnv) {
    EEnv[EEnv["Prod"] = 0] = "Prod";
    EEnv[EEnv["Preprod"] = 1] = "Preprod";
    EEnv[EEnv["Dev"] = 2] = "Dev";
    EEnv[EEnv["Test"] = 3] = "Test";
})(EEnv = exports.EEnv || (exports.EEnv = {}));
var EHTTPStatus;
(function (EHTTPStatus) {
    EHTTPStatus[EHTTPStatus["BadRequest"] = 400] = "BadRequest";
    EHTTPStatus[EHTTPStatus["Forbidden"] = 403] = "Forbidden";
    EHTTPStatus[EHTTPStatus["NotFound"] = 404] = "NotFound";
    EHTTPStatus[EHTTPStatus["InternalServerError"] = 500] = "InternalServerError";
})(EHTTPStatus = exports.EHTTPStatus || (exports.EHTTPStatus = {}));
//# sourceMappingURL=server.enums.js.map