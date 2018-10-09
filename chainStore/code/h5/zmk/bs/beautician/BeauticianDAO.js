const RestDao = require('../../common/RestDao.js');
const SessionUtils = require('../../common/SessionUtils.js');
var BeauticianDAO = new function(){
var service = this;
var serviceAddress = SessionUtils.getServiceAddress();
  var table = 'storeBeauticianInfo';
  var dao = RestDao.newInstance(serviceAddress, table);
  dao.init(true, false);
  service.get = function (id, objCallback) {
    dao.get(id, objCallback);
  };
}
module.exports = BeauticianDAO;