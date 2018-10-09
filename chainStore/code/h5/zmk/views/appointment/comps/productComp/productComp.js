// views/appointment/comps/productComp/productComp.js
const Router = require('../../../../common/Router.js');
const AppointmentData = require('../../../../bs/appointmentdata/appointmentData.js')
const ProductService = require('./productService.js')
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        isCompHidden: Boolean
    },

    /**
     * 组件的初始数据
     */
    data: {
        productArrTmp: new Array(),
        listVM: new Array(),
        hasData: true,
        currentCellModel: new Object()
    },


    attached: function () {
        var windowHeight = wx.getSystemInfoSync().windowHeight;
        var windowWidth = wx.getSystemInfoSync().windowWidth;
        //转换成rpx
        var scroll_view = windowHeight * (750 / windowWidth) - 100 - 108;
        this.setData({scroll_view: scroll_view});
    },

    ready: function () {
        debugger;
        var service = this;
        var listCallBack = function (list) {
            if (!list || list.length == 0) {
                service.setData({
                    hasData: false,
                });
            } else {
                service.setData({
                    productArrTmp: AppointmentData.getInstance().productArr.slice(0),
                    listVM: list,
                    hasData: true
                });
            }
        }
        ProductService.getProductList(listCallBack);
    },
    /**
     * 组件的方法列表
     */
    methods: {
        cellClick: function (e) {
            AppointmentData.getInstance().productId = e.detail.id;
            AppointmentData.getInstance().productName = e.detail.name;
            for (var item of this.data.listVM) {
                if (item.id == e.detail.id) {
                    item.selected = !item.selected;
                    if (item.selected == true) {
                        item.buyCount = 1;
                        this.data.productArrTmp.push(item);
                    } else {
                        for (var prod of this.data.productArrTmp) {
                            if (item.id == prod.id) {
                                var idx = this.data.productArrTmp.indexOf(prod);
                                this.data.productArrTmp.splice(idx, 1);
                            }
                        }
                        item.buyCount = 0;
                    }
                }
            }
            this.setData({
                listVM: this.data.listVM,
                hasData: true
            });
            //wx.navigateBack();
        },

        serveClick: function (e) {

        },

        countUpClick: function (e) {
            var cellModel = e.detail;

            for (var item of this.data.listVM) {
                if (item.id == cellModel.id) {
                    item.buyCount++;
                    if (!item.selected) {
                        this.data.productArrTmp.push(item);
                    }
                    item.selected = true;
                }
            }
            this.setData({
                listVM: this.data.listVM,
                hasData: true
            });
            console.log("--------cellModel:" + JSON.stringify(cellModel));
            console.log("--------productArr:" + JSON.stringify(this.data.productArrTmp));
        },

        countDownClick: function (e) {
            var cellModel = e.detail;

            for (var item of this.data.listVM) {
                if (item.id == cellModel.id) {
                    if (item.buyCount > 0) {
                        item.buyCount--;
                        if (item.buyCount == 0) {
                            item.selected = false;
                            for (var prod of this.data.productArrTmp) {
                                if (item.id == prod.id) {
                                    var idx = this.data.productArrTmp.indexOf(prod);
                                    this.data.productArrTmp.splice(idx, 1);
                                }
                            }
                        }
                    }

                }
            }
            this.setData({
                listVM: this.data.listVM,
                hasData: true
            });
            console.log("--------cellModel:" + JSON.stringify(cellModel));
            console.log("--------productArr:" + JSON.stringify(this.data.productArrTmp));
        },


        selectBeauticianClick: function (e) {
            var cellModel = e.detail;
            this.data.currentCellModel = cellModel;
            var selectBeauticianArr = new Array();
            for (var item of this.data.listVM) {
                if (item.id == cellModel.id) {
                    selectBeauticianArr = item.buserArr;
                }
            }
            var url = '/views/appointment/beautician/beautician?preComp=comp-product&selectBeauticianArr=' + JSON.stringify(selectBeauticianArr);
            wx.navigateTo({
                url: url,
            })
            //Router.goBeaticianFromAppoint();
            console.log(cellModel.title);
        },

        refreshCellModel: function (selectBeauticianArr) {
            //刷新页面数据
            for (var item of this.data.listVM) {
                if (item.id == this.data.currentCellModel.id) {
                    item.buserArrName = '请选择服务人员';
                    item.buserArr = selectBeauticianArr;
                    if (item.buserArr && item.buserArr.length > 0) {
                        item.buserArrName = '';
                        for (var buser of item.buserArr) {
                            item.buserArrName += buser.name + ",";
                        }
                        item.buserArrName = item.buserArrName.substring(0, item.buserArrName.length - 1);
                    }
                    if (item.buserArrName.length > 12) {
                        item.buserArrName = item.buserArrName.substring(0, 12) + "...";
                    }
                }
            }

            this.setData({
                listVM: this.data.listVM,
                hasData: true
            });

            //刷新productArrTmp的数据
            for (var item of this.data.productArrTmp) {
                if (item.id == this.data.currentCellModel.id) {
                    item.buserArr = selectBeauticianArr;
                }
            }


        },

        upper: function () {
            // wx.showNavigationBarLoading()
            // this.refresh();
            // console.log("upper");
            // setTimeout(function () { wx.hideNavigationBarLoading(); wx.stopPullDownRefresh(); }, 2000);
        },
        lower: function (e) {
            // wx.showNavigationBarLoading();
            // var that = this;
            // setTimeout(function () { wx.hideNavigationBarLoading(); that.nextLoad(); }, 1000);
            // console.log("lower")
        },
    }
})
