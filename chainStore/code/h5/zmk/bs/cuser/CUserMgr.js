const AppUtils = require('../../common/AppUtils.js');
const CUserDAO = require('./CUserDAO.js');

var CUserMgr = new function () {
    var service = this;

    service.reg = function (cuserAddApiForm, restCallback) {
        var regPath = "reg";
        var restResp = CUserDAO.rawReq(regPath, cuserAddApiForm, restCallback);
        return restResp;
    };
    service.login = function (cuserLoginForm, restCallback) {
        var regPath = "loginByCode";
        var restResp = CUserDAO.rawReq(regPath, cuserLoginForm, restCallback);
        return restResp;
    }
    service.get = function (cuserId, objCallback) {
        return CUserDAO.get(cuserId, objCallback);
    };

    service.update = function (cuserId, cuserUpdateApiForm, objCallback) {
        CUserDAO.updateWithId(cuserId, cuserUpdateApiForm, objCallback);
    };
};

module.exports = CUserMgr;