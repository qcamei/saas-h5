import {Injectable} from '@angular/core';
import {SessionUtil} from "../../comModule/SessionUtil";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {BUser} from "./apiData/BUser";
import {RestResp} from "../../comModule/RestResp";


@Injectable()
export class BUserResetPwdMgr {

  private buserDao: BUserDao;

  constructor(restProxy: AsyncRestProxy) {
    this.buserDao = new BUserDao(restProxy);
  }

  public resetPwd(resetPwdForm):Promise<RestResp>{
    let actionName = "changePassword";
    return new Promise<RestResp>(resolve => {
      this.buserDao.rawReq(actionName, resetPwdForm).then(
         (restResp)=> {
           console.log("restResp "+restResp.code);
           resolve(restResp);
         }
      );
    });
  }

}

class BUserDao extends AsyncRestDao<BUser> {

  constructor(restProxy: AsyncRestProxy) {
    var table: string = "reset";
    super(BUser, restProxy, table);
  }

  getService(): string {
    return SessionUtil.getInstance().getServiceAddress();
  }
}


