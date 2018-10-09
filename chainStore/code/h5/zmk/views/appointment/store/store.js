// views/appointment/store/store.js
const StoreService = require('./storeService.js')
const Router = require('../../../common/Router.js')
const AppointmentData = require('../../../bs/appointmentdata/appointmentData.js')
const SessionUtils = require('../../../common/SessionUtils.js')

Page({
    /**
     * 页面的初始数据
     */
    data: {},
    /**
     * 点击店铺
     */
    storeCellClick: function (e) {
        console.log(e.detail);
        StoreService.saveStoreInfo(e.detail);
        StoreService.clearAppointData();
        wx.navigateBack();
    },
    /**
     * 扫二维码
     */
    scanBtnClick: function () {
        wx.scanCode({
            scanType: ['qrCode'],
            success: (res) => {
                //此处需要解析扫到的数据
                //二维码规则zhimeitong_1_storeId
                var resultData = res.result;
                var resultArr = resultData.split('_');
                if (resultArr.length == 3 && resultArr[0] == 'zhimeitong') {
                    AppointmentData.getInstance().storeId = resultArr[2];
                    SessionUtils.setStoreId(resultArr[2]);
                    StoreService.joinStore(resultArr[2]);
                    var dataCallBack = function () {
                        StoreService.clearAppointData();
                        wx.navigateBack();
                    }
                    StoreService.getStore(dataCallBack);

                } else {
                    wx.showModal({
                        title: '提示',
                        content: '请扫描正确的店铺二维码',
                        showCancel: 'false',
                        confirmText: '我知道了'
                    })
                }
            },
            fail: (err) =>{

            }
        })
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
        var pageservice = this;
        var listCallBack = function (restResp) {
            var storeVMList = restResp;
            pageservice.setData({'storeVMList': storeVMList});
        }
        StoreService.getStoreList(listCallBack);
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