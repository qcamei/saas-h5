"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AppUtils_1 = require("./AppUtils");
var MgrPool = (function () {
    function MgrPool() {
        this.mgrMap = new AppUtils_1.ZmMap();
    }
    MgrPool.getInstance = function () {
        return MgrPool.instance;
    };
    MgrPool.prototype.get = function (tType) {
        var key = tType.toString();
        if (!this.mgrMap.contains(key)) {
            var tmp = new tType();
            this.mgrMap.put(key, tmp);
        }
        return this.mgrMap.get(key);
    };
    MgrPool.instance = new MgrPool();
    return MgrPool;
}());
exports.MgrPool = MgrPool;
