const StoreCardInfoDAO = require('./storeCardInfoDAO.js')
var StoreCardInfoMgr = new function(){
var service = this;
service.get = function (storeId, objCallback) {
    StoreCardInfoDAO.get(storeId, objCallback);
}

}
module.exports = StoreCardInfoMgr;