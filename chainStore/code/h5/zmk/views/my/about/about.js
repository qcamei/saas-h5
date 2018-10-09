var SessionUtils = require('../../../common/SessionUtils.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginInfo: ''  
  },
  
  logOutClick:function(){
  wx.showModal({
    title: '确定退出登录？',
    content: '退出登录，则无法进行预约',
    confirmText:'确定',
    cancelText:'取消',
    success: function callBack(data){
      if (data.confirm == true){
        SessionUtils.setAccessToken('');
        wx.removeStorageSync("loginInfo");
        wx.switchTab({
          url: '/views/appointment/appointment/appointment',
        })
      }
    }
  })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var loginInfo = wx.getStorageSync('loginInfo');
    this.setData({
      loginInfo: loginInfo
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
    
  },


  logout: function() {
    wx.showModal({
      title: '确定退出登录？',
      content: '退出登录，则无法进行预约',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }

})