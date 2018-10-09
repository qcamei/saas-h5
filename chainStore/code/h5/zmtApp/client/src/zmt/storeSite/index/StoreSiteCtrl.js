angular.module('Zmt.StoreSite')
    .controller('StoreSiteCtrl',
        function ($scope, $routeParams, StoreSiteService) {

            var storeSite = this;

            //从路径获取storeId
            var storeId = $routeParams['storeId'];

            storeSite.viewData = StoreSiteService.getViewData(storeId);
            
            
            
			//	分享
            window._bd_share_config = {
	
				common : {
					bdText : '智美通店铺展示',
					bdDesc : '自定义分享摘要',
					bdUrl : '',
					bdPic : '自定义分享图片'
				},
					share : [{
					"tag" : "share_1",
					"bdSize" : 32,
				}],

		}
		with(document)0[(getElementsByTagName('head')[0]||body)
		.appendChild(createElement('script'))
		.src='http://bdimg.share.baidu.com/static/api/js/share.js?cdnversion='+~(-new Date()/36e5)];
        
});
