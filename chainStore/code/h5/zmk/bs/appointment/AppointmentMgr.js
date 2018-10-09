const AppointmentDAO = require('./AppointmentDAO.js');
var AppointmentMgr = new function(){
  var service = this;
  service.add = function (target, objCallback){
    AppointmentDAO.add(target, objCallback);
  }
}
module.exports = AppointmentMgr;