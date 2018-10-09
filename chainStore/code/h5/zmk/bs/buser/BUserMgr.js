const BUserDAO = require('./BUserDAO.js');
const AppUtils = require('../../common/AppUtils.js')
var BUserMgr = new function(){
  var service = this;
  service.findByMultitId = function (buserIdList, listCallback) {
    var findPath = 'findByMultitId';
    var reqMap = AppUtils.newReqMap();
    reqMap.add('ids',buserIdList);
    BUserDAO.findListWithReqParam(findPath, reqMap, '1000', '1', listCallback);
  }
}
module.exports = BUserMgr;