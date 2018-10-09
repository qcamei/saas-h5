const RestDao = require('../../common/RestDao.js');
const SessionUtils = require('../../common/SessionUtils.js');
var StoreCardInfoDAO = new function(){
  var service = this;
  var serviceAddress = SessionUtils.getServiceAddress();
  var table = 'storeCardInfo';
  var dao = RestDao.newInstance(serviceAddress, table);
  dao.init(true, false);
  service.get = function (storeId, objCallback){
    dao.get(storeId, objCallback);
  }
}
module.exports = StoreCardInfoDAO;