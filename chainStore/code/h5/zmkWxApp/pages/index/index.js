//index.js
//获取应用实例
const app = getApp()
const SessionUtils = require('../../common/SessionUtils.js')
const AppUtils = require('../../common/AppUtils.js')
Page({
  data: {
    url: SessionUtils.getServiceAddress(),
    motto: '欢迎使用智美预约',
    userInfo: {},
    hasUserInfo: false,
    canLoadWebview: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
    // sceneOrderId:'', //支付页面回传的orderId, 无法实现回传
    // sceneAddress:{} //地址页面回传的address, 无法实现回传
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (options) {
    var app = getApp();

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        app.globalData.userInfo = this.data.userInfo;
        console.log("是否拿到userInfo:" + JSON.stringify(app.globalData.userInfo));
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          app.globalData.userInfo = this.data.userInfo;
        }
      })
    }

    var _self = this;
    _self.buildAndLoadWebViewUrl(options);
    
  },

  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  //构建并加载webview的完整url
  buildAndLoadWebViewUrl: function (options) {
    var _self = this;
    //拿到小程序二维码中的url信息
    if (options.url) {

    }
    //拿到小程序二维码中的参数信息（即storeId）
    var sceneStoreId = '';
    var scene = decodeURIComponent(options.scene);
    if (scene && scene != 'undefined') {
      sceneStoreId = scene;
    }

    //拼接带参数的完整url，微信网络请求的数据可能还未拿到，onLoad事件就执行完了，web-view就加载了，所以使用定时器来控制。
    var myTimer = setInterval(
      () => {
        //拿到jsCode
        var jsCode = app.globalData.jsCode;
        if (jsCode != '') {
          var userInfoJson = JSON.stringify(app.globalData.userInfo);
          var senceMiniAppId = SessionUtils.getMiniAppId();
          var sceneAddressJson = JSON.stringify(_self.data.sceneAddress);

          var reqMap = AppUtils.newReqMap();
          reqMap.add('sceneStoreId', sceneStoreId); //用户扫描小程序二维码拿到的storeId
          // reqMap.add('userInfo', userInfoJson); //微信用户信息，可能拿不到，一般是{}
          reqMap.add('senceMiniAppId', senceMiniAppId); //当前小程序的appId
          reqMap.add('jsCode', jsCode); //当前用户的jsCode
          // reqMap.add('sceneOrderId', _self.data.sceneOrderId); //支付后回传的orderId, 无法实现回传
          // reqMap.add('sceneAddress', sceneAddressJson); //选择后回传的通讯地址, 无法实现回传
          var reqParam = reqMap.toReqParam();

          var uriPattern = "{0}?{1}";
          var fullUrl = AppUtils.format(uriPattern, [_self.data.url, reqParam]);

          console.log("fullUrl:" + fullUrl);

          _self.setData({
            url: fullUrl,
            canLoadWebview: true
          });

          if (myTimer) {
            clearInterval(myTimer);
          }
        }

      }, 500);
  },

  // 跳转到选择地址页面
  goAddressPage: function () {
    wx.navigateTo({
      url: '../address/address',
      success: function () {
      },
      fail: function () {
      },
      complete: function (e) {
      }
    })
  }

})
