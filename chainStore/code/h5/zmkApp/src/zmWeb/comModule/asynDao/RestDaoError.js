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
var BaseError = (function () {
    function BaseError() {
        Error.apply(this, arguments);
    }
    return BaseError;
}());
BaseError.prototype = new Error();
var RestDaoError = (function (_super) {
    __extends(RestDaoError, _super);
    function RestDaoError(code, tips, oriError) {
        var _this = _super.call(this) || this;
        _this.code = code;
        _this.tips = tips;
        _this.oriError = oriError;
        return _this;
    }
    return RestDaoError;
}(BaseError));
exports.RestDaoError = RestDaoError;
