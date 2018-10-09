var appModule = angular.module('App',
    [
        'ngRoute',
        'App.Main',
        'Zmt.StoreSite'
    ]);

appModule.config(function( $routeProvider, $httpProvider, $provide) {

    // RestProxy.init($http);

    // Decorator
    // Use the `decorator` solution to substitute or attach behaviors to
    // original service instance; @see angular-mocks for more examples....
    // $provide.decorator('$log', function ($delegate) {
    //     // Save the original $log.debug()
    //     var debugFn = $delegate.debug;
    //
    //     $delegate.debug = function () {
    //         // Prepend timestamp
    //         arguments[0] = timeStamp() + ' - ' + arguments[0];
    //
    //         // Call the original with the output prepended with formatted timestamp
    //         debugFn.apply(null, arguments)
    //     };
    //
    //     return $delegate;
    // });

    $routeProvider
        .when('/', {
            templateUrl: 'src/zmt/main/view/main.html',
            controller: 'MainCtrl',
            controllerAs: 'main'
        })
        .when('/store/:storeId', {
            templateUrl: 'src/zmt/storeSite/index/StoreSite.html',
            controller: 'StoreSiteCtrl',
            controllerAs: 'storeSite'
        })
        .otherwise({redirectTo: '/'});
});

appModule.controller('AppCtrl',
    function () {

    }
);







