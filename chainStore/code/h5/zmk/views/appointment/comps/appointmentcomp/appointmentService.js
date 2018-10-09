const AppointmentData = require('../../../../bs/appointmentdata/appointmentData.js');
const AppUtils = require('../../../../common/AppUtils.js');
const AppointmentApiData = require('../../../../bs/appointment/AppointmentApiData.js')
const AppointmentMgr = require('../../../../bs/appointment/AppointmentMgr.js')
const SessionUtils = require('../../../../common/SessionUtils.js')
var AppointmentService = new function () {
    var appointmentData = AppointmentData.getInstance();

    var service = this;
    var storeCell = new AppointCellModel();
    var dateCell = new AppointCellModel();
    var timerCell = new AppointCellModel();
    var serveCell = new AppointCellModel();
  var productCell = new AppointCellModel(); 
    service.getViewModel = function () {
        
        storeCell.title = '美容店铺';
        storeCell.content = appointmentData.storeName ? appointmentData.storeName : ' ';
        // storeCell.content = SessionUtils.getStoreName ? SessionUtils.getStoreName : ' ';
        storeCell.cellID = 1;
        storeCell.icon = '../../../../images/icon_appointment_store.png';

        dateCell.title = '预约日期';
        if (!appointmentData.appointmentDate) {
            appointmentData.appointmentDate = AppUtils.getDate();
        }
        dateCell.content = appointmentData.appointmentDate;
        dateCell.cellID = 2;
        dateCell.icon = '../../../../images/icon_appointment_date.png';


        timerCell.title = '预约时间';
        if(!appointmentData.appointmentTime){
            appointmentData.appointmentTime = AppUtils.getTime()
        }

        if(appointmentData.appointmentDate <= AppUtils.getDate()){
          if (parseInt(appointmentData.appointmentTime.replace(":", "")) < parseInt(AppUtils.getTime().replace(":", ""))){

                appointmentData.appointmentTime = AppUtils.getTime();
            }
        }
        timerCell.content = appointmentData.appointmentTime;
        timerCell.cellID = 3;
        timerCell.icon = '../../../../images/icon_appointment_time.png';

        productCell.title = '预约项目';
        //productCell.content = appointmentData.productName;
        productCell.content = '';
        var tmp = '';
        if(appointmentData.productArr.length>0){
            productCell.content = '已选择' + appointmentData.productArr.length + '个项目';
            tmp= ',';

        }else{
            tmp= '已选择';
        }
        if(appointmentData.prodCardArr.length>0){
            productCell.content  += tmp + appointmentData.prodCardArr.length + '个划卡';
        }
        productCell.placeHoder = '选择项目';
        productCell.cellID = 4;
        productCell.icon = '../../../../images/icon_appointment_product.png';

        serveCell.title = '服务人员';
        serveCell.content = appointmentData.beauticianName;
        serveCell.placeHoder = '选择美容师';
        serveCell.cellID = 5;
        serveCell.icon = '../../../../images/icon_appointment_beautician.png';

        //return [storeCell, dateCell, timerCell, productCell, serveCell];
        return [storeCell, dateCell, timerCell, productCell];
    }
service.getInitDate = function(){
  var dateModel = {};
  dateModel.value = dateCell.content;
  dateModel.limitDate = AppUtils.getDate();
  dateModel.maxDate = service.getMaxDate();
  return dateModel;
}
    function AppointCellModel() {
        this.title = null;
        this.content = null;
        this.placeHoder = null;
        this.icon = null;
        this.cellID = null;
    }

    service.getTimeRangeArr = function () {
        var rangeArr = new Array();
        for (var i = 9; i <= 21; i++) {
            for (var j = 0; j < 2; j++) {
                var minuts;
                if (j == 0) {
                    minuts = '00';
                } else {
                    minuts = '30';
                }
                rangeArr.push(i.toString() + ':' + minuts);
            }
        }
        if(appointmentData.appointmentDate == AppUtils.getDate()){
         
          var index = rangeArr.indexOf(AppUtils.getTime());
     
            return rangeArr.slice(index, rangeArr.length - 1);
        }
        return rangeArr;
    }
    service.getTimeValue = function () {
        var timeRange = service.getTimeRangeArr();
        for (var i = 0; i < timeRange.length; i++) {
            if (timeRange[i] == appointmentData.appointmentTime) {
                return i;
            }
        }
    }

    service.addAppointment = function (appointCallBack) {
        debugger;
        //if(!AppointmentData.getInstance().productId){
        if(AppointmentData.getInstance().productArr.length <= 0 && AppointmentData.getInstance().prodCardArr.length <= 0){
          wx.showToast({
            title: '请选择项目',
            icon:'none'
          });
          return;
        }

        var addForm = AppointmentApiData.newAppointmentAddForm();
        addForm.storeId = AppointmentData.getInstance().storeId;
        var appointDate = AppointmentData.getInstance().appointmentDate;
        var appointDate1 = appointDate.replace(/\-/g, '/');

        var time = appointDate1 + ' ' + AppointmentData.getInstance().appointmentTime;
        // var date = new Date(); //返回当前时间对象
        // var date1 = date.getDate(time);
        var a = new Date(time);
        addForm.appointTime = a.getTime();
        // var productForm = AppointmentApiData.newAppointPorduct();
        // productForm.productId = AppointmentData.getInstance().productId;
        // productForm.productCount = '1';
        // productForm.operateType = '0';
        // if (AppointmentData.getInstance().beauticianId){
        //     productForm.buserIds = [AppointmentData.getInstance().beauticianId];
        // }
        var productFormArr = new Array();
        for(let prod of AppointmentData.getInstance().productArr){
            var productForm = AppointmentApiData.newAppointPorduct();
            productForm.productId = prod.id;
            productForm.productName=prod.name;
            productForm.productCount = prod.buyCount;
            productForm.operateType = '0';
            var buserIdArr = new Array();
            for(let buser of prod.buserArr){
                buserIdArr.push(buser.id);
            }
            productForm.buserIds = buserIdArr;
            productFormArr.push(productForm);
        }
        for(let prodCard of AppointmentData.getInstance().prodCardArr){
            var productForm = AppointmentApiData.newAppointPorduct();
            productForm.productId = prodCard.id;
            productForm.productName=prodCard.name;
            productForm.productCount = prodCard.buyCount;
            productForm.operateType = '1';
            productForm.productCardId=prodCard.productCardId;
            var buserIdArr = new Array();
            for(let buser of prodCard.buserArr){
                buserIdArr.push(buser.id);
            }
            productForm.buserIds = buserIdArr;
            productFormArr.push(productForm);
        }

        addForm.appointProducts = productFormArr;
        var app = getApp();
        addForm.jsCode = app.globalData.jscode;
        addForm.formId = app.globalData.formid;
        debugger;
        console.log('==========' + time);
        console.log('==========' + a.getTime());

        wx.showLoading({
          title: '提交中...',
          mask:true
        });
        var restCallBack = function () {

        }
        restCallBack.success = function (restResp) {
            console.log(restResp);
            wx.hideLoading();
            appointCallBack();
        }
        restCallBack.fail = function () {
          wx.hideLoading();
        }

        AppointmentMgr.add(addForm, restCallBack);
    }
    service.getMaxDate = function(){
        //获取当前时间戳
        var timestamp = Date.parse(new Date());
        timestamp = timestamp / 1000;
        //获取当前时间
        var n = timestamp * 1000  + 1000*60*60*24*7;
        var date = new Date(n);
        var monthStr = String(date.getMonth() + 1);
        var dayStr = date.getDate().toString();
        if(monthStr.length==1){
            monthStr = '0'+monthStr;
        }
        if(dayStr.length ==1){
            dayStr = '0'+dayStr;
        }
        return date.getFullYear().toString()+'-'+monthStr+'-'+dayStr;

    }

}
module.exports = AppointmentService;