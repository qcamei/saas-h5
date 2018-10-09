"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AppUtils_1 = require("../AppUtils");
var RestResp_1 = require("./apiData/RestResp");
var DataSynCtrl_1 = require("../dataSyn/DataSynCtrl");
var AppCfg_1 = require("../AppCfg");
require("rxjs/add/operator/map");
var SessionUtil_1 = require("../session/SessionUtil");
var http_1 = require("@angular/common/http");
var TipsUtils_1 = require("../TipsUtils");
var AsyncRestProxy = (function () {
    function AsyncRestProxy() {
    }
    AsyncRestProxy.getInstance = function () {
        return AsyncRestProxy.instance;
    };
    AsyncRestProxy.prototype.init = function (http) {
        this.httpUtils = new HttpUtils(http, AppCfg_1.AppCfg.withSyn);
    };
    AsyncRestProxy.prototype.add = function (urlP, target) {
        var _this = this;
        TipsUtils_1.TipsUtils.getInstance().clear();
        var jsonData = AppUtils_1.AppUtils.toJson(target);
        return new Promise(function (resolve) {
            _this.httpUtils.post(urlP, jsonData).then(function (restResp) {
                TipsUtils_1.TipsUtils.getInstance().update(restResp);
                resolve(restResp);
            });
        });
    };
    ;
    AsyncRestProxy.prototype.delete = function (urlP) {
        var _this = this;
        TipsUtils_1.TipsUtils.getInstance().clear();
        return new Promise(function (resolve) {
            _this.httpUtils.delete(urlP).then(function (restResp) {
                TipsUtils_1.TipsUtils.getInstance().update(restResp);
                resolve(restResp);
            });
        });
    };
    ;
    AsyncRestProxy.prototype.update = function (urlP, target) {
        var _this = this;
        TipsUtils_1.TipsUtils.getInstance().clear();
        var jsonData = AppUtils_1.AppUtils.toJson(target);
        return new Promise(function (resolve) {
            _this.httpUtils.put(urlP, jsonData).then(function (restResp) {
                TipsUtils_1.TipsUtils.getInstance().update(restResp);
                resolve(restResp);
            });
        });
    };
    ;
    AsyncRestProxy.prototype.get = function (urlP) {
        var _this = this;
        TipsUtils_1.TipsUtils.getInstance().clear();
        return new Promise(function (resolve) {
            _this.httpUtils.get(urlP).then(function (restResp) {
                TipsUtils_1.TipsUtils.getInstance().update(restResp);
                resolve(restResp);
            });
        });
    };
    ;
    AsyncRestProxy.prototype.rawReq = function (urlP, postParam) {
        var _this = this;
        TipsUtils_1.TipsUtils.getInstance().clear();
        var jsonData = AppUtils_1.AppUtils.toJson(postParam);
        return new Promise(function (resolve) {
            _this.httpUtils.post(urlP, jsonData).then(function (restResp) {
                TipsUtils_1.TipsUtils.getInstance().update(restResp);
                resolve(restResp);
            });
        });
    };
    ;
    AsyncRestProxy.prototype.list = function (urlP) {
        var _this = this;
        TipsUtils_1.TipsUtils.getInstance().clear();
        return new Promise(function (resolve) {
            _this.httpUtils.get(urlP).then(function (restResp) {
                TipsUtils_1.TipsUtils.getInstance().update(restResp);
                resolve(restResp);
            });
        });
    };
    ;
    AsyncRestProxy.prototype.uploadFile = function (urlP, formData) {
        var _this = this;
        TipsUtils_1.TipsUtils.getInstance().clear();
        return new Promise(function (resolve) {
            _this.httpUtils.postFile(urlP, formData).then(function (restResp) {
                TipsUtils_1.TipsUtils.getInstance().update(restResp);
                resolve(restResp);
            });
        });
    };
    ;
    AsyncRestProxy.instance = new AsyncRestProxy();
    return AsyncRestProxy;
}());
exports.AsyncRestProxy = AsyncRestProxy;
var HttpUtils = (function () {
    function HttpUtils(http, withSyn) {
        this.http = http;
        this.withSyn = withSyn;
    }
    HttpUtils.prototype.post = function (urlP, jsonData) {
        var _this = this;
        var headers = this.getHeaders();
        var options = { headers: headers };
        return new Promise(function (resolve) {
            _this.http.post(urlP, jsonData, options).subscribe(function (data) {
                var restResp = null;
                if (!AppUtils_1.AppUtils.isNullObj(data)) {
                    restResp = new RestResp_1.RestResp();
                    AppUtils_1.AppUtils.copy(restResp, data);
                    if (restResp.code == 200) {
                        _this.preHandleResp(restResp);
                    }
                }
                resolve(restResp);
            });
        });
    };
    HttpUtils.prototype.put = function (urlP, jsonData) {
        var _this = this;
        var headers = this.getHeaders();
        var options = { headers: headers };
        return new Promise(function (resolve) {
            _this.http.put(urlP, jsonData, options).subscribe(function (data) {
                var restResp = null;
                if (!AppUtils_1.AppUtils.isNullObj(data)) {
                    restResp = new RestResp_1.RestResp();
                    AppUtils_1.AppUtils.copy(restResp, data);
                    if (restResp.code == 200) {
                        _this.preHandleResp(restResp);
                    }
                }
                resolve(restResp);
            });
        });
    };
    HttpUtils.prototype.delete = function (urlP) {
        var _this = this;
        var headers = this.getHeaders();
        var options = { headers: headers };
        return new Promise(function (resolve) {
            _this.http.delete(urlP, options).subscribe(function (data) {
                var restResp = null;
                if (!AppUtils_1.AppUtils.isNullObj(data)) {
                    restResp = new RestResp_1.RestResp();
                    AppUtils_1.AppUtils.copy(restResp, data);
                    if (restResp.code == 200) {
                        _this.preHandleResp(restResp);
                    }
                }
                resolve(restResp);
            });
        });
    };
    HttpUtils.prototype.get = function (urlP) {
        var _this = this;
        var headers = this.getHeaders();
        var options = { headers: headers };
        return new Promise(function (resolve) {
            _this.http.get(urlP, options).subscribe(function (data) {
                var restResp = null;
                if (!AppUtils_1.AppUtils.isNullObj(data)) {
                    restResp = new RestResp_1.RestResp();
                    AppUtils_1.AppUtils.copy(restResp, data);
                    if (restResp.code == 200) {
                        _this.preHandleResp(restResp);
                    }
                }
                resolve(restResp);
            });
        });
    };
    HttpUtils.prototype.postFile = function (urlP, formData) {
        var _this = this;
        var headers = new http_1.HttpHeaders();
        headers.append(SessionUtil_1.SessionUtil.HEADER_ACCESS_TOKEN_NAME, SessionUtil_1.SessionUtil.getInstance().getAccessToken());
        var options = { headers: headers };
        return new Promise(function (resolve) {
            _this.http.post(urlP, formData, options).subscribe(function (data) {
                var restResp = null;
                if (!AppUtils_1.AppUtils.isNullObj(data)) {
                    restResp = new RestResp_1.RestResp();
                    AppUtils_1.AppUtils.copy(restResp, data);
                }
                resolve(restResp);
            });
        });
    };
    HttpUtils.prototype.getHeaders = function () {
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/json');
        if (!AppUtils_1.AppUtils.isNullOrWhiteSpace(SessionUtil_1.SessionUtil.getInstance().getAccessToken())) {
            headers = headers.set(SessionUtil_1.SessionUtil.HEADER_ACCESS_TOKEN_NAME, SessionUtil_1.SessionUtil.getInstance().getAccessToken());
        }
        // if(!AppUtils.isNullOrWhiteSpace(SessionUtil.getInstance().getBossId())){
        //   let validateInfo = ValidateInfo.newInstance(SessionUtil.getInstance().getBossId());
        //   headers = headers.set(SessionUtil.HEADER_BOSS_ID,AppUtils.toJson(validateInfo));
        // }
        if (this.withSyn) {
            var verInfoTmp = DataSynCtrl_1.DataSynCtrl.Instance.getSynHeader();
            headers = headers.set(DataSynCtrl_1.DataSynCtrl.Instance.DATA_SYN_REQ, verInfoTmp);
        }
        return headers;
    };
    ;
    HttpUtils.prototype.preHandleResp = function (restResp) {
        if (this.withSyn) {
            var respJson = restResp.dsResp;
            if (!AppUtils_1.AppUtils.isNullOrWhiteSpace(respJson)) {
                var dataSynResp = AppUtils_1.AppUtils.fromJson(DataSynCtrl_1.DataSynResp, respJson);
                DataSynCtrl_1.DataSynCtrl.Instance.synData(dataSynResp);
            }
        }
    };
    return HttpUtils;
}());
