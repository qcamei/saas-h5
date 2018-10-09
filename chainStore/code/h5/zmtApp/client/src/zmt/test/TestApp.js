var appModule = angular.module('TestApp',
    [
        'ngRoute',
        'Zmt.StoreSite',
        'App.Test'
    ]);

appModule.config(function( $routeProvider, $httpProvider, $provide) {

    // RestProxy.init($http);



    $routeProvider
        .when('/', {
            templateUrl: 'src/zmt/test/testView.html',
            controller: 'TestCtrl',
            controllerAs: 'test'
        })
        .otherwise({redirectTo: '/'});
});

appModule.controller('TestAppCtrl',
    function () {

    }
);







