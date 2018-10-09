const AppUtils = require('../../common/AppUtils.js');
const orderDao = require('./orderDao.js');
const SessionUtils = require('../../common/SessionUtils.js');

var orderMgr = new function() {

  var service = this;

  service.getOrderList = function (storeId, status, callFunction) {
    var minTime = 0;
    var maxTime = 2145888000000;
    var reqMap  = AppUtils.newReqMap();
    reqMap.add('storeId', storeId);
    reqMap.add('minTime', minTime);
    reqMap.add('maxTime', maxTime);
    reqMap.add('status', status.toString());
    return orderDao.findList("findAppointmentList", reqMap, "10000", "1", callFunction);
  }

  service.getStoreProductList= function (storeId, callFunction) {
    return orderDao.findStoreProductInfo(storeId, callFunction);
  }

  service.getOrderInfo = function (id, callFunction) {
    return orderDao.getOrderInfo(id, callFunction);
  }

  service.updateOrderInfo = function (target, callFunction) {
    return orderDao.updateOrderInfo(target, callFunction);
  }

  service.getProductInfo = function (id, callFunction) {
    return orderDao.getProductInfo(id, callFunction);
  }
}

module.exports = orderMgr;
