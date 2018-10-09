const RestDao = require('../../common/RestDao.js');
const SessionUtils = require('../../common/SessionUtils.js');
var LeaguerDetailDAO = new function(){
  var service = this;
  var serviceAddress = SessionUtils.getServiceAddress();
  var table = 'leaguerDetail';
  var dao = RestDao.newInstance(serviceAddress, table);
  dao.init(true, false);
  service.get = function (leaguerDetailId, objCallback){
    dao.get(leaguerDetailId, objCallback);
  }
}
module.exports = LeaguerDetailDAO;