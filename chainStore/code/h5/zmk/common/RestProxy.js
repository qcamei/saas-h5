const AppUtils = require('./AppUtils.js');
const SessionUtils = require('./SessionUtils.js');
const DataSyn = require('./dataSyn/DataSyn.js');
const Router = require('./Router.js')
const BossIdData = require('../bs/bossid/bossIdData.js')
var RestProxy = new function () {

    var service = this;
    //是否需要带accessToken
    var withToken = false;
    //是否需要做同步
    var withSyn = false;

    var HEADER_ACCESS_TOKEN_NAME = "access_token";

    var HEADER_VALIDATE = "validateInfo";

    service.init = function(withTokenP, withSynP){
        withToken = withTokenP;
        withSyn = withSynP;
    };

    service.add = function (urlP, target, callback) {
       send(urlP, "POST", target, callback);
       
    };

    service.delete = function (urlP, callback) {
       send(urlP, "DELETE", null, callback);        
    };
    service.update = function (urlP, target, callback) {
       send(urlP,"PUT",target, callback);
        
    };

    service.get = function (urlP, callback) {
      
      // urlP = 'http://www.zhimeitimes.com:9128/iotms/ws/v1/accessor/findList/?pageItemCount=1000&pageNo=1';
        send(urlP, "GET", null, callback);
        
    };

    service.list = function (urlP, callback) {
       send(urlP, "GET", null, callback);
    };

    service.rawReq = function (urlP, postParam, callback) {
      send(urlP, "POST", postParam, callback);
    };  

    function send(urlP, methodP,paramObj,callback){
      debugger
      service.serviceCallback = callback;
        var postData = null;
        if(paramObj){
          postData = AppUtils.toJson(paramObj);
        }
        var restResp = {};
        var headerTmp = buildReqHeader();
        wx.request({
          url: urlP,
          data: postData,
          method: methodP,
          header: headerTmp,
          success: function(res){
            
           handleSuccess(callback,res);
          },
          fail: function(err){
            
            console.log(callback);
            handleFail(callback,err);
          }
        });
    };
    function handleSuccess(callback,res){
      
      if(res.data.code == 402){
        wx.showModal({
          title: '登录过期',
          content: '请重新登录',
          showCancel:false,
          confirmText:'去登陆',
          success:function successCallBack(res){
            console.log(res.confirm); 
            SessionUtils.setAccessToken('');
            wx.removeStorageSync("loginInfo");
            Router.goLoginPage();
          }
        })
      }
      var restResp = RestResp(res.data);
      preHandleResp(restResp);
      restResp.success = true;
      callback(restResp);
    }

    function handleFail(callback,err){
      
      var restResp = {};
      restResp.tips = err.errMsg;
      restResp.success = false;
      callback(restResp);
    }

    function buildReqHeader(){
        var headerTmp = { "Content-Type": "application/json;charset=utf-8" };
        var bossId = BossIdData.getInstance().bossId ? BossIdData.getInstance().bossId : SessionUtils.getBossId();
        if(bossId == null) bossId=0;
        headerTmp[HEADER_VALIDATE] = JSON.stringify({ "bossId": bossId }) ;
        if(withToken){
            var token = SessionUtils.getAccessToken();
            debugger
            headerTmp[HEADER_ACCESS_TOKEN_NAME] = token;
        }

        if(withSyn && DataSyn.dataSynVerCtrl){
            DataSyn.dataSynVerCtrl.preHandleReqHeader(headerTmp);
        }
        debugger
      return headerTmp;
    };

    function preHandleResp(restResp){
      
        if(withSyn && DataSyn.dataSynVerCtrl ){
            DataSyn.dataSynVerCtrl.preHandleResp(restResp);
        }
    };

    function RestResp(resp){
      var respModel = {};
        console.log(resp);

        // private int code;
        respModel.code = resp.code;

        // private String tips;
        respModel.tips = resp.tips;

        respModel.tJson = resp.tJson;

        respModel.tListJson = resp.tListJson;

        // private String tJson;
        respModel.target;

        // private String tListJson;
        respModel.targetList;

        //数据同步返回信息
        // private String dsResp;
        respModel.dsResp = resp.dsResp;

        if(resp.tJson){
          respModel.target = AppUtils.fromJson(resp.tJson);
        }

        if(resp.tListJson){
          respModel.targetList = AppUtils.fromJson(resp.tListJson);
        }
        return respModel;
    };
};
module.exports = RestProxy;