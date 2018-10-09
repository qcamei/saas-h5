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
var AsyncRestDao_1 = require("../../comModule/asynDao/AsyncRestDao");
var AppUtils_1 = require("../../comModule/AppUtils");
var AppCfg_1 = require("../../comModule/AppCfg");
var MgrPool_1 = require("../../comModule/MgrPool");
var Store_1 = require("./data/Store");
var StoreMgr = (function () {
    function StoreMgr() {
        this.storeDao = new StoreDao();
    }
    StoreMgr.getInstance = function () {
        return MgrPool_1.MgrPool.getInstance().get(StoreMgr);
    };
    /**
     * 根据id获取店铺信息
     * @param storeId
     * @returns {Promise<Store>}
     */
    StoreMgr.prototype.getStore = function (storeId) {
        return this.storeDao.get(storeId);
    };
    ;
    /**
     * 获取用户相关店铺列表
     * @param cuserId
     * @returns {Promise<Array<Store>>}
     */
    StoreMgr.prototype.findMyStores = function () {
        var findPath = "findMyStores";
        var reqMap = new AppUtils_1.ReqMap();
        return this.storeDao.findListWithReqParam(findPath, reqMap);
    };
    /**
     * 加入店铺
     * @param joinStoreForm
     * @returns {Promise<Store>}
     */
    StoreMgr.prototype.joinStore = function (joinStoreForm) {
        var path = "joinStore";
        return this.storeDao.rawReq4FullPath(path, joinStoreForm);
    };
    return StoreMgr;
}());
exports.StoreMgr = StoreMgr;
var StoreDao = (function (_super) {
    __extends(StoreDao, _super);
    function StoreDao() {
        var _this = this;
        var table = "store";
        _this = _super.call(this, Store_1.Store, table) || this;
        return _this;
    }
    StoreDao.prototype.getService = function () {
        return AppCfg_1.AppCfg.getInstance().getServiceAddress();
    };
    return StoreDao;
}(AsyncRestDao_1.AsyncRestDao));
exports.StoreDao = StoreDao;
