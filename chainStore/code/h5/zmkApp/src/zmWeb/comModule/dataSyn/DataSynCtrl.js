"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AppUtils_1 = require("../AppUtils");
var DataSynCtrl = (function () {
    function DataSynCtrl() {
        this.DATA_SYN_REQ = "dsReq";
        //map<intSynType,DataSynItem>
        this.map = new AppUtils_1.ZmMap();
    }
    DataSynCtrl.prototype.setOwnerId = function (ownerIdP) {
        this.ownerId = ownerIdP;
    };
    ;
    DataSynCtrl.prototype.put = function (dataSynItem) {
        var intSynType = dataSynItem.synVer.synType;
        var key = this.getKey(intSynType, dataSynItem.synVer.id);
        this.map.put(key, dataSynItem);
    };
    ;
    DataSynCtrl.prototype.get = function (constructorT, synType, targetId) {
        var target = null;
        var key = this.getKey(synType, targetId);
        var dataSynItem = this.map.get(key);
        if (!AppUtils_1.AppUtils.isNullObj(dataSynItem)) {
            if (!AppUtils_1.AppUtils.isNullObj(dataSynItem.obj) && !AppUtils_1.AppUtils.isNullOrWhiteSpace(dataSynItem.data)) {
                dataSynItem.obj = AppUtils_1.AppUtils.fromJson(constructorT, dataSynItem.data);
            }
            target = dataSynItem.obj;
        }
        return target;
    };
    DataSynCtrl.prototype.getKey = function (synType, id) {
        var format = "{0}_{1}";
        var intSynType = synType;
        var key = AppUtils_1.AppUtils.format(format, intSynType, id);
        return key;
    };
    DataSynCtrl.prototype.getVerList = function () {
        var verList = new Array();
        var itemList = this.map.values();
        for (var _i = 0, itemList_1 = itemList; _i < itemList_1.length; _i++) {
            var itemTmp = itemList_1[_i];
            verList.push(itemTmp.synVer);
        }
        return verList;
    };
    ;
    DataSynCtrl.prototype.synData = function (dataSynResp) {
        var _this = this;
        if (dataSynResp.itemList && dataSynResp.itemList instanceof Array) {
            dataSynResp.itemList.forEach(function (itemTmp) {
                _this.put(itemTmp);
            });
        }
    };
    ;
    DataSynCtrl.prototype.getSynHeader = function () {
        var dataSynVerInfo = new DataSynVerInfo();
        dataSynVerInfo.ownerId = this.ownerId;
        dataSynVerInfo.synVerList = this.getVerList();
        return AppUtils_1.AppUtils.toJson(dataSynVerInfo);
    };
    ;
    DataSynCtrl.prototype.clear = function () {
        this.map.clear();
    };
    ;
    DataSynCtrl.Instance = new DataSynCtrl();
    return DataSynCtrl;
}());
exports.DataSynCtrl = DataSynCtrl;
var DataSynResp = (function () {
    function DataSynResp() {
    }
    return DataSynResp;
}());
exports.DataSynResp = DataSynResp;
var DataSynItem = (function () {
    function DataSynItem() {
        this.obj = null;
    }
    return DataSynItem;
}());
exports.DataSynItem = DataSynItem;
var DataSynVer = (function () {
    function DataSynVer() {
    }
    return DataSynVer;
}());
exports.DataSynVer = DataSynVer;
var DataSynVerInfo = (function () {
    function DataSynVerInfo() {
    }
    return DataSynVerInfo;
}());
var DataSynType;
(function (DataSynType) {
    DataSynType[DataSynType["BUser"] = 0] = "BUser";
    DataSynType[DataSynType["Worker"] = 1] = "Worker";
    DataSynType[DataSynType["WUnit"] = 2] = "WUnit";
    DataSynType[DataSynType["WGroup"] = 3] = "WGroup";
    DataSynType[DataSynType["Client"] = 4] = "Client";
    DataSynType[DataSynType["CourseContent"] = 5] = "CourseContent";
    DataSynType[DataSynType["CourseKind"] = 6] = "CourseKind";
    DataSynType[DataSynType["Course"] = 7] = "Course";
    DataSynType[DataSynType["CourseLesson"] = 8] = "CourseLesson";
    DataSynType[DataSynType["StoreGoods"] = 9] = "StoreGoods";
    DataSynType[DataSynType["DetailDataVersion"] = 10] = "DetailDataVersion";
})(DataSynType = exports.DataSynType || (exports.DataSynType = {}));
