const AppUtils = require('../AppUtils.js');

var DataSynInfo = new function () {

  var synInfo = this;

  synInfo.newDataSynItem = function (synVerP, dataP) {
    return new DataSynItem(synVerP, dataP);
  };
  function DataSynItem(synVerP, dataP) {
    this.synVer = synVerP;
    this.data = dataP;
  };
  synInfo.newDataSynResp = function () {
    return new DataSynResp();

  };
  function DataSynResp() {
    // private String ownerId;
    // private List<DataSynItem> itemList;
    this.ownerId = null;
    this.itemList = [];
  };

  synInfo.newDataSynVerInfo = function () {
    return new DataSynVerInfo();
  };
  function DataSynVerInfo() {
    this.ownerId = null;
    this.synVerList = [];
  };

  synInfo.newDataSynVer = function (intSynTypeP, idP, verP) {
    return new DataSynVer(intSynTypeP, idP, verP);
  };
  function DataSynVer(intSynTypeP, idP, verP) {

    this.synType = intSynTypeP;
    this.id = idP;
    this.ver = verP;
  };

  synInfo.DataSynType = AppUtils.enum({
    CUser: 0,
    Store: 1,
    Order: 2,
    BUser: 3
   
  });

};

module.exports = DataSynInfo;