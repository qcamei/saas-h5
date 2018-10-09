angular.module('Zmt.StoreSite')
    .service('StoreSiteDao',
        function () {
            var service = this;
            var serviceAddress = 'http://192.168.10.159:9114/ws/v1/';
            var table = 'storeUnAuth';
            service.instance = RestDao.newInstance(serviceAddress,table);
        });