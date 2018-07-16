"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var server_enums_1 = require("../typings/server.enums");
var EdError = (function (_super) {
    __extends(EdError, _super);
    /**
     * Constructor
     * @param httpStatus
     */
    function EdError(httpStatus) {
        var _this = this;
        switch (httpStatus) {
            case server_enums_1.EHTTPStatus.BadRequest:
                _this = _super.call(this, 'Bad Request') || this;
                break;
            case server_enums_1.EHTTPStatus.Forbidden:
                _this = _super.call(this, 'Permission Denied') || this;
                break;
            case server_enums_1.EHTTPStatus.NotFound:
                _this = _super.call(this, 'Not Found') || this;
                break;
            case server_enums_1.EHTTPStatus.InternalServerError:
                _this = _super.call(this, 'Internal Server Error') || this;
                break;
        }
        _this.status = httpStatus;
        return _this;
    }
    return EdError;
}(Error));
exports.EdError = EdError;
var CustomEdError = (function (_super) {
    __extends(CustomEdError, _super);
    /**
     * Constructor
     * @param message
     * @param code
     */
    function CustomEdError(message, code) {
        if (message === void 0) { message = null; }
        if (code === void 0) { code = 500; }
        var _this = _super.call(this, code) || this;
        if (message) {
            _this.message = message;
        }
        return _this;
    }
    return CustomEdError;
}(EdError));
exports.CustomEdError = CustomEdError;
exports.default = EdError;
//# sourceMappingURL=EdError.js.map