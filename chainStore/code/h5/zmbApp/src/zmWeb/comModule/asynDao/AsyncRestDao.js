"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AppUtils_1 = require("../AppUtils");
var AsyncRestProxy_1 = require("./AsyncRestProxy");
var PageResp_1 = require("./apiData/PageResp");
var AsyncRestDao = (function () {
    function AsyncRestDao(tType, table) {
        this.tType = tType;
        this.table = table;
    }
    AsyncRestDao.prototype.getNew = function () {
        return new this.tType();
    };
    AsyncRestDao.prototype.getRestProxy = function () {
        return AsyncRestProxy_1.AsyncRestProxy.getInstance();
    };
    AsyncRestDao.prototype.getTarget = function (restResp) {
        var targetTmp = null;
        if (restResp != null && restResp.code == 200 && !AppUtils_1.AppUtils.isNullOrWhiteSpace(restResp.tJson)) {
            targetTmp = this.getNew();
            AppUtils_1.AppUtils.copyJson(targetTmp, restResp.tJson);
        }
        return targetTmp;
    };
    ;
    AsyncRestDao.prototype.getTargetList = function (restResp) {
        var targetListTmp = null;
        if (restResp != null && restResp.code == 200 && !AppUtils_1.AppUtils.isNullOrWhiteSpace(restResp.tListJson)) {
            targetListTmp = new Array();
            targetListTmp = AppUtils_1.AppUtils.fromJsonToList(this.tType, restResp.tListJson);
        }
        return targetListTmp;
    };
    ;
    AsyncRestDao.prototype.getTargetPage = function (restResp) {
        var targetTmp = new PageResp_1.PageResp();
        if (restResp != null && restResp.code == 200 && !AppUtils_1.AppUtils.isNullOrWhiteSpace(restResp.tPageJson)) {
            var oriTarget = AppUtils_1.AppUtils.fromJson2Obj(restResp.tPageJson);
            AppUtils_1.AppUtils.copy(targetTmp, oriTarget);
            targetTmp.list = AppUtils_1.AppUtils.fromJsonToList(this.tType, oriTarget.list);
        }
        return targetTmp;
    };
    ;
    AsyncRestDao.prototype.checkNetErro = function (restResp) {
        // if(restResp == null || restResp.code != 200){
        //   AppUtils.showError("错误","网络异常，请检查。");
        // }
    };
    AsyncRestDao.prototype.add = function (addForm) {
        var _this = this;
        var uriPattern = "{0}/{1}/";
        var uri = AppUtils_1.AppUtils.format(uriPattern, this.getService(), this.table);
        var daoTmp = this;
        return new Promise(function (resolve) {
            _this.getRestProxy().add(uri, addForm).then(function (restResp) {
                daoTmp.checkNetErro(restResp);
                var target = daoTmp.getTarget(restResp);
                resolve(target);
            });
        });
    };
    ;
    AsyncRestDao.prototype.delete = function (id) {
        var _this = this;
        var uriPattern = "{0}/{1}/{2}";
        var uri = AppUtils_1.AppUtils.format(uriPattern, this.getService(), this.table, id);
        var daoTmp = this;
        return new Promise(function (resolve) {
            _this.getRestProxy().delete(uri).then(function (restResp) {
                daoTmp.checkNetErro(restResp);
                resolve(restResp.code == 200);
            });
        });
    };
    ;
    AsyncRestDao.prototype.updateWithId = function (id, targetP) {
        var _this = this;
        var uriPattern = "{0}/{1}/{2}";
        var uri = AppUtils_1.AppUtils.format(uriPattern, this.getService(), this.table, id);
        var daoTmp = this;
        return new Promise(function (resolve) {
            _this.getRestProxy().update(uri, targetP).then(function (restResp) {
                daoTmp.checkNetErro(restResp);
                var target = daoTmp.getTarget(restResp);
                resolve(target);
            });
        });
    };
    ;
    AsyncRestDao.prototype.get = function (id) {
        var _this = this;
        //http://{sesrvice}/{table}/{id}
        var uriPattern = "{0}/{1}/{2}";
        var uri = AppUtils_1.AppUtils.format(uriPattern, this.getService(), this.table, id);
        var daoTmp = this;
        return new Promise(function (resolve) {
            _this.getRestProxy().get(uri).then(function (restResp) {
                daoTmp.checkNetErro(restResp);
                var target = daoTmp.getTarget(restResp);
                resolve(target);
            });
        });
    };
    ;
    AsyncRestDao.prototype.rawReq = function (uriPath, postParam) {
        var _this = this;
        var uriPattern = "{0}/{1}/{2}";
        var uri = AppUtils_1.AppUtils.format(uriPattern, this.getService(), this.table, uriPath);
        var daoTmp = this;
        return new Promise(function (resolve) {
            _this.getRestProxy().rawReq(uri, postParam).then(function (restResp) {
                if (restResp != null && restResp.code == 200) {
                    resolve(restResp);
                }
                else {
                    daoTmp.checkNetErro(restResp);
                    resolve(null);
                }
            });
        });
    };
    ;
    AsyncRestDao.prototype.rawReq4FullPath = function (uriPath, postParam) {
        var _this = this;
        var daoTmp = this;
        return new Promise(function (resolve) {
            _this.getRestProxy().rawReq(uriPath, postParam).then(function (restResp) {
                if (restResp != null && restResp.code == 200) {
                    resolve(restResp);
                }
                else {
                    daoTmp.checkNetErro(restResp);
                    resolve(null);
                }
            });
        });
    };
    ;
    AsyncRestDao.prototype.findOneWithReqParam = function (uriPath, reqMap) {
        var _this = this;
        var uriPattern = "{0}/{1}/{2}?{3}";
        var reqParam = reqMap.toReqParam();
        var uri = AppUtils_1.AppUtils.format(uriPattern, this.getService(), this.table, uriPath, reqParam);
        var daoTmp = this;
        return new Promise(function (resolve) {
            _this.getRestProxy().get(uri).then(function (restResp) {
                var target = daoTmp.getTarget(restResp);
                resolve(target);
            });
        });
    };
    ;
    AsyncRestDao.prototype.findListWithReqParam = function (findPath, reqMap) {
        var _this = this;
        var uriPattern = "{0}/{1}/{2}?{3}";
        var reqParam = reqMap.toReqParam();
        var uri = AppUtils_1.AppUtils.format(uriPattern, this.getService(), this.table, findPath, reqParam);
        var daoTmp = this;
        return new Promise(function (resolve) {
            _this.getRestProxy().list(uri).then(function (restResp) {
                var targetListTmp = daoTmp.getTargetList(restResp);
                resolve(targetListTmp);
            });
        });
    };
    ;
    AsyncRestDao.prototype.findPageWithReqParam = function (findPath, reqMap, pageNo) {
        var _this = this;
        var uriPattern = "{0}/{1}/{2}?pageNo={3}&{4}";
        var reqParam = reqMap.toReqParam();
        var uri = AppUtils_1.AppUtils.format(uriPattern, this.getService(), this.table, findPath, pageNo, reqParam);
        var daoTmp = this;
        return new Promise(function (resolve) {
            _this.getRestProxy().list(uri).then(function (restResp) {
                var targetPageTmp = daoTmp.getTargetPage(restResp);
                resolve(targetPageTmp);
            });
        });
    };
    ;
    AsyncRestDao.prototype.getWithReqParam = function (uriPath, reqMap) {
        var _this = this;
        var uriPattern = "{0}/{1}/{2}?{3}";
        var reqParam = reqMap.toReqParam();
        var uri = AppUtils_1.AppUtils.format(uriPattern, this.getService(), this.table, uriPath, reqParam);
        return new Promise(function (resolve) {
            _this.getRestProxy().get(uri).then(function (restResp) {
                resolve(restResp);
            });
        });
    };
    ;
    // /**
    //  * 分页PageResp
    //  * @param uriPath
    //  * @param reqMap
    //  * @param typeP
    //  * @returns {Promise<PageResp>}
    //  */
    // public getPageRespByType<K>(uriPath, reqMap,typeP: new() => K):Promise<PageResp>{
    //   let uriPattern = "{0}/{1}/{2}?{3}";
    //   let reqParam = reqMap.toReqParam();
    //   let uri = AppUtils.format(uriPattern, this.getService(), this.table, uriPath,reqParam);
    //   return new Promise<PageResp>(resolve => {
    //     this.restProxy.get(uri).then(
    //       function (restResp) {
    //         if(restResp.code == 200){
    //           let pageRespTmp = null;
    //           if (!AppUtils.isNullObj(restResp) && !AppUtils.isNullOrWhiteSpace(restResp.tJson)) {
    //             pageRespTmp = new PageResp();
    //             AppUtils.copyJson(pageRespTmp, restResp.tJson);
    //             let listTmp: Array<K> = new Array<K>();
    //             if (pageRespTmp != null && !AppUtils.isNullObj(pageRespTmp.list)) {
    //               listTmp = AppUtils.fromObjArrToList(typeP,pageRespTmp.list);
    //             }
    //             pageRespTmp.list = listTmp;
    //           }
    //           resolve(pageRespTmp);
    //         }else{
    //           resolve(null);
    //         }
    //       }
    //     );
    //   });
    // };
    AsyncRestDao.prototype.upLoadFile = function (uriPath, formData) {
        var _this = this;
        var uriPattern = "{0}/{1}/{2}/";
        var uri = AppUtils_1.AppUtils.format(uriPattern, this.getService(), this.table, uriPath);
        return new Promise(function (resolve) {
            _this.getRestProxy().uploadFile(uri, formData).then(function (restResp) {
                resolve(restResp);
            });
        });
    };
    ;
    return AsyncRestDao;
}());
exports.AsyncRestDao = AsyncRestDao;
