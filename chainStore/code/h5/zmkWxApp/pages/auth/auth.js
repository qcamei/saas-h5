// pages/auth/auth.js
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

  },

  /**
   * 打开授权设置之后的回调（有些安卓机不兼容, 点击按钮没反应）
   * https://developers.weixin.qq.com/community/develop/doc/000c823e9a8020b10b077355f5b800?highLine=openType
   */
  openSettingBtnClick: function (e) {
    if (e && e.detail && e.detail.authSetting["scope.address"]) {//如果打开了通讯地址授权，就会为true
        wx.showToast({
          title: '授权成功',
        })
    }
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