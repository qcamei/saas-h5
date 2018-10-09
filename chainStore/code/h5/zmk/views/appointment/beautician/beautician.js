// views/appointment/beautician/beautician.js
const AppointmentData = require('../../../bs/appointmentdata/appointmentData.js')
const BeauticianService = require('./beauticianService.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        //selectBeautician: AppointmentData.getInstance().beauticanId,
        selectBeauticianArr: new Array(), //已选中的服务人员
        preComp: '', //从哪个组件进入的此页面
        listVM: new Array()
    },
    cellClick: function (e) {
        var cellModel = e.detail;
        AppointmentData.getInstance().beauticianName = e.detail.name;
        AppointmentData.getInstance().beauticianId = e.detail.id;

        for (var item of this.data.listVM) {
            if (item.id == cellModel.id) {
                item.selected = !item.selected;
                if (item.selected) {
                    this.data.selectBeauticianArr.push(cellModel);
                } else {
                    for (var selectBeautician of this.data.selectBeauticianArr) {
                        if (item.id == selectBeautician.id) {
                            var idx = this.data.selectBeauticianArr.indexOf(selectBeautician);
                            this.data.selectBeauticianArr.splice(idx, 1);
                        }
                    }
                }
                this.setData({
                    listVM: this.data.listVM
                });
            }
        }

        // var pageList = getCurrentPages();
        // for(var i=0;i<pageList.length;i++){
        //     var page = pageList[i];
        //     var route = page.route;
        //     var strList = route.split('/');
        //     if (strList[strList.length - 1] =='appointment'){
        //       console.log(page.route);
        //       wx.navigateBack({
        //         delta:pageList.length-i-1
        //       })
        //       break
        //     }
        // }


    },

    sureBtnClick: function (e) {
        var pageList = getCurrentPages();
        var prePage = pageList[pageList.length - 2];
        var preComp = null;
        if(this.data.preComp == 'comp-product'){
            preComp = prePage.selectComponent('#comp-product');
        }else if(this.data.preComp == 'comp-card') {
            preComp = prePage.selectComponent('#comp-card');
        }
        preComp['refreshCellModel'](this.data.selectBeauticianArr);
        wx.navigateBack();
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        debugger;
        console.log(options);
        this.data.preComp = options.preComp;
        this.data.selectBeauticianArr = JSON.parse(options.selectBeauticianArr);
        var pageservice = this;
        var listCallBack = function (list) {
            pageservice.setData({
                listVM: list
            });
            console.log('++++++++' + list);
        }
        BeauticianService.getBeautician(listCallBack, this.data.selectBeauticianArr);

        //页面样式处理
        var windowHeight = wx.getSystemInfoSync().windowHeight;
        var windowWidth = wx.getSystemInfoSync().windowWidth;
        //转换成rpx
        var scroll_view = windowHeight * (750 / windowWidth) - 108;
        this.setData({scroll_view: scroll_view});
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