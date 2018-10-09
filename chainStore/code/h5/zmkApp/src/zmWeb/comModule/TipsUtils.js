"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AppUtils_1 = require("./AppUtils");
var MgrPool_1 = require("./MgrPool");
var TipsUtils = (function () {
    function TipsUtils() {
    }
    TipsUtils.getInstance = function () {
        return MgrPool_1.MgrPool.getInstance().get(TipsUtils);
    };
    TipsUtils.prototype.update = function (restResp) {
        if (restResp && restResp.tips) {
            this.lastTips = restResp.tips;
        }
    };
    TipsUtils.prototype.showTips = function () {
        if (this.lastTips) {
            AppUtils_1.AppUtils.showError("错误", this.lastTips);
        }
    };
    TipsUtils.prototype.clear = function () {
        this.lastTips = null;
    };
    return TipsUtils;
}());
exports.TipsUtils = TipsUtils;
