var RestDao = new function () {
    var service = this;

    /*service.test=function(){
        console.log("test restDao");
    };*/


    service.newInstance = function(serviceAddress,table){
        var restDao = {};
        // restDao.serviceAddress = serviceAddress;
        // restDao.table = table;


        restDao.add = function (target) {
            //http://{sesrvice}/{table}/
            var uriPattern = "{0}/{1}/";
            var uri = AppUtils.format(uriPattern, [serviceAddress,table] );
            return RestProxy.add(uri,target);
        };
        restDao.delete = function (id) {
            //http://{sesrvice}/{table}/{id}
            var uriPattern = "{0}/{1}/{2}";
            var uri = AppUtils.format(uriPattern, [serviceAddress,table, id] );
            return RestProxy.delete(uri);
        };
        restDao.update = function (target) {
            //http://{sesrvice}/{table}/{id}
            var uriPattern = "{0}/{1}/{2}";
            var id = target.id;
            var uri = AppUtils.format(uriPattern, [serviceAddress,table, id] );
            return RestProxy.update(uri,target);
        };

        restDao.get = function (id) {
            console.log("restDao id:"+id);
            //http://{sesrvice}/{table}/{id}
            var uriPattern = "{0}/{1}/{2}";
            var uri = AppUtils.format(uriPattern, [serviceAddress,table, id] );
            return RestProxy.get(uri);
        };

        restDao.findList = function (uriPath, pageItemCount, pageNo) {
            //http://{sesrvice}/{table}s/
            var uriPattern = "{0}/{1}/{2}?pageItemCount={3}&pageNo={4}";
            var uri = AppUtils.format(uriPattern, [serviceAddress,table, uriPath, pageItemCount, pageNo] );
            return RestProxy.list(uri);
        };

        restDao.findWithReqParam = function(findPath, reqMap, pageItemCount, pageNo) {

            //http://{sesrvice}/{table}/{findPath}?pageItemCount={}&pageNo={}&{param}
            var uriPattern = "{0}/{1}/{2}?pageItemCount={3}&pageNo={4}&{5}";
            var reqParam = reqMap.toReqParam();
            var uri = AppUtils.format(uriPattern, [serviceAddress,table, uriPath,pageItemCount,pageNo,reqParam]);
            return RestProxy.list(uri);
        };

        restDao.rawReq = function(uriPath, postParam) {
            //http://{sesrvice}/{table}/{uriPath}
            var uriPattern = "{0}/{1}/{2}";
            var uri = AppUtils.format(uriPattern, [serviceAddress,table,uriPath]);
            return RestProxy.rawReq(uri,postParam);
        };

        restDao.postFile = function (uri, postParam) {

        };
        return restDao;

    };

}
