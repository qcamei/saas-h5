const orderDetailService = require('./orderDetailService');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderInfo: {},
    status: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 获取订单信息
    var infoFunction = function (re) {
      that.setData({
        orderInfo: re,
        status: re.status
      });
    }
    orderDetailService.getOrderInfo(options.id, infoFunction);
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
   * 用户自定义事件
   */
  // 取消订单
  cancelOrder: function() {
    var that = this;
    wx.showModal({
      title: '温馨提示',
      content: '是否取消该预约订单',
      success: function (res) {
        if (res.confirm) {
          let target = {
            // id: this.data.orderInfo.id,
            id: that.data.orderInfo.id,
            storeId: that.data.orderInfo.storeId,
            updateType: 1,
            updateStatusData: {
              status: 2
            }
          }
          var infoFunction = function (re) {
            if (re.code == 200) {
              that.setData({
                status: "已取消"
              });
            }
          }
          orderDetailService.updateOrderInfo(target, infoFunction);
        } else if (res.cancel) {
          
        }
      }
    })
    return
    
  }


})