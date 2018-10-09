
import {BUserResetPwdMgr} from "../../../bsModule/buser/BUserResetPwdMgr";

export class ResetPwdService {

  constructor(private buserResetPwdMgr: BUserResetPwdMgr) {
  }


  /**
   * @param resetPwdForm
   * @param handleCallBack()
   */

  public resetPwd(resetPwdForm, handleCallBack: (success: boolean, resetPwdMessage: string) => void) {

    let resetPwdMessage = "";
    this.buserResetPwdMgr.resetPwd(resetPwdForm).then(
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
