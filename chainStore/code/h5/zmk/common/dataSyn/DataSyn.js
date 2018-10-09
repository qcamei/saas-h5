const AppUtils = require('../AppUtils.js');
const DataSynInfo = require('./DataSynInfo')

var DataSynBS = new function () {
  var synbs = this;
  synbs.dataSynCacheMgr;
  synbs.init = function (ownereIdP) {
    synbs.dataSynCacheMgr = new DataSynCacheMgr(ownereIdP);
  };

  synbs.newDataSynDataHolder = function (restDaoP, dataSynTypeP) {
    return new AbsDataSynDataHolder(restDaoP, dataSynTypeP);
  }

  function AbsDataSynDataHolder(restDaoP, dataSynTypeP) {
    var restDao = restDaoP;

    var dataSynType = dataSynTypeP;

    var dataHolder = this;

    // public T getData(String ownerId,String targetId){
    dataHolder.getData = function (targetId, objCallback) {
      var data = synbs.dataSynCacheMgr.getData(dataSynType.value, targetId);
      if (!data) {
        var reqCallback = wrapCallBack(objCallback);
        restDao.get(targetId, reqCallback);
      } else {
        objCallback.success(data);
      }
    };
    //内部方法
    function wrapCallBack(objCallback) {
      var reqCallback = new function () {
        var callbackTmp = this;
        callbackTmp.success = function (returnObj) {
          console.log(returnObj);
          if (returnObj != null) {
            var synVer = DataSynInfo.newDataSynVer(dataSynType.value, returnObj.id, returnObj.ver);
            synbs.dataSynCacheMgr.putData(returnObj, synVer);
            objCallback.success(returnObj);
          }
        };
        callbackTmp.fail = function (tips) {
          if (objCallback.fail) {
            objCallback.fail(tips);
          }
        };
      };
      return reqCallback;
    }

    // synData(String ownerId, DataSynItem dataSynItem) {
    dataHolder.synData = function (dataSynItem) {
      synbs.dataSynCacheMgr.synData(dataSynItem);
    };
  }

  function DataSynCacheMgr(ownerIdP) {

    var ownerId = ownerIdP;

    var ownerDataSynInfo = new OwnerDataSynInfo(ownerId);

    var cacheMgr = this;

    //public void synData(String ownerId, DataSynItem dataSynItem, Class<?> clazz
    cacheMgr.synData = function (dataSynItem) {
      var data = dataSynItem.getData();
      var dataObj = AppUtils.fromJson(data);
      var synVer = dataSynItem.getSynVer();
      cacheMgr.putData(ownerId, dataObj, synVer);
    }

    // public void putData(String ownerId, Object dataObj, DataSynVer synVer)
    cacheMgr.putData = function (dataObj, synVer) {
      var ownerSynItem = new OwnerDataSynItem(synVer, dataObj);

      var key = cacheMgr.getKey(synVer.synType, synVer.id);
      ownerDataSynInfo.put(key, ownerSynItem);
    }
    // private String getKey(DataSynType synType,String id)
    cacheMgr.getKey = function (intSynType, id) {
      var format = "{0}_{1}";
      var key = AppUtils.format(format, [intSynType, id])
      return key;
    }

    // public <T> T getData(String ownerId, DataSynType synType,String id, Class<T> clazz)
    cacheMgr.getData = function (intSynType, id) {
      var key = cacheMgr.getKey(intSynType, id);
      return ownerDataSynInfo.getData(key);
    };

    // public DataSynVerInfo getSynVerInfo(String ownerId){
    cacheMgr.getSynVerInfo = function () {
      return ownerDataSynInfo.getSynVerInfo();
    }

  }

  //私有
  function OwnerDataSynInfo(ownerIdP) {

    var ownerId = ownerIdP;

    var itemMap = AppUtils.newMap();

    var synVerInfo = DataSynInfo.newDataSynVerInfo();

    var synInfo = this;

    synInfo.getOwnerId = function () {
      return ownerId;
    }

    synInfo.getData = function (key) {
      //OwnerDataSynItem
      var item = synInfo.getItem(key);
      if (item) {
        return item.getData();
      } else {
        return null;
      }
    };

    //return OwnerDataSynItem
    synInfo.getItem = function (key) {
      return itemMap.get(key);
    }

    //入参(String key, OwnerDataSynItem item)
    synInfo.put = function (key, item) {
      itemMap.put(key, item);
      //有更新就清空列表;
      synVerInfo = null;
    };

    synInfo.getOwnerId = function () {
      return ownerId;
    };

    //return DataSynVerInfo
    this.getSynVerInfo = function () {
      if (synVerInfo == null) {
        var synVerListTmp = [];
        for (var ownerDataSynItem in itemMap.values()) {
          synVerListTmp.push(ownerDataSynItem.getSynVer());
        }

        var synVerInfoTmp = DataSynInfo.newDataSynVerInfo(ownerId, synVerListTmp);
        synVerInfo = synVerInfoTmp;
      }
      return synVerInfo;
    };
  };

  //私有
  //(DataSynVer synVerP, Object dataP)
  function OwnerDataSynItem(synVerP, dataP) {
    // private DataSynVer synVer;
    var synVer = synVerP;
    // private Object data;
    var data = dataP;

    //public DataSynVer getSynVer()
    this.getSynVer = function () {
      return synVer;
    }

    //public <T> T getData()
    this.getData = function () {
      return data;
    }
  };
};

var DataSyn = new function () {
    var service = this;
    
    service.dataSynVerCtrl = new DataSynVerCtrl();
    service.ownerId;

    service.init = function(ownerId){
        DataSynBS.init(ownerId);       
        service.ownerId = ownerId;
    };

    service.newDataSynDataHolder = function (restDaoP, dataSynTypeP) {
      return DataSynBS.newDataSynDataHolder(restDaoP, dataSynTypeP);
    }

    function DataSynVerCtrl(){
        var DATA_SYN_REQ = "dsReq";

        var holderMap = AppUtils.newMap();

        var synVerCtrl = this;

        synVerCtrl.addHolder = function (dataHolder) {

            holderMap.put(dataHolder.getIntSynType(),dataHolder);
        };

        synVerCtrl.preHandleReqHeader = function(header) {
            
            var ownerId = service.ownerId;
            if(ownerId){
                var synVerInfo =  DataSynBS.dataSynCacheMgr.getSynVerInfo();
                if(synVerInfo){
                    var jsonData = AppUtils.toJson(synVerInfo);
                    header[DATA_SYN_REQ] = jsonData.toString();
                    console.log(jsonData);
                }
            }
        };

        synVerCtrl.preHandleResp = function(restResp) {
            var respJson = restResp.dsResp;
            
            //DataSynResp
            if(respJson){
                var dataSynResp =  AppUtils.fromJson(respJson);
                var itemList = dataSynResp.itemList;
                synData(itemList);
            }
        }

        // private void synData(String ownerId, List<DataSynItem> itemList) {
        function synData(itemList) {
            if(itemList){
                for (var dataSynItem in itemList) {
                    var synVer = dataSynItem.synVer;
                    var holderTmp = holderMap.get(synVer.synType);
                    if(holderTmp){
                        holderTmp.synData(dataSynItem);
                    }
                }
            }
        }
    }
};

module.exports = DataSyn;
