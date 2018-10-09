import {AppUtils} from "../../../comModule/AppUtils";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {BUserLoginApiForm} from "../../../bsModule/buser/apiData/BUserLoginApiForm";
import {BUserMgr} from "../../../bsModule/buser/BUserMgr";
import {LoginResp} from "../../../bsModule/buser/apiData/LoginResp";

export class LoginService {

  constructor() {}

  /**
   * 登陆
   * @param phone
   * @param password
   * @param loginCallback()
   */
  public async login(phone, password, loginCallBack: (success: boolean) => void) {
    let loginSuccess = false;
    let buserLoginApiForm = new BUserLoginApiForm();
    buserLoginApiForm.phone = phone;
    buserLoginApiForm.password = password;

    let restResp = await BUserMgr.getInstance().login(buserLoginApiForm);
    if (restResp && restResp.code == 200 && !AppUtils.isNullOrWhiteSpace(restResp.tJson)) {//登录成功
      loginSuccess = true;
      let loginResp = AppUtils.fromJson(LoginResp, restResp.tJson);
      SessionUtil.getInstance().onLoginSuccess(loginResp);
    }
    loginCallBack(loginSuccess);
  }

}
