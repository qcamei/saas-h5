const RestProxy = require('./RestProxy.js');
const AppUtils = require('./AppUtils.js');


var RestDao = new function () {
    var service = this;
    service.newInstance = function(serviceAddress,table){
        var restDao = {};
        
        restDao.serviceAddress = serviceAddress;
        restDao.table = table;

        function newRestCallback(objCallback){
          
          var restCallBack = function(restResp) {
            
            if (restResp.success) {
              objCallback.success(restResp.target);
            } else {
              objCallback.fail(restResp.tips);
            }
          }
          return restCallBack;
        };

        restDao.init = function (withTokenP,withSynP) {
          RestProxy.init(withTokenP,withSynP);
        }
        restDao.add = function (target,objCallback) {
            //http://{sesrvice}/{table}/
            var uriPattern = "{0}/{1}/";
            var uri = AppUtils.format(uriPattern, [serviceAddress,table]);

            var restCallBack = newRestCallback(objCallback);

            RestProxy.add(uri, target, restCallBack);
        };
        restDao.update = function (target,objCallback) {
            //http://{sesrvice}/{table}/{id}
            var uriPattern = "{0}/{1}/{2}";
            var id = target.id;
            var uri = AppUtils.format(uriPattern, [serviceAddress,table, id] );
            
            // var restCallBack = newRestCallback(objCallback);
            
            RestProxy.update(uri, target, objCallback);
        };
        restDao.updateWithId = function (id, target, objCallback) {
            //http://{sesrvice}/{table}/{id}
            var uriPattern = "{0}/{1}/{2}";
            var uri = AppUtils.format(uriPattern, [serviceAddress,table, id] );

            var restCallBack = newRestCallback(objCallback);
            RestProxy.update(uri, target, restCallBack);
        };

        restDao.get = function (id, objCallback) {
          
            console.log("restDao id:"+id);
            //http://{sesrvice}/{table}/{id}
            var uriPattern = "{0}/{1}/{2}";
            var uri = AppUtils.format(uriPattern, [serviceAddress,table, id] );

            var restCallBack = newRestCallback(objCallback);
            RestProxy.get(uri, restCallBack);
        };
        restDao.delete = function (id, objCallback) {
            //http://{sesrvice}/{table}/{id}
            var uriPattern = "{0}/{1}/{2}";
            var uri = AppUtils.format(uriPattern, [serviceAddress,table, id] );

            var restCallBack = newRestCallback(objCallback);
            RestProxy.delete(uri, restCallBack);
        };

        restDao.findOne = function (uriPath, objCallback) {

            //http://{sesrviceId}/{table}/{uriPath}
            var uriPattern = "{0}/{1}/{2}";
            var uri = AppUtils.format(uriPattern, [serviceAddress, table, uriPath]);

            var restCallBack = newRestCallback(objCallback);
            RestProxy.get(uri, restCallBack);

        };

        //reqMap 参考 AppUtils.newReqMap
        restDao.findOneWithReqParam = function (uriPath, reqMap, objCallback) {

            //http://{sesrviceId}/{table}/{uriPath}/{param}
            var uriPattern = "{0}/{1}/{2}?{3}";
            var reqParam = reqMap.toReqParam();
            var uri = AppUtils.format(uriPattern, [serviceAddress, table, uriPath,reqParam]);

            var restCallBack = newRestCallback(objCallback);
            RestProxy.get(uri, restCallBack);
        };

        function newRestListCallback(listCallback) {

          var restCallBack =  function (restResp) {
              
              if (restResp.success) {
              listCallback.success(restResp.targetList);

            } else if (restResp.fail) {
              listCallback.fail(restResp.tips);
            }
          }
          return restCallBack;
        };


        restDao.list = function (pageItemCount, pageNo, listCallback) {
          //http://{sesrvice}/{table}s/
          var uriPattern = "{0}/{1}?pageItemCount={2}&pageNo={3}";
          var uri = AppUtils.format(uriPattern, [serviceAddress, table, pageItemCount, pageNo]);

          var restCallBack = newRestListCallback(listCallback);
          RestProxy.list(uri, restCallBack);
        };

        restDao.findList = function (uriPath, pageItemCount, pageNo,listCallback) {
          
          //http://{sesrvice}/{table}s/
          var uriPattern = "{0}/{1}/{2}?pageItemCount={3}&pageNo={4}";
          var uri = AppUtils.format(uriPattern, [serviceAddress, table, uriPath, pageItemCount, pageNo] );
          var restCallBack = newRestListCallback(listCallback);

          RestProxy.list(uri, restCallBack);
        };

        //reqMap 参考 AppUtils.newReqMap
        restDao.findListWithReqParam = function (findPath, reqMap, pageItemCount, pageNo, listCallback) {

            //http://{sesrvice}/{table}/{findPath}?pageItemCount={}&pageNo={}&{param}
            var uriPattern = "{0}/{1}/{2}?pageItemCount={3}&pageNo={4}&{5}";
            var reqParam = reqMap.toReqParam();
            var uri = AppUtils.format(uriPattern, [serviceAddress,table, findPath,pageItemCount,pageNo,reqParam]);

            var restCallBack = newRestListCallback(listCallback);
            RestProxy.list(uri, restCallBack);
        };
        //restCallback(restResp)
        restDao.rawReq = function(uriPath, postParam, restCallback) {
            //http://{sesrvice}/{table}/{uriPath}
            var uriPattern = "{0}/{1}/{2}";
            var uri = AppUtils.format(uriPattern, [serviceAddress,table,uriPath]);
            RestProxy.rawReq(uri, postParam, restCallback);
        };

        // restDao.postFile = function (uri,formData) {
        //      var uriPattern = "{0}/{1}/{2}";
        //      var uri = AppUtils.format(uriPattern, [serviceAddress,table,uri]);
        //      return RestProxy.uploadImg(uri,formData);
        // };
        return restDao;

    };

};



module.exports = RestDao;