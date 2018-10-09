const LeaguerDetailDAO = require('./leaguerDetailDAO.js')
var LeaguerDetailMgr = new function(){
var service = this;
service.get = function (leaguerDetailId, objCallback) {
    LeaguerDetailDAO.get(leaguerDetailId, objCallback);
}

}
module.exports = LeaguerDetailMgr;