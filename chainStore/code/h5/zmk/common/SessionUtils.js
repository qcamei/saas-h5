const LocalStorage = require('./LocalStorage.js');

function SessionData() {
    this.loginUser = null;
    this.accessToken = null;
    this.storeId = null;
    this.storeName = null;
    this.appointName = null;
    this.appointPhone = null;
    this.bossId = null;
};

function getData() {
    debugger
    //var loginInfo = wx.getStorageSync("loginInfo");
    //var data = wx.getStorageSync("sessionData");
    //var sessionData = data ? data.phone : null;
    var loginInfo = LocalStorage.getData(LocalStorage.getType().loginInfo);
    var phone = loginInfo ? loginInfo.cuser.phone : "";

    var sessionData = LocalStorage.getData(LocalStorage.getType().sessionData + phone);
    if (!sessionData) {
        sessionData = new SessionData();
        //用户已加入店铺时，则不必再提示扫描加入店铺？
        if(loginInfo && loginInfo.cuser.storeIdSet && loginInfo.cuser.storeIdSet.length > 0){
            sessionData.setStoreId(loginInfo.cuser.storeIdSet[0]);
            sessionData.setStoreName('选择店铺');
        }
    }
    return sessionData;
}

function saveData(sessionData) {
    debugger
    //var loginInfo = wx.getStorageSync("loginInfo");
    var loginInfo = LocalStorage.getData(LocalStorage.getType().loginInfo);
    var phone = loginInfo ? loginInfo.cuser.phone : "";
    // wx.setStorageSync("sessionData", {phone:sessionData});
    LocalStorage.setData(LocalStorage.getType().sessionData + phone, sessionData);
}

var SessionUtils = new function () {
    var service = this;
    var sessionData = getData();

    service.getSessionData = function () {
        return sessionData;
    };

    service.clearSessionData = function () {
        sessionData = new SessionData();
    };

    service.setLoginUser = function (loginUserP) {
        sessionData.loginUser = loginUserP;
        saveData(sessionData);
    };
    service.getLoginUser = function () {
        return sessionData.loginUser;
    };
    service.setBossId = function (bossIdP) {
        sessionData.bossId = bossIdP;
        saveData(sessionData);
    }
    service.getBossId = function () {
        return sessionData.bossId;
    }
    service.setAccessToken = function (accessTokenP) {
        sessionData.accessToken = accessTokenP;
        saveData(sessionData);
    };
    service.getAccessToken = function () {
        console.log(sessionData.accessToken);
        return sessionData.accessToken;
    };
    service.setStoreId = function (storeIdP) {
        sessionData.storeId = storeIdP;
        saveData(sessionData);
    }
    service.getStoreId = function () {
        return sessionData.storeId;
    }
    service.setStoreName = function (storeNameP) {
        sessionData.storeName = storeNameP;
        saveData(sessionData);
    }
    service.getStoreName = function () {
        return sessionData.storeName;
    }
    service.setAppointName = function (appointNameP) {
        sessionData.appointName = appointNameP;
        saveData(sessionData);
    }
    service.getAppointName = function () {
        return sessionData.appointName;
    }
    service.setAppointPhone = function (appointPhoneP) {
        sessionData.appointPhone = appointPhoneP;
        saveData(sessionData);
    }
    service.getAppointPhone = function () {
        return sessionData.appointPhone;
    }
    service.getServiceAddress = function () {
        // return 'https://www.zhimeitimes.com/customerms/ws/v1';  //正式环境
        return 'https://www.zhimeitimes.com:9110/customerms/ws/v1';  //预发布环境
        // return 'http://192.168.40.221/customerms/ws/v1';  //测试环境
        // return 'http://192.168.40.220/customerms/ws/v1';  //开发环境
        // return 'http://192.168.10.158:9118/customerms/ws/v1';  //本地环境
    }
    service.getImgAddress = function () {
        // return 'https://www.zhimeitimes.com/'; //正式环境
        return 'https://www.zhimeitimes.com:9110/'; //预发布环境
        // return 'http://192.168.40.221/'; //测试环境
        
    }
};

module.exports = SessionUtils;
