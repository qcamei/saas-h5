// pages/pay/pay.js

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
    //页面加载调取微信支付
    console.log(JSON.stringify(options));
    _self.requestPayment(options);
  },

  //根据options的参数拉起支付组件
  requestPayment: function (options) {
    var _self = this;
    //获取options的订单Id
    var orderId = options.orderId;
    //调起微信支付
    wx.requestPayment({
      'timeStamp': options.timeStamp,
      'nonceStr': options.nonceStr,
      'package': 'prepay_id=' + options.package,
      'signType': options.signType,
      'paySign': options.paySign,
      'success': function (res) {
        console.log("支付成功"),
        console.log(res)
        _self.goBackToWebView(orderId);
      },
      'fail': function (res) {
        console.log("支付失败"),
        console.log(res)
        _self.goBackToWebView(orderId);
      }
    })
  },

  goBackToWebView(orderId){
    var pages = getCurrentPages();
    //当前页面 (pay page)
    var currPage = pages[pages.length - 1];
    //上一个页面 （index page） 
    var prevPage = pages[pages.length - 2];
    //回传orderId
    prevPage.setData({
      sceneOrderId: orderId
    });
    wx.navigateBack();
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