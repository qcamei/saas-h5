var Router = new function () {

    var routerTmp = this;

    routerTmp.goAppointment = function () {
      redirectTo('../appointment/appointment');
    };
    routerTmp.goStoreList = function () {
      navigateTo('/views/appointment/store/store');
    }
    routerTmp.goBeaticianFromStore = function(){
      navigateTo('../beautician/beautician');
    }
    routerTmp.goBeaticianFromAppoint = function () {
      navigateTo('/views/appointment/beautician/beautician');
    }
    routerTmp.goMakeSureInfoPage = function () {
        navigateTo('/views/appointment/makesureinfo/makeSureInfo');
    }
    routerTmp.goAppointSuccessPage = function () {
      navigateTo('/views/appointment/appointsuccess/appointSuccess');
    }
    routerTmp.goOrderPage = function () {
      navigateTo('/views/my/order/order');
    }
    routerTmp.goProductPage = function () {
      navigateTo('/views/appointment/prodCard/prodCard');
    }
    routerTmp.goLoginPage = function(){
      navigateTo('/views/login/login');
    }
    function navigateTo(urlP) {
        wx.navigateTo({
            url: urlP
        })
    }

    function switchTab(urlP) {
        wx.switchTab({
            url: urlP,
        })
    }

    function redirectTo(urlP) {
        wx.redirectTo({
            url: urlP,
        })
    }
}

module.exports = Router;
