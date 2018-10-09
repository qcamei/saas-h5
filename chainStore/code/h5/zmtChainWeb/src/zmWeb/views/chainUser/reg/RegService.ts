import {AppUtils, ZmMap} from "../../../comModule/AppUtils";
import {RestResp} from "../../../comModule/RestResp";
import {AppRouter} from "../../../comModule/AppRouter";
import {LoginResp} from "../../../bsModule/chainUser/apiData/LoginResp";
import {UserData} from "../../../comModule/session/SessionData";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {ChainUserMgr} from "../../../bsModule/chainUser/ChainUserMgr";
import {RegistForm} from "../../../bsModule/chainUser/apiData/RegistForm";
import {ChainUser} from "../../../bsModule/chainUser/data/ChainUser";
import {ChainUserLoginForm} from "../../../bsModule/chainUser/apiData/ChainUserLoginForm";
import {ChainStoreUserRelative} from "../../../bsModule/chainUser/data/ChainStoreUserRelative";
import {ChainUserRoleEnum} from "../../../bsModule/chainUser/data/ChainUserRoleEnum";
export class RegService {

  constructor(private chainUserMgr: ChainUserMgr) {
  }

  /**
   @param regForm
   @param regCallBack()
   */
  public async reg(regForm, regCallBack: (success: boolean, regMessage: string) => void) {
    let regMessage = "";
    let registForm = new RegistForm();
    AppUtils.copy(registForm, regForm);

    let restResp: RestResp = await this.chainUserMgr.reg(registForm);
    if (restResp.code == 200 && !AppUtils.isNullOrWhiteSpace(restResp.tJson)) {
      let phone = AppUtils.trimBlank(regForm.phone);
      let password = AppUtils.trimBlank(regForm.password);
      await this.loginAuth(phone, password);

      regMessage = "注册成功";
      regCallBack(true, regMessage);
    }else {
      regCallBack(false, restResp.tips);
    }
  }

  /***判断用户身份*/
  private async loginAuth(phone, password) {
    await this.login(phone, password, (user:ChainUser)=>{
      if (!AppUtils.isNullObj(user)) {
          AppRouter.goBossAddChain();
      }
    });
  }

  public async login(phone, password, loginCallBack: ( user: ChainUser) => void) {

  let loginForm = new ChainUserLoginForm();
  loginForm.phone = phone;
  loginForm.password = password;

    this.chainUserMgr.login(loginForm).then(
      (restResp) => {
        if (restResp.code == 200 && !AppUtils.isNullOrWhiteSpace(restResp.tJson)) {
          let loginResp = AppUtils.fromJson(LoginResp, restResp.tJson);
          let user: ChainUser = loginResp.chainUser;
          SessionUtil.getInstance().clearData();//清空缓存数据
          this.saveUserData(user, loginResp);
          loginCallBack(user);
        } else {
          loginCallBack(null);
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
  private saveUserData(user: ChainUser, loginResp: LoginResp) {
    let userData = UserData.newInstance(user.id,user.name);
    userData.setAccessToken(loginResp.token);
    SessionUtil.getInstance().setUserData(userData);
  }

}
