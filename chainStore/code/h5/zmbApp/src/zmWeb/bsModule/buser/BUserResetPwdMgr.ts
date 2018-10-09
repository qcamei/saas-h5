import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {BUser} from "./data/BUser";
import {AppCfg} from "../../comModule/AppCfg";
import {RestResp} from "../../comModule/asynDao/apiData/RestResp";
import {MgrPool} from "../../comModule/MgrPool";
import {BUserResetPasswordForm} from "./apiData/BUserResetPasswordForm";


export class BUserResetPwdMgr {

  public static getInstance():BUserResetPwdMgr{
    return MgrPool.getInstance().get("BUserResetPwdMgr",BUserResetPwdMgr);
  }

  private buserDao: BUserDao;

  constructor() {
    this.buserDao = new BUserDao();
  }

  public resetPwd(resetPwdForm:BUserResetPasswordForm):Promise<RestResp>{
    let actionName = "changePassword";
    return this.buserDao.rawReq(actionName, resetPwdForm);
  }

}

class BUserDao extends AsyncRestDao<BUser> {

  constructor() {
    var table: string = "reset";
    super(BUser, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}


