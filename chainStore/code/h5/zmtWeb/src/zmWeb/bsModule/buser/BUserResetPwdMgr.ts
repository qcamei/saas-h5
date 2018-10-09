import {Injectable} from '@angular/core';
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {BUser} from "./apiData/BUser";
import {RestResp} from "../../comModule/RestResp";
import {AppCfg} from "../../comModule/AppCfg";


@Injectable()
export class BUserResetPwdMgr {

  private buserDao: BUserDao;

  constructor(restProxy: AsyncRestProxy) {
    this.buserDao = new BUserDao(restProxy);
  }

  public resetPwd(resetPwdForm):Promise<RestResp>{
    let actionName = "changePassword";
    return this.buserDao.rawReq(actionName, resetPwdForm);
  }

}

class BUserDao extends AsyncRestDao<BUser> {

  constructor(restProxy: AsyncRestProxy) {
    var table: string = "reset";
    super(BUser, restProxy, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}


