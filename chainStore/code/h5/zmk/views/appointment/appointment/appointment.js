// views/appointment/appointment/appointment.js
const SessionUtils = require('../../../common/SessionUtils.js')
const AppointmentData = require('../../../bs/appointmentdata/appointmentData.js')
const StoreService = require('../store/storeService.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        debugger;
        var scene = decodeURIComponent(options.scene);
        if (scene && scene != 'undefined') {
            SessionUtils.setStoreId(scene);
            StoreService.joinStore(scene);
        }
        console.log('----------------scene:' + scene);
        wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: '#4678FA',
        });

        //测试数据
        // SessionUtils.setStoreId(4);
        // SessionUtils.setStoreName('智店');

        var storeId = SessionUtils.getStoreId();
        if (storeId && storeId != 'undefined') {
            AppointmentData.getInstance().storeId = SessionUtils.getStoreId();
            AppointmentData.getInstance().storeName = SessionUtils.getStoreName() ? SessionUtils.getStoreName() : '选择店铺';
            this.setData({hasStore: true});
        } else {
            this.setData({hasStore: false});
        }

        var sessionData = SessionUtils.getSessionData();
        console.log("------sessionData:" + JSON.stringify(sessionData));
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
        this.appointView = this.selectComponent('#appoint-view');
        if (this.appointView) {
            this.appointView.refreshData();
        }
    },
    getCodeDone: function (e) {
        var storeId = AppointmentData.getInstance().storeId;
        if (storeId) {
            StoreService.joinStore(storeId);
            this.setData({hasStore: true});
        } else {
            this.setData({hasStore: false});
            wx.showModal({
                title: '提示',
                content: '请扫描正确的店铺二维码',
                showCancel: 'false',
                confirmText: '我知道了'
            })
        }
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