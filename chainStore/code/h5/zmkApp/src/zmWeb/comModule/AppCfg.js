"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AppUtils_1 = require("./AppUtils");
var AppCfg = (function () {
    function AppCfg() {
    }
    AppCfg.getInstance = function () {
        return AppCfg.instance;
    };
    AppCfg.prototype.init = function (serviceAddressP, imgPreUrlP) {
        this.serviceAddress = serviceAddressP;
        this.imgPreUrl = imgPreUrlP;
    };
    AppCfg.prototype.getServiceAddress = function () {
        return this.serviceAddress;
    };
    AppCfg.prototype.getImgPreUrl = function () {
        return this.imgPreUrl;
    };
    /**
     * 通过json配置文件初始化配置
     */
    AppCfg.prototype.initFromConfigJson = function (configJsonP) {
        if (!AppUtils_1.AppUtils.isNullObj(configJsonP)) {
            var serviceConfig = new ServiceConfig();
            var env = configJsonP.env;
            AppUtils_1.AppUtils.copy(serviceConfig, configJsonP[env]);
            this.init(serviceConfig.serviceAddress, serviceConfig.imgPreUrl);
        }
    };
    AppCfg.withSyn = true;
    // private static readonly SERVICE_SUFFIX:string = "customerms/ws/v1";
    AppCfg.instance = new AppCfg();
    return AppCfg;
}());
exports.AppCfg = AppCfg;
var ServiceConfig = (function () {
    function ServiceConfig() {
    }
    return ServiceConfig;
}());
exports.ServiceConfig = ServiceConfig;
