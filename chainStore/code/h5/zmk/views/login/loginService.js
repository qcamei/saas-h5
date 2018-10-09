const CUserMgr     = require('../../bs/cuser/CUserMgr.js');
const SessionUtils = require('../../common/SessionUtils.js');
const AppointmentData = require('../../bs/appointmentdata/appointmentData.js');
const StoreService = require('../appointment/store/storeService.js')

var loginService = new function() {

  

  var server = this;

  // 发送验证码
  server.sendSmsCode = function(param) {
    debugger
    var url = SessionUtils.getServiceAddress()+'/sms/sendRandomCode';
    wx.request({
      url: url,
      data: param,
      method: 'POST'
    })
  }

  server.login = function(param) {
    var callFunction = function (restResp) {
      debugger
     

      wx.hideLoading();
      if (restResp.code === 200) {
        var cuserJson  = JSON.parse(restResp.tJson);

        //重新设置sessionData
        cuserJson.code = 200;
        wx.setStorageSync("loginInfo", cuserJson);
        SessionUtils.setAccessToken(cuserJson.token);

        //加入店铺(登陆暂时不用加店铺)
        // if (SessionUtils.getStoreId()) {
        //   StoreService.joinStore(SessionUtils.getStoreId());
        // }

        console.log("=======cuserJson:" + JSON.stringify(cuserJson));
        console.log("=======sessionData:" + JSON.stringify(SessionUtils.getSessionData()));
        console.log("=======AppointmentData:" + JSON.stringify(AppointmentData.getInstance()));
      }


      var pageList = getCurrentPages();
      
      wx.showToast({
        title: restResp.code !== 200 ? restResp.tips : '登录成功',
        icon: 'none',
        duration: 1000,
        success: function() {
          if (restResp.code === 200) {
            setTimeout(function() {
              wx.reLaunch({
                url: "/"+pageList[pageList.length-2].route
              })
            }, 1000
            );           
          }
        }
      })
    };
    CUserMgr.login(param, callFunction);
  }

}

module.exports = loginService;



