const smsData = require('../../bs/sms/smsData.js');
const UserData = require('../../bs/cuser/CUserApiData.js');
const loginService = require('./loginService.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    verifyClick: false,
    CountdownCount: 60,
    phoneNumber: null,
    verifyCode: null,
    reasonablePhone: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  },


  /**
   * 自定义事件
    */
  // 获取手机号输入框的值并验证合法的手机号码
  phoneEvent: function (e) {
    let phone = e.detail.value;
    let reg = /^[1][3,4,5,7,8][0-9]{9}$/;
    this.setData({
      reasonablePhone: !reg.test(phone) ? false : true,
      phoneNumber: phone
    });
  },
  // 获取验证码输入框的值
  verifyCodeEvent: function (e) {
    this.setData({
      verifyCode: e.detail.value
    });
  },
  // 验证合法的手机号码
  // checkPhoneReasonable: function(e) {
  //   let phone = e.detail.value;
  //   let reg   = /^[1][3,4,5,7,8][0-9]{9}$/;
  //   this.setData({
  //     reasonablePhone: !reg.test(phone) ? false : true,
  //     phoneNumber: e.detail.phone
  //   });
  // },
  //点击获取验证码按钮
  clickVerifyButton: function () {
    let that = this;
    let status = that.data.verifyClick;
    if (!that.data.reasonablePhone) {
      return;
    }
    if (!status) {
      that.setData({ verifyClick: true });
      // 组装验证码实体
      debugger
      smsData.phoneNumber = that.data.phoneNumber;
      loginService.sendSmsCode(smsData);
      // 发送验证码
      let timeFnc = setInterval(function () {
        let time = that.data.CountdownCount - 1;
        that.setData({ CountdownCount: time });
        if (time == 0) {
          that.setData({ CountdownCount: 60 });
          that.setData({ verifyClick: false });
          clearInterval(timeFnc);
        }
      }, 1000);
    }
  },

  // 点击登录按钮事件
  clickLoginButton: function () {
    
    //13810905832
    let that = this;
    if (!that.data.phoneNumber || !that.data.verifyCode) {
      return;
    }
    wx.showLoading({
      title: '登录中...',
      mask: true
    })
    let loginForm = {
      phone: that.data.phoneNumber,
      verifyCode: that.data.verifyCode
    }
    loginService.login(loginForm);
  }


})