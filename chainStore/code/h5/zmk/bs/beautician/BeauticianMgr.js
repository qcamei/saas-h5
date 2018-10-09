const BeauticianDAO = require('./BeauticianDAO.js');
var BeauticianMgr = new function(){
 var service = this;
 service.get = function(id,objCallback){
   BeauticianDAO.get(id, objCallback);
 }
}
module.exports = BeauticianMgr;