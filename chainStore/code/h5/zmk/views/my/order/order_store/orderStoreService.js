const StoreMgr = require('../../../../bs/store/StoreMgr.js')
var OrderStoreService = new function(){
var service = this;
service.getStoreList = function(listCallBack){
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
function getStoreListVM(restData) {
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
module.exports = OrderStoreService;