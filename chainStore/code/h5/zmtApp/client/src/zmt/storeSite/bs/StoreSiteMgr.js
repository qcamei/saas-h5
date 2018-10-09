angular.module('Zmt.StoreSite')
    .service('StoreSiteMgr',
        function (StoreSiteDao) {
            var service = this;
            service.getStore = function (storeId) {
                return StoreSiteDao.instance.get(storeId);
            };

        });