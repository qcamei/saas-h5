"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MgrPool_1 = require("../../comModule/MgrPool");
/**
 * 页面路由跳转
 */
var AppRouter = (function () {
    function AppRouter() {
    }
    AppRouter.getInstance = function () {
        return MgrPool_1.MgrPool.getInstance().get(AppRouter);
    };
    AppRouter.prototype.initRouter = function (navCtrl, modalCtrl) {
        this.navCtrl = navCtrl;
        this.modalCtrl = modalCtrl;
    };
    AppRouter.prototype.openModal = function (modalName, callBackFun) {
        this.openModalWithTargetId(modalName, null, callBackFun);
    };
    /**
     e.g
     AppRouter.getInstance().openModalWithTargetId("RegPage","targetId",(data)=>{
            console.log(data);
      });
     */
    AppRouter.prototype.openModalWithTargetId = function (modalName, targetId, callBackFun) {
        var queryParams = null;
        if (targetId) {
            queryParams = QueryParams.newWithTargetId(targetId);
        }
        var modal = this.modalCtrl.create(modalName, queryParams);
        modal.onDidDismiss(function (data) {
            if (callBackFun) {
                callBackFun(data);
            }
        });
        modal.present();
    };
    AppRouter.prototype.setRoot = function (pageName) {
        this.navCtrl.setRoot(pageName);
    };
    AppRouter.prototype.pop = function () {
        this.navCtrl.pop();
    };
    AppRouter.prototype.push = function (path) {
        this.pushWithTargetId(path, null);
    };
    AppRouter.prototype.pushWithTargetId = function (pageName, targetId) {
        var queryParams = null;
        if (targetId) {
            queryParams = QueryParams.newWithTargetId(targetId);
        }
        this.navCtrl.push(pageName, queryParams);
    };
    AppRouter.prototype.getTargetId = function (navParams) {
        return navParams.get("targetId");
    };
    AppRouter.prototype.getWunitId = function (navParams) {
        return navParams.get("wunitId");
    };
    AppRouter.prototype.goLogin = function () {
        this.setRoot("loginPage");
    };
    AppRouter.prototype.goReg = function () {
        this.openModal("regPage", null);
    };
    AppRouter.prototype.goNewWorker = function () {
        this.push("newWorker");
    };
    AppRouter.prototype.goNewBoss = function () {
        this.push("newBoss");
    };
    AppRouter.prototype.goMain = function () {
        this.setRoot("main");
    };
    AppRouter.prototype.goMainHome = function () {
        this.setRoot("mainHome");
    };
    AppRouter.prototype.goMainAdmin = function () {
        this.setRoot("mainAdmin");
    };
    AppRouter.prototype.goMainWorkerAdmin = function () {
        this.push("mainWorkerAdmin");
    };
    AppRouter.prototype.goMainWUnitEdit = function (wunitId) {
        this.pushWithTargetId("mainWUniEdit", wunitId);
    };
    AppRouter.prototype.goMainWUnitAdd = function (onAddFinish) {
        this.openModal("mainWUniAdd", onAddFinish);
    };
    AppRouter.prototype.goAddImg = function () {
        this.openModal("multiImgUpload", null);
    };
    return AppRouter;
}());
exports.AppRouter = AppRouter;
var QueryParams = (function () {
    function QueryParams() {
    }
    QueryParams.newWithTargetId = function (targetId) {
        var target = QueryParams.newParam();
        target.targetId = targetId;
        return target;
    };
    QueryParams.newParam = function () {
        // let wunitId = SessionUtil.getInstance().getCurWUnitId();
        var target = new QueryParams();
        // target.wunitId = wunitId;
        target.storeId = "1";
        target.wunitId = "1";
        return target;
    };
    return QueryParams;
}());
