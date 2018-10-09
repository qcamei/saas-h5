const leaguerDetailProdCardDAO = require('./leaguerDetailProdCardDAO.js')
var leaguerDetailProdCardMgr = new function(){
var service = this;
service.get = function (leaguerDetailId, objCallback) {
    leaguerDetailProdCardDAO.get(leaguerDetailId, objCallback);
}

}
module.exports = leaguerDetailProdCardMgr;