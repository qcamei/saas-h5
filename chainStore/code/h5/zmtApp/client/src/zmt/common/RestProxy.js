var RestProxy = new function () {

    var service = this;

    //是否需要带accessToken
    var withToken = false;
    //是否需要做同步
    var withSyn = false;

    service.init = function(withTokenP, withSynP){
        withToken = withTokenP;
        withSyn = withSynP;
    };

    service.test=function(){
        console.log("test proxy");
    };


        service.add = function (urlP, target) {
            var restResp = send(urlP,"POST",target);
            return restResp.target;
        };

        service.delete = function (urlP) {
            var restResp = send(urlP,"DELETE",null);
            return restResp.target;
        };
        service.update = function (urlP, target) {
            var restResp = send(urlP,"PUT",target);

            return restResp.target;
        };

        service.get = function (urlP) {
            var restResp = send(urlP,"GET",null);

            return restResp.target;
        };

        service.list = function (url) {

            var restResp = send(urlP,"GET",null);

            return restResp.targetList;
        };

        service.rawReq = function (urlP, postParam) {
            var restResp = send(urlP,"POST",postParam);

            return restResp;
        };

        function send(urlP,method,paramObj){
            var postData = null;
            if(paramObj){
                postData = angular.toJson(paramObj,true);
            }
            var restResp = {};

            $.ajax({
                type : method,      //提交方式
                url : urlP,         //路径
                async:false,
                beforeSend: function(req){
                    preHandleReq(req);
                },//这里设置header
                data : postData,    //数据，这里使用的是Json格式进行传输
                success : function(resp) {//返回数据根据结果进行相应的处理
                    restResp = new RestResp(resp);
                    preHandleResp(restResp);
                }
            });
            return restResp;
        };

        function preHandleReq(req){
            if(withSyn){
                DataSyn.DataSynVerCtrl.addVerInfo(req);
            }

        };

        function preHandleResp(restResp){
            if(withSyn){
                DataSyn.DataSynVerCtrl.synData(restResp);
            }
        };

        function RestResp(resp){

            console.log(resp);

            // private int code;
            this.code = resp.code;

            // private String tips;
            this.tips = resp.tips;

            // private String tJson;
            this.target;

            // private String tListJson;
            this.ListJson;

            //数据同步返回信息
            // private String dsResp;
            this.dsResp = resp.dsResp;

            if(resp.tJson){
                this.target =  angular.fromJson(resp.tJson);
            }

            if(resp.ListJson){
                this.targetList =  angular.fromJson(resp.ListJson);
            }

        };

    };