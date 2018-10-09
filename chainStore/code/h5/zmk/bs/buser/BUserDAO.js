const RestDao = require('../../common/RestDao.js');
const SessionUtils = require('../../common/SessionUtils.js');
var BUser = new function(){
  var service = this;
  var serviceAddress = SessionUtils.getServiceAddress();
  var table = 'buser';
  var dao = RestDao.newInstance(serviceAddress, table);
  dao.init(true, false);
  service.findListWithReqParam = function (findPath, reqMap, pageItemCount, pageNo, listCallback){
    dao.findListWithReqParam(findPath, reqMap, pageItemCount, pageNo, listCallback);
  }
}
module.exports = BUser;