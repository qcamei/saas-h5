const StoreDao = require('../store/StoreDAO.js')
const StoreApiData = require('../store/StoreApiData.js');
var StoreMgr = new function(){
  var service = this;
  service.joinStore = function(storeId,restCallback){
      var joinPath = "joinStore";
      var joinForm = StoreApiData.newJoinStoreForm();
      joinForm.storeId = storeId;
      var restResp = StoreDao.rawReq(joinPath,joinForm,restCallback);
      return restResp;
  }
  service.getStoreList = function(listCallback) {
    var restResp = StoreDao.findList('findMyStores', '1000', '1', listCallback);
    return restResp;
  }
  service.getStore = function(id,objCallBack){
    var restResp = StoreDao.get(id, objCallBack);
    return restResp;
  }
}
module.exports = StoreMgr;