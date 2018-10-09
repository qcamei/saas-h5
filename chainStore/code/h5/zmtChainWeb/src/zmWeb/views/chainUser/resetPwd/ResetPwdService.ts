
import {ChainUserResetPwdMgr} from "../../../bsModule/chainUser/ChainUserResetPwdMgr";
export class ResetPwdService {

  constructor(private chainUserResetPwdMgr: ChainUserResetPwdMgr) {
  }


  /**
   * @param resetPwdForm
   * @param handleCallBack()
   */

  public resetPwd(resetPwdForm, handleCallBack: (success: boolean, resetPwdMessage: string) => void) {

    let resetPwdMessage = "";
    this.chainUserResetPwdMgr.resetPwd(resetPwdForm).then(
      (restResp) => {
        if (restResp.code == 200) {
          resetPwdMessage = "修改密码成功";
          handleCallBack(true, resetPwdMessage);
        } else {
          handleCallBack(false, restResp.tips);
        }
      }
    );
  }

}
