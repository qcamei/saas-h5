var app = getApp();
const orderService = require('./orderService');
const SessionUtils = require('../../../common/SessionUtils.js');

Page({
  data: {
    winHeight: "",//窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    list: [],
    hasList: true,
    storeId: ''
  },
  // 滚动切换标签样式
  switchTab: function (e) {

    var cur = e.detail.current;
    var that = this;
    var listFunction = function (re) {
      that.setData({
        list: re,
        hasList: re.length ? true : false
      });
    }
    debugger
    orderService.getOrderList(that.data.storeId, cur, listFunction);
    this.setData({
      currentTab: e.detail.current,
      list:[],
      hasList:true
    });
  },
  // 点击标题切换当前页时改变样式
  switchStatusTab: function (e) {
    var cur = e.target.dataset.current;
    if (this.data.currentTaB == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur
      })
    }
  },
  onLoad: function (option) {
    var that = this;
    if(!option.id) {
      option.id = SessionUtils.getStoreId();
    }
    that.setData({
      storeId: option.id
    });
    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 150;
        console.log(calc)
        that.setData({
          winHeight: calc
        });
      }
    });

    // 获取订单列表
    var listFunction = function (re) {
      that.setData({
        list: re,
        hasList: re.length ? true : false
      });
    }
    debugger
    orderService.getOrderList(option.id, 0, listFunction);
  },

  

})