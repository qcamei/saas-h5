const ProductMgr = require('../../../../bs/product/productMgr.js')
const AppointmentData = require('../../../../bs/appointmentdata/appointmentData.js')
const SessionUtils = require('../../../../common/SessionUtils.js')
var ProductService = new function () {
    var service = this;

    service.getProductList = function (listCallBack) {

        wx.showLoading({
            title: '加载中...',
            mask: true
        })
        var restCallBack = function () {
        };
        restCallBack.success = function (restResp) {
            console.log(restResp);
            var listvm = new Array();
            if (restResp && restResp.productInfoMap) {
                var keys = Object.keys(restResp.productInfoMap);
                for (var i = 0; i < keys.length; i++) {
                    var key = keys[i];
                    var dataModel = restResp.productInfoMap[key];
                    //只显示未删除且已上架的项目
                    debugger
                    if(dataModel.state != 1 || dataModel.entityState != 0) {
                        continue;
                    }
                    var viewModel = new cellModel();
                    viewModel.id = dataModel.id;
                    viewModel.name = dataModel.name;
                    var formattedPrice = parseInt(dataModel.price);
                    viewModel.price = formattedPrice.toFixed(2);
                    viewModel.lastUpdateTime = dataModel.lastUpdateTime;
                    if (dataModel.imgPathList && dataModel.imgPathList.length > 0) {
                        viewModel.headImg = SessionUtils.getImgAddress() + dataModel.imgPathList[0];
                    } else {
                        viewModel.headImg = '/images/pore.png';
                    }
                    if (restResp.productTypeMap) {
                        if (restResp.productTypeMap[dataModel.typeId]) {
                            viewModel.typeName = restResp.productTypeMap[dataModel.typeId].name;

                        }
                    }
                    //默认提示"请选择服务人员"
                    viewModel.buserArrName = "请选择服务人员";
                    //处理数据回显
                    for (var prod of AppointmentData.getInstance().productArr) {
                        if (viewModel.id == prod.id) {
                            viewModel.buyCount = prod.buyCount;
                            viewModel.selected = prod.selected;
                            viewModel.buserArr = prod.buserArr;
                            if (viewModel.buserArr && viewModel.buserArr.length > 0) {
                                viewModel.buserArrName = '';
                                for (var buser of viewModel.buserArr) {
                                    viewModel.buserArrName += buser.name + ",";
                                }
                                viewModel.buserArrName = viewModel.buserArrName.substring(0, viewModel.buserArrName.length - 1);
                            }
                        }
                    }
                    if (viewModel.buserArrName.length > 12) {
                        viewModel.buserArrName = viewModel.buserArrName.substring(0, 12) + "...";
                    }

                    if (viewModel.name.length > 12) {
                        viewModel.name = viewModel.name.substring(0, 12) + "...";
                    }

                    listvm.push(viewModel);

                }
            }
            wx.hideLoading();
            listvm.sort(function (a, b) {
                return b.lastUpdateTime - a.lastUpdateTime;
            });


            listCallBack(listvm);
        }
        restCallBack.fail = function () {
            wx.hideLoading();
        }

        var storeId = AppointmentData.getInstance().storeId;
        ProductMgr.get(storeId, restCallBack);
    }
}

function cellModel() {
    this.id = null; //项目id
    this.name = null; //项目名称
    this.headImg = null; //首个图片
    this.typeName = null; //项目类型名称
    this.price = null; //项目价格
    this.buyCount = 0;
    this.buserArr = new Array(); //服务人员
    this.buserArrName = '';
    this.lastUpdateTime = null;
    this.selected = false;
}

module.exports = ProductService;