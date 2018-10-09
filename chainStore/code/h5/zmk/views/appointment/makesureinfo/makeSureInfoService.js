const AppointmentMgr = require('../../../bs/appointment/AppointmentMgr.js')
var MakeSureInfoService = new function(){
  var service = this;
  var appointName='';
  var appointPhone='';
  service.setAppointName = function(appointNameP) {
      appointName = appointNameP;
  }
  service.setAppointPhone = function(appointPhoneP) {
      appointPhone = appointPhoneP;
  }
  service.getStatus = function() {
      if(appointPhone.length>0&&appointName.length>0){
        return false;
      }else {
        return true;
      }
  }

}
module.exports = MakeSureInfoService;
