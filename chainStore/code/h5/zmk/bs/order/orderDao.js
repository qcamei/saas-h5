const RestDao      = require('../../common/RestDao.js');
const SessionUtils = require('../../common/SessionUtils.js');
const AppUtils     = require('../../common/AppUtils.js');

var orderDao = new function() {

  var service = this;
  var table   = 'appointment';
  var address = SessionUtils.getServiceAddress();
  var dao     = RestDao.newInstance(address, table);

  dao.init(true, false);

  service.findList = function (uriPath, reqMap, pageItemCount, pageNo, callFunction) {
    dao.findListWithReqParam(uriPath, reqMap, pageItemCount, pageNo, callFunction);
  }

  service.findStoreProductInfo = function (storeId, callFunction) {
    dao.findList(uriPath, reqMap, pageItemCount, pageNo, callFunction);
  }

  service.getOrderInfo = function (target, callFunction) {
    dao.get(target, callFunction);
  }

  service.updateOrderInfo = function (target, callFunction) {
    dao.update(target, callFunction);
  }

  service.getProductInfo = function (id, callFunction) {
    return dao.get(id, callFunction);
  }

}

module.exports = orderDao;