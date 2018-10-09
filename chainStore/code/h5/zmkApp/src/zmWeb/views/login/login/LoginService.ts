import {AppUtils} from "../../../comModule/AppUtils";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {LoginResp} from "../../../bsModule/cuser/apiData/LoginResp";
import {CUserLoginApiForm} from "../../../bsModule/cuser/apiData/CUserLoginApiForm";
import {CUserMgr} from "../../../bsModule/cuser/CUserMgr";
import {CUserLoginByCodeApiForm} from "../../../bsModule/cuser/apiData/CUserLoginByCodeApiForm";
// import {RandomCodeAPIForm} from "../../../bsModule/sms/apiData/RandomCodeAPIForm";
// import {SmsMgr} from "../../../bsModule/sms/SmsMgr";


export class LoginService {

  constructor() {
  }


  /**
   * 登陆
   * @param phone
   * @param password
   * @param loginCallback()
   */

  public async login(phone, password, loginCallBack: (success: boolean) => void) {
    let loginSuccess = false;
    let cuserLoginApiForm = new CUserLoginApiForm();
    cuserLoginApiForm.phone = phone;
    cuserLoginApiForm.password = password;

    let restResp = await CUserMgr.getInstance().login(cuserLoginApiForm);
    // let restResp = TestLogin.getInstance().mockRestResp();
    if (restResp!=null && restResp.code == 200 && !AppUtils.isNullOrWhiteSpace(restResp.tJson)) {//登录成功
      loginSuccess = true;
      let loginResp = AppUtils.fromJson(LoginResp, restResp.tJson);
      SessionUtil.getInstance().onLoginSuccess(loginResp);
    }
    loginCallBack(loginSuccess);
  }

  /**
   * 登陆(使用验证码)
   * @param phone
   * @param verifyCode
   * @param loginCallback()
   */

  public async loginByCode(phone, verifyCode, loginCallBack: (success: boolean) => void) {
    let loginSuccess = false;
    let cuserLoginByCodeApiForm = new CUserLoginByCodeApiForm();
    cuserLoginByCodeApiForm.phone = phone;
    cuserLoginByCodeApiForm.verifyCode = verifyCode;

    let restResp = await CUserMgr.getInstance().loginByCode(cuserLoginByCodeApiForm);
    // let restResp = TestLogin.getInstance().mockRestResp();

    if (restResp!=null && restResp.code == 200 && !AppUtils.isNullOrWhiteSpace(restResp.tJson)) {//登录成功
      loginSuccess = true;
      let loginResp = AppUtils.fromJson(LoginResp, restResp.tJson);
      SessionUtil.getInstance().onLoginSuccess(loginResp);
    }
    loginCallBack(loginSuccess);
  }


}
