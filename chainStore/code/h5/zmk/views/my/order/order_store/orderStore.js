// views/my/order/order_store/orderStore.js
const OrderStoreService = require('./orderStoreService.js')
const BossIdData = require('../../../../bs/bossid/bossIdData.js')
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  storeCellClick:function(e){
    console.log(e.detail);
    var storeId = e.detail.storeId;
    var bossId = e.detail.bossId;
    BossIdData.getInstance().bossId = bossId;
    var url = '/views/my/order/order?id=' + storeId;
    wx.navigateTo({
      url: url,
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    BossIdData.getInstance().bossId = null;
    var service = this;
    var listCallBack = function(list){
      service.setData({
        storeVMList:list
      });
    }
    OrderStoreService.getStoreList(listCallBack);
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