"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WUnitBUserPerms_1 = require("../../bsModule/wunit/data/WUnitBUserPerms");
var AppUtils_1 = require("../AppUtils");
var WUnitPermEnum_1 = require("../../bsModule/wunit/data/WUnitPermEnum");
var LocalData = (function () {
    function LocalData() {
        //保存的登陆信息 f5要用到，退出登录的时候才清空
        this.loginData = new LoginData();
    }
    return LocalData;
}());
exports.LocalData = LocalData;
var LoginData = (function () {
    function LoginData() {
    }
    return LoginData;
}());
exports.LoginData = LoginData;
var MainData = (function () {
    function MainData() {
        this.curStore = null; //当前店铺
        this.storeList = null; //店铺列表
        this.cuser = null; //当前用户
        this.wunitList = null;
        this.curWGroup = null; //工作账号
        this.curWUnit = null;
        //数字和枚举 在ts里是等价的
        this.curWUnitPermSet = null;
        this._curBUserPerm = null;
    }
    Object.defineProperty(MainData.prototype, "curBUserPerm", {
        get: function () {
            if (AppUtils_1.AppUtils.isNullObj(this._curBUserPerm) && !AppUtils_1.AppUtils.isNullObj(this.curWUnitPermSet)) {
                this._curBUserPerm = this.buildData(this.curWUnitPermSet);
            }
            return this._curBUserPerm;
        },
        set: function (value) {
            this._curBUserPerm = value;
        },
        enumerable: true,
        configurable: true
    });
    MainData.prototype.buildData = function (permSet) {
        var target = new WUnitBUserPerms_1.WUnitBUserPerms();
        var isBoss = AppUtils_1.AppUtils.arrayContains(permSet, WUnitPermEnum_1.WUnitPermEnum.BOSS);
        target.wunitAdmin = isBoss; //机构单位管理
        target.workerAdmin = isBoss || AppUtils_1.AppUtils.arrayContains(permSet, WUnitPermEnum_1.WUnitPermEnum.WORKER_ADMIN); //职员管理
        target.clientAdmin = isBoss || AppUtils_1.AppUtils.arrayContains(permSet, WUnitPermEnum_1.WUnitPermEnum.CLIENT_ADMIN); //客户管理
        target.orderAdmin = isBoss || false; //订单管理
        target.reportAdmin = isBoss || false; //报表管理
        target.courseContentAdmin = isBoss || false; //课件管理
        target.courseAdmin = isBoss || false; //课程管理
        target.soldItemAdmin = isBoss || false; //售件管理
        target.goodsAdmin = isBoss || false; //商品管理
        target.boss = isBoss;
        return target;
    };
    return MainData;
}());
exports.MainData = MainData;
