angular.module('App.Test', ['Zmt.StoreSite']);

angular.module('App.Test').controller('TestCtrl',
    function ($scope,$log,StoreSiteMgr) {
        console.log("in test ");
        var store = StoreSiteMgr.getStore(21);
        console.log(store);
        // RestProxy.test();
    }
);
