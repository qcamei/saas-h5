angular.module('Zmt.StoreSite')
    .service('StoreSiteService',
        function (StoreSiteMgr) {
            var service = this;
            service.getViewData = function (storeId) {

                var storeData  = StoreSiteMgr.getStore(storeId);//从后台获取数据

                var preUri= "http://192.168.10.220:9116/";

                var vData = new viewData();

                AppUtils.copy(vData,storeData,"name");
                AppUtils.copy(vData,storeData,"disseminateImgs");
                AppUtils.copy(vData,storeData,"company");
                AppUtils.copy(vData,storeData,"tel");
                AppUtils.copy(vData,storeData,"area");
                AppUtils.copy(vData,storeData,"address");
                AppUtils.copy(vData,storeData,"descript");
                AppUtils.copy(vData,storeData,"joinStoreImg");
                AppUtils.copy(vData,storeData,"wechatRecommendImg");

                vData.joinStoreImg = preUri+vData.joinStoreImg;
                vData.wechatRecommendImg=preUri+vData.wechatRecommendImg;
                for (var i= 0; i < vData.disseminateImgs.length; i++) {
                    vData.disseminateImgs[i]=preUri+vData.disseminateImgs[i];
                }

                return vData;
            };



            function viewData(){
                this.storeId;

                this.disseminateImgs = [];
                // 店铺名称
                this.name;
                //公司名称
                this.company;
                //店铺电话
                this.tel;
                //店铺区域
                this.area;
                //店铺地址
                this.address;
                //店铺简介
                this.descript;
                // 加入店铺二维码
                this.joinStoreImg;
                // 微信二维码
                this.wechatRecommendImg;
            }


        });