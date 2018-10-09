var SessionUtils = new function () {
    var service = this;
    service.getServiceAddress = function () {
      // return 'https://www.zhimeitimes.com/zmkapp/index.html'; //正式环境
      return 'https://www.zhimeitimes.com/green/zmkapp/index.html'; //预发布环境
    }

    service.getMiniAppId = function () {
      return 'wx098ce2483147daa6'; //小程序appId，小程序定制化时会用到
    }
  
};

module.exports = SessionUtils;
