const CUserDAO = require('./CUserDAO.js');
const DataSyn = require('../../common/dataSyn/DataSyn.js');
const DataSynInfo = require('../../common/dataSyn/DataSynInfo.js');


var CUserSynDataHolder = new function () {

  var service = this;

  service.instance = newCUserSynDH();

  function newCUserSynDH() {
    var synType = DataSynInfo.DataSynType.CUser;

    var dataHolder = DataSyn.newDataSynDataHolder(CUserDAO.instance, synType);

    dataHolder.getIntSynType = function () {
      return synType.value;
    };

    DataSyn.dataSynVerCtrl.addHolder(dataHolder);
    return dataHolder;
  }

}

module.exports = CUserSynDataHolder;