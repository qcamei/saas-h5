const leaguerDetailProdCardMgr = require('../../../../bs/leaguerDetailProdCard/leaguerDetailProdCardMgr.js')
const AppointmentData = require('../../../../bs/appointmentdata/appointmentData.js')
const SessionUtils = require('../../../../common/SessionUtils.js')
var CardService = new function () {
    var service = this;

    service.getCardList = function (listCallBack) {

        wx.showLoading({
            title: '加载中...',
            mask: true
        })

        var restCallBack = function () {
        };
        restCallBack.success = function (restResp) {
            debugger;
            console.log(restResp);
            var listvm = new Array();
            if (restResp && restResp.leaguerProdCardMap) {
                var keys = Object.keys(restResp.leaguerProdCardMap);
                for (var i = 0; i < keys.length; i++) {
                    var key = keys[i];
                    var dataModel = restResp.leaguerProdCardMap[key];
                    var viewModel = new cellModel();
                    viewModel.id = dataModel.id;
                    viewModel.cardId = dataModel.cardId;
                    viewModel.cardName = dataModel.cardName;
                    viewModel.count = dataModel.count;
                    viewModel.createdTime = dataModel.createdTime;
                    if (dataModel.useProdCardCountMap) {
                        var subKeys = Object.keys(dataModel.useProdCardCountMap);
                        for (var j = 0; j < subKeys.length; j++) {
                            var subKey = subKeys[j];
                            var subDataModel = dataModel.useProdCardCountMap[subKey];
                            var subViewModel = new subCellModel();
                            subViewModel.id = subDataModel.id;
                            subViewModel.name = subDataModel.name;
                            if (subDataModel.headImg && subDataModel.headImg.trim() != '') {
                                subViewModel.headImg = SessionUtils.getImgAddress() + subDataModel.headImg;
                            }else{
                                subViewModel.headImg = '/images/pore.png';
                            }
                            subViewModel.typeName = subDataModel.typeName;
                            subViewModel.count = subDataModel.count;
                            if (subDataModel.count > 0) {
                                subViewModel.countDispaly = "剩余:" + subDataModel.count + "次";
                            } else if (subDataModel.count == -1) {
                                subViewModel.countDispaly = "无限次";
                            }

                            subViewModel.productCardId = dataModel.id;
                            subViewModel.lastUpdateTime = subDataModel.lastUpdateTime;

                            //默认提示"请选择服务人员"
                            subViewModel.buserArrName = "请选择服务人员";
                            //处理数据回显
                            for (var prodCard of AppointmentData.getInstance().prodCardArr) {
                                if (subViewModel.id == prodCard.id) {
                                    subViewModel.buyCount = prodCard.buyCount;
                                    subViewModel.selected = prodCard.selected;
                                    subViewModel.buserArr = prodCard.buserArr;
                                    if (subViewModel.buserArr && subViewModel.buserArr.length > 0) {
                                        subViewModel.buserArrName = '';
                                        for (var buser of subViewModel.buserArr) {
                                            subViewModel.buserArrName += buser.name + ",";
                                        }
                                        subViewModel.buserArrName = subViewModel.buserArrName.substring(0, subViewModel.buserArrName.length - 1);
                                    }
                                }
                            }

                            if (subViewModel.name.length > 12) {
                                subViewModel.name = subViewModel.name.substring(0, 12) + "...";
                            }

                            viewModel.useProdCardCountList.push(subViewModel);
                        }

                    }

                    listvm.push(viewModel);
                }
            }
            wx.hideLoading();
            listvm.sort(function (a, b) {
                return b.createdTime - a.createdTime;
            });
            listCallBack(listvm);
        }
        restCallBack.fail = function () {
            wx.hideLoading();
        }

        var storeId = AppointmentData.getInstance().storeId;
        var userInfo = wx.getStorageSync('loginInfo');
        var cuserId = userInfo.cuser.id;
        // var leaguerDetailId = storeId+"_992"; //测试数据
        var leaguerDetailId = storeId + "_" + cuserId;
        leaguerDetailProdCardMgr.get(leaguerDetailId, restCallBack);
    }
}

function cellModel() {
    this.id = null; //客户次卡的ID
    this.cardId = null; //次卡类型id 对应ProductCard id
    this.cardName = null; //次卡类型名称 对应ProductCard name
    this.state = null;//次卡状态 对应LeaguerCardEnum
    this.useProdCardCountList = new Array(); //限项目限次数和限项目不限次数(永久次数为-1) 项目id对应项目剩余次数
    this.count = null; //不限项目限次数 对应次数
    this.createdTime = null;
}

function subCellModel() {
    this.id = null; //项目id
    this.name = null; //项目名称
    this.headImg = null; //项目图片
    this.typeName = null; //项目类型名称
    this.count = null; //项目剩余次数
    this.countDispaly = null;//项目剩余次数的页面展示文字
    this.buyCount = 0;
    this.buserArr = new Array(); //服务人员
    this.createdTime = null;
    this.lastUpdateTime = null;
    this.productCardId = null; // 耗卡ID，即客户次卡的ID

}

module.exports = CardService;