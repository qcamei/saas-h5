const AppUtils = require('../../common/AppUtils.js');

var CUserApiData = new function () {
  var service = this;

  // service.CUserUpdateType = AppUtils.enum({
  //     updateInfo: 0,
  //     changePassword: 1,
  // });

  // service.newCUserAddApiForm = function () {
  //     return new CUserAddApiForm();
  // };

  // function CUserAddApiForm() {
  //     this.name = null;
  //     this.phone = null;
  //     this.password = null;
  //     this.headImg = null;
  //     this.gender = null;
  //     this.age = null;
  //     this.verifyCode = null;
  // };

  // service.newCUserUpdateApiForm = function () {
  //     return new CUserUpdateApiForm();
  // };

  // function CUserUpdateApiForm() {
  //     this.updateType = null;
  //     // private CUserUpdateInfoApiData updateInfoData;
  //     this.updateInfoData = null;

  //     // private CUserChangePasswordApiData changePasswordData;
  //     this.changePasswordData = null;
  // };

  service.user = new function() {
    this.id             = null;
    this.name           = null;
    this.headImg        = null;
    this.gender         = null;
    this.createdTime    = null;
    this.lastUpdateTime = null;
    this.ver = null;
  };
  service.CUserLoginByCodeApiForm = new function() {
    this.phone      = null;
    this.verifyCode = null;
  }
};

module.exports = CUserApiData;