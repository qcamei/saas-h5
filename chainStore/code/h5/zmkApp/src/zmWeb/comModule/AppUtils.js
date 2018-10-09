"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AppUtils = (function () {
    function AppUtils() {
    }
    AppUtils.setToaster = function (toasterP) {
        AppUtils.toaster = toasterP;
    };
    AppUtils.showToast = function (messageP) {
        var toast = AppUtils.toaster.create({
            showCloseButton: true,
            message: messageP,
            duration: 2000,
            position: "top"
        });
        toast.present();
    };
    AppUtils.showInfo = function (title, body) {
        AppUtils.showToast(body);
    };
    AppUtils.showSuccess = function (title, body) {
        AppUtils.showToast(body);
    };
    AppUtils.showWarn = function (title, body) {
        AppUtils.showToast(body);
    };
    AppUtils.showError = function (title, body) {
        AppUtils.showToast(body);
    };
    AppUtils.delayExecute = function (fn, delayInMilli) {
        setTimeout(function () {
            fn();
        }, delayInMilli);
    };
    AppUtils.showRestError = function (restError) {
        console.log("code:" + restError.code + " tips:" + restError.tips);
        alert(restError.tips);
    };
    AppUtils.alert = function (msg) {
        alert(msg);
    };
    //json utils....
    AppUtils.toJson = function (target) {
        return JSON.stringify(target);
    };
    AppUtils.fromJsonToList = function (tc, jsonStr) {
        var targetList = new Array();
        var arrayTmp = JSON.parse(jsonStr);
        for (var _i = 0, arrayTmp_1 = arrayTmp; _i < arrayTmp_1.length; _i++) {
            var tmpJson = arrayTmp_1[_i];
            var targetTmp = new tc();
            AppUtils.copy(targetTmp, tmpJson);
            if (targetTmp != null) {
                targetList.push(targetTmp);
            }
        }
        return targetList;
    };
    AppUtils.fromJson2Obj = function (jsonStr) {
        return JSON.parse(jsonStr);
    };
    AppUtils.fromJson = function (tc, jsonStr) {
        var target = Object.assign(new tc(), JSON.parse(jsonStr));
        return target;
    };
    AppUtils.copyJson = function (target, jsonStr) {
        Object.assign(target, JSON.parse(jsonStr));
    };
    AppUtils.copy = function (toObj, fromObj) {
        Object.assign(toObj, fromObj);
    };
    //array utils...
    AppUtils.cloneArray = function (arrayTargetP) {
        var arrayTmp = new Array();
        return arrayTmp.concat(arrayTargetP);
    };
    AppUtils.addAll = function (arraySourceP) {
        var arrayTargetsP = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            arrayTargetsP[_i - 1] = arguments[_i];
        }
        return arraySourceP.concat(arrayTargetsP);
    };
    AppUtils.insertArray = function (taretArray, index, item) {
        // .splice(index, 0, item);
        taretArray.splice(index, 0, item);
    };
    AppUtils.clearArray = function (taret) {
        taret.length = 0;
    };
    AppUtils.removeAll = function (arraySourceP, arrayTargetP) {
        return arraySourceP.filter(function (item) {
            return !AppUtils.arrayContains(arrayTargetP, item);
        });
    };
    //去重
    AppUtils.uniquelize = function (arraySourceP) {
        var arrayTmp = new Array();
        return arraySourceP.filter(function (item) {
            if (!AppUtils.arrayContains(arrayTmp, item)) {
                arrayTmp.push(item);
                return true;
            }
            else {
                return false;
            }
        });
    };
    AppUtils.removeFromArray = function (arrayP, target) {
        var index = arrayP.indexOf(target, 0);
        if (index > -1) {
            arrayP.splice(index, 1);
        }
    };
    AppUtils.arrayContains = function (arrayP, keyP) {
        var index = arrayP.indexOf(keyP, 0);
        return index > -1;
    };
    AppUtils.isNullObj = function (value) {
        return value == null || value == 'undefined';
    };
    AppUtils.isNotNullObjs = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var notNull = true;
        for (var i = 0; i < args.length; i++) {
            if (AppUtils.isNullObj(args[i])) {
                notNull = false;
                break;
            }
        }
        return notNull;
    };
    AppUtils.isNullOrWhiteSpace = function (value) {
        try {
            if (value == null || value == 'undefined')
                return true;
            return value.replace(/\s/g, '').length < 1;
        }
        catch (e) {
            return false;
        }
    };
    // example: var testText = AppUtils.getInstance().format('{0}-{1}-{2}', "salutation", "chen", "allen");
    AppUtils.format = function (value) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        try {
            return value.replace(/{(\d+(:.*)?)}/g, function (match, i) {
                var s = match.split(':');
                if (s.length > 1) {
                    i = i[0];
                    match = s[1].replace('}', '');
                }
                var arg = args[i];
                return typeof arg != 'undefined' && arg != null ? arg : AppUtils.Empty;
            });
        }
        catch (e) {
            console.log("error app utils", e);
            return AppUtils.Empty;
        }
    };
    /**
     * 去掉字符串两边的空格 str不能为null
     */
    AppUtils.trimBlank = function (str) {
        if (!str) {
            return str;
        }
        return str.replace(/(^\s*)|(\s*$)/g, "");
    };
    /**
     * 两位小数
     */
    AppUtils.twoDecimal = function (str) {
        var target = "";
        var strTmp = new Number(str);
        if (str != null) {
            target = strTmp.toFixed(2);
        }
        return parseFloat(target);
    };
    /**
     * 一位小数
     */
    AppUtils.aDecimal = function (str) {
        var target = "";
        var strTmp = new Number(str);
        if (str != null) {
            target = strTmp.toFixed(1);
        }
        return parseFloat(target);
    };
    /**
     * 正则判断输入的是否为正整数  正整数返回true
     * @param num
     * @returns {boolean}
     */
    AppUtils.isPositiveInt = function (num) {
        var reNum = /^[0-9]*[1-9][0-9]*$/;
        return reNum.test(num);
    };
    /**
     * 正则判断输入的是否为数字
     * @param num
     * @returns {boolean}
     */
    AppUtils.isNumber = function (num) {
        var reNum = /(^(-?\d+)(\.\d+)?$)|(^-?\d+$)/;
        return reNum.test(num);
    };
    //对从json List<string>转成的 Array<number> 要做该处理
    AppUtils.toNumberList = function (inputList) {
        if (inputList) {
            return inputList.map(function (item) {
                return Number(item);
            });
        }
        else {
            return inputList;
        }
    };
    /**
     * 拷贝属性值 不适用对象属性值未初始化情况
     * @param toObj
     * @param fromObj
     * @returns {any}
     */
    AppUtils.copyField = function (toObj, fromObj) {
        if (typeof toObj == "object" && typeof fromObj == "object") {
            var fields = Object.keys(toObj);
            for (var index in fields) {
                var field = fields[index];
                if (fromObj.hasOwnProperty(field) && fromObj[field]) {
                    toObj[field] = fromObj[field];
                }
            }
        }
        return toObj;
    };
    /**
     * 分页过滤数据
     */
    AppUtils.getPageData = function (curPage, dataArray) {
        var pageSize = 10;
        var maxLength = curPage * pageSize - 1;
        var minLength = curPage * pageSize - pageSize;
        var pageData = [];
        for (var i = minLength; i < dataArray.length; i++) {
            if (maxLength < i) {
                break;
            }
            else {
                pageData.push(dataArray[i]);
            }
        }
        return pageData;
    };
    AppUtils.checkBrowser = function () {
        /*
         * 浏览器
         * chrome
         * firfox
         * qq浏览器 只支持极速模式(webkit内核) 兼容模式不支持
         * 360浏览器 只支持极速模式(webkit内核) 兼容模式不支持
         * IE浏览器 只支持IE11及以上
         */
        var userAgent = navigator.userAgent;
        if (userAgent.indexOf('Trident') > -1) {
            alert('为了让您得到更好的网上浏览体验\n 1、切换到极速模式下进行浏览\n 2、使用的IE浏览器在IE10以上 ');
        }
    };
    /**
     * 格式化为对应位数的小数
     * @param numberRound 需要格式化的number
     * @param roundDigit 需要保留的位数
     * @returns {number}
     */
    AppUtils.roundPoint = function (numberRound, roundDigit) {
        if (numberRound >= 0) {
            var tempNumber = parseInt((numberRound * Math.pow(10, roundDigit) + 0.5).toString()) / Math.pow(10, roundDigit);
            return tempNumber;
        }
        else {
            var numberRound1 = -numberRound;
            var tempNumber = parseInt((numberRound1 * Math.pow(10, roundDigit) + 0.5).toString()) / Math.pow(10, roundDigit);
            return -tempNumber;
        }
    };
    AppUtils.fromObjArrToList = function (tc, arrayTmp) {
        var targetList = new Array();
        for (var _i = 0, arrayTmp_2 = arrayTmp; _i < arrayTmp_2.length; _i++) {
            var tmpJson = arrayTmp_2[_i];
            var targetTmp = new tc();
            AppUtils.copy(targetTmp, tmpJson);
            if (targetTmp != null) {
                targetList.push(targetTmp);
            }
        }
        return targetList;
    };
    /**
     * dateP 格式eg：{year:2018,month:3,day:15}
     * 转化日期 最小时间 00:00:00
     * @returns {number}
     */
    AppUtils.getCurTimeTimeMillis = function () {
        return new Date().getTime().toString();
    };
    /**
     * dateP 格式eg：{year:2018,month:3,day:15}
     * 转化日期 最小时间 00:00:00
     * @returns {number}
     */
    AppUtils.getMinTime = function (dateP) {
        var arrTmp = [dateP.year, dateP.month, dateP.day];
        var date = new Date(arrTmp.join("/") + " 00:00:00");
        return date.getTime().toString();
    };
    /**
     * dateP 格式eg：{year:2018,month:3,day:15}
     * 转化日期 最大时间 23:59:59
     * @returns {number}
     */
    AppUtils.getMaxTime = function (dateP) {
        var arrTmp = [dateP.year, dateP.month, dateP.day];
        var date = new Date(arrTmp.join("/") + " 23:59:59");
        return date.getTime().toString();
    };
    //string utils...
    AppUtils.Empty = "";
    return AppUtils;
}());
exports.AppUtils = AppUtils;
var ReqMap = (function () {
    function ReqMap() {
        this.map = new ZmMap();
    }
    ReqMap.prototype.add = function (keyP, valueP) {
        if (keyP) {
            this.map.put(keyP, valueP);
        }
        return this;
    };
    ReqMap.prototype.toReqParam = function () {
        var keys = this.map.keys();
        var reqParam = "";
        for (var i = 0; i < keys.length; i++) {
            var keyTmp = keys[i];
            var value = this.map.get(keyTmp);
            reqParam = reqParam + keyTmp + "=" + value + "&";
        }
        return reqParam;
    };
    return ReqMap;
}());
exports.ReqMap = ReqMap;
var ZmMap = (function () {
    function ZmMap() {
        this.data = {};
        this.keyList = new Array();
    }
    ZmMap.newMap = function () {
        return new ZmMap();
    };
    ZmMap.fromMap = function (tType, idName, inputMap) {
        var target = null;
        if (AppUtils.isNullObj(inputMap)) {
            target = new ZmMap();
            for (var index in inputMap) {
                var targetTmp = new tType();
                AppUtils.copy(targetTmp, inputMap[index]);
                target.put(String(targetTmp[idName]), targetTmp);
            }
        }
        return target;
    };
    ZmMap.prototype.put = function (keyP, valueP) {
        this.data[keyP] = valueP;
        if (!AppUtils.arrayContains(this.keyList, keyP)) {
            this.keyList.push(keyP);
        }
        return this;
    };
    ZmMap.prototype.get = function (keyP) {
        return this.data[keyP];
    };
    ZmMap.prototype.remove = function (keyP) {
        AppUtils.removeFromArray(this.keyList, keyP);
        return this.data[keyP] = null;
    };
    ZmMap.prototype.keys = function () {
        return this.keyList;
    };
    ZmMap.prototype.size = function () {
        return this.keyList.length;
    };
    ZmMap.prototype.values = function () {
        var _this = this;
        var valueList = new Array();
        this.keyList.forEach(function (keyTmp) {
            valueList.push(_this.get(keyTmp));
        });
        return valueList;
    };
    ZmMap.prototype.contains = function (keyP) {
        return AppUtils.arrayContains(this.keyList, keyP);
    };
    ZmMap.prototype.clear = function () {
        this.data = {};
        this.keyList = new Array();
    };
    return ZmMap;
}());
exports.ZmMap = ZmMap;
