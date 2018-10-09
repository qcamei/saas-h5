


import {BUserMgr} from "../../../bsModule/buser/BUserMgr";
import {BUserAddApiForm} from "../../../bsModule/buser/apiData/BUserAddApiForm";
import {AppUtils} from "../../../comModule/AppUtils";
import {RestResp} from "../../../comModule/RestResp";
import {AppRouter} from "../../../comModule/AppRouter";
import {BUserLoginApiForm} from "../../../bsModule/buser/apiData/BUserLoginApiForm";
import {BUser} from "../../../bsModule/buser/apiData/BUser";
import {LoginResp} from "../../../bsModule/buser/apiData/LoginResp";
import {UserData} from "../../../comModule/session/SessionData";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
export class RegService {

  constructor(private buserMgr: BUserMgr) {
  }

  /**
   @param regForm
   @param regCallBack()
   */
  public async reg(regForm, regCallBack: (success: boolean, regMessage: string) => void) {
    let regMessage = "";
    let buserRegApiForm = new BUserAddApiForm();
    AppUtils.copy(buserRegApiForm, regForm);

    let restResp: RestResp = await this.buserMgr.reg(buserRegApiForm);
    if (restResp.code == 200 && !AppUtils.isNullOrWhiteSpace(restResp.tJson)) {
      let phone = AppUtils.trimBlank(regForm.phone);
      let password = AppUtils.trimBlank(regForm.password);
      this.loginAuth(phone, password);

      regMessage = "注册成功";
      regCallBack(true, regMessage);
    }else {
      regCallBack(false, restResp.tips);
    }
  }

  /***判断用户身份*/
  private async loginAuth(phone, password) {
    this.login(phone, password, (successTmp, user) => {
      if (successTmp) {
        if(user.roleSet && AppUtils.arrayContains(user.roleSet, "0")) {
          AppRouter.goBossAddStore();//管理者跳转开店铺页面
        }else {
          AppRouter.goExpired();//其他跳转开通会员页面
        }
      }
    });
  }


  /**
   * @param phone
   * @param password
   * @param loginCallback()
   */

  public async login(phone, password, loginCallBack: (success: boolean, user: BUser) => void) {

    let loginSuccess = false;
    let buserLoginApiForm = new BUserLoginApiForm();
    buserLoginApiForm.phone = phone;
    buserLoginApiForm.password = password;

    this.buserMgr.login(buserLoginApiForm).then(
      (restResp) => {
        if (restResp.code == 200 && !AppUtils.isNullOrWhiteSpace(restResp.tJson)) {
          loginSuccess = true;
          let loginResp = AppUtils.fromJson(LoginResp, restResp.tJson);
          let user = loginResp.buser;
          SessionUtil.getInstance().clearData();//清空缓存数据
          this.saveUserData(user, loginResp);
          loginCallBack(loginSuccess, user);
        } else {
          loginCallBack(loginSuccess, null);
        }
      }
    ).catch(error => {
      AppUtils.handleError(error);
    });
  }

  /**
   * 设置用户数据
   * @param user
   * @param loginResp
   */
  private saveUserData(user: BUser, loginResp: LoginResp) {
    let userData = UserData.newInstance(user.id,user.name);
    userData.setAccessToken(loginResp.token);
    SessionUtil.getInstance().setUserData(userData);
  }

}
