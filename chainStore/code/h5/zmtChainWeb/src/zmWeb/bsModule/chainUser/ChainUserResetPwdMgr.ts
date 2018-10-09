import {Injectable} from '@angular/core';
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {RestResp} from "../../comModule/RestResp";
import {AppCfg} from "../../comModule/AppCfg";
import {ResetPasswordForm} from "./apiData/ResetPasswordForm";
import {ChainUser} from "./data/ChainUser";


@Injectable()
export class ChainUserResetPwdMgr {

  private chainUserDao: ChainUserDao;

  constructor(restProxy: AsyncRestProxy) {
    this.chainUserDao = new ChainUserDao(restProxy);
  }

  public resetPwd(resetPwdForm:ResetPasswordForm):Promise<RestResp>{
    let actionName = "changePassword";
    return this.chainUserDao.rawReq(actionName, resetPwdForm);
  }

}

class ChainUserDao extends AsyncRestDao<ChainUser> {

  constructor(restProxy: AsyncRestProxy) {
    var table: string = "reset";
    super(ChainUser, restProxy, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}


