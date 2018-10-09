"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var LocalStorageUtil_1 = require("./LocalStorageUtil");
var SessionData_1 = require("./SessionData");
var AppUtils_1 = require("../AppUtils");
var CUser_1 = require("../../bsModule/cuser/data/CUser");
var StoreMgr_1 = require("../../bsModule/store/StoreMgr");
var StoreMonitor_1 = require("./StoreMonitor");
var SessionUtil = (function () {
    function SessionUtil() {
        this._loginData = null; //登陆数据
        this._localData = new SessionData_1.LocalData(); //本地持久化数据
        this.localLoad();
    }
    SessionUtil.getInstance = function () {
        return SessionUtil.Instance;
    };
    SessionUtil.prototype.localLoad = function () {
        this._localData = LocalStorageUtil_1.LocalStorageUtil.getLocalData();
        this._loginData = this._localData.loginData;
        //直接本地load 出来的对象是没有自定义方法的，所以要处理一下
        if (AppUtils_1.AppUtils.isNullObj(this._loginData) && AppUtils_1.AppUtils.isNullObj(this._loginData.cuser)) {
            var cuser = new CUser_1.CUser;
            AppUtils_1.AppUtils.copy(cuser, this._loginData.cuser);
        }
    };
    SessionUtil.prototype.localSave = function () {
        LocalStorageUtil_1.LocalStorageUtil.saveLocalData(this._localData);
    };
    SessionUtil.prototype.saveLoginDataToLocal = function () {
        this._localData = LocalStorageUtil_1.LocalStorageUtil.getLocalData();
        this._localData.loginData = this.loginData;
        this.localSave();
    };
    Object.defineProperty(SessionUtil.prototype, "localData", {
        set: function (value) {
            this._localData = value;
            this.localSave();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SessionUtil.prototype, "loginData", {
        get: function () {
            console.log("loginData:" + JSON.stringify(this._loginData));
            return this._loginData;
        },
        set: function (value) {
            this._loginData = value;
        },
        enumerable: true,
        configurable: true
    });
    SessionUtil.prototype.getLoginCUser = function () {
        return this._loginData.cuser;
    };
    SessionUtil.prototype.getLoginCUserId = function () {
        return this._loginData.cuser.id;
    };
    SessionUtil.prototype.isLogin = function () {
        return !AppUtils_1.AppUtils.isNullObj(this._loginData.accessToken);
    };
    /**
     * 清空数据 退出登录调用
     */
    SessionUtil.prototype.clearData = function () {
        LocalStorageUtil_1.LocalStorageUtil.clearStorage();
        this.localLoad();
    };
    SessionUtil.prototype.onLoginSuccess = function (loginResp) {
        this._loginData.cuser = loginResp.cuser;
        this._loginData.curStoreId = this.getCurStoreIdFromCUser(loginResp.cuser);
        this._loginData.accessToken = loginResp.token;
        this.saveLoginDataToLocal(); //保存到本地
    };
    SessionUtil.prototype.getCurStoreIdFromCUser = function (cuser) {
        var target = null;
        var storeIdList = cuser.storeIdSet;
        if (!AppUtils_1.AppUtils.isNullObj(storeIdList) && storeIdList.length > 0) {
            target = storeIdList[0];
        }
        return target;
    };
    SessionUtil.prototype.getAccessToken = function () {
        return this._loginData.accessToken;
    };
    SessionUtil.prototype.switchStore = function (storeId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.loginData.curStoreId = storeId;
                this.saveLoginDataToLocal();
                StoreMonitor_1.StoreMonitor.getInstance().notify();
                return [2 /*return*/];
            });
        });
    };
    SessionUtil.prototype.getCurStoreId = function () {
        var curStoreId = this.loginData.curStoreId; //内存中获取
        if (AppUtils_1.AppUtils.isNullOrWhiteSpace(curStoreId)) {
            this.localLoad(); //本地获取
            curStoreId = this.loginData.curStoreId;
        }
        return curStoreId;
    };
    SessionUtil.prototype.getCurStore = function () {
        return __awaiter(this, void 0, void 0, function () {
            var curStoreId, curStore;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        curStoreId = this.getCurStoreId();
                        if (AppUtils_1.AppUtils.isNullOrWhiteSpace(curStoreId)) {
                            return [2 /*return*/, null];
                        }
                        return [4 /*yield*/, StoreMgr_1.StoreMgr.getInstance().getStore(curStoreId)];
                    case 1:
                        curStore = _a.sent();
                        return [2 /*return*/, new Promise(function (resolve) { resolve(curStore); })];
                }
            });
        });
    };
    SessionUtil.prototype.getMainData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var target;
            return __generator(this, function (_a) {
                target = this;
                // if(!target._mainData){
                //   let buserId = this.getLoginBUserId();
                //   let wunitId = this.getCurWUnitId();
                //   let mainDataTmp:MainData = await BUserMgr.getInstance().reqMainData(buserId, wunitId);
                //   target._mainData = mainDataTmp;
                // }
                return [2 /*return*/, new Promise(function (resolve) { resolve(target._mainData); })];
            });
        });
    };
    SessionUtil.HEADER_ACCESS_TOKEN_NAME = "access_token";
    SessionUtil.Instance = new SessionUtil();
    return SessionUtil;
}());
exports.SessionUtil = SessionUtil;
