var AppointmentApiData = new function(){
var service = this;
service.newAppointmentAddForm = function(){
  return new AppointmentAddApiForm();
}
  function AppointmentAddApiForm(){
    this.storeId = null;
    this.appointTime = null;
    this.appointProducts = null;
    this.jsCode = null;
    this.formId = null;
  }
  service.newAppointPorduct = function(){
    return new AppointProduct();
  }
  function AppointProduct(){
    this.productId = null;
    this.productName = null;
    this.productCount = null;
    this.operateType = null;
    this.productCardId = null;
    this.buserIds = null;
  }
}
module.exports = AppointmentApiData;