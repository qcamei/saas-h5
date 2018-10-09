"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var MgrPool_1 = require("../MgrPool");
var AppUtils_1 = require("../AppUtils");
/**
 * store监视器，切换store时，通知各个监听页面
 */
var StoreMonitor = (function () {
    function StoreMonitor() {
        this.monitor = new rxjs_1.Subject();
        this.subMap = new AppUtils_1.ZmMap();
    }
    StoreMonitor.getInstance = function () {
        return MgrPool_1.MgrPool.getInstance().get(StoreMonitor);
    };
    StoreMonitor.prototype.notify = function () {
        this.monitor.next(null);
    };
    StoreMonitor.prototype.subscribe = function (page, func) {
        var key = page.constructor.name;
        var sub = this.monitor.subscribe(func);
        this.subMap.put(key, sub);
    };
    StoreMonitor.prototype.unSubscribe = function (page) {
        var key = page.constructor.name;
        var sub = this.subMap.remove(key);
        if (sub) {
            sub.unsubscribe();
        }
    };
    return StoreMonitor;
}());
exports.StoreMonitor = StoreMonitor;
