const RestDao = require('../../common/RestDao.js');
const SessionUtils = require('../../common/SessionUtils.js');
var AppointmentDAO = new function(){
  var service = this;
  var serviceAddress = SessionUtils.getServiceAddress();
  var table = 'appointment';
  var dao = RestDao.newInstance(serviceAddress, table);
  dao.init(true, false);
  service.add = function (target, objCallback){
    dao.add(target, objCallback);
  }
}
module.exports = AppointmentDAO;