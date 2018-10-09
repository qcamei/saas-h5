const app = getApp();
const SessionUtils = require('../../../common/SessionUtils.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
      {
        id: 'order',
        name: '我的预约订单',
        page: 'order',
        pages: 'order_store/orderStore',
        icon: '../../../images/ic_new_shop.png'
      },
      {
        id: 'about',
        name: '关于我们',
        page: 'about',
        pages: 'about',
        icon: '../../../images/ic_about_us.png'
      },
    ],
    userInfo: {},
    hasUserInfo: false,
    isAuthorization: false,
    authInfo: null,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
    var that = this;

    if (app.globalData.userInfo) {
      that.setData({
        isAuthorization: true,
        authInfo: app.globalData.userInfo,
      });
    }
    
    var userInfo = wx.getStorageSync('loginInfo');
    debugger;
    //userInfo.code = 200;
    that.setData({
      userInfo: userInfo.code === 200 ? userInfo.cuser : {},
      hasUserInfo: userInfo.code === 200 ? true : false,
    })
    
    if (userInfo.code === 200) {
      wx.getSetting({
        success(res) {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                // 可以将 res 发送给后台解码出 unionId
                that.setData({
                  authInfo: res.userInfo,
                  isAuthorization: true,
                })
                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                if (this.userInfoReadyCallback) {
                  this.userInfoReadyCallback(res)
                }
              }
            })
          } else {
            wx.authorize({
              scope: 'scope.userInfo',
              success() {
                // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                wx.getUserInfo({
                  success: res => {
                    // 可以将 res 发送给后台解码出 unionId
                    that.setData({
                      authInfo: res.userInfo,
                      isAuthorization: true,
                    })
                    // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                    // 所以此处加入 callback 以防止这种情况
                    if (this.userInfoReadyCallback) {
                      this.userInfoReadyCallback(res)
                    }
                  }
                })
              }
            })
          }
        }

      })
    }

    // if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else if (this.data.canIUse) {
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   })
    // }
  },

  // 预约订单判断是否登录
  ckeckLogin: function(options) {
    if (options.detail.currentTarget.id == "order" && !this.data.hasUserInfo ) {
      wx.navigateTo({
        url: '/views/login/login',
      })
    } else {
      wx.navigateTo({
        url: options.detail.currentTarget.dataset.url,
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },


  /** 
   * 自定义事件
   */
  // 点击登录按钮事件
  clickLoginButton: function() {
    wx.navigateTo({
      url: '../../login/login',
      success: function () {
        console.log("success");
      },
      fail: function () {
        console.log("fail");
      },
      complete: function (e) {
        console.log(e);
      }
    })
  }
})