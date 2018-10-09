head.load(
	//三方依赖
    { file: '//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js' },
    { file: '//cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.0-rc.0/angular.min.js' },
    { file: '//cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.0-rc.0/angular-messages.min.js' },
    { file: '//cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.0-rc.0/angular-route.min.js' },
    { file: '//cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.0-rc.0/angular-animate.min.js' },
    { file: '//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.6/js/bootstrap.min.js' },


    //common 顺序不能乱
    { file: 'src/zmt/common/AppUtils.js' },
    { file: 'src/zmt/common/RestProxy.js' },
    { file: 'src/zmt/common/RestDao.js' },
    // { file: 'src/zmt/common/dataSyn/DataSyn.js' },

    //应用模块 storeSite
    { file: 'src/zmt/storeSite/StoreSite.js' },
    { file: 'src/zmt/storeSite/bs/StoreSiteMgr.js' },
    { file: 'src/zmt/storeSite/bs/StoreSiteDao.js' },
    // { file: 'src/zmt/storeSite/index/StoreSiteService.js' },
    // { file: 'src/zmt/storeSite/index/StoreSiteCtrl.js' },



	//应用 顺序不能乱
    { file: 'src/zmt/test/TestCtrl.js' },
    { file: 'src/zmt/test/TestApp.js' }

);
