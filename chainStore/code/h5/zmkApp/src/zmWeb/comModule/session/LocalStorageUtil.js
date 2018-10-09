"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SessionData_1 = require("./SessionData");
var AppUtils_1 = require("../AppUtils");
var LocalStorageUtil = (function () {
    function LocalStorageUtil() {
    }
    /**
     * 清空缓存数据
     */
    LocalStorageUtil.clearStorage = function () {
        localStorage.removeItem(LocalStorageUtil.LOCAL_DATA);
    };
    LocalStorageUtil.setItem = function (keyP, valueP) {
        if (!AppUtils_1.AppUtils.isNullOrWhiteSpace(keyP) && !AppUtils_1.AppUtils.isNullOrWhiteSpace(valueP)) {
            var value = AppUtils_1.AppUtils.toJson(valueP);
            localStorage.setItem(keyP, value);
        }
        else {
        }
    };
    LocalStorageUtil.removeItem = function (keyP) {
        localStorage.removeItem(keyP);
    };
    LocalStorageUtil.getItem = function (keyP, tc) {
        if (!AppUtils_1.AppUtils.isNullOrWhiteSpace(keyP)) {
            var item = localStorage.getItem(keyP);
            return AppUtils_1.AppUtils.fromJson(tc, item);
        }
        else {
            return null;
        }
    };
    /**
     * 持久化用户数据
     */
    LocalStorageUtil.saveLocalData = function (localData) {
        LocalStorageUtil.setItem(LocalStorageUtil.LOCAL_DATA, localData);
    };
    LocalStorageUtil.getLocalData = function () {
        var target = LocalStorageUtil.getItem(LocalStorageUtil.LOCAL_DATA, SessionData_1.LocalData);
        if (AppUtils_1.AppUtils.isNullObj(target)) {
            return new SessionData_1.LocalData();
        }
        return target;
    };
    LocalStorageUtil.LOCAL_DATA = "zm_local_data";
    return LocalStorageUtil;
}());
exports.LocalStorageUtil = LocalStorageUtil;
