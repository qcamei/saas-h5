// views/appointment/makesureinfo/makeSureInfo.js
const AppointmentData = require('../../../bs/appointmentdata/appointmentData.js')
const SessionUtils = require('../../../common/SessionUtils.js')
const Router = require('../../../common/Router.js')
const MakeSureInfoService = require('../makesureinfo/makeSureInfoService.js')
Page({
    /**
     * 页面的初始数据
     */
    data: {
        appointName: SessionUtils.getAppointName(),
        appointPhone: SessionUtils.getAppointPhone(),
    },
    appointmentNameInput:function(e){
        MakeSureInfoService.setAppointName(e.detail.value);
        this.setData({
            btnDisable:MakeSureInfoService.getStatus()
        })

    },
    appointmentPhoneInput:function(e){
        MakeSureInfoService.setAppointPhone(e.detail.value);
        this.setData({
            btnDisable:MakeSureInfoService.getStatus()
        })
    },
    inputonfocus:function(e){
        this.setData({
          namePlaceHoder : ''
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '核对预约信息'
        })
        this.setData({
            appointData: AppointmentData.getInstance()
        })
        if(!SessionUtils.getAppointName()&&!SessionUtils.getAppointPhone()){
            this.setData({
                btnDisable:true
            })
        }else {
            this.setData({
                btnDisable:false
            })
        }

    },
    appointClick:function () {
      Router.goAppointSuccessPage();
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