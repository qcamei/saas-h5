var AppointmentData = function () {
    var storeName;
    var storeId;
    var beauticianName;
    var beauticianId;
    var appointmentDate;
    var appointmentTime;
    var productId;
    var productName;
    var instance;
    var productArr; //项目数据
    var prodCardArr; //划卡数据
}
AppointmentData.getInstance = function () {
    if (!this.instance) {
        this.instance = new AppointmentData();
        this.instance.productArr = new Array();
        this.instance.prodCardArr = new Array();
    }
    return this.instance;
}

AppointmentData.clearData = function () {
    this.instance = new AppointmentData();
    return this.instance;
}
module.exports = AppointmentData;