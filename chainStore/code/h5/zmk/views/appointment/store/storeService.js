const StoreMgr = require('../../../bs/store/StoreMgr.js')
const AppointmentData = require('../../../bs/appointmentdata/appointmentData.js')
const SessionUtils = require('../../../common/SessionUtils.js')
var StoreService = new function () {
    var service = this;

    service.joinStore = function (storeId) {
        var restCallBack = function (restResp) {

            console.log('--------加入店铺' + JSON.stringify(restResp));
        }
        StoreMgr.joinStore(storeId, restCallBack);
    }
    service.getStoreList = function (listCallBack) {
        wx.showLoading({
            title: '加载中...',
            mask: true
        })

        var restCallBack = function () {

        }
        restCallBack.success = function (respData) {
            wx.hideLoading();
            if (respData) {
                var storelistvm = getStoreListVM(respData);
                listCallBack(storelistvm);
            }
        }
        restCallBack.fail = function () {
            wx.hideLoading();
        }
        StoreMgr.getStoreList(restCallBack);
    }

    service.getStore = function (dataCallBack) {
        var storeId = AppointmentData.getInstance().storeId;
        var restCallBack = function () {

        }
        restCallBack.success = function (store) {
            console.log('store------' + store);
            if (store) {
                AppointmentData.getInstance().storeName = store.name;
                SessionUtils.setStoreName(store.name);
                SessionUtils.setBossId(store.bossId);
                dataCallBack();
            }
        }
        restCallBack.fail = function () {
            dataCallBack();
        }
        StoreMgr.getStore(storeId, restCallBack);
    }
    service.saveStoreInfo = function (cellmodel) {
        AppointmentData.getInstance().storeName = cellmodel.title;
        AppointmentData.getInstance().storeId = cellmodel.storeId;
        SessionUtils.setStoreId(cellmodel.storeId);
        SessionUtils.setStoreName(cellmodel.title);
        SessionUtils.setBossId(cellmodel.bossId);
    }
    service.clearAppointData = function () {
        AppointmentData.getInstance().beauticianId = null;
        AppointmentData.getInstance().beauticianName = null;
        AppointmentData.getInstance().productId = null;
        AppointmentData.getInstance().productName = null;
        AppointmentData.getInstance().productArr = [];
        AppointmentData.getInstance().prodCardArr = [];
    }

    function getStoreListVM(restData) {
        debugger
        var vmlist = new Array();
        for (var store of restData) {
            var storeVM = new StoreViewModel();
            storeVM.title = store.name;
            storeVM.storeId = store.id;
            storeVM.location = store.address;
            storeVM.bossId = store.bossId;
            vmlist.push(storeVM);
        }
        return vmlist;
    }

    function StoreViewModel() {
        this.title = null;
        this.location = null;
        this.storeId = null;
        this.bossId = null;
    }
}

module.exports = StoreService;