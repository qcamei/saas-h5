const orderMgr = require('../../../bs/order/orderMgr.js');
const productMgr = require('../../../bs/product/productMgr.js');

var orderService = new function () {
    let service = this;
    service.getOrderList = function (storeId, status, listFunction) {
        debugger
        wx.showLoading({
            title: '加载中...',
            mask: true
        })

        // 获取订单列表
        var callFunction = function () {
        }
        callFunction.success = function (re) {
            wx.hideLoading();
            // 获取项目列表
            var productFunction = function () {
            }
            productFunction.success = function (res) {

                var productList = res.productInfoMap;

                var list = [];
                for (var v of re) {
                    debugger
                    //只显示未删除的预约
                    if(v.entityState != 0){
                        continue;
                    }

                    var orderInfo = {
                        id: v.id,
                        dayTime: '',
                        time: '',
                        name: '项目',
                        appointTime: v.appointTime,
                    }
                    var dateObj = new Date();
                    var nowDay = dateObj.getDate();
                    var nowMonth = dateObj.getMonth() + 1;
                    var nowYear = dateObj.getFullYear();
                    var date = new Date(parseInt(v.appointTime));
                    var day = date.getDate();
                    var month = date.getMonth() + 1;
                    var year = date.getFullYear();
                    var hours = date.getHours();
                    var minutes = date.getMinutes();
                    if (hours < 10) {
                        hours = "0" + hours;
                    }
                    if (minutes < 10) {
                        minutes = "0" + minutes;
                    }
                    orderInfo.time = hours + ":" + minutes;
                    if (nowYear == year) {
                        if (nowMonth == month) {
                            if (nowDay == day) {
                                orderInfo.dayTime = '今天';
                            } else if (day - nowDay == 1) {
                                orderInfo.dayTime = '明天';
                            } else {
                                orderInfo.dayTime = month + "月" + day + "日";
                            }
                        } else {
                            orderInfo.dayTime = month + "月" + day + "日";
                        }
                    } else {
                        orderInfo.dayTime = year + "年" + month + "月" + day + "日";
                    }

                    //orderInfo.name = productList[v.appointProducts[0].productId].name;
                    orderInfo.name = '';
                    if (v.appointProducts) {
                        for (var ap of v.appointProducts) {
                            orderInfo.name += productList[ap.productId].name + ",";
                        }
                        orderInfo.name = orderInfo.name.substring(0, orderInfo.name.length - 1);
                    }

                    list.push(orderInfo);
                }
                list.sort(function (a, b) {
                    var time1 = a.appointTime;
                    var time2 = b.appointTime;
                    return time1 - time2;
                });
                listFunction(list);

            }
            productFunction.fail = function (res) {
            }
            productMgr.get(storeId, productFunction);

            listFunction(re);
        }
        callFunction.fail = function (re) {
            wx.hideLoading();
        }
        debugger
        orderMgr.getOrderList(storeId, status, callFunction);
    }

}

module.exports = orderService;