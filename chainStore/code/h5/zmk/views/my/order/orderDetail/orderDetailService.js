const orderMgr   = require('../../../../bs/order/orderMgr.js');
const productMgr = require('../../../../bs/product/productMgr.js');
const buserMgr   = require('../../../../bs/buser/BUserMgr.js');
const storeMgr   = require('../../../../bs/store/StoreMgr.js');
const appUtil = require('../../../../common/AppUtils.js');

var orderDetailService = new function() {
  let service = this;

  // 获取订单信息
  service.getOrderInfo = function (id, infoFunction) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    var callFunction = function () { }
    callFunction.success = function (re) {
      var status = '';
      switch (parseInt(re.status)) {
        case 0:
          status =  "待接单";
          break;
        case 1:
          status = "待服务";
          break;
        case 2:
          status = "已取消";
          break;
        case 3:
          status = "服务完成";
          break;
        default:
          status = "待接单";
      }

      var orderInfo = new orderInfoFunction();
      orderInfo.id              = id;
      orderInfo.status          = status;
      orderInfo.creatorName     = re.creatorName;
      orderInfo.creatorPhone    = wx.getStorageSync("loginInfo").cuser.phone;
      orderInfo.appointmentTime = appUtil.getFormatDate(re.appointTime, true);
      orderInfo.createdTime     = appUtil.getFormatDate(re.createdTime, true);
      // 获取项目信息
      orderInfo.productName = '';
      var proFunction = function () { }
      proFunction.success = function (pro) {
        wx.hideLoading();
          if(re.appointProducts){
              for(var ap of re.appointProducts){
                  orderInfo.productName += pro.productInfoMap[ap.productId].name + ",";
              }
              orderInfo.productName = orderInfo.productName.substring(0,orderInfo.productName.length-1);
          }
        //orderInfo.productName = pro.productInfoMap[re.appointProducts[0].productId].name;
        infoFunction(orderInfo);
      }
      proFunction.fail = function (pro) {
        wx.hideLoading();
      }
      productMgr.get(re.storeId, proFunction);

      // 获取操作人的信息
      orderInfo.buserName = '';
      var buserFunction = function () { }
      buserFunction.success = function (busers) {
        wx.hideLoading();
        //orderInfo.buserName = buser ? (buser[0] ? buser[0].name : '未填写'):'';
          for(var buser of busers){
              orderInfo.buserName += buser.name+",";
          }
          orderInfo.buserName = orderInfo.buserName.substring(0,orderInfo.buserName.length-1);
        infoFunction(orderInfo);
      }
      buserFunction.fail = function (buser) {
        wx.hideLoading();
      }
      if(re.appointProducts[0].buserIds){
        //buserMgr.findByMultitId([re.appointProducts[0].buserIds[0]], buserFunction);
          buserMgr.findByMultitId(re.appointProducts[0].buserIds, buserFunction);
      }else{
          orderInfo.buserName = '未填写';
      }

      // 获取店铺信息
      var storeFunction = function () { }
      storeFunction.success = function (store) {
        wx.hideLoading();
        orderInfo.storeId      = store.id;
        orderInfo.storeName    = store.name;
        orderInfo.storeAddress = store.address;
        infoFunction(orderInfo);
      }
      storeFunction.fail = function (store) {
        wx.hideLoading();
      }
      storeMgr.getStore(re.storeId, storeFunction);
      infoFunction(orderInfo);

    }
    callFunction.fail = function (re) {
    }
    orderMgr.getOrderInfo(id, callFunction);
  }
  function orderInfoFunction() {
    this.id= "";
    this.status= "";
    this.creatorName= "";
    this.creatorPhone= "";
    this.appointment= "";
    this.buserName= '';
    this.productName= '';
    this.storeName= '';
    this.storeAddress= '';
  };

  // 更改订单信息
  service.updateOrderInfo = function (target, infoFunction) {
    orderMgr.updateOrderInfo(target, infoFunction);
  }
  
  
}

module.exports = orderDetailService;