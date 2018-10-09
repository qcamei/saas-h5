import {Injectable} from '@angular/core';
import {SessionUtil} from "../../comModule/SessionUtil";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {OPUser} from "./apiData/OPUser";
import {RestResp} from "../../comModule/RestResp";
import {ReqMap} from "../../comModule/AppUtils";



@Injectable()
export class OPUserMgr {

  private opuserDao: OPUserDao;

  constructor(restProxy: AsyncRestProxy) {
    this.opuserDao = new OPUserDao(restProxy);
  }

  public login(opuserLoginApiForm):Promise<RestResp> {
    var loginPath = "login";
    return new Promise<RestResp>(resolve => {
      this.opuserDao.rawReq(loginPath, opuserLoginApiForm).then(
        function (restResp) {
          resolve(restResp);
        }
      );
    });
  }

  public findByName(name: string):Promise<OPUser>{
    let uriPath = "findByName";
    let reqMap = new ReqMap().add("name", name);
    return new Promise<OPUser>(resolve => {
      this.opuserDao.findOneWithReqParam(uriPath, reqMap).then(
        function (opuser) {
          resolve(opuser);
        }
      );
    });
  }

  public get(id: number):Promise<OPUser>{
    return new Promise<OPUser>(resolve => {
      this.opuserDao.get(id).then(
        function (opuser) {
          resolve(opuser);
        }
      );
    });
  }


}

class OPUserDao extends AsyncRestDao<OPUser> {

  constructor(restProxy: AsyncRestProxy) {
    var table: string = "opuser";
    super(OPUser, restProxy, table);
  }

  getService(): string {
    return SessionUtil.getInstance().getServiceAddress();
  }
}


