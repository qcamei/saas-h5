import {Injectable} from '@angular/core';
import {SessionUtil} from "../../comModule/SessionUtil";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {MUser} from "./apiData/MUser";
import {RestResp} from "../../comModule/RestResp";


@Injectable()
export class MUserResetPwdMgr {

  private muserDao: MUserDao;

  constructor(restProxy: AsyncRestProxy) {
    this.muserDao = new MUserDao(restProxy);
  }

  public resetPwd(resetPwdForm):Promise<RestResp>{
    let actionName = "changePassword";
    return new Promise<RestResp>(resolve => {
      this.muserDao.rawReq(actionName, resetPwdForm).then(
         (restResp)=> {
           console.log("restResp "+restResp.code);
           resolve(restResp);
         }
      );
    });
  }

}

class MUserDao extends AsyncRestDao<MUser> {

  constructor(restProxy: AsyncRestProxy) {
    var table: string = "reset";
    super(MUser, restProxy, table);
  }

  getService(): string {
    return SessionUtil.getInstance().getServiceAddress();
  }
}


