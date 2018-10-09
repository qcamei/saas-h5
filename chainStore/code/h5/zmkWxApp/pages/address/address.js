// pages/address/address.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _self = this;
    _self.getAddressAuthorizes();
  },

  getAddressAuthorizes: function () {
    var _self = this;
    wx.authorize({
      scope: 'scope.address',
      success: () => {
        console.log('用户同意address授权');
        _self.chooseAddressByWx();
      },
      fail: () => {
        console.log('用户拒绝address授权');
        /*** 用户拒绝授权的处理方式1: 使用wx.openStting()接口打开授权设置界面 ***/
        wx.showModal({
          title: '提示',
          content: '需要您的授权才能使用通讯地址功能哦',
          showCancel: true,
          confirmText: '去授权',
          success: function (res) {
            console.log(JSON.stringify(res));
            if(res.confirm){
              _self.openSettingByWx();
            }else{
              _self.goBackToWebView();
            }
          }
        })
       
        /*** 用户拒绝授权的处理方式2: 使用<button>打开授权设置界面 ***/
        // _self.goAuthPage();

        /*** 用户拒绝授权的处理方式3: 提示用户可将小程序删除后重新进入，再授权 ***/
        // wx.showModal({
        //   title: '提示',
        //   content: '未授权，如想重新授权，请删除小程序后再次进入',
        //   showCancel: false,
        //   confirmText: '知道了',
        //   success: function (res) { 
        //   }
        // })
        
      }
    })
  },

  openSettingByWx: function(){
    var _self = this;
    wx.openSetting({
      success: function (res) {
        if (res && res.detail && res.detail.authSetting["scope.address"]) {//如果打开了通讯地址授权，就会为true
          _self.chooseAddressByWx();
        } else {
          console.log("取消 => success");
          _self.goBackToWebView();
        }
      },
      fail: function (res) {
        console.log("取消 => fail");
        _self.goBackToWebView();
      }
    });
  },

  chooseAddressByWx: function () {
    var _self = this;
    wx.chooseAddress({
      success: function (res) {
        console.log(JSON.stringify(res));
        // {"errMsg":"chooseAddress:ok","userName":"张三","nationalCode":"510000","telNumber":"020-81167888","postalCode":"510000","provinceName":"广东省","cityName":"广州市","countyName":"海珠区","detailInfo":"新港中路397号"}
        console.info("收货地址获取成功");
        _self.goBackToWebView(res);
      },
      fail: function (err) {
        console.log(JSON.stringify(err));
        console.info("收货地址获取失败");
        _self.goBackToWebView();
      }
    })
  },

  goBackToWebView(address) {
    var pages = getCurrentPages();
    //当前页面 (address page)
    var currPage = pages[pages.length - 1];
    //上一个页面 （index page） 
    var prevPage = pages[pages.length - 2];
    //回传地址信息
    if (address){
      prevPage.setData({
        sceneAddress: address
      });
    }
    wx.navigateBack();
  },

  //进入授权页面
  goAuthPage: function () {
    wx.navigateTo({
      url: '../auth/auth',
      success: function () {
      },
      fail: function () {
      },
      complete: function (e) {
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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

  }
})