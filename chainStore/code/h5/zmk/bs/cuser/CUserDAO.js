const RestDao = require('../../common/RestDao.js');
const SessionUtils = require('../../common/SessionUtils.js');

var CUserDAO = new function () {
  var service = this;
  var serviceAddress = SessionUtils.getServiceAddress();
  var table = 'cuser';

  var dao = RestDao.newInstance(serviceAddress, table);  

  service.add = function (target, objCallback) {
    dao.add(target, objCallback);
  };

  service.update = function (target, objCallback) {
    dao.update(target, objCallback);
  };
  service.get = function (id, objCallback) {
    dao.get(id, objCallback);   
  };
  service.findList = function (uriPath, pageItemCount, pageNo, listCallback) {
    dao.findList(uriPath, pageItemCount, pageNo, listCallback);  
  };
  service.rawReq = function (uriPath, postParam, restCallback) {
    dao.rawReq(uriPath, postParam, restCallback);  
  }

}

module.exports = CUserDAO;