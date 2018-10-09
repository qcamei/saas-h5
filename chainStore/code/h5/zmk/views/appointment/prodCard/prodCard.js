const AppointmentData = require('../../../bs/appointmentdata/appointmentData.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        activeTab: 0,
        tabs: ["项目", "划卡"],
        currentNavtab: "0",
        stv: {
          windowWidth: 0,
          lineWidth: 0,
          offset: 0,
          tStart: false
        },
        touchDot:0

    },
    switchTab: function (e) {
        this.setData({
            currentNavtab: e.currentTarget.dataset.idx
        });
    },
    handlerStart(e) {
      this.data.touchDot = e.touches[0].pageX;
      let { clientX, clientY } = e.touches[0];
      this.startX = clientX;
      this.tapStartX = clientX;
      this.tapStartY = clientY;
      this.data.stv.tStart = true;
      this.tapStartTime = e.timeStamp;
      this.setData({ stv: this.data.stv });
    },
    handlerMove(e) {
      let { clientX, clientY } = e.touches[0];
      let { stv } = this.data;
      let offsetX = this.startX - clientX;
      this.startX = clientX;
      stv.offset += offsetX;
      if (stv.offset <= 0) {
        stv.offset = 0;
      } else if (stv.offset >= stv.windowWidth * (this.tabsCount - 1)) {
        stv.offset = stv.windowWidth * (this.tabsCount - 1);
      }

      this.setData({ stv: stv });
    },
    handlerCancel(e) {

    },
    handlerEnd(e) {
      //触摸移动距离
      var touchMove = e.changedTouches[0].pageX;
      let { clientX, clientY } = e.changedTouches[0];
      let endTime = e.timeStamp;
      let { tabs, stv, activeTab } = this.data;
      let { offset, windowWidth } = stv;
      //快速滑动
      if (endTime - this.tapStartTime <= 300) {
          //向左
          debugger;
          if (Math.abs(this.tapStartY - clientY) < 50) {
              if(Math.abs(touchMove - this.data.touchDot) > 10) {
                  if (this.tapStartX - clientX > 5) {
                      if (activeTab < this.tabsCount - 1) {
                          this.setData({activeTab: ++activeTab})
                      }
                  } else {
                      if (activeTab > 0) {
                          this.setData({activeTab: --activeTab})
                      }
                  }
              }
              stv.offset = stv.windowWidth * activeTab;
          }
          else {
              //快速滑动 但是Y距离大于50 所以用户是左右滚动
              let page = Math.round(offset / windowWidth);
              if (activeTab != page) {
                  this.setData({activeTab: page})
              }
              stv.offset = stv.windowWidth * page;
          }
      } else {
          let page = Math.round(offset / windowWidth);
          if (activeTab != page) {
              this.setData({activeTab: page})
          }
          stv.offset = stv.windowWidth * page;
      }
      stv.tStart = false;


      this.setData({ stv: this.data.stv })
    },

    _updateSelectedPage(page) {
      let { tabs, stv, activeTab } = this.data;
      activeTab = page;
      this.setData({ activeTab: activeTab })
      stv.offset = stv.windowWidth * activeTab;
      this.setData({ stv: this.data.stv })
    },
    handlerTabTap(e) {
      this._updateSelectedPage(e.currentTarget.dataset.index);
    },

    /**
     * 确认按钮点击
     */
    sureBtnClick: function (e) {
        debugger;
        this.compProduct = this.selectComponent('#comp-product');
        if (this.compProduct) {
            AppointmentData.getInstance().productArr = this.compProduct.data.productArrTmp;
        }

        this.compCard = this.selectComponent('#comp-card');
        if (this.compCard) {
            AppointmentData.getInstance().prodCardArr = this.compCard.data.prodCardArrTmp;
        }

        wx.navigateBack();
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        try {
            let { tabs } = this.data;
            var res = wx.getSystemInfoSync()
            this.windowWidth = res.windowWidth;
            this.data.stv.lineWidth = this.windowWidth / this.data.tabs.length;
            this.data.stv.windowWidth = res.windowWidth;
            this.setData({ stv: this.data.stv })
            this.tabsCount = tabs.length;

        } catch (e) {
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