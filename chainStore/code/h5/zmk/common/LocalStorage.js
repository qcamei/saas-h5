const AppUtils = require('./AppUtils.js');

var LocalStorage = new function () {

    var storage = this;
    storage.setData = function (key, data) {
        wx.setStorageSync(key, data);
    }
    storage.getData = function (key) {
        return wx.getStorageSync(key);
    }
    storage.getType = function () {
          return Type;
    }
    const Type = {
        lastSelectedStore: 'lastSelectedStore',
        lastAppointInfo:'lastAppointInfo',
        loginInfo:'loginInfo',
        sessionData:'sessionData_'
    };
}
module.exports = LocalStorage;