const BeauticianMgr = require('../../../bs/beautician/BeauticianMgr.js')
const AppointmentData = require('../../../bs/appointmentdata/appointmentData.js')
const BUserMgr = require('../../../bs/buser/BUserMgr.js')
const SessionUtils = require('../../../common/SessionUtils.js')
var BeauticianService = new function () {
    var service = this;
    service.getBeautician = function (listCallBack, selectBeauticianArr) {
        wx.showLoading({
            title: '加载中...',
            mask: true
        })
        var storeId = AppointmentData.getInstance().storeId;
        var restCallBack = function () {
        }
        restCallBack.success = function (restResp) {

            if (restResp && restResp.beauticianInfoMap) {
                var ids = Object.keys(restResp.beauticianInfoMap);
                var busercallback = function () {
                }
                busercallback.success = function (buserList) {
                    wx.hideLoading();

                    var vmList = getBeauticianViewModelList(buserList);
                    if(vmList){
                        vmList.sort(function (a, b) {
                            var name1 = a.name;
                            var name2 = b.name;
                            return name1.localeCompare(name2)
                        });
                        debugger
                        //处理数据回显
                        for(var vm of vmList){
                            for(var selectBeautician of selectBeauticianArr){
                                if(vm.id == selectBeautician.id){
                                    console.log("vm.selected = true");
                                    vm.selected = true;
                                }
                            }
                        }
                    }
                    listCallBack(vmList);
                }
                busercallback.fail = function () {
                    wx.hideLoading();
                }
                BUserMgr.findByMultitId(ids, busercallback);
            } else {
                wx.hideLoading();
            }
        }
        restCallBack.fail = function () {
            wx.hideLoading();

        }
        BeauticianMgr.get(storeId, restCallBack);
    }

    function getBeauticianViewModelList(resp) {
        var vmList = new Array();
        for (var beautician of resp) {
            var beauticianVM = new BeauticianViewModel();
            beauticianVM.id = beautician.id;
            beauticianVM.headImg = SessionUtils.getImgAddress() + beautician.headImg;
            beauticianVM.name = beautician.name;
            beauticianVM.lastUpdateTime = beautician.lastUpdateTime;
            vmList.push(beauticianVM);
        }
        return vmList;
    }

    function BeauticianViewModel() {
        this.id = null;
        this.headImg = null;
        this.name = null;
        this.lastUpdateTime = null;
        this.selected = false;
    }
}
module.exports = BeauticianService;