const RestDao = require('../../common/RestDao.js');
const SessionUtils = require('../../common/SessionUtils.js');
var StoreDao = new function () {
    var service = this;
    var serviceAddress = SessionUtils.getServiceAddress();
    var table = 'store';
    var dao = RestDao.newInstance(serviceAddress, table);
    dao.init(true, false);
    service.add = function (target, objCallback) {
        dao.add(target, objCallback);
    };
    service.rawReq = function (uriPath, postParam, restCallback) {
        dao.rawReq(uriPath, postParam, restCallback);
    }
    service.findList = function (uriPath,pageItemCount, pageNo, listCallback) {
      dao.findList(uriPath,pageItemCount, pageNo, listCallback);
    }
    service.get = function (id, objCallback){
      dao.get(id, objCallback);
    }
}
module.exports = StoreDao;